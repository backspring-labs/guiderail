import type { FocusTarget } from "../entities/focus-target.js";
import {
	CONTENT_COLLECTION_NAMES,
	type ContentBundle,
	type ContentCollectionName,
} from "./collections.js";
import { type ContentError, issue } from "./diagnostics.js";

interface Reference {
	/** The field holding the reference, for the diagnostic. */
	field: string;
	/** The collection the id should exist in. */
	target: ContentCollectionName;
	id: string | null | undefined;
}

const one = (
	field: string,
	target: ContentCollectionName,
	id: string | null | undefined,
): Reference => ({ field, target, id });

const many = (field: string, target: ContentCollectionName, ids: readonly string[]): Reference[] =>
	ids.map((id, i) => one(`${field}[${i}]`, target, id));

/** Focus-target types that name an entity in exactly one collection. Others are not checked. */
const FOCUS_TARGET_COLLECTION: Partial<Record<FocusTarget["type"], ContentCollectionName>> = {
	node: "nodes",
	edge: "edges",
	annotation: "annotations",
	provider: "providers",
	process_stage: "processStages",
	value_stream: "valueStreams",
	interface: "interfaces",
	message: "messages",
};

function focusTargets(targets: readonly FocusTarget[]): Reference[] {
	const refs: Reference[] = [];
	targets.forEach((t, i) => {
		const target = FOCUS_TARGET_COLLECTION[t.type];
		if (target) refs.push(one(`focusTargets[${i}]`, target, t.targetId));
	});
	return refs;
}

const PROVIDER_TARGET: Record<
	ContentBundle["providerAssociations"][number]["targetType"],
	ContentCollectionName
> = {
	domain: "domains",
	capability: "capabilities",
	value_stream: "valueStreams",
	journey: "journeys",
	process: "processes",
	node: "nodes",
};

const ANNOTATION_TARGET: Record<
	ContentBundle["annotations"][number]["targetType"],
	ContentCollectionName
> = {
	domain: "domains",
	capability: "capabilities",
	node: "nodes",
	edge: "edges",
	step: "steps",
	journey: "journeys",
};

type Extractors = {
	[K in ContentCollectionName]?: (entity: ContentBundle[K][number]) => Reference[];
};

/**
 * Every reference the loader checks, per collection. A collection with no entry
 * holds no checkable references. What is deliberately not checked is listed in
 * docs/architecture/data-integrity.md, section 4.
 */
