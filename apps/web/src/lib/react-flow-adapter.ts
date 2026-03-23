import type { Edge as KernelEdge, Node as KernelNode } from "@guiderail/core/entities";
import type { Provider, ProviderAssociation } from "@guiderail/core/entities";
import type { Edge as ReactFlowEdge, Node as ReactFlowNode } from "@xyflow/react";

export interface ProviderBadge {
	providerId: string;
	label: string;
	category: string;
}

export interface TerrainNodeData extends Record<string, unknown> {
	kernelNode: KernelNode;
	dimmed: boolean;
	providerBadges: ProviderBadge[];
}

export interface TerrainEdgeData extends Record<string, unknown> {
	kernelEdge: KernelEdge;
	dimmed: boolean;
}

const MAX_VISIBLE_BADGES = 2;

function resolveProviderBadges(
	nodeId: string,
	providers: Provider[],
	associations: ProviderAssociation[],
): ProviderBadge[] {
	const nodeAssociations = associations.filter(
		(a) => a.targetType === "node" && a.targetId === nodeId,
	);
	return nodeAssociations
		.map((a) => {
			const provider = providers.find((p) => p.id === a.providerId);
			if (!provider) return null;
			return {
				providerId: provider.id,
				label: provider.label,
				category: provider.category,
			};
		})
		.filter((b): b is ProviderBadge => b != null);
}

export function toReactFlowNodes(
	nodes: KernelNode[],
	perspectiveId: string,
	options: {
		visibleNodeIds?: Set<string>;
		selectedNodeId?: string | null;
		highlightedNodeIds?: Set<string>;
		providers?: Provider[];
		providerAssociations?: ProviderAssociation[];
	} = {},
): ReactFlowNode<TerrainNodeData>[] {
	const {
		visibleNodeIds,
		selectedNodeId,
		highlightedNodeIds,
		providers = [],
		providerAssociations = [],
	} = options;

	return nodes.map((node) => {
		const pos = node.layoutByPerspective[perspectiveId];
		const isVisible = !visibleNodeIds || visibleNodeIds.has(node.id);
		const nodeType = resolveNodeType(node.type);
		const providerBadges = resolveProviderBadges(node.id, providers, providerAssociations);

		return {
			id: node.id,
			type: nodeType,
			position: pos ? { x: pos.x, y: pos.y } : { x: 0, y: 0 },
			selected: node.id === selectedNodeId,
			data: {
				kernelNode: node,
				dimmed: !isVisible,
				label: node.label,
				highlighted: highlightedNodeIds?.has(node.id) ?? false,
				providerBadges,
				visibleBadgeCount: MAX_VISIBLE_BADGES,
			},
		};
	});
}

export function toReactFlowEdges(
	edges: KernelEdge[],
	options: {
		visibleEdgeIds?: Set<string>;
		selectedEdgeId?: string | null;
		highlightedEdgeIds?: Set<string>;
	} = {},
): ReactFlowEdge<TerrainEdgeData>[] {
	const { visibleEdgeIds, selectedEdgeId, highlightedEdgeIds } = options;

	return edges.map((edge) => {
		const isVisible = !visibleEdgeIds || visibleEdgeIds.has(edge.id);

		return {
			id: edge.id,
			source: edge.sourceNodeId,
			target: edge.targetNodeId,
			type: "terrain",
			selected: edge.id === selectedEdgeId,
			animated: highlightedEdgeIds?.has(edge.id) ?? false,
			data: {
				kernelEdge: edge,
				dimmed: !isVisible,
				label: edge.label ?? "",
			},
		};
	});
}

function resolveNodeType(kernelType: string): string {
	switch (kernelType) {
		case "actor":
		case "service":
		case "system":
		case "screen":
		case "bpmn_task":
		case "bpmn_event":
		case "bpmn_gateway":
			return kernelType;
		default:
			return "service";
	}
}
