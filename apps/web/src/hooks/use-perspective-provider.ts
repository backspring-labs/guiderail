import { computeBpmnLayout } from "@/lib/bpmn-layout.js";
import { computeElkLayout, getLayoutDirection } from "@/lib/elk-layout.js";
import type { JourneyLayoutResult, JourneyNode } from "@/lib/journey-layout.js";
import { computeJourneyLayout, computeJourneyPickerLayout } from "@/lib/journey-layout.js";
import { computeLandscapeLayout } from "@/lib/landscape-layout.js";
import { computeOrientationLayout } from "@/lib/orientation-layout.js";
import {
	getHighlightedEdgeIds,
	getHighlightedNodeIds,
	getVisibleEdgeIds,
	getVisibleNodeIds,
} from "@/lib/projection.js";
import { toReactFlowEdges, toReactFlowNodes } from "@/lib/react-flow-adapter.js";
import type { SequenceLayoutResult, SequenceNode } from "@/lib/sequence-layout.js";
import { computeSequenceLayout, computeSequencePickerLayout } from "@/lib/sequence-layout.js";
import {
	seedBpmnEdges,
	seedBpmnNodes,
	seedCapabilities,
	seedControlPoints,
	seedDomains,
	seedEdges,
	seedInterfaces,
	seedJourneys,
	seedMessages,
	seedNodes,
	seedOrientationItems,
	seedPerspectives,
	seedProcessStages,
	seedProviderAssociations,
	seedProviders,
	seedSequences,
	seedSteps,
	seedValueStreams,
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
	const isJourneyPerspective = perspectiveType === "journey";
	const isLandscapePerspective = perspectiveType === "landscape";
	const isOrientationPerspective = perspectiveType === "orientation";

	// Compute ELK layout when perspective changes (terrain perspectives only)
	useEffect(() => {
		if (
			!graph ||
			isProcessPerspective ||
			isSequencePerspective ||
			isJourneyPerspective ||
			isLandscapePerspective ||
			isOrientationPerspective
		)
			return;
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
		isJourneyPerspective,
		isLandscapePerspective,
		isOrientationPerspective,
		perspectiveType,
	]);

	// BPMN layout (synchronous, computed once per perspective switch)
	const bpmnLayout = useMemo(() => {
		if (!isProcessPerspective) return null;
		return computeBpmnLayout(seedBpmnNodes, seedBpmnEdges);
	}, [isProcessPerspective]);

	// Sequence layout (synchronous, filtered by active sequence)
	const sequenceLayout = useMemo(() => {
		if (!isSequencePerspective) return null;
		const activeSequence = nav.activeSequenceId
			? seedSequences.find((s) => s.id === nav.activeSequenceId)
			: null;
		if (activeSequence) {
			const filteredInterfaces = seedInterfaces.filter((i) =>
				activeSequence.interfaceIds.includes(i.id),
			);
			const filteredMessages = seedMessages.filter((m) => activeSequence.messageIds.includes(m.id));
			return computeSequenceLayout(filteredInterfaces, filteredMessages);
		}
		const scopedSequences = nav.activeCapabilityId
			? seedSequences.filter((s) => s.capabilityId === nav.activeCapabilityId)
			: seedSequences;
		return computeSequencePickerLayout(scopedSequences);
	}, [isSequencePerspective, nav.activeSequenceId, nav.activeCapabilityId]);

	// Journey layout (synchronous)
	const journeyLayout = useMemo(() => {
		if (!isJourneyPerspective) return null;
		if (nav.activeJourneyId) {
			const journey = seedJourneys.find((j) => j.id === nav.activeJourneyId);
			if (journey) {
				const vs = seedValueStreams.find((v) => v.journeyIds?.includes(journey.id));
				return computeJourneyLayout(journey, seedSteps, vs?.label ?? null);
			}
		}
		return computeJourneyPickerLayout(seedJourneys);
	}, [isJourneyPerspective, nav.activeJourneyId]);

	// Orientation layout (synchronous)
	const orientationLayout = useMemo(() => {
		if (!isOrientationPerspective) return null;
		return computeOrientationLayout(seedOrientationItems);
	}, [isOrientationPerspective]);

	// Landscape layout (synchronous)
	const landscapeLayout = useMemo(() => {
		if (!isLandscapePerspective) return null;
		const actors = seedNodes.filter((n) => n.type === "actor");
		return computeLandscapeLayout(
			seedDomains,
			seedCapabilities,
			actors,
			seedProviders,
			seedProviderAssociations,
		);
	}, [isLandscapePerspective]);

	const rfNodes = useMemo(
		() =>
			resolveNodes(nav, graph, elkPositions, {
				isOrientationPerspective,
				orientationLayout,
				isProcessPerspective,
				bpmnLayout,
				isSequencePerspective,
				sequenceLayout,
				isJourneyPerspective,
				journeyLayout,
				isLandscapePerspective,
				landscapeLayout,
			}),
		[
			nav,
			graph,
			elkPositions,
			isProcessPerspective,
			bpmnLayout,
			isSequencePerspective,
			sequenceLayout,
			isJourneyPerspective,
			journeyLayout,
			isOrientationPerspective,
			orientationLayout,
			isLandscapePerspective,
			landscapeLayout,
		],
	);

	const rfEdges = useMemo(
		() =>
			resolveEdges(nav, graph, {
				isOrientationPerspective,
				isProcessPerspective,
				isSequencePerspective,
				isLandscapePerspective,
				isJourneyPerspective,
				journeyLayout,
			}),
		[
			nav,
			graph,
			isOrientationPerspective,
			isProcessPerspective,
			isSequencePerspective,
			isJourneyPerspective,
			isLandscapePerspective,
			journeyLayout,
		],
	);

	const swimLanes = isProcessPerspective ? (bpmnLayout?.swimLanes ?? []) : [];

	return { rfNodes, rfEdges, layoutLoading, swimLanes };
}

