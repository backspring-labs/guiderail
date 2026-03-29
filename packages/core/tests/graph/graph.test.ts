import { describe, expect, it } from "vitest";
import {
	createGraph,
	filterNodes,
	getCapabilitiesForDomain,
	getEdge,
	getEdgesForNode,
	getNeighbors,
	getNode,
	getNodesForCapability,
	getNodesForLayer,
	getPathNodes,
	getProcessesForCapability,
} from "../../src/graph/index.js";
import { bfsTraverse } from "../../src/graph/index.js";
import { filterGraph, filterNodesByTags, filterNodesByType } from "../../src/graph/index.js";
import {
	capabilities,
	edges,
	journeys,
	layers,
	nodes,
	processes,
	steps,
} from "../../src/test-fixtures/index.js";

const graph = createGraph(nodes, edges);

describe("createGraph", () => {
	it("creates a graph with correct node count", () => {
		expect(graph.nodes.size).toBe(24);
	});

	it("creates a graph with correct edge count", () => {
		expect(graph.edges.size).toBe(25);
	});
});

describe("getNode / getEdge", () => {
	it("retrieves a node by id", () => {
		const node = getNode(graph, "n-context-machine");
		expect(node).toBeDefined();
		expect(node?.label).toBe("Context Machine");
	});

	it("returns undefined for missing node", () => {
		expect(getNode(graph, "nonexistent")).toBeUndefined();
	});

	it("retrieves an edge by id", () => {
		const edge = getEdge(graph, "e-user-shell");
		expect(edge).toBeDefined();
		expect(edge?.type).toBe("user_interaction");
	});
});

describe("getNeighbors", () => {
	it("returns outbound neighbors", () => {
		const neighbors = getNeighbors(graph, "n-app-shell", "out");
		const ids = neighbors.map((n) => n.id);
		expect(ids).toContain("n-use-context-machine");
		expect(ids).toContain("n-use-perspective-provider");
		expect(ids).toContain("n-left-panel");
	});

	it("returns inbound neighbors", () => {
		const neighbors = getNeighbors(graph, "n-app-shell", "in");
		const ids = neighbors.map((n) => n.id);
		expect(ids).toContain("n-user");
	});

	it("returns both directions by default", () => {
		const neighbors = getNeighbors(graph, "n-app-shell");
		const ids = neighbors.map((n) => n.id);
		expect(ids).toContain("n-user");
		expect(ids).toContain("n-use-context-machine");
	});
});

describe("getEdgesForNode", () => {
	it("returns outbound edges", () => {
		const result = getEdgesForNode(graph, "n-use-perspective-provider", "out");
		expect(result.length).toBe(4);
		const targets = result.map((e) => e.targetNodeId);
		expect(targets).toContain("n-bpmn-layout");
		expect(targets).toContain("n-journey-layout");
	});

	it("returns inbound edges", () => {
		const result = getEdgesForNode(graph, "n-reconciler", "in");
		expect(result.length).toBe(1);
		expect(result[0]?.sourceNodeId).toBe("n-context-machine");
	});
});

describe("filterNodes", () => {
	it("filters by type", () => {
		const services = filterNodes(graph, (n) => n.type === "service");
		expect(services.length).toBe(19);
	});

	it("filters by tag", () => {
		const coreNodes = filterNodes(graph, (n) => n.tags.includes("core"));
		expect(coreNodes.length).toBeGreaterThan(0);
	});
});

describe("getNodesForCapability", () => {
	it("returns correct nodes for context machine capability", () => {
		const cap = capabilities.find((c) => c.id === "cap-context-machine");
		expect(cap).toBeDefined();
		if (!cap) return;

		const result = getNodesForCapability(graph, cap);
		const ids = result.map((n) => n.id);
		expect(ids).toContain("n-context-machine");
	});
});

describe("getCapabilitiesForDomain", () => {
	it("returns capabilities for Core Kernel domain", () => {
		const result = getCapabilitiesForDomain("dom-core-kernel", capabilities);
		expect(result.length).toBe(3);
		const labels = result.map((c) => c.label);
		expect(labels).toContain("Context Machine");
		expect(labels).toContain("State Reconciliation");
		expect(labels).toContain("Navigation Context");
	});

	it("returns capabilities for Canvas Rendering domain", () => {
		const result = getCapabilitiesForDomain("dom-canvas-rendering", capabilities);
		expect(result.length).toBe(6);
	});

	it("returns empty for unknown domain", () => {
		expect(getCapabilitiesForDomain("dom-unknown", capabilities)).toEqual([]);
	});
});

describe("getNodesForLayer", () => {
	it("returns all nodes for layer with no type restrictions", () => {
		const defaultLayer = layers.find((l) => l.id === "layer-default");
		expect(defaultLayer).toBeDefined();
		if (!defaultLayer) return;

		const result = getNodesForLayer(graph, defaultLayer);
		expect(result.length).toBe(24);
	});

	it("filters by eligible types for process layer", () => {
		const processLayer = layers.find((l) => l.id === "layer-process");
		expect(processLayer).toBeDefined();
		if (!processLayer) return;

		const result = getNodesForLayer(graph, processLayer);
		for (const node of result) {
			expect(["service", "system"]).toContain(node.type);
		}
	});
});

describe("getPathNodes", () => {
	it("returns ordered nodes along the journey", () => {
		const journey = journeys[0];
		expect(journey).toBeDefined();
		if (!journey) return;

		const result = getPathNodes(graph, journey, steps);
		expect(result.length).toBeGreaterThan(0);
		// First step focuses on n-app-shell
		expect(result[0]?.id).toBe("n-app-shell");
	});
});

describe("bfsTraverse", () => {
	it("traverses from user outward", () => {
		const result = bfsTraverse(graph, "n-user", { direction: "out", maxDepth: 2 });
		const ids = result.map((n) => n.id);
		expect(ids).toContain("n-user");
		expect(ids).toContain("n-app-shell");
	});

	it("respects depth limit", () => {
		const depth1 = bfsTraverse(graph, "n-user", { direction: "out", maxDepth: 1 });
		const depth2 = bfsTraverse(graph, "n-user", { direction: "out", maxDepth: 2 });
		expect(depth2.length).toBeGreaterThanOrEqual(depth1.length);
	});
});

describe("filterGraph", () => {
	it("returns filtered graph with consistent edges", () => {
		const filtered = filterGraph(graph, (n) => n.type === "service");
		for (const edge of filtered.edges.values()) {
			expect(filtered.nodes.has(edge.sourceNodeId)).toBe(true);
			expect(filtered.nodes.has(edge.targetNodeId)).toBe(true);
		}
	});
});

describe("filterNodesByTags", () => {
	it("finds nodes with core tag", () => {
		const result = filterNodesByTags(graph, ["core"]);
		expect(result.some((n) => n.id === "n-context-machine")).toBe(true);
	});
});

describe("filterNodesByType", () => {
	it("finds actor nodes", () => {
		const result = filterNodesByType(graph, ["actor"]);
		expect(result.length).toBe(1);
		expect(result.some((n) => n.id === "n-user")).toBe(true);
	});
});

describe("getProcessesForCapability", () => {
	it("returns processes for state reconciliation capability", () => {
		const result = getProcessesForCapability("cap-state-reconciliation", processes);
		expect(result.length).toBeGreaterThanOrEqual(1);
		expect(result.some((p) => p.label === "Perspective Switch with Shared Context")).toBe(true);
	});

	it("returns empty for capability with no processes", () => {
		const result = getProcessesForCapability("cap-navigation-context", processes);
		expect(result).toEqual([]);
	});
});
