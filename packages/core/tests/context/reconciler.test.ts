import { describe, expect, it } from "vitest";
import { createInitialNavigationContext } from "../../src/context/navigation-context.js";
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
	reconcileWaypointChange,
} from "../../src/context/reconciler.js";
import { createGraph } from "../../src/graph/graph.js";
import {
	capabilities,
	edges,
	journeys,
	nodes,
	processStages,
	steps,
	storyRoutes,
	storyWaypoints,
} from "../../src/test-fixtures/index.js";

const graph = createGraph(nodes, edges);
// biome-ignore lint/style/noNonNullAssertion: seed data is known to have at least one journey
const journey = journeys[0]!;
const journeySteps = steps.filter((s) => s.journeyId === journey.id);

function baseCtx() {
	return createInitialNavigationContext("persp-landscape");
}

describe("reconcileDomainSwitch", () => {
	it("sets domain and clears capability/journey/step", () => {
		const ctx = {
			...baseCtx(),
			activeCapabilityId: "cap-context-machine",
			activeJourneyId: "j-full-descent",
			activeStepIndex: 3,
		};
		const result = reconcileDomainSwitch(ctx, "dom-core-kernel");
		expect(result.activeDomainId).toBe("dom-core-kernel");
		expect(result.activeCapabilityId).toBeNull();
		expect(result.activeJourneyId).toBeNull();
		expect(result.activeStepIndex).toBeNull();
		expect(result.activeFocusTargets).toEqual([]);
		expect(result.activeSceneId).toBeNull();
	});

	it("preserves perspective", () => {
		const ctx = { ...baseCtx(), activePerspectiveId: "persp-architecture" };
		const result = reconcileDomainSwitch(ctx, "dom-core-kernel");
		expect(result.activePerspectiveId).toBe("persp-architecture");
	});

	it("preserves mode", () => {
		const ctx = { ...baseCtx(), mode: "guiderail" as const };
		const result = reconcileDomainSwitch(ctx, "dom-core-kernel");
		expect(result.mode).toBe("guiderail");
	});
});

describe("reconcileCapabilitySwitch", () => {
	it("sets capability and clears journey/step", () => {
		const ctx = {
			...baseCtx(),
			activeDomainId: "dom-core-kernel",
			activeJourneyId: "j-full-descent",
			activeStepIndex: 2,
		};
		const result = reconcileCapabilitySwitch(ctx, "cap-context-machine");
		expect(result.activeCapabilityId).toBe("cap-context-machine");
		expect(result.activeJourneyId).toBeNull();
		expect(result.activeStepIndex).toBeNull();
	});

	it("preserves domain and perspective", () => {
		const ctx = {
			...baseCtx(),
			activeDomainId: "dom-core-kernel",
			activePerspectiveId: "persp-process",
		};
		const result = reconcileCapabilitySwitch(ctx, "cap-context-machine");
		expect(result.activeDomainId).toBe("dom-core-kernel");
		expect(result.activePerspectiveId).toBe("persp-process");
	});
});

describe("reconcilePerspectiveSwitch", () => {
	it("preserves domain/capability/journey/step", () => {
		const ctx = {
			...baseCtx(),
			activeDomainId: "dom-core-kernel",
			activeCapabilityId: "cap-context-machine",
			activeJourneyId: "j-full-descent",
			activeStepIndex: 2,
			activeFocusTargets: [{ type: "node" as const, targetId: "n-context-machine" }],
		};
		const result = reconcilePerspectiveSwitch(ctx, "persp-architecture", graph);
		expect(result.activeDomainId).toBe("dom-core-kernel");
		expect(result.activeCapabilityId).toBe("cap-context-machine");
		expect(result.activeJourneyId).toBe("j-full-descent");
		expect(result.activeStepIndex).toBe(2);
		expect(result.activePerspectiveId).toBe("persp-architecture");
	});

	it("updates viewport to focal node position in new perspective", () => {
		const ctx = {
			...baseCtx(),
			activeFocusTargets: [{ type: "node" as const, targetId: "n-context-machine" }],
		};
		const result = reconcilePerspectiveSwitch(ctx, "persp-architecture", graph);
		// n-context-machine has persp-architecture layout at { x: 400, y: 0 }
		expect(result.viewportAnchor.x).toBe(400);
		expect(result.viewportAnchor.y).toBe(0);
	});

	it("uses selectedNodeId if no focus targets", () => {
		const ctx = {
			...baseCtx(),
			selectedNodeId: "n-reconciler",
		};
		const result = reconcilePerspectiveSwitch(ctx, "persp-architecture", graph);
		// n-reconciler has persp-architecture layout at { x: 400, y: 150 }
		expect(result.viewportAnchor.x).toBe(400);
		expect(result.viewportAnchor.y).toBe(150);
	});
});

