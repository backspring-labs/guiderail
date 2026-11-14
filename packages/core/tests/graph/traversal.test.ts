import { describe, expect, it } from "vitest";
import { bfsTraverse, createGraph, getPathNodes } from "../../src/graph/index.js";
import { makeEdge, makeJourney, makeNode, makeStep } from "../../src/test-fixtures/index.js";

function nodes(...ids: string[]) {
	return ids.map((id) => makeNode({ id, label: id }));
}

/** "a>b" becomes an edge from a to b. Edge ids are unique per call position. */
function edges(...specs: string[]) {
	return specs.map((spec, i) => {
		const [sourceNodeId, targetNodeId] = spec.split(">");
		if (!sourceNodeId || !targetNodeId) throw new Error(`bad edge spec: ${spec}`);
		return makeEdge({ id: `e${i}-${spec}`, sourceNodeId, targetNodeId });
	});
}

function ids(result: Array<{ id: string }>) {
	return result.map((n) => n.id);
}

describe("bfsTraverse — uniqueness", () => {
	it("returns each node once across parallel edges", () => {
		const graph = createGraph(nodes("a", "b"), edges("a>b", "a>b"));
		expect(ids(bfsTraverse(graph, "a"))).toEqual(["a", "b"]);
	});

	it("returns each node once in a cycle", () => {
		const graph = createGraph(nodes("a", "b", "c"), edges("a>b", "b>c", "c>a"));
		expect(ids(bfsTraverse(graph, "a", { direction: "out" }))).toEqual(["a", "b", "c"]);
	});

	it("ignores a self-loop", () => {
		const graph = createGraph(nodes("a", "b"), edges("a>a", "a>b"));
		expect(ids(bfsTraverse(graph, "a"))).toEqual(["a", "b"]);
	});

	it("returns a node shared by two paths once, at its first depth", () => {
		// Diamond: a reaches d through both b and c.
		const graph = createGraph(nodes("a", "b", "c", "d"), edges("a>b", "a>c", "b>d", "c>d"));
		expect(ids(bfsTraverse(graph, "a", { direction: "out" }))).toEqual(["a", "b", "c", "d"]);
	});
});

describe("bfsTraverse — order and reach", () => {
	it("visits breadth-first, in edge insertion order within a level", () => {
		const graph = createGraph(nodes("a", "b", "c", "d", "e"), edges("a>c", "a>b", "b>d", "c>e"));
		expect(ids(bfsTraverse(graph, "a", { direction: "out" }))).toEqual(["a", "c", "b", "e", "d"]);
	});

	it("excludes nodes with no path from the start", () => {
		const graph = createGraph(nodes("a", "b", "x", "y"), edges("a>b", "x>y"));
		expect(ids(bfsTraverse(graph, "a"))).toEqual(["a", "b"]);
	});

	it("returns only the start node when it has no edges", () => {
		const graph = createGraph(nodes("a", "b"), []);
		expect(ids(bfsTraverse(graph, "a"))).toEqual(["a"]);
	});

	it("follows direction as stored", () => {
		const graph = createGraph(nodes("a", "b", "c"), edges("a>b", "c>a"));
		expect(ids(bfsTraverse(graph, "a", { direction: "out" }))).toEqual(["a", "b"]);
		expect(ids(bfsTraverse(graph, "a", { direction: "in" }))).toEqual(["a", "c"]);
		expect(ids(bfsTraverse(graph, "a", { direction: "both" }))).toEqual(["a", "b", "c"]);
	});
});

describe("bfsTraverse — depth bounds", () => {
	const chain = createGraph(nodes("a", "b", "c", "d"), edges("a>b", "b>c", "c>d"));

	it.each([
		[0, ["a"]],
		[1, ["a", "b"]],
		[2, ["a", "b", "c"]],
		[3, ["a", "b", "c", "d"]],
		[99, ["a", "b", "c", "d"]],
	])("maxDepth %i returns %j", (maxDepth, expected) => {
		expect(ids(bfsTraverse(chain, "a", { direction: "out", maxDepth }))).toEqual(expected);
	});

	it("is unbounded when maxDepth is omitted", () => {
		expect(ids(bfsTraverse(chain, "a", { direction: "out" }))).toEqual(["a", "b", "c", "d"]);
	});

	it("measures depth by the shortest path", () => {
		// d is 1 hop away directly and 3 hops away through b and c.
		const graph = createGraph(nodes("a", "b", "c", "d"), edges("a>b", "b>c", "c>d", "a>d"));
		expect(ids(bfsTraverse(graph, "a", { direction: "out", maxDepth: 1 }))).toEqual([
			"a",
			"b",
			"d",
		]);
	});
});

