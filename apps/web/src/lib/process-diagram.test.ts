import type { Edge, Node, Process, ProcessStage } from "@guiderail/core/entities";
import { describe, expect, it } from "vitest";
import { parentProcessOf, resolveProcessDiagram } from "./process-diagram.js";

const process = (id: string): Process => ({
	id,
	label: `Process ${id}`,
	capabilityIds: [],
	stageIds: [],
	tags: [],
	metadata: {},
});
const stage = (
	id: string,
	processId: string,
	sequenceNumber: number,
	extra: Partial<ProcessStage> = {},
): ProcessStage => ({
	id,
	processId,
	sequenceNumber,
	label: `Stage ${id}`,
	nodeIds: [],
	edgeIds: [],
	controlPoints: [],
	metadata: {},
	...extra,
});
const bpmnNode = (id: string, processId: string | undefined): Node => ({
	id,
	type: "bpmn_task",
	label: id,
	tags: [],
	metadata: processId ? { processId, swimLane: "lane" } : { swimLane: "lane" },
	layoutByPerspective: {},
});
const flow = (id: string, sourceNodeId: string, targetNodeId: string): Edge => ({
	id,
	sourceNodeId,
	targetNodeId,
	type: "sequence_flow",
	directed: true,
	metadata: {},
});

// p1 has authored BPMN. p2 has only stages. p3 has neither.
const data = {
	processes: [process("p2"), process("p1"), process("p3")],
	processStages: [
		stage("s2-b", "p2", 20, { nodeIds: ["terrain-b"] }),
		stage("s2-a", "p2", 10, { nodeIds: ["terrain-a"], description: "first" }),
		stage("s2-c", "p2", 35),
		stage("s1-a", "p1", 0, { subProcessId: "p2" }),
	],
	bpmnNodes: [
		bpmnNode("b1", "p1"),
		bpmnNode("b2", "p1"),
		bpmnNode("stray", "p9"),
		bpmnNode("untagged", undefined),
	],
	bpmnEdges: [
		flow("e1", "b1", "b2"),
		flow("cross", "b2", "stray"),
		flow("e9", "stray", "untagged"),
	],
};
const ids = (items: Array<{ id: string }>) => items.map((i) => i.id);

describe("resolveProcessDiagram — authored", () => {
	const diagram = resolveProcessDiagram("p1", data);

	it("shows only the BPMN nodes that belong to the active process", () => {
		expect(diagram.source).toBe("authored");
		expect(diagram.processId).toBe("p1");
		expect(ids(diagram.nodes)).toEqual(["b1", "b2"]);
	});

	it("keeps only edges whose two ends are both in the diagram", () => {
		expect(ids(diagram.edges)).toEqual(["e1"]);
	});
});

describe("resolveProcessDiagram — derived from stages", () => {
	const diagram = resolveProcessDiagram("p2", data);

	it("shows one task per stage in navigation order, whatever the input order and numbering", () => {
		expect(diagram.source).toBe("derived");
		expect(diagram.nodes.map((n) => n.label)).toEqual(["Stage s2-a", "Stage s2-b", "Stage s2-c"]);
		expect(diagram.nodes.every((n) => n.type === "bpmn_task")).toBe(true);
	});

	it("links each task to its stage, so the stepper can highlight it", () => {
		expect(diagram.nodes.map((n) => n.metadata.stageId)).toEqual(["s2-a", "s2-b", "s2-c"]);
		expect(diagram.nodes[0]?.metadata.terrainNodeId).toBe("terrain-a");
		expect(diagram.nodes[0]?.description).toBe("first");
	});

	it("puts every task in one lane named after the process", () => {
		expect(new Set(diagram.nodes.map((n) => n.metadata.swimLane))).toEqual(new Set(["Process p2"]));
	});

	it("joins consecutive tasks with sequence flows", () => {
		expect(diagram.edges.map((e) => `${e.sourceNodeId}>${e.targetNodeId}`)).toEqual([
			"derived-stage-s2-a>derived-stage-s2-b",
			"derived-stage-s2-b>derived-stage-s2-c",
		]);
		expect(diagram.edges.every((e) => e.type === "sequence_flow")).toBe(true);
	});

	it("does not include another process's authored nodes", () => {
		expect(ids(diagram.nodes).some((id) => id === "b1" || id === "b2")).toBe(false);
	});
});

describe("resolveProcessDiagram — nothing to show", () => {
	it("is empty for a process with no diagram and no stages", () => {
		expect(resolveProcessDiagram("p3", data)).toEqual({
			processId: "p3",
			source: "empty",
			nodes: [],
			edges: [],
		});
	});

	it("is empty for an unknown process id", () => {
		expect(resolveProcessDiagram("nope", data).source).toBe("empty");
		expect(resolveProcessDiagram("nope", data).processId).toBeNull();
	});

	it("is empty when there are no processes at all", () => {
		const none = { processes: [], processStages: [], bpmnNodes: [], bpmnEdges: [] };
		expect(resolveProcessDiagram(null, none).source).toBe("empty");
	});
});

describe("resolveProcessDiagram — no process selected", () => {
	it("defaults to the first process that has an authored diagram", () => {
		const diagram = resolveProcessDiagram(null, data);
		expect(diagram.processId).toBe("p1");
		expect(diagram.source).toBe("authored");
	});

	it("falls back to the first process when none has an authored diagram", () => {
		const diagram = resolveProcessDiagram(null, { ...data, bpmnNodes: [], bpmnEdges: [] });
		expect(diagram.processId).toBe("p2");
		expect(diagram.source).toBe("derived");
	});
});

describe("parentProcessOf", () => {
	it("finds the process whose stage names this one as a sub-process", () => {
		expect(parentProcessOf("p2", data)?.id).toBe("p1");
	});

	it("is null for a top-level process", () => {
		expect(parentProcessOf("p1", data)).toBeNull();
		expect(parentProcessOf("p3", data)).toBeNull();
	});
});
