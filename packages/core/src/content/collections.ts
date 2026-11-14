import type { z } from "zod";
import {
	AnnotationSchema,
	CapabilitySchema,
	ControlPointSchema,
	DomainSchema,
	EdgeSchema,
	EvidenceRefSchema,
	InterfaceSchema,
	JourneySchema,
	LayerSchema,
	MessageSchema,
	NodeSchema,
	OrientationItemSchema,
	PerspectiveSchema,
	ProcessSchema,
	ProcessStageSchema,
	ProviderAssociationSchema,
	ProviderSchema,
	SceneSchema,
	SequenceSchema,
	StepSchema,
	StoryRouteSchema,
	StoryWaypointSchema,
	ValueStreamSchema,
} from "../entities/index.js";

/**
 * The single definition of what a content dataset can contain: each collection
 * name and the schema of its entities.
 *
 * The bundle type, the empty bundle, parsing, merging and validation are all
 * derived from this object. Adding a collection here is the only step needed,
 * and a collection missing from here cannot be loaded by accident.
 *
 * `bpmnNodes` and `bpmnEdges` reuse the node and edge schemas but are their own
 * id spaces: a BPMN diagram is not part of the terrain graph.
 */
export const CONTENT_COLLECTIONS = {
	domains: DomainSchema,
	capabilities: CapabilitySchema,
	nodes: NodeSchema,
	edges: EdgeSchema,
	journeys: JourneySchema,
	steps: StepSchema,
	scenes: SceneSchema,
	perspectives: PerspectiveSchema,
	layers: LayerSchema,
	annotations: AnnotationSchema,
	evidenceRefs: EvidenceRefSchema,
	providers: ProviderSchema,
	providerAssociations: ProviderAssociationSchema,
	valueStreams: ValueStreamSchema,
	processes: ProcessSchema,
	processStages: ProcessStageSchema,
	controlPoints: ControlPointSchema,
	bpmnNodes: NodeSchema,
	bpmnEdges: EdgeSchema,
	storyRoutes: StoryRouteSchema,
	storyWaypoints: StoryWaypointSchema,
	interfaces: InterfaceSchema,
	messages: MessageSchema,
	sequences: SequenceSchema,
	orientationItems: OrientationItemSchema,
} as const;

export type ContentCollectionName = keyof typeof CONTENT_COLLECTIONS;

export const CONTENT_COLLECTION_NAMES = Object.keys(CONTENT_COLLECTIONS) as ContentCollectionName[];

/** A loaded dataset: one array per collection, every one present. */
export type ContentBundle = {
	[K in ContentCollectionName]: z.output<(typeof CONTENT_COLLECTIONS)[K]>[];
};

export function isContentCollectionName(key: string): key is ContentCollectionName {
	return Object.hasOwn(CONTENT_COLLECTIONS, key);
}

/** A bundle with every collection present and empty. */
export function emptyContentBundle(): ContentBundle {
	const bundle: Record<string, unknown[]> = {};
	for (const name of CONTENT_COLLECTION_NAMES) {
		bundle[name] = [];
	}
	return bundle as ContentBundle;
}
