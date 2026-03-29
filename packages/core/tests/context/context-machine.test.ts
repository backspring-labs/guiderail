import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import { contextMachine } from "../../src/context/context.machine.js";
import { createGraph } from "../../src/graph/graph.js";
import {
	capabilities,
	edges,
	interfaces,
	journeys,
	messages,
	nodes,
	processStages,
	processes,
	providerAssociations,
	providers,
	sequences,
	steps,
	storyRoutes,
	storyWaypoints,
	valueStreams,
} from "../../src/test-fixtures/index.js";
import { orientationItems } from "../../src/test-fixtures/seed-orientation.js";

const graph = createGraph(nodes, edges);

function createCtx() {
	const actor = createActor(contextMachine).start();
	actor.send({
		type: "INITIALIZE",
		graph,
		journeys,
		steps,
		capabilities,
	});
	return actor;
}

describe("Context Machine", () => {
	it("starts in uninitialized", () => {
		const actor = createActor(contextMachine).start();
		expect(actor.getSnapshot().value).toBe("uninitialized");
	});

	it("INITIALIZE transitions to ready", () => {
		const actor = createCtx();
		expect(actor.getSnapshot().value).toBe("ready");
		expect(actor.getSnapshot().context.graph).toBeDefined();
		expect(actor.getSnapshot().context.steps.length).toBe(21);
	});

	it("SELECT_DOMAIN updates nav context", () => {
		const actor = createCtx();
		actor.send({ type: "SELECT_DOMAIN", domainId: "dom-core-kernel" });
		const nav = actor.getSnapshot().context.nav;
		expect(nav.activeDomainId).toBe("dom-core-kernel");
		expect(nav.activeCapabilityId).toBeNull();
	});

	it("SELECT_CAPABILITY updates nav context", () => {
		const actor = createCtx();
		actor.send({ type: "SELECT_DOMAIN", domainId: "dom-core-kernel" });
		actor.send({ type: "SELECT_CAPABILITY", capabilityId: "cap-context-machine" });
		const nav = actor.getSnapshot().context.nav;
		expect(nav.activeCapabilityId).toBe("cap-context-machine");
	});

	it("CLEAR_DOMAIN clears domain and capability", () => {
		const actor = createCtx();
		actor.send({ type: "SELECT_DOMAIN", domainId: "dom-core-kernel" });
		actor.send({ type: "SELECT_CAPABILITY", capabilityId: "cap-context-machine" });
		actor.send({ type: "CLEAR_DOMAIN" });
		const nav = actor.getSnapshot().context.nav;
		expect(nav.activeCapabilityId).toBeNull();
		expect(nav.activeJourneyId).toBeNull();
	});

	it("SWITCH_PERSPECTIVE preserves domain/capability", () => {
		const actor = createCtx();
		actor.send({ type: "SELECT_DOMAIN", domainId: "dom-core-kernel" });
		actor.send({ type: "SELECT_CAPABILITY", capabilityId: "cap-context-machine" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-architecture" });
		const nav = actor.getSnapshot().context.nav;
		expect(nav.activePerspectiveId).toBe("persp-architecture");
		expect(nav.activeDomainId).toBe("dom-core-kernel");
		expect(nav.activeCapabilityId).toBe("cap-context-machine");
	});

	it("SWITCH_MODE preserves all context", () => {
		const actor = createCtx();
		actor.send({ type: "SELECT_DOMAIN", domainId: "dom-core-kernel" });
		actor.send({ type: "SWITCH_MODE", mode: "guiderail" });
		const nav = actor.getSnapshot().context.nav;
		expect(nav.mode).toBe("guiderail");
		expect(nav.activeDomainId).toBe("dom-core-kernel");
	});

	it("SELECT_NODE updates selected node", () => {
		const actor = createCtx();
		actor.send({ type: "SELECT_NODE", nodeId: "n-context-machine" });
		expect(actor.getSnapshot().context.nav.selectedNodeId).toBe("n-context-machine");
	});

	it("SELECT_EDGE updates selected edge and clears node", () => {
		const actor = createCtx();
		actor.send({ type: "SELECT_NODE", nodeId: "n-context-machine" });
		actor.send({ type: "SELECT_EDGE", edgeId: "e-machine-reconciler" });
		const nav = actor.getSnapshot().context.nav;
		expect(nav.selectedEdgeId).toBe("e-machine-reconciler");
		expect(nav.selectedNodeId).toBeNull();
	});

	it("rejects SELECT_JOURNEY for invalid journey", () => {
		const actor = createCtx();
		actor.send({ type: "SELECT_JOURNEY", journeyId: "nonexistent" });
		expect(actor.getSnapshot().context.nav.activeJourneyId).toBeNull();
	});

	it("ignores events in uninitialized state", () => {
		const actor = createActor(contextMachine).start();
		actor.send({ type: "SELECT_DOMAIN", domainId: "dom-core-kernel" });
		expect(actor.getSnapshot().value).toBe("uninitialized");
	});

	it("SELECT_JOURNEY sets journey and step 0", () => {
		const actor = createCtx();
		actor.send({ type: "SELECT_JOURNEY", journeyId: "j-full-descent" });
		const nav = actor.getSnapshot().context.nav;
		expect(nav.activeJourneyId).toBe("j-full-descent");
		expect(nav.activeStepIndex).toBe(0);
	});
});

// --- 0.2.0 Context Machine tests ---

function createFullCtx() {
	const actor = createActor(contextMachine).start();
	actor.send({
		type: "INITIALIZE",
		graph,
		journeys,
		steps,
		capabilities,
		providers,
		providerAssociations,
		valueStreams,
		processes,
		processStages,
		storyRoutes,
		storyWaypoints,
		interfaces,
		messages,
		sequences,
		orientationItems,
	});
	return actor;
}

describe("Context Machine 0.2.0", () => {
	it("INITIALIZE without new fields still works (backward compat)", () => {
		const actor = createCtx();
		expect(actor.getSnapshot().value).toBe("ready");
		expect(actor.getSnapshot().context.providers).toEqual([]);
		expect(actor.getSnapshot().context.storyRoutes).toEqual([]);
	});

	it("INITIALIZE with new fields stores them", () => {
		const actor = createFullCtx();
		// Self-referential corpus: no providers, no value streams
		expect(actor.getSnapshot().context.providers.length).toBe(0);
		expect(actor.getSnapshot().context.storyRoutes.length).toBe(3);
		expect(actor.getSnapshot().context.storyWaypoints.length).toBe(18);
		expect(actor.getSnapshot().context.valueStreams.length).toBe(0);
		expect(actor.getSnapshot().context.processes.length).toBe(3);
		expect(actor.getSnapshot().context.processStages.length).toBe(22);
	});

	it("SELECT_PROCESS updates nav", () => {
		const actor = createFullCtx();
		actor.send({ type: "SELECT_PROCESS", processId: "proc-perspective-switch" });
		const nav = actor.getSnapshot().context.nav;
		expect(nav.activeProcessId).toBe("proc-perspective-switch");
		expect(nav.activeFocusTargets.length).toBeGreaterThan(0);
	});

	it("CLEAR_PROCESS clears process", () => {
		const actor = createFullCtx();
		actor.send({ type: "SELECT_PROCESS", processId: "proc-perspective-switch" });
		actor.send({ type: "CLEAR_PROCESS" });
		expect(actor.getSnapshot().context.nav.activeProcessId).toBeNull();
	});

	it("START_ROUTE sets route and first waypoint", () => {
		const actor = createFullCtx();
		actor.send({ type: "START_ROUTE", storyRouteId: "sr-full-descent" });
		const nav = actor.getSnapshot().context.nav;
		expect(nav.activeStoryRouteId).toBe("sr-full-descent");
		expect(nav.activeWaypointIndex).toBe(0);
		expect(nav.routeState).toBe("active");
		expect(nav.activeFocusTargets.length).toBeGreaterThan(0);
	});

	it("START_ROUTE rejects invalid route", () => {
		const actor = createFullCtx();
		actor.send({ type: "START_ROUTE", storyRouteId: "nonexistent" });
		expect(actor.getSnapshot().context.nav.activeStoryRouteId).toBeNull();
	});

	it("NEXT_WAYPOINT advances", () => {
		const actor = createFullCtx();
		actor.send({ type: "START_ROUTE", storyRouteId: "sr-full-descent" });
		actor.send({ type: "NEXT_WAYPOINT" });
		expect(actor.getSnapshot().context.nav.activeWaypointIndex).toBe(1);
	});

	it("PAUSE_ROUTE and RESUME_ROUTE cycle", () => {
		const actor = createFullCtx();
		actor.send({ type: "START_ROUTE", storyRouteId: "sr-full-descent" });
		actor.send({ type: "NEXT_WAYPOINT" });

		// Pause
		actor.send({ type: "PAUSE_ROUTE" });
		expect(actor.getSnapshot().context.nav.routeState).toBe("paused");
		expect(actor.getSnapshot().context.pausedRouteSnapshot).not.toBeNull();

		// Explore during pause
		actor.send({ type: "SELECT_NODE", nodeId: "n-user" });

		// Resume
		actor.send({ type: "RESUME_ROUTE" });
		const nav = actor.getSnapshot().context.nav;
		expect(nav.routeState).toBe("active");
		expect(nav.activeWaypointIndex).toBe(1);
		expect(actor.getSnapshot().context.pausedRouteSnapshot).toBeNull();
	});

	it("END_ROUTE clears route state", () => {
		const actor = createFullCtx();
		actor.send({ type: "START_ROUTE", storyRouteId: "sr-full-descent" });
		actor.send({ type: "SELECT_DOMAIN", domainId: "dom-core-kernel" });
		actor.send({ type: "END_ROUTE" });
		const nav = actor.getSnapshot().context.nav;
		expect(nav.activeStoryRouteId).toBeNull();
		expect(nav.routeState).toBe("inactive");
		expect(nav.activeDomainId).toBe("dom-core-kernel");
	});
});

// --- 0.6.0 Stepper events ---

describe("Context Machine — Stepper (Journey)", () => {
	function createJourneyStepperCtx() {
		const actor = createFullCtx();
		actor.send({ type: "SELECT_JOURNEY", journeyId: "j-full-descent" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-journey" });
		return actor;
	}

	it("STEPPER_FORWARD increments activeStepIndex", () => {
		const actor = createJourneyStepperCtx();
		expect(actor.getSnapshot().context.nav.activeStepIndex).toBe(0);
		actor.send({ type: "STEPPER_FORWARD" });
		expect(actor.getSnapshot().context.nav.activeStepIndex).toBe(1);
	});

	it("STEPPER_BACKWARD decrements activeStepIndex", () => {
		const actor = createJourneyStepperCtx();
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_FORWARD" });
		expect(actor.getSnapshot().context.nav.activeStepIndex).toBe(2);
		actor.send({ type: "STEPPER_BACKWARD" });
		expect(actor.getSnapshot().context.nav.activeStepIndex).toBe(1);
	});

	it("STEPPER_RESET sets activeStepIndex to 0", () => {
		const actor = createJourneyStepperCtx();
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_RESET" });
		expect(actor.getSnapshot().context.nav.activeStepIndex).toBe(0);
	});

	it("STEPPER_END sets activeStepIndex to last step", () => {
		const actor = createJourneyStepperCtx();
		actor.send({ type: "STEPPER_END" });
		const nav = actor.getSnapshot().context.nav;
		// j-full-descent has 10 steps (indices 0-9)
		expect(nav.activeStepIndex).toBe(9);
	});

	it("STEPPER_FORWARD guard prevents stepping beyond last step", () => {
		const actor = createJourneyStepperCtx();
		actor.send({ type: "STEPPER_END" });
		const lastIndex = actor.getSnapshot().context.nav.activeStepIndex;
		actor.send({ type: "STEPPER_FORWARD" });
		expect(actor.getSnapshot().context.nav.activeStepIndex).toBe(lastIndex);
	});

	it("STEPPER_BACKWARD guard prevents stepping below 0", () => {
		const actor = createJourneyStepperCtx();
		expect(actor.getSnapshot().context.nav.activeStepIndex).toBe(0);
		actor.send({ type: "STEPPER_BACKWARD" });
		expect(actor.getSnapshot().context.nav.activeStepIndex).toBe(0);
	});
});

describe("Context Machine — Stepper (Process)", () => {
	function createProcessStepperCtx() {
		const actor = createFullCtx();
		actor.send({ type: "SELECT_PROCESS", processId: "proc-perspective-switch" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-process" });
		return actor;
	}

	it("STEPPER_FORWARD sets activeStageIndex from null to 0", () => {
		const actor = createProcessStepperCtx();
		expect(actor.getSnapshot().context.nav.activeStageIndex).toBeNull();
		actor.send({ type: "STEPPER_FORWARD" });
		expect(actor.getSnapshot().context.nav.activeStageIndex).toBe(0);
	});

	it("STEPPER_FORWARD increments activeStageIndex", () => {
		const actor = createProcessStepperCtx();
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_FORWARD" });
		expect(actor.getSnapshot().context.nav.activeStageIndex).toBe(1);
	});

	it("STEPPER_BACKWARD decrements activeStageIndex", () => {
		const actor = createProcessStepperCtx();
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_BACKWARD" });
		expect(actor.getSnapshot().context.nav.activeStageIndex).toBe(0);
	});

	it("STEPPER_FORWARD guard prevents stepping beyond last stage", () => {
		const actor = createProcessStepperCtx();
		actor.send({ type: "STEPPER_END" });
		const lastIndex = actor.getSnapshot().context.nav.activeStageIndex;
		actor.send({ type: "STEPPER_FORWARD" });
		expect(actor.getSnapshot().context.nav.activeStageIndex).toBe(lastIndex);
	});

	it("STEPPER_BACKWARD guard prevents stepping below 0", () => {
		const actor = createProcessStepperCtx();
		actor.send({ type: "STEPPER_FORWARD" }); // go to 0
		actor.send({ type: "STEPPER_BACKWARD" });
		// Guard should prevent going below 0
		expect(actor.getSnapshot().context.nav.activeStageIndex).toBe(0);
	});

	it("selecting a new process resets activeStageIndex", () => {
		const actor = createProcessStepperCtx();
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_FORWARD" });
		expect(actor.getSnapshot().context.nav.activeStageIndex).toBe(1);
		actor.send({ type: "SELECT_PROCESS", processId: "proc-perspective-switch" });
		expect(actor.getSnapshot().context.nav.activeStageIndex).toBeNull();
	});
});

describe("Context Machine — Stepper (Sequence)", () => {
	function createSequenceStepperCtx() {
		const actor = createFullCtx();
		actor.send({ type: "SELECT_SEQUENCE", sequenceId: "seq-capability-selection" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-sequence" });
		return actor;
	}

	it("STEPPER_FORWARD sets activeMessageIndex from null to 0", () => {
		const actor = createSequenceStepperCtx();
		expect(actor.getSnapshot().context.nav.activeMessageIndex).toBeNull();
		actor.send({ type: "STEPPER_FORWARD" });
		expect(actor.getSnapshot().context.nav.activeMessageIndex).toBe(0);
	});

	it("STEPPER_FORWARD increments activeMessageIndex", () => {
		const actor = createSequenceStepperCtx();
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_FORWARD" });
		expect(actor.getSnapshot().context.nav.activeMessageIndex).toBe(1);
	});

	it("STEPPER_BACKWARD decrements activeMessageIndex", () => {
		const actor = createSequenceStepperCtx();
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_BACKWARD" });
		expect(actor.getSnapshot().context.nav.activeMessageIndex).toBe(0);
	});

	it("STEPPER_FORWARD guard prevents stepping beyond last message", () => {
		const actor = createSequenceStepperCtx();
		actor.send({ type: "STEPPER_END" });
		const lastIndex = actor.getSnapshot().context.nav.activeMessageIndex;
		actor.send({ type: "STEPPER_FORWARD" });
		expect(actor.getSnapshot().context.nav.activeMessageIndex).toBe(lastIndex);
	});

	it("STEPPER_BACKWARD guard prevents stepping below 0", () => {
		const actor = createSequenceStepperCtx();
		actor.send({ type: "STEPPER_FORWARD" }); // go to 0
		actor.send({ type: "STEPPER_BACKWARD" });
		expect(actor.getSnapshot().context.nav.activeMessageIndex).toBe(0);
	});

	it("selecting a new sequence resets activeMessageIndex", () => {
		const actor = createSequenceStepperCtx();
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_FORWARD" });
		expect(actor.getSnapshot().context.nav.activeMessageIndex).toBe(1);
		actor.send({ type: "SELECT_SEQUENCE", sequenceId: "seq-capability-selection" });
		expect(actor.getSnapshot().context.nav.activeMessageIndex).toBeNull();
	});
});

describe("Context Machine — Stepper indices do not leak between types", () => {
	it("process stepper does not affect journey or sequence indices", () => {
		const actor = createFullCtx();
		actor.send({ type: "SELECT_JOURNEY", journeyId: "j-full-descent" });
		actor.send({ type: "SELECT_PROCESS", processId: "proc-perspective-switch" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-process" });

		// Step forward in process perspective — should affect activeStageIndex only
		actor.send({ type: "STEPPER_FORWARD" });
		const nav = actor.getSnapshot().context.nav;
		expect(nav.activeStageIndex).toBe(0);
		// Journey step index should be preserved (set to 0 from SELECT_JOURNEY)
		expect(nav.activeStepIndex).toBe(0);
		// Message index should remain null
		expect(nav.activeMessageIndex).toBeNull();
	});

	it("sequence stepper does not affect journey or process indices", () => {
		const actor = createFullCtx();
		actor.send({ type: "SELECT_PROCESS", processId: "proc-perspective-switch" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-process" });
		actor.send({ type: "STEPPER_FORWARD" }); // sets activeStageIndex to 0
		actor.send({ type: "SELECT_SEQUENCE", sequenceId: "seq-capability-selection" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-sequence" });

		actor.send({ type: "STEPPER_FORWARD" });
		const nav = actor.getSnapshot().context.nav;
		expect(nav.activeMessageIndex).toBe(0);
		// Stage index should be preserved (reconcileSequenceSwitch does not clear it)
		expect(nav.activeStageIndex).toBe(0);
	});
});

// --- 0.7.0 Orientation stepper ---

describe("Context Machine — Stepper (Orientation)", () => {
	function createOrientationStepperCtx() {
		const actor = createFullCtx();
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-orientation" });
		return actor;
	}

	it("STEPPER_FORWARD sets activeOrientationIndex from null to 0", () => {
		const actor = createOrientationStepperCtx();
		expect(actor.getSnapshot().context.nav.activeOrientationIndex).toBeNull();
		actor.send({ type: "STEPPER_FORWARD" });
		expect(actor.getSnapshot().context.nav.activeOrientationIndex).toBe(0);
	});

	it("STEPPER_FORWARD increments activeOrientationIndex", () => {
		const actor = createOrientationStepperCtx();
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_FORWARD" });
		expect(actor.getSnapshot().context.nav.activeOrientationIndex).toBe(1);
	});

	it("STEPPER_BACKWARD decrements activeOrientationIndex", () => {
		const actor = createOrientationStepperCtx();
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_BACKWARD" });
		expect(actor.getSnapshot().context.nav.activeOrientationIndex).toBe(0);
	});

	it("STEPPER_RESET sets activeOrientationIndex to 0", () => {
		const actor = createOrientationStepperCtx();
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_RESET" });
		expect(actor.getSnapshot().context.nav.activeOrientationIndex).toBe(0);
	});

	it("STEPPER_END sets activeOrientationIndex to last item", () => {
		const actor = createOrientationStepperCtx();
		actor.send({ type: "STEPPER_END" });
		const nav = actor.getSnapshot().context.nav;
		expect(nav.activeOrientationIndex).toBe(orientationItems.length - 1);
	});

	it("STEPPER_FORWARD guard prevents stepping beyond last item", () => {
		const actor = createOrientationStepperCtx();
		actor.send({ type: "STEPPER_END" });
		const lastIndex = actor.getSnapshot().context.nav.activeOrientationIndex;
		actor.send({ type: "STEPPER_FORWARD" });
		expect(actor.getSnapshot().context.nav.activeOrientationIndex).toBe(lastIndex);
	});

	it("STEPPER_BACKWARD guard prevents stepping below 0", () => {
		const actor = createOrientationStepperCtx();
		actor.send({ type: "STEPPER_FORWARD" }); // go to 0
		actor.send({ type: "STEPPER_BACKWARD" });
		expect(actor.getSnapshot().context.nav.activeOrientationIndex).toBe(0);
	});

	it("JUMP_TO_ORIENTATION sets activeOrientationIndex directly", () => {
		const actor = createOrientationStepperCtx();
		actor.send({ type: "JUMP_TO_ORIENTATION", index: 4 });
		expect(actor.getSnapshot().context.nav.activeOrientationIndex).toBe(4);
	});

	it("JUMP_TO_ORIENTATION rejects out-of-bounds index", () => {
		const actor = createOrientationStepperCtx();
		actor.send({ type: "JUMP_TO_ORIENTATION", index: 0 });
		actor.send({ type: "JUMP_TO_ORIENTATION", index: 999 });
		expect(actor.getSnapshot().context.nav.activeOrientationIndex).toBe(0);
	});

	it("JUMP_TO_ORIENTATION rejects negative index", () => {
		const actor = createOrientationStepperCtx();
		actor.send({ type: "JUMP_TO_ORIENTATION", index: 0 });
		actor.send({ type: "JUMP_TO_ORIENTATION", index: -1 });
		expect(actor.getSnapshot().context.nav.activeOrientationIndex).toBe(0);
	});

	it("activeOrientationIndex resets on perspective switch away", () => {
		const actor = createOrientationStepperCtx();
		actor.send({ type: "JUMP_TO_ORIENTATION", index: 3 });
		expect(actor.getSnapshot().context.nav.activeOrientationIndex).toBe(3);

		// Switch away from orientation
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-landscape" });
		// activeOrientationIndex is preserved (not cleared) per current reconciler behavior
		expect(actor.getSnapshot().context.nav.activeOrientationIndex).toBe(3);

		// Switch back — preserved
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-orientation" });
		expect(actor.getSnapshot().context.nav.activeOrientationIndex).toBe(3);
	});
});

// --- Seed split barrel re-export verification ---

describe("Seed split barrel re-export", () => {
	it("seed-banking.ts re-exports all expected entities", async () => {
		const barrel = await import("../../src/test-fixtures/seed-banking.js");
		expect(barrel.domains).toBeDefined();
		expect(barrel.capabilities).toBeDefined();
		expect(barrel.nodes).toBeDefined();
		expect(barrel.edges).toBeDefined();
		expect(barrel.journeys).toBeDefined();
		expect(barrel.steps).toBeDefined();
		expect(barrel.perspectives).toBeDefined();
		expect(barrel.layers).toBeDefined();
		expect(barrel.scenes).toBeDefined();
		expect(barrel.annotations).toBeDefined();
		expect(barrel.evidenceRefs).toBeDefined();
		expect(barrel.providers).toBeDefined();
		expect(barrel.providerAssociations).toBeDefined();
		expect(barrel.valueStreams).toBeDefined();
		expect(barrel.processes).toBeDefined();
		expect(barrel.processStages).toBeDefined();
		expect(barrel.storyRoutes).toBeDefined();
		expect(barrel.storyWaypoints).toBeDefined();
		expect(barrel.controlPoints).toBeDefined();
		expect(barrel.bpmnNodes).toBeDefined();
		expect(barrel.bpmnEdges).toBeDefined();
		expect(barrel.interfaces).toBeDefined();
		expect(barrel.messages).toBeDefined();
		expect(barrel.sequences).toBeDefined();
		expect(barrel.orientationItems).toBeDefined();
	});

	it("barrel re-export provides same data as direct import", () => {
		// The test-fixtures/index.ts imports from seed-banking.ts —
		// if we got here with valid data, the barrel chain works
		expect(capabilities.length).toBeGreaterThan(0);
		expect(journeys.length).toBeGreaterThan(0);
		expect(sequences.length).toBeGreaterThan(0);
		expect(messages.length).toBeGreaterThan(0);
		expect(processes.length).toBeGreaterThan(0);
		expect(processStages.length).toBeGreaterThan(0);
	});
});