const REFERENCES: Extractors = {
	capabilities: (c) => [
		one("domainId", "domains", c.domainId),
		...many("nodeIds", "nodes", c.nodeIds),
		...many("edgeIds", "edges", c.edgeIds),
		...many("journeyIds", "journeys", c.journeyIds),
	],
	nodes: (n) => [one("parentNodeId", "nodes", n.parentNodeId)],
	edges: (e) => [
		one("sourceNodeId", "nodes", e.sourceNodeId),
		one("targetNodeId", "nodes", e.targetNodeId),
	],
	journeys: (j) => [
		one("entryCapabilityId", "capabilities", j.entryCapabilityId),
		...many("capabilityIds", "capabilities", j.capabilityIds),
		...many("stepIds", "steps", j.stepIds),
	],
	steps: (s) => [
		one("journeyId", "journeys", s.journeyId),
		one("capabilityId", "capabilities", s.capabilityId),
		one("sceneId", "scenes", s.sceneId),
		...focusTargets(s.focusTargets),
		...s.transitions.map((t, i) => one(`transitions[${i}].targetStepId`, "steps", t.targetStepId)),
		...many("evidenceRefIds", "evidenceRefs", s.evidenceRefIds),
	],
	scenes: (s) => [
		one("stepId", "steps", s.stepId),
		...many("annotations", "annotations", s.annotations),
	],
	perspectives: (p) => [one("defaultLayerId", "layers", p.defaultLayerId)],
	annotations: (a) => [one("targetId", ANNOTATION_TARGET[a.targetType], a.targetId)],
	providerAssociations: (a) => [
		one("providerId", "providers", a.providerId),
		one("targetId", PROVIDER_TARGET[a.targetType], a.targetId),
	],
	valueStreams: (v) => [
		one("domainId", "domains", v.domainId),
		...many("capabilityIds", "capabilities", v.capabilityIds),
		...many("journeyIds", "journeys", v.journeyIds),
	],
	processes: (p) => [
		one("valueStreamId", "valueStreams", p.valueStreamId),
		...many("capabilityIds", "capabilities", p.capabilityIds),
		...many("stageIds", "processStages", p.stageIds),
	],
	processStages: (s) => [
		one("processId", "processes", s.processId),
		one("subProcessId", "processes", s.subProcessId),
		...many("nodeIds", "nodes", s.nodeIds),
		...many("edgeIds", "edges", s.edgeIds),
		...many("controlPoints", "controlPoints", s.controlPoints),
	],
	controlPoints: (c) => [one("processStageId", "processStages", c.processStageId)],
	bpmnEdges: (e) => [
		one("sourceNodeId", "bpmnNodes", e.sourceNodeId),
		one("targetNodeId", "bpmnNodes", e.targetNodeId),
	],
	storyRoutes: (r) => many("waypointIds", "storyWaypoints", r.waypointIds),
	storyWaypoints: (w) => [
		one("storyRouteId", "storyRoutes", w.storyRouteId),
		one("perspectiveId", "perspectives", w.perspectiveId),
		...focusTargets(w.focusTargets),
		...many("evidenceRefIds", "evidenceRefs", w.evidenceRefIds),
	],
	interfaces: (i) => [one("nodeId", "nodes", i.nodeId)],
	messages: (m) => [
		one("sourceInterfaceId", "interfaces", m.sourceInterfaceId),
		one("targetInterfaceId", "interfaces", m.targetInterfaceId),
	],
	sequences: (s) => [
		one("capabilityId", "capabilities", s.capabilityId),
		one("journeyId", "journeys", s.journeyId),
		one("processId", "processes", s.processId),
		...many("interfaceIds", "interfaces", s.interfaceIds),
		...many("messageIds", "messages", s.messageIds),
	],
	orientationItems: (o) =>
		o.links.map((l, i) => one(`links[${i}].perspectiveId`, "perspectives", l.perspectiveId)),
};

type Identified = { id: string };

/**
 * Reports every reference that names an id missing from its target collection.
 *
 * `present` lists the collections supplied by the dataset. A reference into a
 * collection that was not supplied is not checked, so a partial dataset may
 * point at entities provided elsewhere. Defaults to every collection.
 */
export function checkReferences(
	bundle: ContentBundle,
	present: ReadonlySet<ContentCollectionName> = new Set(CONTENT_COLLECTION_NAMES),
): ContentError[] {
	const idsByCollection = new Map<ContentCollectionName, Set<string>>();
	for (const name of CONTENT_COLLECTION_NAMES) {
		idsByCollection.set(name, new Set((bundle[name] as Identified[]).map((e) => e.id)));
	}

	const issues: ContentError[] = [];
	for (const name of CONTENT_COLLECTION_NAMES) {
		const extract = REFERENCES[name] as ((entity: Identified) => Reference[]) | undefined;
		if (!extract) continue;

		(bundle[name] as Identified[]).forEach((entity, index) => {
			for (const reference of extract(entity)) {
				if (reference.id == null) continue;
				if (!present.has(reference.target)) continue;
				if (idsByCollection.get(reference.target)?.has(reference.id)) continue;
				issues.push(
					issue(
						"dangling_reference",
						name,
						`"${entity.id}" ${reference.field} refers to "${reference.id}", which is not in ${reference.target}`,
						{ index, id: entity.id },
					),
				);
			}
		});
	}
	return issues;
}

/**
 * Reports ids used more than once in a collection. Does not modify the bundle.
 */
export function checkDuplicateIds(bundle: ContentBundle): ContentError[] {
	const issues: ContentError[] = [];
	for (const name of CONTENT_COLLECTION_NAMES) {
		const seen = new Set<string>();
		(bundle[name] as Identified[]).forEach((entity, index) => {
			if (seen.has(entity.id)) {
				issues.push(
					issue("duplicate_id", name, `id "${entity.id}" is used more than once in ${name}`, {
						index,
						id: entity.id,
					}),
				);
			}
			seen.add(entity.id);
		});
	}
	return issues;
}