describe("reconcileJourneySelection", () => {
	it("sets journey, step 0, and focus targets", () => {
		const result = reconcileJourneySelection(baseCtx(), journey, journeySteps, capabilities, graph);
		expect(result.activeJourneyId).toBe("j-full-descent");
		expect(result.activeStepIndex).toBe(0);
		expect(result.activeFocusTargets.length).toBeGreaterThan(0);
	});

	it("infers domain from entry capability when not set", () => {
		const result = reconcileJourneySelection(baseCtx(), journey, journeySteps, capabilities, graph);
		expect(result.activeDomainId).toBe("dom-navigation");
		expect(result.activeCapabilityId).toBe("cap-perspective-switching");
	});

	it("preserves existing domain/capability if already set", () => {
		const ctx = {
			...baseCtx(),
			activeDomainId: "dom-core-kernel",
			activeCapabilityId: "cap-context-machine",
		};
		const result = reconcileJourneySelection(ctx, journey, journeySteps, capabilities, graph);
		expect(result.activeDomainId).toBe("dom-core-kernel");
		expect(result.activeCapabilityId).toBe("cap-context-machine");
	});

	it("preserves perspective", () => {
		const ctx = { ...baseCtx(), activePerspectiveId: "persp-architecture" };
		const result = reconcileJourneySelection(ctx, journey, journeySteps, capabilities, graph);
		expect(result.activePerspectiveId).toBe("persp-architecture");
	});

	it("updates viewport to first step's primary node", () => {
		const result = reconcileJourneySelection(baseCtx(), journey, journeySteps, capabilities, graph);
		// First step focuses on n-app-shell which has persp-architecture layout at { x: 0, y: 0 }
		expect(result.viewportAnchor.x).toBe(0);
		expect(result.viewportAnchor.y).toBe(0);
	});
});

describe("reconcileJourneyDeselection", () => {
	it("clears journey/step/scene but preserves domain/capability/perspective", () => {
		const ctx = {
			...baseCtx(),
			activeDomainId: "dom-core-kernel",
			activeCapabilityId: "cap-context-machine",
			activePerspectiveId: "persp-process",
			activeJourneyId: "j-full-descent",
			activeStepIndex: 3,
			activeSceneId: "sc-4",
			selectedNodeId: "n-reconciler",
		};
		const result = reconcileJourneyDeselection(ctx);
		expect(result.activeJourneyId).toBeNull();
		expect(result.activeStepIndex).toBeNull();
		expect(result.activeSceneId).toBeNull();
		expect(result.activeFocusTargets).toEqual([]);
		expect(result.activeDomainId).toBe("dom-core-kernel");
		expect(result.activeCapabilityId).toBe("cap-context-machine");
		expect(result.activePerspectiveId).toBe("persp-process");
		expect(result.selectedNodeId).toBe("n-reconciler");
	});
});

