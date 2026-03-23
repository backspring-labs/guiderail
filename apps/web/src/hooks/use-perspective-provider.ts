import { computeBpmnLayout } from "@/lib/bpmn-layout.js";
import { computeElkLayout, getLayoutDirection } from "@/lib/elk-layout.js";
import {
	getHighlightedEdgeIds,
	getHighlightedNodeIds,
	getVisibleEdgeIds,
	getVisibleNodeIds,
} from "@/lib/projection.js";
import { toReactFlowEdges, toReactFlowNodes } from "@/lib/react-flow-adapter.js";
import { computeSequenceLayout } from "@/lib/sequence-layout.js";
import {
	seedBpmnEdges,
	seedBpmnNodes,
	seedCapabilities,
	seedControlPoints,
	seedDomains,
	seedEdges,
	seedInterfaces,
	seedMessages,
	seedNodes,
	seedPerspectives,
	seedProcessStages,
	seedProviderAssociations,
	seedProviders,
} from "@/store/seed-loader.js";
import type { NavigationContext } from "@guiderail/core/context";
import type { TerrainGraph } from "@guiderail/core/graph";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Derives React Flow nodes and edges from kernel navigation state.
 * Uses BPMN layout for Process perspective, ELK for all others.
 */
export function usePerspectiveProvider(nav: NavigationContext, graph: TerrainGraph | null) {
	const [elkPositions, setElkPositions] = useState<Map<string, { x: number; y: number }>>(
		new Map(),
	);
	const [layoutLoading, setLayoutLoading] = useState(false);
	const lastPerspectiveRef = useRef(nav.activePerspectiveId);

	const perspectiveType =
		seedPerspectives.find((p) => p.id === nav.activePerspectiveId)?.type ?? "landscape";
	const isProcessPerspective = perspectiveType === "process";
	const isSequencePerspective = perspectiveType === "sequence";

	// Compute ELK layout when perspective changes (terrain perspectives only)
	useEffect(() => {
		if (!graph || isProcessPerspective || isSequencePerspective) return;
		if (nav.activePerspectiveId === lastPerspectiveRef.current && elkPositions.size > 0) return;
		lastPerspectiveRef.current = nav.activePerspectiveId;

		setLayoutLoading(true);
		const direction = getLayoutDirection(perspectiveType);
		const elkNodes = seedNodes.map((n) => ({ id: n.id, position: { x: 0, y: 0 }, data: {} }));
		const elkEdges = seedEdges.map((e) => ({
			id: e.id,
			source: e.sourceNodeId,
			target: e.targetNodeId,
		}));

		computeElkLayout(elkNodes, elkEdges, { direction })
			.then((positions) => {
				setElkPositions(positions);
				setLayoutLoading(false);
			})
			.catch(() => {
				setLayoutLoading(false);
			});
	}, [
		nav.activePerspectiveId,
		graph,
		elkPositions.size,
		isProcessPerspective,
		isSequencePerspective,
		perspectiveType,
	]);

	// BPMN layout (synchronous, computed once per perspective switch)
	const bpmnLayout = useMemo(() => {
		if (!isProcessPerspective) return null;
		return computeBpmnLayout(seedBpmnNodes, seedBpmnEdges);
	}, [isProcessPerspective]);

	// Sequence layout (synchronous)
	const sequenceLayout = useMemo(() => {
		if (!isSequencePerspective) return null;
		return computeSequenceLayout(seedInterfaces, seedMessages);
	}, [isSequencePerspective]);

	const rfNodes = useMemo(() => {
		if (!graph) return [];

		// Process perspective: render BPMN nodes
		if (isProcessPerspective && bpmnLayout) {
			return buildBpmnNodes(nav, bpmnLayout.positions);
		}

		// Sequence perspective: render lifeline + message nodes
		if (isSequencePerspective && sequenceLayout) {
			return sequenceLayout.nodes;
		}

		// All other perspectives: render terrain nodes with ELK
		return buildTerrainNodes(nav, graph, elkPositions);
	}, [
		nav,
		graph,
		elkPositions,
		isProcessPerspective,
		bpmnLayout,
		isSequencePerspective,
		sequenceLayout,
	]);

	const rfEdges = useMemo(() => {
		if (!graph) return [];

		// Process perspective: render BPMN edges
		if (isProcessPerspective) {
			return buildBpmnEdges(nav);
		}

		// Sequence perspective: no edges (messages rendered as nodes)
		if (isSequencePerspective) {
			return [];
		}

		// All other perspectives: render terrain edges
		return buildTerrainEdges(nav, graph);
	}, [nav, graph, isProcessPerspective, isSequencePerspective]);

	const swimLanes = isProcessPerspective ? (bpmnLayout?.swimLanes ?? []) : [];

	return { rfNodes, rfEdges, layoutLoading, swimLanes };
}