describe("bfsTraverse — dangling and duplicate identifiers", () => {
	it("returns nothing for an unknown start id", () => {
		const graph = createGraph(nodes("a", "b"), edges("a>b", "ghost>b"));
		expect(bfsTraverse(graph, "ghost")).toEqual([]);
	});

	it("neither returns nor traverses through a missing endpoint", () => {
		// "ghost" is not a node, so c is unreachable from a.
		const graph = createGraph(nodes("a", "b", "c"), edges("a>b", "a>ghost", "ghost>c"));
		expect(ids(bfsTraverse(graph, "a"))).toEqual(["a", "b"]);
	});

	it("keeps the last node when ids collide", () => {
		const graph = createGraph(
			[makeNode({ id: "a", label: "first" }), makeNode({ id: "a", label: "second" })],
			[],
		);
		expect(graph.nodes.size).toBe(1);
		expect(bfsTraverse(graph, "a").map((n) => n.label)).toEqual(["second"]);
	});
});

describe("getPathNodes — journey scoping", () => {
	const graph = createGraph(nodes("a", "b", "c", "d"), []);
	const j1 = makeJourney({ id: "j1" });
	const j2 = makeJourney({ id: "j2" });
	const focus = (...targetIds: string[]) =>
		targetIds.map((targetId) => ({ type: "node" as const, targetId }));

	it("excludes steps that belong to another journey", () => {
		const steps = [
			makeStep({ journeyId: "j1", sequenceNumber: 0, focusTargets: focus("a") }),
			makeStep({ journeyId: "j2", sequenceNumber: 0, focusTargets: focus("b") }),
			makeStep({ journeyId: "j1", sequenceNumber: 1, focusTargets: focus("c") }),
		];
		expect(ids(getPathNodes(graph, j1, steps))).toEqual(["a", "c"]);
		expect(ids(getPathNodes(graph, j2, steps))).toEqual(["b"]);
	});

	it("orders by sequenceNumber, not by input order", () => {
		const steps = [
			makeStep({ journeyId: "j1", sequenceNumber: 2, focusTargets: focus("c") }),
			makeStep({ journeyId: "j1", sequenceNumber: 0, focusTargets: focus("a") }),
			makeStep({ journeyId: "j1", sequenceNumber: 1, focusTargets: focus("b") }),
		];
		expect(ids(getPathNodes(graph, j1, steps))).toEqual(["a", "b", "c"]);
	});

	it("returns a revisited node once, at its first visit", () => {
		const steps = [
			makeStep({ journeyId: "j1", sequenceNumber: 0, focusTargets: focus("a", "b") }),
			makeStep({ journeyId: "j1", sequenceNumber: 1, focusTargets: focus("b", "a", "c") }),
		];
		expect(ids(getPathNodes(graph, j1, steps))).toEqual(["a", "b", "c"]);
	});

	it("skips focus targets that are not nodes in the graph", () => {
		const steps = [
			makeStep({
				journeyId: "j1",
				sequenceNumber: 0,
				focusTargets: [
					{ type: "node", targetId: "ghost" },
					{ type: "edge", targetId: "a" },
					{ type: "node", targetId: "d" },
				],
			}),
		];
		expect(ids(getPathNodes(graph, j1, steps))).toEqual(["d"]);
	});

	it("returns nothing for a journey with no steps", () => {
		const steps = [makeStep({ journeyId: "j2", sequenceNumber: 0, focusTargets: focus("a") })];
		expect(getPathNodes(graph, j1, steps)).toEqual([]);
	});

	it("does not reorder the caller's step array", () => {
		const steps = [
			makeStep({ id: "late", journeyId: "j1", sequenceNumber: 1, focusTargets: focus("b") }),
			makeStep({ id: "early", journeyId: "j1", sequenceNumber: 0, focusTargets: focus("a") }),
		];
		getPathNodes(graph, j1, steps);
		expect(steps.map((s) => s.id)).toEqual(["late", "early"]);
	});
});