describe("reconcileStepChange", () => {
	it("updates focus targets and viewport", () => {
		const ctx = {
			...baseCtx(),
			activeJourneyId: "j-full-descent",
			activeStepIndex: 0,
		};
		const result = reconcileStepChange(ctx, 2, journeySteps, graph);
		expect(result.activeStepIndex).toBe(2);
		expect(result.activeFocusTargets.length).toBeGreaterThan(0);
	});

	it("updates capability when step crosses capability boundary", () => {
		const ctx = {
			...baseCtx(),
			activeCapabilityId: "cap-perspective-switching",
			activeJourneyId: "j-full-descent",
			activeStepIndex: 5,
		};
		// Step index 6 (step-fd-7) is in cap-canvas-mode-switching
		const result = reconcileStepChange(ctx, 6, journeySteps, graph);
		expect(result.activeCapabilityId).toBe("cap-canvas-mode-switching");
	});

	it("updates viewport to primary node position", () => {
		const ctx = {
			...baseCtx(),
			activePerspectiveId: "persp-architecture",
			activeJourneyId: "j-full-descent",
			activeStepIndex: 0,
		};
		// Step 2 (step-fd-3) focuses on n-context-machine (persp-architecture: { x: 400, y: 0 })
		const result = reconcileStepChange(ctx, 2, journeySteps, graph);
		expect(result.viewportAnchor.x).toBe(400);
		expect(result.viewportAnchor.y).toBe(0);
	});

	it("returns unchanged context for invalid step index", () => {
		const ctx = { ...baseCtx(), activeStepIndex: 0 };
		const result = reconcileStepChange(ctx, 99, journeySteps, graph);
		expect(result).toEqual(ctx);
	});
});

describe("reconcileNodeSelection", () => {
	it("snaps to step when node is on active journey path", () => {
		const ctx = {
			...baseCtx(),
			activeJourneyId: "j-full-descent",
			activeStepIndex: 0,
		};
		// n-context-machine is a focus target on step 2 (step-fd-3)
		const result = reconcileNodeSelection(ctx, "n-context-machine", journeySteps, graph);
		expect(result.activeStepIndex).toBe(2);
	});

	it("selects node without disrupting journey when node is off-path", () => {
		const ctx = {
			...baseCtx(),
			activeJourneyId: "j-full-descent",
			activeStepIndex: 2,
		};
		// n-graph is not on the full-descent journey path
		const result = reconcileNodeSelection(ctx, "n-graph", journeySteps, graph);
		expect(result.selectedNodeId).toBe("n-graph");
		expect(result.activeStepIndex).toBe(2);
		expect(result.activeJourneyId).toBe("j-full-descent");
	});

	it("selects node normally when no journey is active", () => {
		const result = reconcileNodeSelection(baseCtx(), "n-reconciler", [], graph);
		expect(result.selectedNodeId).toBe("n-reconciler");
		expect(result.activeJourneyId).toBeNull();
	});
});

describe("reconcileModeSwitch", () => {
	it("switches mode and preserves all context", () => {
		const ctx = {
			...baseCtx(),
			activeDomainId: "dom-core-kernel",
			activeCapabilityId: "cap-context-machine",
			activeJourneyId: "j-full-descent",
			activeStepIndex: 3,
		};
		const result = reconcileModeSwitch(ctx, "guiderail");
		expect(result.mode).toBe("guiderail");
		expect(result.activeDomainId).toBe("dom-core-kernel");
		expect(result.activeCapabilityId).toBe("cap-context-machine");
		expect(result.activeJourneyId).toBe("j-full-descent");
		expect(result.activeStepIndex).toBe(3);
	});
});

// --- 0.2.0 reconciler additions ---

// biome-ignore lint/style/noNonNullAssertion: seed data known
const storyRoute = storyRoutes.find((sr) => sr.id === "sr-full-descent")!;
const routeWaypoints = storyWaypoints.filter((sw) => sw.storyRouteId === "sr-full-descent");
const perspectiveSwitchStages = processStages.filter(
	(ps) => ps.processId === "proc-perspective-switch",
);

