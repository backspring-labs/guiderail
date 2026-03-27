import type { ZodSchema } from "zod";
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
	PerspectiveSchema,
	ProcessSchema,
	ProcessStageSchema,
	ProviderAssociationSchema,
	ProviderSchema,
	SequenceSchema,
	StepSchema,
	StoryRouteSchema,
	StoryWaypointSchema,
	ValueStreamSchema,
} from "../entities/index.js";
import type {
	Annotation,
	Capability,
	ControlPoint,
	Domain,
	Edge,
	EvidenceRef,
	Interface,
	Journey,
	Layer,
	Message,
	Node,
	Perspective,
	Process,
	ProcessStage,
	Provider,
	ProviderAssociation,
	Sequence,
	Step,
	StoryRoute,
	StoryWaypoint,
	ValueStream,
} from "../entities/index.js";

/**
 * Result of loading content from a JSON file.
 * Matches the same entity shapes as seed data.
 */
export interface ContentBundle {
	domains: Domain[];
	capabilities: Capability[];
	nodes: Node[];
	edges: Edge[];
	journeys: Journey[];
	steps: Step[];
	perspectives: Perspective[];
	layers: Layer[];
	annotations: Annotation[];
	evidenceRefs: EvidenceRef[];
	providers: Provider[];
	providerAssociations: ProviderAssociation[];
	valueStreams: ValueStream[];
	processes: Process[];
	processStages: ProcessStage[];
	storyRoutes: StoryRoute[];
	storyWaypoints: StoryWaypoint[];
	controlPoints: ControlPoint[];
	interfaces: Interface[];
	messages: Message[];
	sequences: Sequence[];
}

export interface LoadResult {
	bundle: ContentBundle;
	errors: ContentError[];
	provenance: ContentProvenance;
}

export interface ContentError {
	entityType: string;
	index: number;
	message: string;
}

export interface ContentProvenance {
	sourceType: string;
	sourcePath: string;
	loadedAt: string;
	entityCounts: Record<string, number>;
}

const ENTITY_SCHEMAS: Record<string, ZodSchema> = {
	domains: DomainSchema,
	capabilities: CapabilitySchema,
	nodes: NodeSchema,
	edges: EdgeSchema,
	journeys: JourneySchema,
	steps: StepSchema,
	perspectives: PerspectiveSchema,
	layers: LayerSchema,
	annotations: AnnotationSchema,
	evidenceRefs: EvidenceRefSchema,
	providers: ProviderSchema,
	providerAssociations: ProviderAssociationSchema,
	valueStreams: ValueStreamSchema,
	processes: ProcessSchema,
	processStages: ProcessStageSchema,
	storyRoutes: StoryRouteSchema,
	storyWaypoints: StoryWaypointSchema,
	controlPoints: ControlPointSchema,
	interfaces: InterfaceSchema,
	messages: MessageSchema,
	sequences: SequenceSchema,
};

/**
 * Parse a raw JSON object into a validated ContentBundle.
 * Each entity array is validated through its Zod schema.
 * Invalid entities are collected as errors, not thrown.
 */
export function parseContentBundle(raw: Record<string, unknown>, sourcePath: string): LoadResult {
	const errors: ContentError[] = [];
	const entityCounts: Record<string, number> = {};

	const bundle: ContentBundle = {
		domains: [],
		capabilities: [],
		nodes: [],
		edges: [],
		journeys: [],
		steps: [],
		perspectives: [],
		layers: [],
		annotations: [],
		evidenceRefs: [],
		providers: [],
		providerAssociations: [],
		valueStreams: [],
		processes: [],
		processStages: [],
		storyRoutes: [],
		storyWaypoints: [],
		controlPoints: [],
		interfaces: [],
		messages: [],
		sequences: [],
	};

	for (const [key, schema] of Object.entries(ENTITY_SCHEMAS)) {
		const rawArray = raw[key];
		if (!Array.isArray(rawArray)) {
			entityCounts[key] = 0;
			continue;
		}

		const parsed: unknown[] = [];
		for (let i = 0; i < rawArray.length; i++) {
			const result = schema.safeParse(rawArray[i]);
			if (result.success) {
				parsed.push(result.data);
			} else {
				errors.push({
					entityType: key,
					index: i,
					message: result.error.message,
				});
			}
		}

		(bundle as unknown as Record<string, unknown>)[key] = parsed;
		entityCounts[key] = parsed.length;
	}

	return {
		bundle,
		errors,
		provenance: {
			sourceType: "content_file",
			sourcePath,
			loadedAt: new Date().toISOString(),
			entityCounts,
		},
	};
}

/**
 * Create an empty ContentBundle (all arrays empty).
 */
export function emptyContentBundle(): ContentBundle {
	return {
		domains: [],
		capabilities: [],
		nodes: [],
		edges: [],
		journeys: [],
		steps: [],
		perspectives: [],
		layers: [],
		annotations: [],
		evidenceRefs: [],
		providers: [],
		providerAssociations: [],
		valueStreams: [],
		processes: [],
		processStages: [],
		storyRoutes: [],
		storyWaypoints: [],
		controlPoints: [],
		interfaces: [],
		messages: [],
		sequences: [],
	};
}

/**
 * Merge two ContentBundles. Second bundle's entities are appended.
 */
export function mergeContentBundles(a: ContentBundle, b: ContentBundle): ContentBundle {
	return {
		domains: [...a.domains, ...b.domains],
		capabilities: [...a.capabilities, ...b.capabilities],
		nodes: [...a.nodes, ...b.nodes],
		edges: [...a.edges, ...b.edges],
		journeys: [...a.journeys, ...b.journeys],
		steps: [...a.steps, ...b.steps],
		perspectives: [...a.perspectives, ...b.perspectives],
		layers: [...a.layers, ...b.layers],
		annotations: [...a.annotations, ...b.annotations],
		evidenceRefs: [...a.evidenceRefs, ...b.evidenceRefs],
		providers: [...a.providers, ...b.providers],
		providerAssociations: [...a.providerAssociations, ...b.providerAssociations],
		valueStreams: [...a.valueStreams, ...b.valueStreams],
		processes: [...a.processes, ...b.processes],
		processStages: [...a.processStages, ...b.processStages],
		storyRoutes: [...a.storyRoutes, ...b.storyRoutes],
		storyWaypoints: [...a.storyWaypoints, ...b.storyWaypoints],
		controlPoints: [...a.controlPoints, ...b.controlPoints],
		interfaces: [...a.interfaces, ...b.interfaces],
		messages: [...a.messages, ...b.messages],
		sequences: [...a.sequences, ...b.sequences],
	};
}
