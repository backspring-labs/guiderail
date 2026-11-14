import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import { contextMachine } from "../../src/context/context.machine.js";
import type { Message } from "../../src/entities/message.js";
import type { OrientationItem } from "../../src/entities/orientation-item.js";
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
	makeStoryRoute,
	makeStoryWaypoint,
} from "../../src/test-fixtures/index.js";

/**
 * The stepper index contract (docs/architecture/data-integrity.md, section 5):
 * an index is a position in a group ordered by sequenceNumber, sequence numbers
 * need not start at 0 or be contiguous, and the stepper is chosen by the active
 * perspective's type.
 *
 * Every group below is given in shuffled input order with gapped numbers, and
 * every perspective id avoids its own type name, so a regression to
 * "sequenceNumber === index" or to id substring matching fails here.
 */

const graph = createGraph(
	["a", "b", "c", "d"].map((id) => makeNode({ id, label: id })),
	[],
);
const focus = (nodeId: string) => [{ type: "node" as const, targetId: nodeId }];

const perspectives = [
	makePerspective({ id: "p-1", type: "journey" }),
	makePerspective({ id: "p-2", type: "process" }),
	makePerspective({ id: "p-3", type: "sequence" }),
	makePerspective({ id: "p-4", type: "orientation" }),
	makePerspective({ id: "p-5", type: "architecture" }),
	// The id says journey; the type says process. Type must win.
	makePerspective({ id: "persp-journey-lookalike", type: "process" }),
];

const capabilities = [makeCapability({ id: "cap" })];
const journeys = [makeJourney({ id: "j1", entryCapabilityId: "cap" }), makeJourney({ id: "j2" })];
const steps = [
	makeStep({
		id: "s-30",
		journeyId: "j1",
		capabilityId: "cap",
		sequenceNumber: 30,
		focusTargets: focus("c"),
	}),
	makeStep({
		id: "s-10",
		journeyId: "j1",
		capabilityId: "cap",
		sequenceNumber: 10,
		focusTargets: focus("a"),
	}),
	makeStep({
		id: "s-20",
		journeyId: "j1",
		capabilityId: "cap",
		sequenceNumber: 20,
		focusTargets: focus("b"),
	}),
	// Another journey's step, numbered between j1's steps.
	makeStep({
		id: "other",
		journeyId: "j2",
		capabilityId: "cap",
		sequenceNumber: 15,
		focusTargets: focus("d"),
	}),
];

const processes = [makeProcess({ id: "pr1" })];
const processStages = [
	makeProcessStage({ id: "st-50", processId: "pr1", sequenceNumber: 50, nodeIds: ["c"] }),
	makeProcessStage({ id: "st-5", processId: "pr1", sequenceNumber: 5, nodeIds: ["a"] }),
	// Names a node that does not exist before one that does.
	makeProcessStage({ id: "st-6", processId: "pr1", sequenceNumber: 6, nodeIds: ["ghost", "b"] }),
];

const message = (id: string, sequenceNumber: number): Message => ({
	id,
	sequenceNumber,
	sourceInterfaceId: "i1",
	targetInterfaceId: "i2",
	type: "request",
	label: id,
	metadata: {},
});
const messages = [message("m-27", 27), message("m-3", 3), message("m-9", 9)];
const sequences: Sequence[] = [
	{
		id: "q1",
		label: "q1",
		capabilityId: "cap",
		interfaceIds: [],
		// "m-missing" does not exist: it is a dangling reference, not a position.
		messageIds: ["m-3", "m-missing", "m-9", "m-27"],
		tags: [],
		metadata: {},
	},
];

const storyRoutes = [makeStoryRoute({ id: "r1" })];
const storyWaypoints = [
	makeStoryWaypoint({ id: "w-8", storyRouteId: "r1", sequenceNumber: 8, focusTargets: focus("c") }),
	makeStoryWaypoint({ id: "w-2", storyRouteId: "r1", sequenceNumber: 2, focusTargets: focus("a") }),
	makeStoryWaypoint({ id: "w-4", storyRouteId: "r1", sequenceNumber: 4, focusTargets: focus("b") }),
];