describe("reconcileProcessSwitch", () => {
	it("sets process and updates focus to first stage nodes", () => {
		const result = reconcileProcessSwitch(
			baseCtx(),
			"proc-perspective-switch",
			perspectiveSwitchStages,
			graph,
		);
		expect(result.activeProcessId).toBe("proc-perspective-switch");
		expect(result.activeFocusTargets.length).toBeGreaterThan(0);
		expect(result.activeFocusTargets[0]?.type).toBe("node");
	});

	it("preserves domain/capability/perspective", () => {
		const ctx = {
			...baseCtx(),
			activeDomainId: "dom-core-kernel",
			activeCapabilityId: "cap-state-reconciliation",
			activePerspectiveId: "persp-process",
		};
		const result = reconcileProcessSwitch(
			ctx,
			"proc-perspective-switch",
			perspectiveSwitchStages,
			graph,
		);
		expect(result.activeDomainId).toBe("dom-core-kernel");
		expect(result.activeCapabilityId).toBe("cap-state-reconciliation");
		expect(result.activePerspectiveId).toBe("persp-process");
	});
});

describe("reconcileStoryRouteStart", () => {
	it("sets route, first waypoint, and routeState active", () => {
		const result = reconcileStoryRouteStart(baseCtx(), storyRoute, routeWaypoints, graph);
		expect(result.activeStoryRouteId).toBe("sr-full-descent");
		expect(result.activeWaypointIndex).toBe(0);
		expect(result.routeState).toBe("active");
		expect(result.activeFocusTargets.length).toBeGreaterThan(0);
	});

	it("applies first waypoint perspective if present", () => {
		const result = reconcileStoryRouteStart(baseCtx(), storyRoute, routeWaypoints, graph);
		// First waypoint (sw-fd-1) has perspectiveId: "persp-landscape"
		expect(result.activePerspectiveId).toBe("persp-landscape");
	});

	it("does not clear domain/capability", () => {
		const ctx = {
			...baseCtx(),
			activeDomainId: "dom-core-kernel",
			activeCapabilityId: "cap-state-reconciliation",
		};
		const result = reconcileStoryRouteStart(ctx, storyRoute, routeWaypoints, graph);
		expect(result.activeDomainId).toBe("dom-core-kernel");
		expect(result.activeCapabilityId).toBe("cap-state-reconciliation");
	});
});

describe("reconcileWaypointChange", () => {
	it("updates focus targets for new waypoint", () => {
		const ctx = {
			...baseCtx(),
			activeStoryRouteId: "sr-full-descent",
			activeWaypointIndex: 0,
			routeState: "active" as const,
		};
		const result = reconcileWaypointChange(ctx, 1, routeWaypoints, graph);
		expect(result.activeWaypointIndex).toBe(1);
	});

	it("applies waypoint perspective if present", () => {
		const ctx = { ...baseCtx(), routeState: "active" as const };
		// Waypoint sw-fd-2 (index 1) has perspectiveId: "persp-landscape"
		const result = reconcileWaypointChange(ctx, 1, routeWaypoints, graph);
		expect(result.activePerspectiveId).toBe("persp-landscape");
	});

	it("returns unchanged for invalid waypoint index", () => {
		const ctx = { ...baseCtx(), routeState: "active" as const };
		const result = reconcileWaypointChange(ctx, 99, routeWaypoints, graph);
		expect(result).toEqual(ctx);
	});
});

describe("reconcileRoutePause", () => {
	it("sets routeState to paused", () => {
		const ctx = {
			...baseCtx(),
			activeStoryRouteId: "sr-full-descent",
			activeWaypointIndex: 2,
			routeState: "active" as const,
		};
		const result = reconcileRoutePause(ctx);
		expect(result.routeState).toBe("paused");
		expect(result.activeStoryRouteId).toBe("sr-full-descent");
		expect(result.activeWaypointIndex).toBe(2);
	});
});

describe("reconcileRouteResume", () => {
	it("restores focus/perspective/viewport from saved snapshot", () => {
		const savedSnapshot = {
			...baseCtx(),
			activeFocusTargets: [{ type: "node" as const, targetId: "n-reconciler" }],
			activePerspectiveId: "persp-architecture",
			viewportAnchor: { x: 500, y: 200, zoom: 1.5 },
			activeWaypointIndex: 2,
		};
		const currentCtx = {
			...baseCtx(),
			routeState: "paused" as const,
			activeStoryRouteId: "sr-full-descent",
			selectedNodeId: "n-user",
			activePerspectiveId: "persp-landscape",
		};
		const result = reconcileRouteResume(currentCtx, savedSnapshot);
		expect(result.routeState).toBe("active");
		expect(result.activeFocusTargets).toEqual(savedSnapshot.activeFocusTargets);
		expect(result.activePerspectiveId).toBe("persp-architecture");
		expect(result.viewportAnchor).toEqual(savedSnapshot.viewportAnchor);
		expect(result.activeWaypointIndex).toBe(2);
	});
});

