import type {
	Edge as KernelEdge,
	Node as KernelNode,
	Provider,
	ProviderAssociation,
} from "@guiderail/core/entities";
import { describe, expect, it } from "vitest";
import { toReactFlowEdges, toReactFlowNodes } from "./react-flow-adapter.js";

const testNodes: KernelNode[] = [
	{
		id: "n-1",
		type: "service",
		label: "Service A",
		tags: [],
		metadata: {},
		layoutByPerspective: {
			"persp-overview": { x: 100, y: 200 },
			"persp-architecture": { x: 300, y: 400 },
		},
	},
	{
		id: "n-2",
		type: "actor",
		label: "Customer",
		tags: [],
		metadata: {},
		layoutByPerspective: {
			"persp-overview": { x: 0, y: 50 },
		},
	},
];

const testEdges: KernelEdge[] = [
	{
		id: "e-1",
		sourceNodeId: "n-1",
		targetNodeId: "n-2",
		type: "service_call",
		label: "calls",
		directed: true,
		metadata: {},
	},
];

describe("toReactFlowNodes", () => {
	it("maps positions from layoutByPerspective", () => {
		const result = toReactFlowNodes(testNodes, "persp-overview");
		expect(result[0]?.position).toEqual({ x: 100, y: 200 });
		expect(result[1]?.position).toEqual({ x: 0, y: 50 });
	});

	it("uses different positions for different perspectives", () => {
		const result = toReactFlowNodes(testNodes, "persp-architecture");
		expect(result[0]?.position).toEqual({ x: 300, y: 400 });
	});

	it("falls back to { x: 0, y: 0 } for missing perspective", () => {
		const result = toReactFlowNodes(testNodes, "persp-nonexistent");
		expect(result[0]?.position).toEqual({ x: 0, y: 0 });
	});

	it("sets correct node type from kernel type", () => {
		const result = toReactFlowNodes(testNodes, "persp-overview");
		expect(result[0]?.type).toBe("service");
		expect(result[1]?.type).toBe("actor");
	});

	it("passes kernel node in data", () => {
		const result = toReactFlowNodes(testNodes, "persp-overview");
		expect(result[0]?.data.kernelNode.label).toBe("Service A");
	});

	it("marks nodes as dimmed when not in visibleNodeIds", () => {
		const visible = new Set(["n-1"]);
		const result = toReactFlowNodes(testNodes, "persp-overview", { visibleNodeIds: visible });
		expect(result[0]?.data.dimmed).toBe(false);
		expect(result[1]?.data.dimmed).toBe(true);
	});

	it("marks node as selected when matching selectedNodeId", () => {
		const result = toReactFlowNodes(testNodes, "persp-overview", { selectedNodeId: "n-2" });
		expect(result[0]?.selected).toBe(false);
		expect(result[1]?.selected).toBe(true);
	});

	it("marks node as highlighted when in highlightedNodeIds", () => {
		const highlighted = new Set(["n-1"]);
		const result = toReactFlowNodes(testNodes, "persp-overview", {
			highlightedNodeIds: highlighted,
		});
		expect(result[0]?.data.highlighted).toBe(true);
		expect(result[1]?.data.highlighted).toBe(false);
	});

	it("all nodes visible when visibleNodeIds not provided", () => {
		const result = toReactFlowNodes(testNodes, "persp-overview");
		expect(result[0]?.data.dimmed).toBe(false);
		expect(result[1]?.data.dimmed).toBe(false);
	});
});

const testProviders: Provider[] = [
	{ id: "prov-1", label: "Visa", category: "scheme", tags: [], metadata: {} },
	{ id: "prov-2", label: "RTP", category: "rail", tags: [], metadata: {} },
	{ id: "prov-3", label: "Extra1", category: "wallet", tags: [], metadata: {} },
	{ id: "prov-4", label: "Extra2", category: "network", tags: [], metadata: {} },
];

const testAssociations: ProviderAssociation[] = [
	{
		id: "pa-1",
		providerId: "prov-1",
		targetType: "node",
		targetId: "n-1",
		role: "participant",
		metadata: {},
	},
	{
		id: "pa-2",
		providerId: "prov-2",
		targetType: "node",
		targetId: "n-1",
		role: "rail_provider",
		metadata: {},
	},
	{
		id: "pa-3",
		providerId: "prov-3",
		targetType: "node",
		targetId: "n-1",
		role: "participant",
		metadata: {},
	},
	{
		id: "pa-4",
		providerId: "prov-4",
		targetType: "node",
		targetId: "n-1",
		role: "participant",
		metadata: {},
	},
	{
		id: "pa-5",
		providerId: "prov-1",
		targetType: "capability",
		targetId: "cap-1",
		role: "participant",
		metadata: {},
	},
];

describe("toReactFlowNodes — provider badges", () => {
	it("populates badges for nodes with associations", () => {
		const result = toReactFlowNodes(testNodes, "persp-overview", {
			providers: testProviders,
			providerAssociations: testAssociations,
		});
		const n1Badges = result[0]?.data.providerBadges ?? [];
		expect(n1Badges.length).toBe(4);
		expect(n1Badges[0]?.label).toBe("Visa");
		expect(n1Badges[0]?.category).toBe("scheme");
	});

	it("returns empty badges for nodes without associations", () => {
		const result = toReactFlowNodes(testNodes, "persp-overview", {
			providers: testProviders,
			providerAssociations: testAssociations,
		});
		const n2Badges = result[1]?.data.providerBadges ?? [];
		expect(n2Badges.length).toBe(0);
	});

	it("only uses node-type associations (not capability)", () => {
		const result = toReactFlowNodes(testNodes, "persp-overview", {
			providers: testProviders,
			providerAssociations: testAssociations,
		});
		// pa-5 targets capability, not node — should not appear in badges
		const n1Badges = result[0]?.data.providerBadges ?? [];
		expect(n1Badges.every((b) => b.providerId !== "prov-1" || b.label === "Visa")).toBe(true);
	});

	it("works without providers (backward compat)", () => {
		const result = toReactFlowNodes(testNodes, "persp-overview");
		expect(result[0]?.data.providerBadges).toEqual([]);
		expect(result[1]?.data.providerBadges).toEqual([]);
	});

	it("includes visibleBadgeCount for overflow rendering", () => {
		const result = toReactFlowNodes(testNodes, "persp-overview", {
			providers: testProviders,
			providerAssociations: testAssociations,
		});
		expect(result[0]?.data.visibleBadgeCount).toBe(2);
	});
});

describe("toReactFlowEdges", () => {
	it("maps sourceNodeId/targetNodeId to source/target", () => {
		const result = toReactFlowEdges(testEdges);
		expect(result[0]?.source).toBe("n-1");
		expect(result[0]?.target).toBe("n-2");
	});

	it("sets type to terrain", () => {
		const result = toReactFlowEdges(testEdges);
		expect(result[0]?.type).toBe("terrain");
	});

	it("passes kernel edge in data", () => {
		const result = toReactFlowEdges(testEdges);
		expect(result[0]?.data?.kernelEdge.label).toBe("calls");
	});

	it("marks edges as dimmed when not in visibleEdgeIds", () => {
		const visible = new Set<string>();
		const result = toReactFlowEdges(testEdges, { visibleEdgeIds: visible });
		expect(result[0]?.data?.dimmed).toBe(true);
	});

	it("sets animated for highlighted edges", () => {
		const highlighted = new Set(["e-1"]);
		const result = toReactFlowEdges(testEdges, { highlightedEdgeIds: highlighted });
		expect(result[0]?.animated).toBe(true);
	});
});
