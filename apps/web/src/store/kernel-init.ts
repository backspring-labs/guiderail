import type { Dataset } from "@/data/dataset.js";
import type { ContextMachineEvent } from "@guiderail/core/context";

type InitializeEvent = Extract<ContextMachineEvent, { type: "INITIALIZE" }>;

/**
 * The kernel accepts a partial INITIALIZE payload and defaults every omitted
 * collection to an empty array. The app must not lean on that: a collection the
 * views read but the kernel never received makes the two disagree silently.
 *
 * Every collection is therefore required here. Adding a collection to the
 * kernel event without supplying it below is a compile error.
 */
export type CompleteInitializeEvent = Required<InitializeEvent>;

/**
 * Builds the single INITIALIZE event the app sends to the Context Machine, from
 * the same Dataset the views read.
 */
export function createInitializeEvent(dataset: Dataset): CompleteInitializeEvent {
	return {
		type: "INITIALIZE",
		graph: dataset.graph,
		journeys: dataset.journeys,
		steps: dataset.steps,
		capabilities: dataset.capabilities,
		providers: dataset.providers,
		providerAssociations: dataset.providerAssociations,
		valueStreams: dataset.valueStreams,
		processes: dataset.processes,
		processStages: dataset.processStages,
		storyRoutes: dataset.storyRoutes,
		storyWaypoints: dataset.storyWaypoints,
		controlPoints: dataset.controlPoints,
		interfaces: dataset.interfaces,
		messages: dataset.messages,
		sequences: dataset.sequences,
		orientationItems: dataset.orientationItems,
		perspectives: dataset.perspectives,
	};
}
