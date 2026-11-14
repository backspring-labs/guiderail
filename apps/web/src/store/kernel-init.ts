import {
	seedCapabilities,
	seedControlPoints,
	seedGraph,
	seedInterfaces,
	seedJourneys,
	seedMessages,
	seedOrientationItems,
	seedPerspectives,
	seedProcessStages,
	seedProcesses,
	seedProviderAssociations,
	seedProviders,
	seedSequences,
	seedSteps,
	seedStoryRoutes,
	seedStoryWaypoints,
	seedValueStreams,
} from "@/store/seed-loader.js";
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

/** Builds the single INITIALIZE event the app sends to the Context Machine. */
export function createInitializeEvent(): CompleteInitializeEvent {
	return {
		type: "INITIALIZE",
		graph: seedGraph,
		journeys: seedJourneys,
		steps: seedSteps,
		capabilities: seedCapabilities,
		providers: seedProviders,
		providerAssociations: seedProviderAssociations,
		valueStreams: seedValueStreams,
		processes: seedProcesses,
		processStages: seedProcessStages,
		storyRoutes: seedStoryRoutes,
		storyWaypoints: seedStoryWaypoints,
		controlPoints: seedControlPoints,
		interfaces: seedInterfaces,
		messages: seedMessages,
		sequences: seedSequences,
		orientationItems: seedOrientationItems,
		perspectives: seedPerspectives,
	};
}