describe("reconcileRouteEnd", () => {
	it("clears route state and preserves domain/capability/perspective", () => {
		const ctx = {
			...baseCtx(),
			activeDomainId: "dom-core-kernel",
			activeCapabilityId: "cap-state-reconciliation",
			activePerspectiveId: "persp-architecture",
			activeStoryRouteId: "sr-full-descent",
			activeWaypointIndex: 4,
			routeState: "active" as const,
			activeFocusTargets: [{ type: "node" as const, targetId: "n-reconciler" }],
		};
		const result = reconcileRouteEnd(ctx);
		expect(result.activeStoryRouteId).toBeNull();
		expect(result.activeWaypointIndex).toBeNull();
		expect(result.routeState).toBe("inactive");
		expect(result.activeFocusTargets).toEqual([]);
		expect(result.activeDomainId).toBe("dom-core-kernel");
		expect(result.activeCapabilityId).toBe("cap-state-reconciliation");
		expect(result.activePerspectiveId).toBe("persp-architecture");
	});
});

describe("reconcileCanvasModeSwitch", () => {
	it("sets canvas mode and preserves everything including selection", () => {
		const ctx = {
			...baseCtx(),
			activeDomainId: "dom-core-kernel",
			activeCapabilityId: "cap-state-reconciliation",
			selectedNodeId: "n-reconciler",
			selectedEdgeId: "e-machine-reconciler",
			activeProcessId: "proc-perspective-switch",
		};
		const result = reconcileCanvasModeSwitch(ctx, "operational");
		expect(result.activeCanvasMode).toBe("operational");
		expect(result.activeDomainId).toBe("dom-core-kernel");
		expect(result.activeCapabilityId).toBe("cap-state-reconciliation");
		expect(result.selectedNodeId).toBe("n-reconciler");
		expect(result.selectedEdgeId).toBe("e-machine-reconciler");
		expect(result.activeProcessId).toBe("proc-perspective-switch");
	});

	it("switching canvas mode again replaces the previous mode", () => {
		const ctx = {
			...baseCtx(),
			activeCanvasMode: "operational",
		};
		const result = reconcileCanvasModeSwitch(ctx, "activity");
		expect(result.activeCanvasMode).toBe("activity");
	});
});

describe("reconcilePerspectiveSwitch — shared context contract", () => {
	it("clears selection and canvas mode on perspective switch", () => {
		const ctx = {
			...baseCtx(),
			selectedNodeId: "n-reconciler",
			selectedEdgeId: "e-machine-reconciler",
			activeCanvasMode: "operational",
		};
		const result = reconcilePerspectiveSwitch(ctx, "persp-architecture", graph);
		expect(result.selectedNodeId).toBeNull();
		expect(result.selectedEdgeId).toBeNull();
		expect(result.activeCanvasMode).toBeNull();
	});

	it("preserves domain, capability, journey, process, and route context", () => {
		const ctx = {
			...baseCtx(),
			activeDomainId: "dom-core-kernel",
			activeCapabilityId: "cap-state-reconciliation",
			activeJourneyId: "j-full-descent",
			activeProcessId: "proc-perspective-switch",
			activeStoryRouteId: "sr-full-descent",
			activeWaypointIndex: 2,
			routeState: "active" as const,
		};
		const result = reconcilePerspectiveSwitch(ctx, "persp-sequence", graph);
		expect(result.activeDomainId).toBe("dom-core-kernel");
		expect(result.activeCapabilityId).toBe("cap-state-reconciliation");
		expect(result.activeJourneyId).toBe("j-full-descent");
		expect(result.activeProcessId).toBe("proc-perspective-switch");
		expect(result.activeStoryRouteId).toBe("sr-full-descent");
		expect(result.activeWaypointIndex).toBe(2);
		expect(result.routeState).toBe("active");
		expect(result.activePerspectiveId).toBe("persp-sequence");
	});
});

