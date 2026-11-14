import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import { contextMachine } from "../../src/context/context.machine.js";
import {
	type NavigationContext,
	createInitialNavigationContext,
} from "../../src/context/navigation-context.js";
import { reconcilePerspectiveSwitch } from "../../src/context/reconciler.js";
import { demoContent } from "../../src/demo/index.js";
import { createGraph } from "../../src/graph/graph.js";

/**
 * The navigation contract, confirmed by the maintainer on 2026-11-14 and
 * recorded in AGENTS.md under "Navigation contract": what a perspective switch
 * keeps and what it resets.
 *
 * The table below classifies EVERY field of NavigationContext. Its type makes
 * that exhaustive: adding a field to the navigation context without deciding
 * what a perspective switch does to it is a compile error here.
 */
type Rule =
	| "persists" // unchanged by a perspective switch
	| "cleared" // set to null: the selection belongs to the canvas being left
	| "reset" // set to null so the new perspective uses its default
	| "switched" // becomes the new perspective id
	| "outside-contract"; // recomputed by the kernel, read by nothing in the UI

const CONTRACT: Record<keyof NavigationContext, Rule> = {
	activePerspectiveId: "switched",

	activeDomainId: "persists",
	activeCapabilityId: "persists",
	activeJourneyId: "persists",
	activeStepIndex: "persists",
	activeProcessId: "persists",
	activeStageIndex: "persists",
	activeSequenceId: "persists",
	activeMessageIndex: "persists",
	activeValueStreamId: "persists",
	activeOrientationIndex: "persists",
	activeStoryRouteId: "persists",
	activeWaypointIndex: "persists",
	routeState: "persists",
	activeFocusTargets: "persists",
	activeSceneId: "persists",
	mode: "persists",

	selectedNodeId: "cleared",
	selectedEdgeId: "cleared",

	activeCanvasMode: "reset",

	viewportAnchor: "outside-contract",
};

const fields = Object.keys(CONTRACT) as Array<keyof NavigationContext>;
const fieldsWith = (rule: Rule) => fields.filter((f) => CONTRACT[f] === rule);

/** A navigation context in which every field holds a non-default value. */
const FULL: NavigationContext = {
	activePerspectiveId: "p-from",
	activeDomainId: "dom",
	activeCapabilityId: "cap",
	activeJourneyId: "journey",
	activeStepIndex: 3,
	activeProcessId: "process",
	activeStageIndex: 2,
	activeSequenceId: "sequence",
	activeMessageIndex: 4,
	activeValueStreamId: "value-stream",
	activeOrientationIndex: 5,
	activeStoryRouteId: "route",
	activeWaypointIndex: 1,
	routeState: "paused",
	activeFocusTargets: [{ type: "node", targetId: "a" }],
	activeSceneId: "scene",
	mode: "guiderail",
	selectedNodeId: "a",
	selectedEdgeId: "e",
	activeCanvasMode: "risk_controls",
	viewportAnchor: { x: 10, y: 20, zoom: 1.5 },
};

const graph = createGraph([], []);

describe("navigation contract — a perspective switch, field by field", () => {
	it("the fixture really does set every field away from its default", () => {
		const defaults = createInitialNavigationContext("p-from");
		const unchanged = fields.filter(
			(f) => f !== "activePerspectiveId" && JSON.stringify(FULL[f]) === JSON.stringify(defaults[f]),
		);
		expect(unchanged).toEqual([]);
	});

	const after = reconcilePerspectiveSwitch(FULL, "p-to", graph);

	it.each(fieldsWith("persists"))("%s persists", (field) => {
		expect(after[field]).toEqual(FULL[field]);
	});

	it.each(fieldsWith("cleared"))("%s is cleared", (field) => {
		expect(after[field]).toBeNull();
	});

	it.each(fieldsWith("reset"))("%s is reset to the perspective default", (field) => {
		expect(after[field]).toBeNull();
	});

	it("activePerspectiveId becomes the new perspective", () => {
		expect(after.activePerspectiveId).toBe("p-to");
	});

	it("classifies every field of the navigation context", () => {
		expect([...fields].sort()).toEqual(Object.keys(FULL).sort());
		expect(fieldsWith("switched")).toEqual(["activePerspectiveId"]);
		expect(fieldsWith("outside-contract")).toEqual(["viewportAnchor"]);
	});

	it("does not mutate the context it was given", () => {
		const before = structuredClone(FULL);
		reconcilePerspectiveSwitch(FULL, "p-to", graph);
		expect(FULL).toEqual(before);
	});
});

