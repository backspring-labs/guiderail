import type { NavigationContext } from "@guiderail/core/context";
import { createInitialNavigationContext } from "@guiderail/core/context";
import type { Capability, Domain } from "@guiderail/core/entities";
import { createGraph } from "@guiderail/core/graph";
import { describe, expect, it } from "vitest";
import {
	getHighlightedEdgeIds,
	getHighlightedNodeIds,
	getVisibleEdgeIds,
	getVisibleNodeIds,
} from "./projection.js";

const domains: Domain[] = [
	{ id: "dom-a", label: "Domain A", tags: [], metadata: {} },
	{ id: "dom-b", label: "Domain B", tags: [], metadata: {} },
];

const capabilities: Capability[] = [
	{
		id: "cap-1",
		domainId: "dom-a",
		label: "Cap 1",
		nodeIds: ["n-1", "n-2"],
		edgeIds: [],
		journeyIds: [],
		tags: [],
		metadata: {},
	},
	{
		id: "cap-2",
		domainId: "dom-a",
		label: "Cap 2",
		nodeIds: ["n-2", "n-3"],
		edgeIds: [],
		journeyIds: [],
		tags: [],
		metadata: {},
	},
	{
		id: "cap-3",
		domainId: "dom-b",
		label: "Cap 3",
		nodeIds: ["n-4"],
		edgeIds: [],
		journeyIds: [],
		tags: [],
		metadata: {},
	},
];

const graph = createGraph(
	[
		{ id: "n-1", type: "service", label: "N1", tags: [], metadata: {}, layoutByPerspective: {} },
		{ id: "n-2", type: "service", label: "N2", tags: [], metadata: {}, layoutByPerspective: {} },
		{ id: "n-3", type: "service", label: "N3", tags: [], metadata: {}, layoutByPerspective: {} },
		{ id: "n-4", type: "service", label: "N4", tags: [], metadata: {}, layoutByPerspective: {} },
	],
	[
		{
			id: "e-1",
			sourceNodeId: "n-1",
			targetNodeId: "n-2",
			type: "dep",
			directed: true,
			metadata: {},
		},
		{
			id: "e-2",
			sourceNodeId: "n-3",
			targetNodeId: "n-4",
			type: "dep",
			directed: true,
			metadata: {},
		},
	],
);

function baseCtx(overrides: Partial<NavigationContext> = {}): NavigationContext {
	return { ...createInitialNavigationContext("persp-landscape"), ...overrides };
}

describe("getVisibleNodeIds", () => {
	it("returns all nodes when no domain selected", () => {
		const result = getVisibleNodeIds(baseCtx(), graph, domains, capabilities);
		expect(result.size).toBe(4);
	});

	it("returns domain nodes when domain selected", () => {
		const ctx = baseCtx({ activeDomainId: "dom-a" });
		const result = getVisibleNodeIds(ctx, graph, domains, capabilities);
		expect(result.has("n-1")).toBe(true);
		expect(result.has("n-2")).toBe(true);
		expect(result.has("n-3")).toBe(true);
		expect(result.has("n-4")).toBe(false);
	});

	it("returns capability nodes when capability selected", () => {
		const ctx = baseCtx({ activeDomainId: "dom-a", activeCapabilityId: "cap-1" });
		const result = getVisibleNodeIds(ctx, graph, domains, capabilities);
		expect(result.has("n-1")).toBe(true);
		expect(result.has("n-2")).toBe(true);
		expect(result.has("n-3")).toBe(false);
	});
});

describe("getVisibleEdgeIds", () => {
	it("includes edges where both endpoints are visible", () => {
		const visible = new Set(["n-1", "n-2"]);
		const result = getVisibleEdgeIds(graph, visible);
		expect(result.has("e-1")).toBe(true);
		expect(result.has("e-2")).toBe(false);
	});

	it("excludes edges with invisible endpoints", () => {
		const visible = new Set(["n-1"]);
		const result = getVisibleEdgeIds(graph, visible);
		expect(result.size).toBe(0);
	});
});

describe("getHighlightedNodeIds", () => {
	it("extracts node targets from focus targets", () => {
		const ctx = baseCtx({
			activeFocusTargets: [
				{ type: "node", targetId: "n-1" },
				{ type: "edge", targetId: "e-1" },
				{ type: "node", targetId: "n-3" },
			],
		});
		const result = getHighlightedNodeIds(ctx);
		expect(result.has("n-1")).toBe(true);
		expect(result.has("n-3")).toBe(true);
		expect(result.size).toBe(2);
	});

	it("returns empty set when no focus targets", () => {
		const result = getHighlightedNodeIds(baseCtx());
		expect(result.size).toBe(0);
	});
});

describe("getHighlightedEdgeIds", () => {
	it("extracts edge targets from focus targets", () => {
		const ctx = baseCtx({
			activeFocusTargets: [
				{ type: "node", targetId: "n-1" },
				{ type: "edge", targetId: "e-1" },
			],
		});
		const result = getHighlightedEdgeIds(ctx);
		expect(result.has("e-1")).toBe(true);
		expect(result.size).toBe(1);
	});
});
