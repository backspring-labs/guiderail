import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import { contextMachine } from "../../src/context/context.machine.js";
import { createGraph } from "../../src/graph/graph.js";
import { capabilities, edges, journeys, nodes, steps } from "../../src/test-fixtures/index.js";

const graph = createGraph(nodes, edges);

function createInitializedContext() {
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

function nav(actor: ReturnType<typeof createActor<typeof contextMachine>>) {
	return actor.getSnapshot().context.nav;
}

describe("Integration Walkthrough — the user must never lose their place", () => {
	it("completes the full navigation flow", () => {
		const actor = createInitializedContext();

		// 1. Verify initial state
		expect(actor.getSnapshot().value).toBe("ready");
		expect(nav(actor).activeDomainId).toBeNull();

		// 2. Select domain "Core Kernel"
		actor.send({ type: "SELECT_DOMAIN", domainId: "dom-core-kernel" });
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");
		expect(nav(actor).activeCapabilityId).toBeNull();

		// 3. Select capability "Context Machine"
		actor.send({ type: "SELECT_CAPABILITY", capabilityId: "cap-context-machine" });
		expect(nav(actor).activeCapabilityId).toBe("cap-context-machine");
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");

		// 4. Switch perspective to "Process" — domain/capability preserved
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-process" });
		expect(nav(actor).activePerspectiveId).toBe("persp-process");
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");
		expect(nav(actor).activeCapabilityId).toBe("cap-context-machine");

		// 5. Switch perspective to "Architecture" — still preserved
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-architecture" });
		expect(nav(actor).activePerspectiveId).toBe("persp-architecture");
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");
		expect(nav(actor).activeCapabilityId).toBe("cap-context-machine");

		// 6. Select journey "The Full Descent"
		actor.send({ type: "SELECT_JOURNEY", journeyId: "j-full-descent" });
		expect(nav(actor).activeJourneyId).toBe("j-full-descent");
		expect(nav(actor).activeStepIndex).toBe(0);
		expect(nav(actor).activeFocusTargets.length).toBeGreaterThan(0);
		// Domain/capability preserved since they were already set
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");
		expect(nav(actor).activeCapabilityId).toBe("cap-context-machine");

		// 7. Step forward
		actor.send({ type: "STEP_FORWARD" });
		expect(nav(actor).activeStepIndex).toBe(1);

		// 8. Switch perspective to "Architecture" — step preserved
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-architecture" });
		expect(nav(actor).activePerspectiveId).toBe("persp-architecture");
		expect(nav(actor).activeStepIndex).toBe(1);
		expect(nav(actor).activeJourneyId).toBe("j-full-descent");

		// 9. Step through remaining steps
		actor.send({ type: "STEP_FORWARD" }); // step 2
		actor.send({ type: "STEP_FORWARD" }); // step 3
		actor.send({ type: "STEP_FORWARD" }); // step 4
		actor.send({ type: "STEP_FORWARD" }); // step 5
		actor.send({ type: "STEP_FORWARD" }); // step 6
		actor.send({ type: "STEP_FORWARD" }); // step 7
		actor.send({ type: "STEP_FORWARD" }); // step 8
		actor.send({ type: "STEP_FORWARD" }); // step 9 (last)
		expect(nav(actor).activeStepIndex).toBe(9);

		// Verify STEP_FORWARD is guarded at end
		actor.send({ type: "STEP_FORWARD" });
		expect(nav(actor).activeStepIndex).toBe(9);

		// 10. Step backward
		actor.send({ type: "STEP_BACKWARD" });
		expect(nav(actor).activeStepIndex).toBe(8);

		// 11. Switch perspective back — verify full coherence
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-landscape" });
		expect(nav(actor).activePerspectiveId).toBe("persp-landscape");
		expect(nav(actor).activeStepIndex).toBe(8);
		expect(nav(actor).activeJourneyId).toBe("j-full-descent");
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");

		// 12. Select off-path node — journey not disrupted
		actor.send({ type: "SELECT_NODE", nodeId: "n-graph" });
		expect(nav(actor).selectedNodeId).toBe("n-graph");
		expect(nav(actor).activeStepIndex).toBe(8);
		expect(nav(actor).activeJourneyId).toBe("j-full-descent");

		// 13. Deselect journey — domain/capability preserved
		actor.send({ type: "DESELECT_JOURNEY" });
		expect(nav(actor).activeJourneyId).toBeNull();
		expect(nav(actor).activeStepIndex).toBeNull();
		expect(nav(actor).activeSceneId).toBeNull();
		expect(nav(actor).activeFocusTargets).toEqual([]);
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");
		expect(nav(actor).activePerspectiveId).toBe("persp-landscape");

		// 14. Clear capability — domain preserved
		actor.send({ type: "CLEAR_CAPABILITY" });
		expect(nav(actor).activeCapabilityId).toBeNull();
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");

		// 15. Clear domain — clean state
		actor.send({ type: "CLEAR_DOMAIN" });
		expect(nav(actor).activeCapabilityId).toBeNull();
		expect(nav(actor).activeJourneyId).toBeNull();
		expect(nav(actor).activeStepIndex).toBeNull();
	});
});

describe("Journey inference — entry capability rule", () => {
	it("infers domain and capability from entryCapabilityId when not set", () => {
		const actor = createInitializedContext();

		// Select journey without prior domain/capability
		actor.send({ type: "SELECT_JOURNEY", journeyId: "j-full-descent" });

		// entryCapabilityId is cap-perspective-switching, which belongs to dom-navigation
		expect(nav(actor).activeCapabilityId).toBe("cap-perspective-switching");
		expect(nav(actor).activeDomainId).toBe("dom-navigation");
	});

	it("preserves existing domain/capability when already set", () => {
		const actor = createInitializedContext();

		actor.send({ type: "SELECT_DOMAIN", domainId: "dom-core-kernel" });
		actor.send({ type: "SELECT_CAPABILITY", capabilityId: "cap-context-machine" });
		actor.send({ type: "SELECT_JOURNEY", journeyId: "j-full-descent" });

		// Should NOT override existing domain/capability
		expect(nav(actor).activeDomainId).toBe("dom-core-kernel");
		expect(nav(actor).activeCapabilityId).toBe("cap-context-machine");
	});
});

describe("Capability boundary crossing during step traversal", () => {
	it("updates active capability when step crosses boundary", () => {
		const actor = createInitializedContext();

		actor.send({ type: "SELECT_JOURNEY", journeyId: "j-full-descent" });
		// Steps 0-5 are cap-perspective-switching, step 6 is cap-canvas-mode-switching
		expect(nav(actor).activeCapabilityId).toBe("cap-perspective-switching");

		actor.send({ type: "STEP_FORWARD" }); // step 1
		actor.send({ type: "STEP_FORWARD" }); // step 2
		actor.send({ type: "STEP_FORWARD" }); // step 3
		actor.send({ type: "STEP_FORWARD" }); // step 4
		actor.send({ type: "STEP_FORWARD" }); // step 5
		expect(nav(actor).activeCapabilityId).toBe("cap-perspective-switching");

		actor.send({ type: "STEP_FORWARD" }); // step 6 - canvas-mode-switching!
		expect(nav(actor).activeCapabilityId).toBe("cap-canvas-mode-switching");

		actor.send({ type: "STEP_FORWARD" }); // step 7 - perspective-switching
		expect(nav(actor).activeCapabilityId).toBe("cap-perspective-switching");

		// Step backward should restore
		actor.send({ type: "STEP_BACKWARD" }); // back to step 6
		expect(nav(actor).activeCapabilityId).toBe("cap-canvas-mode-switching");

		actor.send({ type: "STEP_BACKWARD" }); // back to step 5
		expect(nav(actor).activeCapabilityId).toBe("cap-perspective-switching");
	});
});

describe("Node selection snaps to step on active journey", () => {
	it("snaps to correct step when clicking a node on the journey path", () => {
		const actor = createInitializedContext();

		actor.send({ type: "SELECT_JOURNEY", journeyId: "j-full-descent" });
		expect(nav(actor).activeStepIndex).toBe(0);

		// Click on n-context-machine which is a focus target on step 2 (step-fd-3)
		actor.send({ type: "SELECT_NODE", nodeId: "n-context-machine" });
		expect(nav(actor).activeStepIndex).toBe(2);
	});
});
