import { assign, setup } from "xstate";
import { orderBySequence } from "../content/ordering.js";
import type { Capability } from "../entities/capability.js";
import type { ControlPoint } from "../entities/control-point.js";
import type { Interface } from "../entities/interface.js";
import type { Journey } from "../entities/journey.js";
import type { Message } from "../entities/message.js";
import type { OrientationItem } from "../entities/orientation-item.js";
import type { Perspective, PerspectiveType } from "../entities/perspective.js";
import type { ProcessStage } from "../entities/process-stage.js";
import type { Process } from "../entities/process.js";
import type { ProviderAssociation } from "../entities/provider-association.js";
import type { Provider } from "../entities/provider.js";
import type { Sequence } from "../entities/sequence.js";
import type { Step } from "../entities/step.js";
import type { StoryRoute } from "../entities/story-route.js";
import type { StoryWaypoint } from "../entities/story-waypoint.js";
import type { ValueStream } from "../entities/value-stream.js";
import type { TerrainGraph } from "../graph/graph.js";
import type { NavigationContext } from "./navigation-context.js";
import {
	reconcileCanvasModeSwitch,
	reconcileCapabilitySwitch,
	reconcileDomainSwitch,
	reconcileJourneyDeselection,
	reconcileJourneySelection,
	reconcileMessageChange,
	reconcileModeSwitch,
	reconcileNodeSelection,
	reconcileOrientationChange,
	reconcilePerspectiveSwitch,
	reconcileProcessSwitch,
	reconcileRouteEnd,
	reconcileRoutePause,
	reconcileRouteResume,
	reconcileSequenceClear,
	reconcileSequenceSwitch,
	reconcileStageChange,
	reconcileStepChange,
	reconcileStoryRouteStart,
	reconcileValueStreamSwitch,
	reconcileWaypointChange,
} from "./reconciler.js";

export interface ContextMachineContext {
	nav: NavigationContext;
	graph: TerrainGraph | null;
	journeys: Journey[];
	steps: Step[];
	capabilities: Capability[];
	// 0.2.0 additions
	providers: Provider[];
	providerAssociations: ProviderAssociation[];
	valueStreams: ValueStream[];
	processes: Process[];
	processStages: ProcessStage[];
	storyRoutes: StoryRoute[];
	storyWaypoints: StoryWaypoint[];
	// 0.4.0 additions
	controlPoints: ControlPoint[];
	interfaces: Interface[];
	messages: Message[];
	sequences: Sequence[];
	// 0.7.0 additions
	orientationItems: OrientationItem[];
	pausedRouteSnapshot: NavigationContext | null;
	// The stepper is resolved from the active perspective's type, so the kernel
	// needs the perspectives. Without them no perspective has a stepper.
	perspectives: Perspective[];
}

export type ContextMachineEvent =
	| {
			type: "INITIALIZE";
			graph: TerrainGraph;
			journeys: Journey[];
			steps: Step[];
			capabilities: Capability[];
			// 0.2.0 optional additions for backward compat
			providers?: Provider[];
			providerAssociations?: ProviderAssociation[];
			valueStreams?: ValueStream[];
			processes?: Process[];
			processStages?: ProcessStage[];
			storyRoutes?: StoryRoute[];
			storyWaypoints?: StoryWaypoint[];
			// 0.4.0 optional additions
			controlPoints?: ControlPoint[];
			interfaces?: Interface[];
			messages?: Message[];
			sequences?: Sequence[];
			// 0.7.0 optional additions
			orientationItems?: OrientationItem[];
			perspectives?: Perspective[];
	  }
	| { type: "SELECT_DOMAIN"; domainId: string }
	| { type: "SELECT_CAPABILITY"; capabilityId: string }
	| { type: "CLEAR_CAPABILITY" }
	| { type: "CLEAR_DOMAIN" }
	| { type: "SELECT_JOURNEY"; journeyId: string }
	| { type: "DESELECT_JOURNEY" }
	| { type: "STEP_FORWARD" }
	| { type: "STEP_BACKWARD" }
	| { type: "JUMP_TO_STEP"; index: number }
	| { type: "SWITCH_PERSPECTIVE"; perspectiveId: string }
	| { type: "SELECT_NODE"; nodeId: string }
	| { type: "SELECT_EDGE"; edgeId: string }
	| { type: "CLEAR_SELECTION" }
	| { type: "SWITCH_MODE"; mode: "viewscape" | "guiderail" }
	// 0.2.0 additions
	| { type: "SELECT_VALUE_STREAM"; valueStreamId: string }
	| { type: "CLEAR_VALUE_STREAM" }
	| { type: "SELECT_PROCESS"; processId: string }
	| { type: "CLEAR_PROCESS" }
	| { type: "START_ROUTE"; storyRouteId: string }
	| { type: "NEXT_WAYPOINT" }
	| { type: "PREVIOUS_WAYPOINT" }
	| { type: "JUMP_TO_WAYPOINT"; index: number }
	| { type: "PAUSE_ROUTE" }
	| { type: "RESUME_ROUTE" }
	| { type: "END_ROUTE" }
	// 0.4.0 additions
	| { type: "SWITCH_CANVAS_MODE"; canvasMode: string }
	| { type: "SELECT_SEQUENCE"; sequenceId: string }
	| { type: "CLEAR_SEQUENCE" }
	// 0.6.0 additions — generic stepper events
	| { type: "STEPPER_FORWARD" }
	| { type: "STEPPER_BACKWARD" }
	| { type: "STEPPER_RESET" }
	| { type: "STEPPER_END" }
	// 0.7.0 additions — orientation jump
	| { type: "JUMP_TO_ORIENTATION"; index: number };