describe("reconcileSequenceSwitch", () => {
	it("sets activeSequenceId and auto-sets domain/capability from sequence", () => {
		const ctx = baseCtx();
		const sequence = {
			id: "seq-test",
			label: "Test",
			capabilityId: "cap-state-reconciliation",
			interfaceIds: [],
			messageIds: [],
			tags: [],
			metadata: {},
		};
		const result = reconcileSequenceSwitch(ctx, "seq-test", sequence, capabilities);
		expect(result.activeSequenceId).toBe("seq-test");
		expect(result.activeCapabilityId).toBe("cap-state-reconciliation");
		expect(result.activeDomainId).toBe("dom-core-kernel");
	});

	it("preserves compatible processId from sequence", () => {
		const ctx = {
			...baseCtx(),
			activeProcessId: "proc-perspective-switch",
		};
		const sequence = {
			id: "seq-test",
			label: "Test",
			capabilityId: "cap-state-reconciliation",
			processId: "proc-perspective-switch",
			interfaceIds: [],
			messageIds: [],
			tags: [],
			metadata: {},
		};
		const result = reconcileSequenceSwitch(ctx, "seq-test", sequence, capabilities);
		expect(result.activeProcessId).toBe("proc-perspective-switch");
	});

	it("clears incompatible processId", () => {
		const ctx = {
			...baseCtx(),
			activeProcessId: "proc-other",
		};
		const sequence = {
			id: "seq-test",
			label: "Test",
			capabilityId: "cap-state-reconciliation",
			processId: "proc-perspective-switch",
			interfaceIds: [],
			messageIds: [],
			tags: [],
			metadata: {},
		};
		const result = reconcileSequenceSwitch(ctx, "seq-test", sequence, capabilities);
		expect(result.activeProcessId).toBe("proc-perspective-switch");
	});

	it("does not force perspective switch", () => {
		const ctx = {
			...baseCtx(),
			activePerspectiveId: "persp-architecture",
		};
		const sequence = {
			id: "seq-test",
			label: "Test",
			capabilityId: "cap-state-reconciliation",
			interfaceIds: [],
			messageIds: [],
			tags: [],
			metadata: {},
		};
		const result = reconcileSequenceSwitch(ctx, "seq-test", sequence, capabilities);
		expect(result.activePerspectiveId).toBe("persp-architecture");
	});
});

describe("reconcileSequenceClear", () => {
	it("clears only activeSequenceId", () => {
		const ctx = {
			...baseCtx(),
			activeSequenceId: "seq-test",
			activeDomainId: "dom-core-kernel",
			activeCapabilityId: "cap-state-reconciliation",
		};
		const result = reconcileSequenceClear(ctx);
		expect(result.activeSequenceId).toBeNull();
		expect(result.activeDomainId).toBe("dom-core-kernel");
		expect(result.activeCapabilityId).toBe("cap-state-reconciliation");
	});
});

// --- 0.6.0 reconciler additions ---

const perspectiveSwitchStagesForReconciler = processStages
	.filter((ps) => ps.processId === "proc-perspective-switch")
	.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

