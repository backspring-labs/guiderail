import { computeElkLayout, getLayoutDirection } from "@/lib/elk-layout.js";
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
import type { TerrainGraph } from "@guiderail/core/graph";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Derives React Flow nodes and edges from kernel navigation state.
 * Uses ELK.js for auto-layout when nodes don't have hand-authored positions.
 */
export function usePerspectiveProvider(nav: NavigationContext, graph: TerrainGraph | null) {
	const [elkPositions, setElkPositions] = useState<Map<string, { x: number; y: number }>>(
		new Map(),
	);
	const [layoutLoading, setLayoutLoading] = useState(false);
	const lastPerspectiveRef = useRef(nav.activePerspectiveId);

	// Compute ELK layout when perspective changes
	useEffect(() => {
		if (!graph || nav.activePerspectiveId === lastPerspectiveRef.current) {
			// Skip if same perspective (positions already computed)
			if (elkPositions.size > 0) return;
		}
		lastPerspectiveRef.current = nav.activePerspectiveId;

		setLayoutLoading(true);

		// Find the perspective type from seed data
		const perspectiveType =
			seedPerspectives.find((p) => p.id === nav.activePerspectiveId)?.type ?? "overview";

		const direction = getLayoutDirection(perspectiveType);

		// Build the node/edge list for ELK
		const elkNodes = seedNodes.map((n) => ({ id: n.id }));
		const elkEdges = seedEdges.map((e) => ({
			id: e.id,
			source: e.sourceNodeId,
			target: e.targetNodeId,
		}));

		computeElkLayout(
			elkNodes.map((n) => ({ id: n.id, position: { x: 0, y: 0 }, data: {} })),
			elkEdges,
			{ direction },
		)
			.then((positions) => {
				setElkPositions(positions);
				setLayoutLoading(false);
			})
			.catch(() => {
				setLayoutLoading(false);
			});
	}, [nav.activePerspectiveId, graph, elkPositions.size]);

	const rfNodes = useMemo(() => {
		if (!graph) return [];

		const visibleNodeIds = getVisibleNodeIds(nav, graph, seedDomains, seedCapabilities);
		const highlightedNodeIds = getHighlightedNodeIds(nav);

		const nodesWithPositions = toReactFlowNodes(seedNodes, nav.activePerspectiveId, {
			visibleNodeIds,
			selectedNodeId: nav.selectedNodeId,
			highlightedNodeIds,
			providers: seedProviders,
			providerAssociations: seedProviderAssociations,
		});

		// Apply ELK positions for nodes that don't have hand-authored positions
		return nodesWithPositions.map((rfNode) => {
			// If the node already has a non-zero position from layoutByPerspective, keep it
			if (rfNode.position.x !== 0 || rfNode.position.y !== 0) {
				return rfNode;
			}
			// Otherwise use ELK-computed position
			const elkPos = elkPositions.get(rfNode.id);
			if (elkPos) {
				return { ...rfNode, position: elkPos };
			}
			return rfNode;
		});
	}, [nav, graph, elkPositions]);

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

	return { rfNodes, rfEdges, layoutLoading };
}

// Import perspectives for type lookup
import { seedPerspectives } from "@/store/seed-loader.js";