/*
 * Ordered groups. Every index in NavigationContext (step, stage, message,
 * waypoint, orientation) is a POSITION in one of these arrays, never a
 * sequenceNumber. See docs/architecture/data-integrity.md, section 5.
 */
function resolveStepsForJourney(journeyId: string, allSteps: Step[]): Step[] {
	return orderBySequence(allSteps.filter((s) => s.journeyId === journeyId));
}

function resolveWaypointsForRoute(routeId: string, allWaypoints: StoryWaypoint[]): StoryWaypoint[] {
	return orderBySequence(allWaypoints.filter((w) => w.storyRouteId === routeId));
}

function resolveStagesForProcess(processId: string, allStages: ProcessStage[]): ProcessStage[] {
	return orderBySequence(allStages.filter((s) => s.processId === processId));
}

/** The messages a sequence lists that actually exist. A missing id is not a position. */
function resolveMessagesForSequence(
	sequenceId: string,
	allSequences: Sequence[],
	allMessages: Message[],
): Message[] {
	const seq = allSequences.find((s) => s.id === sequenceId);
	if (!seq) return [];
	return orderBySequence(allMessages.filter((m) => seq.messageIds.includes(m.id)));
}

type StepperTarget = "journey" | "process" | "sequence" | "orientation";

interface Stepper {
	target: StepperTarget;
	/** How many items there are to step through. Always at least 1. */
	count: number;
	/** The active position, or null when none is active yet. */
	index: number | null;
}

function activePerspectiveType(ctx: ContextMachineContext): PerspectiveType | null {
	return ctx.perspectives.find((p) => p.id === ctx.nav.activePerspectiveId)?.type ?? null;
}

/**
 * What the generic stepper events act on. Decided by the active perspective's
 * type, never by the text of its id. Null when the perspective has no stepper,
 * nothing is selected, or the selection has nothing to step through.
 */
function resolveStepper(ctx: ContextMachineContext): Stepper | null {
	const { nav } = ctx;
	const stepper = (target: StepperTarget, count: number, index: number | null): Stepper | null =>
		count > 0 ? { target, count, index } : null;

	switch (activePerspectiveType(ctx)) {
		case "orientation":
			return stepper("orientation", ctx.orientationItems.length, nav.activeOrientationIndex);
		case "journey":
			if (!nav.activeJourneyId) return null;
			return stepper(
				"journey",
				resolveStepsForJourney(nav.activeJourneyId, ctx.steps).length,
				nav.activeStepIndex,
			);
		case "process":
			if (!nav.activeProcessId) return null;
			return stepper(
				"process",
				resolveStagesForProcess(nav.activeProcessId, ctx.processStages).length,
				nav.activeStageIndex,
			);
		case "sequence":
			if (!nav.activeSequenceId) return null;
			return stepper(
				"sequence",
				resolveMessagesForSequence(nav.activeSequenceId, ctx.sequences, ctx.messages).length,
				nav.activeMessageIndex,
			);
		default:
			return null;
	}
}

