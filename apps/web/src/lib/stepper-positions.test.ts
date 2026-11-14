import { contextMachine } from "@guiderail/core/context";
import type {
	Interface,
	Journey,
	Message,
	OrientationItem,
	Perspective,
	Sequence,
	Step,
} from "@guiderail/core/entities";
import { createGraph } from "@guiderail/core/graph";
import { describe, expect, it } from "vitest";
import { createActor } from "xstate";
import { computeJourneyLayout } from "./journey-layout.js";
import { computeOrientationLayout } from "./orientation-layout.js";
import { computeSequenceLayout } from "./sequence-layout.js";

/**
 * The canvases must number and highlight items by position in navigation order,
 * the same order the kernel steps through. Every dataset here is in shuffled
 * input order with gapped sequence numbers that do not start at 0.
 */

const iface = (id: string): Interface => ({ id, nodeId: "n", label: id, metadata: {} });
const message = (id: string, sequenceNumber: number): Message => ({
	id,
	sequenceNumber,
	sourceInterfaceId: "i1",
	targetInterfaceId: "i2",
	type: "request",
	label: id,
	metadata: {},
});
const interfaces = [iface("i1"), iface("i2")];
const messages = [message("m-27", 27), message("m-3", 3), message("m-9", 9)];
const sequence: Sequence = {
	id: "q1",
	label: "q1",
	capabilityId: "cap",
	interfaceIds: ["i1", "i2"],
	messageIds: ["m-27", "m-3", "m-9"],
	tags: [],
	metadata: {},
};

const positionsById = (
	nodes: Array<{ id: string; data: Record<string, unknown> }>,
	prefix: string,
) =>
	Object.fromEntries(
		nodes
			.filter((n) => n.id.startsWith(prefix))
			.map((n) => [n.id.slice(prefix.length), n.data.position]),
	);

describe("sequence canvas", () => {
	const layout = computeSequenceLayout(interfaces, messages);
	const messageNodes = layout.nodes.filter((n) => n.type === "sequence_message");

	it("gives each message its position in number order", () => {
		expect(positionsById(messageNodes, "msg-node-")).toEqual({ "m-3": 0, "m-9": 1, "m-27": 2 });
	});

	it("lays messages out one row per position, not per sequence number", () => {
		const rows = [...messageNodes].sort((a, b) => a.position.y - b.position.y).map((n) => n.id);
		expect(rows).toEqual(["msg-node-m-3", "msg-node-m-9", "msg-node-m-27"]);
		const gaps = messageNodes.map((n) => n.position.y).sort((a, b) => a - b);
		expect((gaps[1] ?? 0) - (gaps[0] ?? 0)).toBe((gaps[2] ?? 0) - (gaps[1] ?? 0));
	});

	it("highlights the same message the kernel is on, at every step", () => {
		const perspectives: Perspective[] = [
			{ id: "p-seq", type: "sequence", label: "Sequence", highlightRules: {}, visibilityRules: {} },
		];
		const actor = createActor(contextMachine).start();
		actor.send({
			type: "INITIALIZE",
			graph: createGraph([], []),
			journeys: [],
			steps: [],
			capabilities: [],
			interfaces,
			messages,
			sequences: [sequence],
			perspectives,
		});
		actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "p-seq" });
		actor.send({ type: "SELECT_SEQUENCE", sequenceId: "q1" });

		const highlighted: string[] = [];
		for (let step = 0; step < messages.length; step++) {
			const index = actor.getSnapshot().context.nav.activeMessageIndex;
			const active = messageNodes.filter((n) => n.data.position === index);
			expect(active).toHaveLength(1);
			highlighted.push(active[0]?.id ?? "");
			actor.send({ type: "STEPPER_FORWARD" });
		}
		expect(highlighted).toEqual(["msg-node-m-3", "msg-node-m-9", "msg-node-m-27"]);
	});
});

describe("journey canvas", () => {
	const journey: Journey = {
		id: "j1",
		label: "j1",
		entryCapabilityId: "cap",
		capabilityIds: [],
		stepIds: [],
		tags: [],
		entryConditions: [],
		exitConditions: [],
		metadata: {},
	};
	const step = (id: string, sequenceNumber: number, next?: string): Step => ({
		id,
		journeyId: "j1",
		sequenceNumber,
		stepType: "screen",
		focusTargets: [],
		capabilityId: "cap",
		title: id,
		transitions: next ? [{ targetStepId: next }] : [],
		evidenceRefIds: [],
		metadata: {},
	});

	it("gives each step its position in number order", () => {
		const steps = [step("s-30", 30), step("s-10", 10, "s-20"), step("s-20", 20, "s-30")];
		const layout = computeJourneyLayout(journey, steps, null);
		expect(positionsById(layout.nodes, "journey-step-")).toEqual({
			"s-10": 0,
			"s-20": 1,
			"s-30": 2,
		});
	});

	it("ignores steps of other journeys when numbering", () => {
		const other: Step = { ...step("other", 1), journeyId: "j2" };
		const layout = computeJourneyLayout(journey, [other, step("s-10", 10)], null);
		expect(positionsById(layout.nodes, "journey-step-")).toEqual({ "s-10": 0 });
	});
});

describe("orientation deck", () => {
	it("gives each item its position in number order", () => {
		const item = (id: string, sequenceNumber: number): OrientationItem => ({
			id,
			sequenceNumber,
			title: id,
			body: id,
			terms: [],
			links: [],
			tags: [],
			metadata: {},
		});
		const layout = computeOrientationLayout([item("o-200", 200), item("o-100", 100)]);
		expect(positionsById(layout.nodes, "orient-item-")).toEqual({ "o-100": 0, "o-200": 1 });
	});
});
