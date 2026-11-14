import { describe, expect, it } from "vitest";
import { bfsTraverse, createGraph, getNeighbors } from "../../src/graph/index.js";
import type { Direction } from "../../src/graph/index.js";
import { makeEdge, makeNode } from "../../src/test-fixtures/index.js";

const nodes = ["a", "b", "c"].map((id) => makeNode({ id, label: id }));
const ids = (result: Array<{ id: string }>) => result.map((n) => n.id);

/** One edge stored as a -> b. */
function graphWith(directed: boolean) {
	return createGraph(nodes, [
		makeEdge({ id: "e", sourceNodeId: "a", targetNodeId: "b", directed }),
	]);
}

// [start, direction, reachable neighbour] for a directed edge a -> b.
const directedCases: [string, Direction, string[]][] = [
	["a", "out", ["b"]],
	["a", "in", []],
	["a", "both", ["b"]],
	["b", "out", []],
	["b", "in", ["a"]],
	["b", "both", ["a"]],
];

// An undirected edge joins both ends whatever direction is asked for.
const undirectedCases: [string, Direction, string[]][] = [
	["a", "out", ["b"]],
	["a", "in", ["b"]],
	["a", "both", ["b"]],
	["b", "out", ["a"]],
	["b", "in", ["a"]],
	["b", "both", ["a"]],
];

describe("directed edges are followed as stored", () => {
	it.each(directedCases)("getNeighbors from %s, %s", (start, direction, expected) => {
		expect(ids(getNeighbors(graphWith(true), start, direction))).toEqual(expected);
	});

	it.each(directedCases)("bfsTraverse from %s, %s", (start, direction, expected) => {
		expect(ids(bfsTraverse(graphWith(true), start, { direction }))).toEqual([start, ...expected]);
	});
});

describe("undirected edges are walkable from either end", () => {
	it.each(undirectedCases)("getNeighbors from %s, %s", (start, direction, expected) => {
		expect(ids(getNeighbors(graphWith(false), start, direction))).toEqual(expected);
	});

	it.each(undirectedCases)("bfsTraverse from %s, %s", (start, direction, expected) => {
		expect(ids(bfsTraverse(graphWith(false), start, { direction }))).toEqual([start, ...expected]);
	});
});

describe("mixed graphs", () => {
	// a -> b is directed; b - c is undirected, stored as c -> b.
	const graph = createGraph(nodes, [
		makeEdge({ id: "ab", sourceNodeId: "a", targetNodeId: "b", directed: true }),
		makeEdge({ id: "cb", sourceNodeId: "c", targetNodeId: "b", directed: false }),
	]);

	it("an outward walk crosses an undirected edge stored the other way round", () => {
		expect(ids(bfsTraverse(graph, "a", { direction: "out" }))).toEqual(["a", "b", "c"]);
	});

	it("an outward walk does not go back up a directed edge", () => {
		expect(ids(bfsTraverse(graph, "c", { direction: "out" }))).toEqual(["c", "b"]);
	});

	it("getNeighbors and bfsTraverse at depth 1 agree for every node and direction", () => {
		for (const node of nodes) {
			for (const direction of ["in", "out", "both"] as const) {
				const viaNeighbors = ids(getNeighbors(graph, node.id, direction));
				const viaTraversal = ids(bfsTraverse(graph, node.id, { direction, maxDepth: 1 })).slice(1);
				expect(viaTraversal).toEqual(viaNeighbors);
			}
		}
	});
});