function buildTerrainNodes(
	nav: NavigationContext,
	graph: TerrainGraph,
	elkPositions: Map<string, { x: number; y: number }>,
) {
	const visibleNodeIds = getVisibleNodeIds(nav, graph, seedDomains, seedCapabilities);
	const highlightedNodeIds = getHighlightedNodeIds(nav);

	const nodesWithPositions = toReactFlowNodes(seedNodes, nav.activePerspectiveId, {
		visibleNodeIds,
		selectedNodeId: nav.selectedNodeId,
		highlightedNodeIds,
		providers: seedProviders,
		providerAssociations: seedProviderAssociations,
	});

	return nodesWithPositions.map((rfNode) => {
		if (rfNode.position.x !== 0 || rfNode.position.y !== 0) return rfNode;
		const elkPos = elkPositions.get(rfNode.id);
		return elkPos ? { ...rfNode, position: elkPos } : rfNode;
	});
}

function buildTerrainEdges(nav: NavigationContext, graph: TerrainGraph) {
	const visibleNodeIds = getVisibleNodeIds(nav, graph, seedDomains, seedCapabilities);
	const visibleEdgeIds = getVisibleEdgeIds(graph, visibleNodeIds);
	const highlightedEdgeIds = getHighlightedEdgeIds(nav);

	return toReactFlowEdges(seedEdges, {
		visibleEdgeIds,
		selectedEdgeId: nav.selectedEdgeId,
		highlightedEdgeIds,
	});
}

function buildBpmnNodes(nav: NavigationContext, positions: Map<string, { x: number; y: number }>) {
	const canvasMode = nav.activeCanvasMode ?? "operational";
	const isRiskControls = canvasMode === "risk_controls";
	const isActivity = canvasMode === "activity";

	return seedBpmnNodes.map((node) => {
		const pos = positions.get(node.id) ?? { x: 0, y: 0 };
		const metadata = node.metadata as Record<string, unknown>;

		// Resolve control indicators for Risk Controls mode
		const controlIndicators = isRiskControls
			? resolveControlIndicators(metadata.terrainNodeId as string | undefined)
			: [];

		// Activity mode: dim non-gateway nodes
		const isGateway = node.type === "bpmn_gateway";
		const dimmed = isActivity && !isGateway && node.type !== "bpmn_event";

		return {
			id: node.id,
			type: node.type,
			position: pos,
			selected: node.id === nav.selectedNodeId,
			data: {
				kernelNode: node,
				label: node.label,
				dimmed,
				highlighted: false,
				selected: node.id === nav.selectedNodeId,
				providerBadges: [],
				eventKind: metadata.eventKind as string | undefined,
				gatewayKind: metadata.gatewayKind as string | undefined,
				controlIndicators,
			},
		};
	});
}

function buildBpmnEdges(nav: NavigationContext) {
	const canvasMode = nav.activeCanvasMode ?? "operational";
	const isActivity = canvasMode === "activity";

	return seedBpmnEdges.map((edge) => {
		const isBranch = edge.type === "yes_branch" || edge.type === "no_branch";

		return {
			id: edge.id,
			source: edge.sourceNodeId,
			target: edge.targetNodeId,
			type: "default",
			label: edge.label ?? undefined,
			style: isBranch
				? { stroke: edge.type === "yes_branch" ? "#10b981" : "#ef4444", strokeWidth: 2 }
				: undefined,
			animated: isActivity && isBranch,
			data: {
				kernelEdge: edge,
				dimmed: false,
				label: edge.label ?? "",
			},
		};
	});
}

function resolveControlIndicators(terrainNodeId: string | undefined) {
	if (!terrainNodeId) return [];

	// Find process stages that include this terrain node
	const stageIds = seedProcessStages
		.filter((ps) => ps.nodeIds.includes(terrainNodeId))
		.map((ps) => ps.id);

	// Find control points for those stages
	return seedControlPoints
		.filter((cp) => stageIds.includes(cp.processStageId))
		.map((cp) => ({
			controlPointId: cp.id,
			label: cp.label,
			severity: cp.severity,
			status: cp.status,
		}));
}
