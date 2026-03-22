import {
	getHighlightedEdgeIds,
	getHighlightedNodeIds,
	getVisibleEdgeIds,
	getVisibleNodeIds,
} from "@/lib/projection.js";
import { toReactFlowEdges, toReactFlowNodes } from "@/lib/react-flow-adapter.js";
import {
	seedCapabilities,
	seedDomains,
	seedEdges,
	seedNodes,
	seedProviderAssociations,
	seedProviders,
} from "@/store/seed-loader.js";
import type { NavigationContext } from "@guiderail/core/context";
import type { Capability, Domain } from "@guiderail/core/entities";
import type { TerrainGraph } from "@guiderail/core/graph";
import { useMemo } from "react";

/**
 * Derives React Flow nodes and edges from kernel navigation state.
 * Recomputes only when nav or graph changes.
 */
export function usePerspectiveProvider(nav: NavigationContext, graph: TerrainGraph | null) {
	const rfNodes = useMemo(() => {
		if (!graph) return [];

		const visibleNodeIds = getVisibleNodeIds(nav, graph, seedDomains, seedCapabilities);
		const highlightedNodeIds = getHighlightedNodeIds(nav);

		return toReactFlowNodes(seedNodes, nav.activePerspectiveId, {
			visibleNodeIds,
			selectedNodeId: nav.selectedNodeId,
			highlightedNodeIds,
			providers: seedProviders,
			providerAssociations: seedProviderAssociations,
		});
	}, [nav, graph]);

	const rfEdges = useMemo(() => {
		if (!graph) return [];

		const visibleNodeIds = getVisibleNodeIds(nav, graph, seedDomains, seedCapabilities);
		const visibleEdgeIds = getVisibleEdgeIds(graph, visibleNodeIds);
		const highlightedEdgeIds = getHighlightedEdgeIds(nav);

		return toReactFlowEdges(seedEdges, {
			visibleEdgeIds,
			selectedEdgeId: nav.selectedEdgeId,
			highlightedEdgeIds,
		});
	}, [nav, graph]);

	return { rfNodes, rfEdges };
}