const orientation = (id: string, sequenceNumber: number): OrientationItem => ({
	id,
	sequenceNumber,
	title: id,
	body: id,
	terms: [],
	links: [],
	tags: [],
	metadata: {},
});
const orientationItems = [orientation("o-200", 200), orientation("o-100", 100)];

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
		storyRoutes,
		storyWaypoints,
		orientationItems,
		perspectives,
		...overrides,
	});
	return actor;
}

type Actor = ReturnType<typeof start>;
const nav = (actor: Actor) => actor.getSnapshot().context.nav;

/** Sends STEPPER_FORWARD until the index stops changing; returns each state visited. */
function walk<T>(actor: Actor, read: (actor: Actor) => T): T[] {
	const visited = [read(actor)];
	for (let i = 0; i < 10; i++) {
		actor.send({ type: "STEPPER_FORWARD" });
		const next = read(actor);
		if (JSON.stringify(next) === JSON.stringify(visited[visited.length - 1])) break;
		visited.push(next);
	}
	return visited;
}

describe("positions, not sequence numbers", () => {
	it("journey: steps in number order, indices 0..2, focus follows the ordered step", () => {
		const actor = start();
		actor.send({ type: "SELECT_JOURNEY", journeyId: "j1" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "p-1" });

		const visited = walk(actor, (a) => ({
			index: nav(a).activeStepIndex,
			node: nav(a).activeFocusTargets[0]?.targetId,
		}));
		expect(visited).toEqual([
			{ index: 0, node: "a" },
			{ index: 1, node: "b" },
			{ index: 2, node: "c" },
		]);
	});

	it("journey: the first step is the lowest number, not the first in the input", () => {
		const actor = start();
		actor.send({ type: "SELECT_JOURNEY", journeyId: "j1" });
		expect(nav(actor).activeStepIndex).toBe(0);
		expect(nav(actor).selectedNodeId).toBe("a");
	});

	it("journey: JUMP_TO_STEP, STEP_FORWARD and STEP_BACKWARD use positions", () => {
		const actor = start();
		actor.send({ type: "SELECT_JOURNEY", journeyId: "j1" });
		actor.send({ type: "JUMP_TO_STEP", index: 2 });
		expect(nav(actor).selectedNodeId).toBe("c");
		actor.send({ type: "STEP_BACKWARD" });
		expect(nav(actor).selectedNodeId).toBe("b");
		actor.send({ type: "STEP_FORWARD" });
		expect(nav(actor).selectedNodeId).toBe("c");
		// 30 is a sequence number, not a position: out of range, ignored.
		actor.send({ type: "JUMP_TO_STEP", index: 30 });
		expect(nav(actor).activeStepIndex).toBe(2);
	});

	it("journey: selecting a node on the path snaps to that step's position", () => {
		const actor = start();
		actor.send({ type: "SELECT_JOURNEY", journeyId: "j1" });
		actor.send({ type: "SELECT_NODE", nodeId: "c" });
		expect(nav(actor).activeStepIndex).toBe(2);
	});

	it("process: stages in number order, indices 0..2", () => {
		const actor = start();
		actor.send({ type: "SELECT_PROCESS", processId: "pr1" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "p-2" });

		const visited = walk(actor, (a) => ({
			index: nav(a).activeStageIndex,
			nodes: nav(a).activeFocusTargets.map((t) => t.targetId),
		}));
		expect(visited).toEqual([
			{ index: 0, nodes: ["a"] },
			{ index: 1, nodes: ["ghost", "b"] },
			{ index: 2, nodes: ["c"] },
		]);
	});

	it("sequence: only messages that exist count, in number order", () => {
		const actor = start();
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "p-3" });
		actor.send({ type: "SELECT_SEQUENCE", sequenceId: "q1" });

		expect(walk(actor, (a) => nav(a).activeMessageIndex)).toEqual([0, 1, 2]);
		actor.send({ type: "STEPPER_RESET" });
		expect(nav(actor).activeMessageIndex).toBe(0);
		actor.send({ type: "STEPPER_END" });
		expect(nav(actor).activeMessageIndex).toBe(2);
	});

	it("orientation: indices cover the items", () => {
		const actor = start();
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "p-4" });
		actor.send({ type: "JUMP_TO_ORIENTATION", index: 0 });
		expect(walk(actor, (a) => nav(a).activeOrientationIndex)).toEqual([0, 1]);
	});

	it("story route: waypoints in number order", () => {
		const actor = start();
		actor.send({ type: "START_ROUTE", storyRouteId: "r1" });
		const visited = [nav(actor).activeFocusTargets[0]?.targetId];
		actor.send({ type: "NEXT_WAYPOINT" });
		visited.push(nav(actor).activeFocusTargets[0]?.targetId);
		actor.send({ type: "NEXT_WAYPOINT" });
		visited.push(nav(actor).activeFocusTargets[0]?.targetId);
		actor.send({ type: "NEXT_WAYPOINT" });
		expect(visited).toEqual(["a", "b", "c"]);
		expect(nav(actor).activeWaypointIndex).toBe(2);

		actor.send({ type: "JUMP_TO_WAYPOINT", index: 0 });
		expect(nav(actor).activeFocusTargets[0]?.targetId).toBe("a");
	});
});