function buildLandscapeNodes(
	nav: NavigationContext,
	nodes: Array<{
		id: string;
		type: string;
		position: { x: number; y: number };
		draggable: boolean;
		data: Record<string, unknown>;
	}>,
) {
	const isProviderMode = nav.activeCanvasMode === "providers";
	return nodes.map((node) => {
		if (node.type === "landscape_domain") {
			const domainId = node.data.domainId as string;
			const isActive =
				domainId === nav.activeDomainId ||
				seedCapabilities.some((c) => c.id === nav.activeCapabilityId && c.domainId === domainId);
			return { ...node, data: { ...node.data, isActive } };
		}
		if (node.type === "landscape_capability") {
			const capId = node.data.capabilityId as string;
			const isActive = capId === nav.activeCapabilityId;
			const providerNames = isProviderMode ? resolveProviderNames(capId) : [];
			return {
				...node,
				data: { ...node.data, isActive, providerNames, showProviders: isProviderMode },
			};
		}
		if (node.type === "landscape_actor") {
			const nodeId = node.data.nodeId as string;
			const isActive = nodeId === nav.selectedNodeId;
			return { ...node, data: { ...node.data, isActive } };
		}
		return node;
	});
}

function buildTerrainNodes(
	nav: NavigationContext,
	graph: TerrainGraph,
	elkPositions: Map<string, { x: number; y: number }>,
) {
	const visibleNodeIds = getVisibleNodeIds(nav, graph, seedDomains, seedCapabilities);
	const highlightedNodeIds = getHighlightedNodeIds(nav);

	const isDeploymentMode = nav.activeCanvasMode === "deployment";
	const nodesWithPositions = toReactFlowNodes(seedNodes, nav.activePerspectiveId, {
		visibleNodeIds,
		selectedNodeId: nav.selectedNodeId,
		highlightedNodeIds,
		providers: seedProviders,
		providerAssociations: seedProviderAssociations,
	});

	return nodesWithPositions.map((rfNode) => {
		// Mark component nodes (nodes with parentNodeId)
		let node = rfNode;
		const parentNodeId = rfNode.data.kernelNode?.parentNodeId;
		if (parentNodeId) {
			const parentNode = seedNodes.find((n) => n.id === parentNodeId);
			node = {
				...node,
				data: {
					...node.data,
					isComponent: true,
					parentLabel: parentNode?.label,
				},
			};
		}
		// Add deployment metadata to node data when in Deployment mode
		if (isDeploymentMode) {
			const metadata = (rfNode.data.kernelNode?.metadata ?? {}) as Record<string, unknown>;
			const deployment = metadata.deployment as Record<string, string> | undefined;
			if (deployment) {
				node = {
					...rfNode,
					data: {
						...rfNode.data,
						deploymentTier: deployment.tier,
						deploymentRuntime: deployment.runtime,
						deploymentRegion: deployment.region,
					},
				};
			}
		}
		if (node.position.x !== 0 || node.position.y !== 0) return node;
		const elkPos = elkPositions.get(node.id);
		return elkPos ? { ...node, position: elkPos } : node;
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

function buildOrientationNodes(
	nav: NavigationContext,
	nodes: Array<{
		id: string;
		type: string;
		position: { x: number; y: number };
		draggable: boolean;
		data: { sequenceNumber: number; [key: string]: unknown };
	}>,
) {
	const activeIdx = nav.activeOrientationIndex;
	return nodes.map((node) => {
		const isActive = activeIdx != null && node.data.sequenceNumber === activeIdx;
		return { ...node, data: { ...node.data, isActive } };
	});
}

function resolveNodes(
	nav: NavigationContext,
	graph: TerrainGraph | null,
	elkPositions: Map<string, { x: number; y: number }>,
	ctx: {
		isOrientationPerspective: boolean;
		orientationLayout: ReturnType<typeof computeOrientationLayout> | null;
		isProcessPerspective: boolean;
		bpmnLayout: ReturnType<typeof computeBpmnLayout> | null;
		isSequencePerspective: boolean;
		sequenceLayout: SequenceLayoutResult | null;
		isJourneyPerspective: boolean;
		journeyLayout: JourneyLayoutResult | null;
		isLandscapePerspective: boolean;
		landscapeLayout: ReturnType<typeof computeLandscapeLayout> | null;
	},
): unknown[] {
	if (!graph) return [];
	if (ctx.isOrientationPerspective && ctx.orientationLayout) {
		return buildOrientationNodes(nav, ctx.orientationLayout.nodes);
	}
	if (ctx.isProcessPerspective && ctx.bpmnLayout) {
		return buildBpmnNodes(nav, ctx.bpmnLayout.positions);
	}
	if (ctx.isSequencePerspective && ctx.sequenceLayout) {
		return buildSequenceNodes(nav, ctx.sequenceLayout.nodes);
	}
	if (ctx.isJourneyPerspective && ctx.journeyLayout) {
		return buildJourneyNodes(nav, ctx.journeyLayout.nodes);
	}
	if (ctx.isLandscapePerspective && ctx.landscapeLayout) {
		return buildLandscapeNodes(nav, ctx.landscapeLayout.nodes);
	}
	return buildTerrainNodes(nav, graph, elkPositions);
}

function resolveEdges(
	nav: NavigationContext,
	graph: TerrainGraph | null,
	ctx: {
		isOrientationPerspective: boolean;
		isProcessPerspective: boolean;
		isSequencePerspective: boolean;
		isLandscapePerspective: boolean;
		isJourneyPerspective: boolean;
		journeyLayout: JourneyLayoutResult | null;
	},
): unknown[] {
	if (!graph) return [];
	if (ctx.isOrientationPerspective) return [];
	if (ctx.isProcessPerspective) return buildBpmnEdges(nav);
	if (ctx.isSequencePerspective) return [];
	if (ctx.isLandscapePerspective) return [];
	if (ctx.isJourneyPerspective && ctx.journeyLayout) return ctx.journeyLayout.edges;
	return buildTerrainEdges(nav, graph);
}

function buildSequenceNodes(nav: NavigationContext, nodes: SequenceNode[]) {
	const selectedId = nav.selectedNodeId;
	const isLifelineSelected = selectedId?.startsWith("lifeline-") ?? false;
	const activeIdx = nav.activeMessageIndex;
	return nodes.map((node) => {
		const isSelected = node.id === selectedId;
		const isActive =
			node.type === "sequence_message" &&
			activeIdx != null &&
			node.data.sequenceNumber === activeIdx;
		if (node.type === "sequence_message" && isLifelineSelected) {
			return {
				...node,
				selected: isSelected,
				data: { ...node.data, selectedLifelineId: selectedId, isActive },
			};
		}
		return { ...node, selected: isSelected, data: { ...node.data, isActive } };
	});
}

function buildJourneyNodes(nav: NavigationContext, nodes: JourneyNode[]) {
	const activeIdx = nav.activeStepIndex;
	return nodes.map((node) => {
		const isActive =
			node.type === "journey_step" && activeIdx != null && node.data.sequenceNumber === activeIdx;
		return { ...node, data: { ...node.data, isActive } };
	});
}

function resolveProviderNames(capabilityId: string): string[] {
	const associations = seedProviderAssociations.filter(
		(pa) => pa.targetType === "capability" && pa.targetId === capabilityId,
	);
	return associations
		.map((a) => seedProviders.find((p) => p.id === a.providerId)?.label)
		.filter((label): label is string => label != null);
}