/** Moves the active stepper to `position`. Out-of-range positions leave nav unchanged. */
function stepTo(
	ctx: ContextMachineContext,
	stepper: Stepper,
	position: number,
): Partial<ContextMachineContext> {
	const { nav, graph } = ctx;
	if (position < 0 || position >= stepper.count) return {};

	switch (stepper.target) {
		case "orientation":
			return { nav: reconcileOrientationChange(nav, position) };
		case "sequence":
			return { nav: reconcileMessageChange(nav, position) };
		case "journey": {
			if (!nav.activeJourneyId || !graph) return {};
			const steps = resolveStepsForJourney(nav.activeJourneyId, ctx.steps);
			return { nav: reconcileStepChange(nav, position, steps, graph) };
		}
		case "process": {
			if (!nav.activeProcessId || !graph) return {};
			const stages = resolveStagesForProcess(nav.activeProcessId, ctx.processStages);
			return { nav: reconcileStageChange(nav, position, stages, graph) };
		}
	}
}

export const contextMachine = setup({
	types: {
		context: {} as ContextMachineContext,
		events: {} as ContextMachineEvent,
	},
	guards: {
		hasGraph: ({ context }) => context.graph != null,
		canStepForward: ({ context }) => {
			if (context.nav.activeStepIndex == null) return false;
			const journeySteps = context.nav.activeJourneyId
				? resolveStepsForJourney(context.nav.activeJourneyId, context.steps)
				: [];
			return context.nav.activeStepIndex < journeySteps.length - 1;
		},
		canStepBackward: ({ context }) => {
			if (context.nav.activeStepIndex == null) return false;
			return context.nav.activeStepIndex > 0;
		},
		hasActiveJourney: ({ context }) => context.nav.activeJourneyId != null,
		isValidJourney: ({ context, event }) => {
			if (event.type !== "SELECT_JOURNEY") return false;
			return context.journeys.some((j) => j.id === event.journeyId);
		},
		isValidStepIndex: ({ context, event }) => {
			if (event.type !== "JUMP_TO_STEP") return false;
			if (context.nav.activeJourneyId == null) return false;
			const journeySteps = resolveStepsForJourney(context.nav.activeJourneyId, context.steps);
			return event.index >= 0 && event.index < journeySteps.length;
		},
		// 0.2.0 guards
		isValidRoute: ({ context, event }) => {
			if (event.type !== "START_ROUTE") return false;
			return context.storyRoutes.some((r) => r.id === event.storyRouteId);
		},
		hasActiveRoute: ({ context }) => context.nav.activeStoryRouteId != null,
		isRouteActive: ({ context }) => context.nav.routeState === "active",
		isRoutePaused: ({ context }) => context.nav.routeState === "paused",
		canAdvanceWaypoint: ({ context }) => {
			if (context.nav.activeWaypointIndex == null || !context.nav.activeStoryRouteId) return false;
			const waypoints = resolveWaypointsForRoute(
				context.nav.activeStoryRouteId,
				context.storyWaypoints,
			);
			return context.nav.activeWaypointIndex < waypoints.length - 1;
		},
		canGoBackWaypoint: ({ context }) => {
			if (context.nav.activeWaypointIndex == null) return false;
			return context.nav.activeWaypointIndex > 0;
		},
		isValidWaypointIndex: ({ context, event }) => {
			if (event.type !== "JUMP_TO_WAYPOINT") return false;
			if (!context.nav.activeStoryRouteId) return false;
			const waypoints = resolveWaypointsForRoute(
				context.nav.activeStoryRouteId,
				context.storyWaypoints,
			);
			return event.index >= 0 && event.index < waypoints.length;
		},
		canStepperForward: ({ context }) => {
			const stepper = resolveStepper(context);
			return stepper != null && (stepper.index ?? -1) < stepper.count - 1;
		},
		canStepperBackward: ({ context }) => {
			const stepper = resolveStepper(context);
			return stepper != null && (stepper.index ?? 0) > 0;
		},
		hasStepperTarget: ({ context }) => resolveStepper(context) != null,
	},
}).createMachine({
	id: "context",
	initial: "uninitialized",
	context: {
		nav: {
			activeDomainId: null,
			activeCapabilityId: null,
			activeJourneyId: null,
			activeStepIndex: null,
			activePerspectiveId: "",
			activeFocusTargets: [],
			selectedNodeId: null,
			selectedEdgeId: null,
			viewportAnchor: { x: 0, y: 0, zoom: 1 },
			activeSceneId: null,
			mode: "viewscape",
			activeValueStreamId: null,
			activeProcessId: null,
			activeStoryRouteId: null,
			activeWaypointIndex: null,
			routeState: "inactive",
			activeCanvasMode: null,
			activeSequenceId: null,
			activeStageIndex: null,
			activeMessageIndex: null,
			activeOrientationIndex: null,
		},
		graph: null,
		journeys: [],
		steps: [],
		capabilities: [],
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
		orientationItems: [],
		pausedRouteSnapshot: null,
		perspectives: [],
	},
	states: {
		uninitialized: {
			on: {
				INITIALIZE: {
					target: "ready",
					actions: assign(({ event }) => ({
						graph: event.graph,
						journeys: event.journeys,
						steps: event.steps,
						capabilities: event.capabilities,
						providers: event.providers ?? [],
						providerAssociations: event.providerAssociations ?? [],
						valueStreams: event.valueStreams ?? [],
						processes: event.processes ?? [],
						processStages: event.processStages ?? [],
						storyRoutes: event.storyRoutes ?? [],
						storyWaypoints: event.storyWaypoints ?? [],
						controlPoints: event.controlPoints ?? [],
						interfaces: event.interfaces ?? [],
						messages: event.messages ?? [],
						sequences: event.sequences ?? [],
						orientationItems: event.orientationItems ?? [],
						perspectives: event.perspectives ?? [],
					})),
				},
			},
		},
		ready: {
			on: {
				SELECT_DOMAIN: {
					actions: assign(({ context, event }) => ({
						nav: reconcileDomainSwitch(context.nav, event.domainId),
					})),
				},
				SELECT_CAPABILITY: {
					actions: assign(({ context, event }) => ({
						nav: reconcileCapabilitySwitch(context.nav, event.capabilityId),
					})),
				},
				CLEAR_CAPABILITY: {
					actions: assign(({ context }) => ({
						nav: {
							...context.nav,
							activeCapabilityId: null,
							activeJourneyId: null,
							activeStepIndex: null,
							activeFocusTargets: [],
							selectedNodeId: null,
							selectedEdgeId: null,
							activeSceneId: null,
						},
					})),
				},
				CLEAR_DOMAIN: {
					actions: assign(({ context }) => ({
						nav: {
							...context.nav,
							activeDomainId: null,
							activeCapabilityId: null,
							activeJourneyId: null,
							activeStepIndex: null,
							activeFocusTargets: [],
							selectedNodeId: null,
							selectedEdgeId: null,
							activeSceneId: null,
						},
					})),
				},
				SELECT_JOURNEY: {
					guard: "isValidJourney",
					actions: assign(({ context, event }) => {
						const journey = context.journeys.find((j) => j.id === event.journeyId);
						if (!journey || !context.graph) return {};
						const journeySteps = resolveStepsForJourney(journey.id, context.steps);
						return {
							nav: reconcileJourneySelection(
								context.nav,
								journey,
								journeySteps,
								context.capabilities,
								context.graph,
							),
						};
					}),
				},
				DESELECT_JOURNEY: {
					guard: "hasActiveJourney",
					actions: assign(({ context }) => ({
						nav: reconcileJourneyDeselection(context.nav),
					})),
				},
				STEP_FORWARD: {
					guard: "canStepForward",
					actions: assign(({ context }) => {
						if (context.nav.activeStepIndex == null || !context.graph) return {};
						const journeySteps = context.nav.activeJourneyId
							? resolveStepsForJourney(context.nav.activeJourneyId, context.steps)
							: [];
						return {
							nav: reconcileStepChange(
								context.nav,
								context.nav.activeStepIndex + 1,
								journeySteps,
								context.graph,
							),
						};
					}),
				},
				STEP_BACKWARD: {
					guard: "canStepBackward",
					actions: assign(({ context }) => {
						if (context.nav.activeStepIndex == null || !context.graph) return {};
						const journeySteps = context.nav.activeJourneyId
							? resolveStepsForJourney(context.nav.activeJourneyId, context.steps)
							: [];
						return {
							nav: reconcileStepChange(
								context.nav,
								context.nav.activeStepIndex - 1,
								journeySteps,
								context.graph,
							),
						};
					}),
				},
				JUMP_TO_STEP: {
					guard: "isValidStepIndex",
					actions: assign(({ context, event }) => {
						if (!context.graph) return {};
						const journeySteps = context.nav.activeJourneyId
							? resolveStepsForJourney(context.nav.activeJourneyId, context.steps)
							: [];
						return {
							nav: reconcileStepChange(context.nav, event.index, journeySteps, context.graph),
						};
					}),
				},
				SWITCH_PERSPECTIVE: {
					actions: assign(({ context, event }) => {
						if (!context.graph) return {};
						return {
							nav: reconcilePerspectiveSwitch(context.nav, event.perspectiveId, context.graph),
						};
					}),
				},
				SELECT_NODE: {
					actions: assign(({ context, event }) => {
						if (!context.graph) return {};
						const journeySteps = context.nav.activeJourneyId
							? resolveStepsForJourney(context.nav.activeJourneyId, context.steps)
							: [];
						return {
							nav: reconcileNodeSelection(context.nav, event.nodeId, journeySteps, context.graph),
						};
					}),
				},
				SELECT_EDGE: {
					actions: assign(({ context, event }) => ({
						nav: {
							...context.nav,
							selectedEdgeId: event.edgeId,
							selectedNodeId: null,
						},
					})),
				},
				CLEAR_SELECTION: {
					actions: assign(({ context }) => ({
						nav: {
							...context.nav,
							selectedNodeId: null,
							selectedEdgeId: null,
						},
					})),
				},
				SWITCH_MODE: {
					actions: assign(({ context, event }) => ({
						nav: reconcileModeSwitch(context.nav, event.mode),
					})),
				},
				// 0.4.0 event handlers
				SWITCH_CANVAS_MODE: {
					actions: assign(({ context, event }) => ({
						nav: reconcileCanvasModeSwitch(context.nav, event.canvasMode),
					})),
				},
				SELECT_SEQUENCE: {
					actions: assign(({ context, event }) => {
						const sequence = context.sequences.find((s) => s.id === event.sequenceId);
						if (!sequence) return {};
						const nav = reconcileSequenceSwitch(
							context.nav,
							event.sequenceId,
							sequence,
							context.capabilities,
						);
						// An index is only valid when it points at a message the kernel holds.
						const msgs = resolveMessagesForSequence(
							event.sequenceId,
							context.sequences,
							context.messages,
						);
						return { nav: msgs.length > 0 ? nav : { ...nav, activeMessageIndex: null } };
					}),
				},
				CLEAR_SEQUENCE: {
					actions: assign(({ context }) => ({
						nav: reconcileSequenceClear(context.nav),
					})),
				},
				// 0.2.0 event handlers
				SELECT_VALUE_STREAM: {
					actions: assign(({ context, event }) => {
						const vs = context.valueStreams.find((v) => v.id === event.valueStreamId);
						if (!vs) return {};
						return {
							nav: reconcileValueStreamSwitch(context.nav, event.valueStreamId, vs),
						};
					}),
				},
				CLEAR_VALUE_STREAM: {
					actions: assign(({ context }) => ({
						nav: {
							...context.nav,
							activeValueStreamId: null,
							activeProcessId: null,
						},
					})),
				},
				SELECT_PROCESS: {
					actions: assign(({ context, event }) => {
						if (!context.graph) return {};
						const stages = resolveStagesForProcess(event.processId, context.processStages);
						return {
							nav: reconcileProcessSwitch(context.nav, event.processId, stages, context.graph),
						};
					}),
				},
				CLEAR_PROCESS: {
					actions: assign(({ context }) => ({
						nav: {
							...context.nav,
							activeProcessId: null,
						},
					})),
				},
				START_ROUTE: {
					guard: "isValidRoute",
					actions: assign(({ context, event }) => {
						if (!context.graph) return {};
						const route = context.storyRoutes.find((r) => r.id === event.storyRouteId);
						if (!route) return {};
						const waypoints = resolveWaypointsForRoute(route.id, context.storyWaypoints);
						return {
							nav: reconcileStoryRouteStart(context.nav, route, waypoints, context.graph),
						};
					}),
				},
				NEXT_WAYPOINT: {
					guard: "canAdvanceWaypoint",
					actions: assign(({ context }) => {
						if (
							context.nav.activeWaypointIndex == null ||
							!context.nav.activeStoryRouteId ||
							!context.graph ||
							context.nav.routeState !== "active"
						)
							return {};
						const waypoints = resolveWaypointsForRoute(
							context.nav.activeStoryRouteId,
							context.storyWaypoints,
						);
						return {
							nav: reconcileWaypointChange(
								context.nav,
								context.nav.activeWaypointIndex + 1,
								waypoints,
								context.graph,
							),
						};
					}),
				},
				PREVIOUS_WAYPOINT: {
					guard: "canGoBackWaypoint",
					actions: assign(({ context }) => {
						if (
							context.nav.activeWaypointIndex == null ||
							!context.nav.activeStoryRouteId ||
							!context.graph ||
							context.nav.routeState !== "active"
						)
							return {};
						const waypoints = resolveWaypointsForRoute(
							context.nav.activeStoryRouteId,
							context.storyWaypoints,
						);
						return {
							nav: reconcileWaypointChange(
								context.nav,
								context.nav.activeWaypointIndex - 1,
								waypoints,
								context.graph,
							),
						};
					}),
				},
				JUMP_TO_WAYPOINT: {
					guard: "isValidWaypointIndex",
					actions: assign(({ context, event }) => {
						if (!context.nav.activeStoryRouteId || !context.graph) return {};
						const waypoints = resolveWaypointsForRoute(
							context.nav.activeStoryRouteId,
							context.storyWaypoints,
						);
						return {
							nav: reconcileWaypointChange(context.nav, event.index, waypoints, context.graph),
						};
					}),
				},
				PAUSE_ROUTE: {
					guard: "isRouteActive",
					actions: assign(({ context }) => ({
						pausedRouteSnapshot: { ...context.nav },
						nav: reconcileRoutePause(context.nav),
					})),
				},
				RESUME_ROUTE: {
					guard: "isRoutePaused",
					actions: assign(({ context }) => {
						if (!context.pausedRouteSnapshot) return {};
						return {
							nav: reconcileRouteResume(context.nav, context.pausedRouteSnapshot),
							pausedRouteSnapshot: null,
						};
					}),
				},
				END_ROUTE: {
					guard: "hasActiveRoute",
					actions: assign(({ context }) => ({
						nav: reconcileRouteEnd(context.nav),
						pausedRouteSnapshot: null,
					})),
				},
				// 0.6.0 — Generic stepper events. Each resolves the stepper for the
				// active perspective and moves it by position.
				STEPPER_FORWARD: {
					guard: "canStepperForward",
					actions: assign(({ context }) => {
						const stepper = resolveStepper(context);
						return stepper ? stepTo(context, stepper, (stepper.index ?? -1) + 1) : {};
					}),
				},
				STEPPER_BACKWARD: {
					guard: "canStepperBackward",
					actions: assign(({ context }) => {
						const stepper = resolveStepper(context);
						return stepper ? stepTo(context, stepper, (stepper.index ?? 0) - 1) : {};
					}),
				},
				STEPPER_RESET: {
					guard: "hasStepperTarget",
					actions: assign(({ context }) => {
						const stepper = resolveStepper(context);
						return stepper ? stepTo(context, stepper, 0) : {};
					}),
				},
				STEPPER_END: {
					guard: "hasStepperTarget",
					actions: assign(({ context }) => {
						const stepper = resolveStepper(context);
						return stepper ? stepTo(context, stepper, stepper.count - 1) : {};
					}),
				},
				// 0.7.0 — Orientation jump
				JUMP_TO_ORIENTATION: {
					actions: assign(({ context, event }) => {
						if (event.index < 0 || event.index >= context.orientationItems.length) {
							return {};
						}
						return {
							nav: reconcileOrientationChange(context.nav, event.index),
						};
					}),
				},
			},
		},
	},
});