describe("navigation contract — through the kernel, with the demo corpus", () => {
	function start() {
		const actor = createActor(contextMachine).start();
		actor.send({
			type: "INITIALIZE",
			graph: createGraph(demoContent.nodes, demoContent.edges),
			...demoContent,
		});
		return actor;
	}
	const nav = (actor: ReturnType<typeof start>) => actor.getSnapshot().context.nav;
	const perspectiveOf = (type: string) => {
		const perspective = demoContent.perspectives.find((p) => p.type === type);
		if (!perspective) throw new Error(`the demo has no ${type} perspective`);
		return perspective.id;
	};

	it("a context built by real navigation survives a tour of every perspective", () => {
		const actor = start();
		const [journey] = demoContent.journeys;
		const [process] = demoContent.processes;
		const [sequence] = demoContent.sequences;
		if (!journey || !process || !sequence) throw new Error("the demo lacks content for this test");

		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: perspectiveOf("orientation") });
		actor.send({ type: "JUMP_TO_ORIENTATION", index: 2 });
		actor.send({ type: "NAVIGATE_TO", target: { kind: "journey", id: journey.id } });
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "NAVIGATE_TO", target: { kind: "process", id: process.id } });
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "STEPPER_FORWARD" });
		actor.send({ type: "NAVIGATE_TO", target: { kind: "sequence", id: sequence.id } });
		actor.send({ type: "STEPPER_FORWARD" });

		const built = nav(actor);
		// Every index moved, so a reset anywhere would show.
		expect(built.activeOrientationIndex).toBe(2);
		expect(built.activeStageIndex).toBe(2);
		expect(built.activeMessageIndex).toBe(1);

		for (const perspective of demoContent.perspectives) {
			actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: perspective.id });
			for (const field of fieldsWith("persists")) {
				expect(nav(actor)[field], `${field} after switching to ${perspective.type}`).toEqual(
					built[field],
				);
			}
			expect(nav(actor).activePerspectiveId).toBe(perspective.id);
		}
	});

	it("a switch clears the selection and resets the canvas mode, and nothing else", () => {
		const actor = start();
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: perspectiveOf("process") });
		actor.send({ type: "SWITCH_CANVAS_MODE", canvasMode: "risk_controls" });
		const [node] = demoContent.nodes;
		if (!node) throw new Error("the demo has no nodes");
		actor.send({ type: "SELECT_NODE", nodeId: node.id });
		const before = nav(actor);
		expect(before.selectedNodeId).toBe(node.id);

		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: perspectiveOf("architecture") });

		const changed = fields.filter(
			(f) => JSON.stringify(nav(actor)[f]) !== JSON.stringify(before[f]),
		);
		expect(changed.filter((f) => CONTRACT[f] !== "outside-contract").sort()).toEqual([
			"activeCanvasMode",
			"activePerspectiveId",
			"selectedNodeId",
		]);
	});

	it("switching back to a perspective does not restore its old canvas mode", () => {
		// Recorded behaviour: canvas mode is per switch, not remembered per perspective.
		const actor = start();
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: perspectiveOf("process") });
		actor.send({ type: "SWITCH_CANVAS_MODE", canvasMode: "risk_controls" });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: perspectiveOf("architecture") });
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: perspectiveOf("process") });
		expect(nav(actor).activeCanvasMode).toBeNull();
	});
});