describe("reconcileStageChange", () => {
	it("sets activeStageIndex and updates focus targets", () => {
		const ctx = {
			...baseCtx(),
			activeProcessId: "proc-perspective-switch",
			activePerspectiveId: "persp-process",
		};
		const result = reconcileStageChange(ctx, 0, perspectiveSwitchStagesForReconciler, graph);
		expect(result.activeStageIndex).toBe(0);
		expect(result.activeFocusTargets.length).toBeGreaterThan(0);
		expect(result.activeFocusTargets[0]?.type).toBe("node");
	});

	it("updates focus targets when advancing to next stage", () => {
		const ctx = {
			...baseCtx(),
			activeProcessId: "proc-perspective-switch",
			activePerspectiveId: "persp-process",
			activeStageIndex: 0,
		};
		const result = reconcileStageChange(ctx, 1, perspectiveSwitchStagesForReconciler, graph);
		expect(result.activeStageIndex).toBe(1);
		expect(result.activeFocusTargets.length).toBeGreaterThan(0);
	});

	it("returns unchanged context for invalid stage index", () => {
		const ctx = {
			...baseCtx(),
			activeProcessId: "proc-perspective-switch",
			activeStageIndex: 0,
		};
		const result = reconcileStageChange(ctx, 99, perspectiveSwitchStagesForReconciler, graph);
		expect(result).toEqual(ctx);
	});

	it("preserves domain/capability/perspective", () => {
		const ctx = {
			...baseCtx(),
			activeDomainId: "dom-core-kernel",
			activeCapabilityId: "cap-state-reconciliation",
			activePerspectiveId: "persp-process",
			activeProcessId: "proc-perspective-switch",
		};
		const result = reconcileStageChange(ctx, 0, perspectiveSwitchStagesForReconciler, graph);
		expect(result.activeDomainId).toBe("dom-core-kernel");
		expect(result.activeCapabilityId).toBe("cap-state-reconciliation");
		expect(result.activePerspectiveId).toBe("persp-process");
	});

	it("clears selected edge on stage change", () => {
		const ctx = {
			...baseCtx(),
			activeProcessId: "proc-perspective-switch",
			selectedEdgeId: "e-machine-reconciler",
		};
		const result = reconcileStageChange(ctx, 0, perspectiveSwitchStagesForReconciler, graph);
		expect(result.selectedEdgeId).toBeNull();
	});
});

describe("reconcileMessageChange", () => {
	it("sets activeMessageIndex", () => {
		const ctx = {
			...baseCtx(),
			activeSequenceId: "seq-capability-selection",
			activePerspectiveId: "persp-sequence",
		};
		const result = reconcileMessageChange(ctx, 0);
		expect(result.activeMessageIndex).toBe(0);
	});

	it("updates activeMessageIndex on advance", () => {
		const ctx = {
			...baseCtx(),
			activeSequenceId: "seq-capability-selection",
			activeMessageIndex: 0,
		};
		const result = reconcileMessageChange(ctx, 5);
		expect(result.activeMessageIndex).toBe(5);
	});

	it("preserves all other context", () => {
		const ctx = {
			...baseCtx(),
			activeDomainId: "dom-core-kernel",
			activeCapabilityId: "cap-state-reconciliation",
			activePerspectiveId: "persp-sequence",
			activeSequenceId: "seq-capability-selection",
			activeProcessId: "proc-perspective-switch",
		};
		const result = reconcileMessageChange(ctx, 3);
		expect(result.activeDomainId).toBe("dom-core-kernel");
		expect(result.activeCapabilityId).toBe("cap-state-reconciliation");
		expect(result.activePerspectiveId).toBe("persp-sequence");
		expect(result.activeSequenceId).toBe("seq-capability-selection");
		expect(result.activeProcessId).toBe("proc-perspective-switch");
		expect(result.activeMessageIndex).toBe(3);
	});
});

// --- 0.7.0 reconciler additions ---

describe("reconcileOrientationChange", () => {
	it("sets activeOrientationIndex", () => {
		const ctx = baseCtx();
		const result = reconcileOrientationChange(ctx, 3);
		expect(result.activeOrientationIndex).toBe(3);
	});

	it("preserves all other context", () => {
		const ctx = {
			...baseCtx(),
			activeDomainId: "dom-core-kernel",
			activePerspectiveId: "persp-orientation",
		};
		const result = reconcileOrientationChange(ctx, 5);
		expect(result.activeDomainId).toBe("dom-core-kernel");
		expect(result.activePerspectiveId).toBe("persp-orientation");
		expect(result.activeOrientationIndex).toBe(5);
	});
});