describe("the stepper follows perspective type, not the text of the id", () => {
	it("a perspective whose id names a different type gets the stepper of its type", () => {
		const actor = start();
		actor.send({ type: "SELECT_JOURNEY", journeyId: "j1" });
		actor.send({ type: "SELECT_PROCESS", processId: "pr1" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-journey-lookalike" });

		actor.send({ type: "STEPPER_FORWARD" });
		// It is a process perspective: the stage moved and the step did not.
		expect(nav(actor).activeStageIndex).toBe(1);
		expect(nav(actor).activeStepIndex).toBe(0);
	});

	it("a perspective type without a stepper has none", () => {
		const actor = start();
		actor.send({ type: "SELECT_JOURNEY", journeyId: "j1" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "p-5" });
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_END" });
		expect(nav(actor).activeStepIndex).toBe(0);
	});

	it("an id that only looks like a type, with no such perspective, has no stepper", () => {
		const actor = start();
		actor.send({ type: "SELECT_JOURNEY", journeyId: "j1" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-journey" });
		actor.send({ type: "STEPPER_FORWARD" });
		expect(nav(actor).activeStepIndex).toBe(0);
	});

	it("without perspectives the kernel has no stepper", () => {
		const actor = start({ perspectives: [] });
		actor.send({ type: "SELECT_JOURNEY", journeyId: "j1" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "p-1" });
		actor.send({ type: "STEPPER_FORWARD" });
		expect(nav(actor).activeStepIndex).toBe(0);
	});
});

describe("missing entities do not produce an invalid index or selection", () => {
	it("a sequence naming a message that does not exist steps over the ones that do", () => {
		const actor = start();
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "p-3" });
		actor.send({ type: "SELECT_SEQUENCE", sequenceId: "q1" });
		actor.send({ type: "STEPPER_END" });
		// Three messages exist; the fourth id is dangling. The last position is 2, not 3.
		expect(nav(actor).activeMessageIndex).toBe(2);
		actor.send({ type: "STEPPER_FORWARD" });
		expect(nav(actor).activeMessageIndex).toBe(2);
	});

	it("a stage naming a missing node selects the first node that exists", () => {
		const actor = start();
		actor.send({ type: "SELECT_PROCESS", processId: "pr1" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "p-2" });
		actor.send({ type: "STEPPER_FORWARD" });
		expect(nav(actor).activeStageIndex).toBe(1);
		expect(nav(actor).selectedNodeId).toBe("b");
	});

	it("a step whose only focus target is a missing node selects nothing", () => {
		const actor = createActor(contextMachine).start();
		actor.send({
			type: "INITIALIZE",
			graph,
			journeys,
			capabilities,
			perspectives,
			steps: [
				makeStep({
					id: "x1",
					journeyId: "j1",
					capabilityId: "cap",
					sequenceNumber: 1,
					focusTargets: focus("a"),
				}),
				makeStep({
					id: "x2",
					journeyId: "j1",
					capabilityId: "cap",
					sequenceNumber: 2,
					focusTargets: focus("ghost"),
				}),
			],
		});
		actor.send({ type: "SELECT_JOURNEY", journeyId: "j1" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "p-1" });
		actor.send({ type: "STEPPER_FORWARD" });
		expect(nav(actor).activeStepIndex).toBe(1);
		expect(nav(actor).selectedNodeId).toBeNull();
	});
});
