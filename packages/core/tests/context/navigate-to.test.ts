import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import { contextMachine } from "../../src/context/context.machine.js";
import type { ContextMachineEvent, NavigationTarget } from "../../src/context/index.js";
import type { Message } from "../../src/entities/message.js";
import type { Sequence } from "../../src/entities/sequence.js";
import { createGraph } from "../../src/graph/graph.js";
import {
	makeCapability,
	makeJourney,
	makeNode,
	makePerspective,
	makeProcess,
	makeProcessStage,
	makeStep,
} from "../../src/test-fixtures/index.js";

/**
 * NAVIGATE_TO selects an entity and shows it in the perspective that displays
 * it. Perspective ids here never contain their type name, so resolution has to
 * go through the type.
 */

const graph = createGraph(
	["a", "b"].map((id) => makeNode({ id, label: id })),
	[],
);
const focus = (nodeId: string) => [{ type: "node" as const, targetId: nodeId }];
const perspectives = [
	makePerspective({ id: "p-land", type: "landscape" }),
	makePerspective({ id: "p-jrn", type: "journey" }),
	makePerspective({ id: "p-proc", type: "process" }),
	makePerspective({ id: "p-seq", type: "sequence" }),
	makePerspective({ id: "p-arch", type: "architecture" }),
	// A second perspective of a type that already has one.
	makePerspective({ id: "p-proc-2", type: "process" }),
];
const capabilities = [makeCapability({ id: "cap", domainId: "dom" })];
const journeys = [makeJourney({ id: "j1", entryCapabilityId: "cap" })];
const steps = [
	makeStep({ id: "s1", journeyId: "j1", capabilityId: "cap", focusTargets: focus("a") }),
];
const processes = [makeProcess({ id: "pr1" })];
const processStages = [makeProcessStage({ id: "st1", processId: "pr1", nodeIds: ["b"] })];
const messages: Message[] = [
	{
		id: "m1",
		sequenceNumber: 0,
		sourceInterfaceId: "i1",
		targetInterfaceId: "i2",
		type: "request",
		label: "m1",
		metadata: {},
	},
];
const sequences: Sequence[] = [
	{
		id: "q1",
		label: "q1",
		capabilityId: "cap",
		interfaceIds: [],
		messageIds: ["m1"],
		tags: [],
		metadata: {},
	},
];

function start(overrides: { perspectives?: typeof perspectives } = {}) {
	const actor = createActor(contextMachine).start();
	actor.send({
		type: "INITIALIZE",
		graph,
		journeys,
		steps,
		capabilities,
		processes,
		processStages,
		messages,
		sequences,
		perspectives,
		...overrides,
	});
	actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "p-arch" });
	return actor;
}
type Actor = ReturnType<typeof start>;
const nav = (actor: Actor) => actor.getSnapshot().context.nav;
const go = (actor: Actor, target: NavigationTarget) => actor.send({ type: "NAVIGATE_TO", target });

/** What the UI used to send: the select event, then a perspective switch. */
function selectThenSwitch(select: ContextMachineEvent, perspectiveId: string) {
	const actor = start();
	actor.send(select);
	actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId });
	return nav(actor);
}

describe("NAVIGATE_TO lands on the perspective that shows the target", () => {
	const cases: [NavigationTarget, ContextMachineEvent, string][] = [
		[{ kind: "domain", id: "dom" }, { type: "SELECT_DOMAIN", domainId: "dom" }, "p-land"],
		[
			{ kind: "capability", id: "cap" },
			{ type: "SELECT_CAPABILITY", capabilityId: "cap" },
			"p-land",
		],
		[{ kind: "journey", id: "j1" }, { type: "SELECT_JOURNEY", journeyId: "j1" }, "p-jrn"],
		[{ kind: "process", id: "pr1" }, { type: "SELECT_PROCESS", processId: "pr1" }, "p-proc"],
		[{ kind: "sequence", id: "q1" }, { type: "SELECT_SEQUENCE", sequenceId: "q1" }, "p-seq"],
	];

	it.each(cases)("%o", (target, select, perspectiveId) => {
		const actor = start();
		go(actor, target);
		expect(nav(actor).activePerspectiveId).toBe(perspectiveId);
		// One event gives exactly the state the two-event sequence gave.
		expect(nav(actor)).toEqual(selectThenSwitch(select, perspectiveId));
	});

	it.each(cases)("leaves no node or edge selected after %o", (target) => {
		const actor = start();
		actor.send({ type: "SELECT_NODE", nodeId: "a" });
		go(actor, target);
		expect(nav(actor).selectedNodeId).toBeNull();
		expect(nav(actor).selectedEdgeId).toBeNull();
	});

	it("selects the journey's first step on the way", () => {
		const actor = start();
		go(actor, { kind: "journey", id: "j1" });
		expect(nav(actor).activeJourneyId).toBe("j1");
		expect(nav(actor).activeStepIndex).toBe(0);
		expect(nav(actor).activeFocusTargets).toEqual(focus("a"));
	});
});

describe("NAVIGATE_TO when already on a perspective of the right type", () => {
	it("stays on that perspective instead of jumping to the first of its type", () => {
		const actor = start();
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "p-proc-2" });
		go(actor, { kind: "process", id: "pr1" });
		expect(nav(actor).activePerspectiveId).toBe("p-proc-2");
		expect(nav(actor).activeProcessId).toBe("pr1");
	});

	it("keeps the canvas mode and clears the selection", () => {
		const actor = start();
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "p-proc" });
		actor.send({ type: "SWITCH_CANVAS_MODE", canvasMode: "risk_controls" });
		actor.send({ type: "SELECT_NODE", nodeId: "a" });

		go(actor, { kind: "process", id: "pr1" });

		expect(nav(actor).activeCanvasMode).toBe("risk_controls");
		expect(nav(actor).selectedNodeId).toBeNull();
	});
});

describe("NAVIGATE_TO that cannot complete", () => {
	it("changes nothing for an unknown journey", () => {
		const actor = start();
		const before = nav(actor);
		go(actor, { kind: "journey", id: "nope" });
		expect(nav(actor)).toBe(before);
	});

	it("changes nothing for an unknown sequence", () => {
		const actor = start();
		const before = nav(actor);
		go(actor, { kind: "sequence", id: "nope" });
		expect(nav(actor)).toBe(before);
	});

	it("selects without switching when no perspective of that type exists", () => {
		const actor = start({ perspectives: perspectives.filter((p) => p.type !== "journey") });
		go(actor, { kind: "journey", id: "j1" });
		expect(nav(actor).activeJourneyId).toBe("j1");
		expect(nav(actor).activePerspectiveId).toBe("p-arch");
	});

	it("is ignored before the kernel is initialized", () => {
		const actor = createActor(contextMachine).start();
		actor.send({ type: "NAVIGATE_TO", target: { kind: "journey", id: "j1" } });
		expect(actor.getSnapshot().value).toBe("uninitialized");
	});
});
