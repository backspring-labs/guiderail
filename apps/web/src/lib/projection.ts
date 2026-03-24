import { seedNodes, seedPerspectives, seedProcessStages, seedSteps } from "@/store/seed-loader.js";
import type { NavigationContext } from "@guiderail/core/context";
import type { Capability, Domain, ProcessStage } from "@guiderail/core/entities";
import type { TerrainGraph } from "@guiderail/core/graph";
import { getCapabilitiesForDomain } from "@guiderail/core/graph";

/**
 * Determine which node IDs should be visible given current navigation state.
 *
 * Priority:
 * 1. Active process on Process perspective — show only process stage nodes
 * 2. Capability selected — show only that capability's nodes
 * 3. Domain selected — show all nodes from that domain's capabilities
 * 4. Nothing selected — all nodes visible
 */
export function getVisibleNodeIds(
	nav: NavigationContext,
	graph: TerrainGraph,
	domains: Domain[],
	capabilities: Capability[],
): Set<string> {
	return (
		resolveSystemScope(nav) ??
		resolveProcessScope(nav) ??
		resolveCapabilityScope(nav, capabilities) ??
		resolveDomainScope(nav, capabilities) ??
		allNodeIds(graph)
	);
}

/**
 * System perspective: scope to nodes participating in the current process or journey.
 * Falls back to all nodes if no process or journey is active (graceful degradation).
 */
function resolveSystemScope(nav: NavigationContext): Set<string> | null {
	const perspective = seedPerspectives.find((p) => p.id === nav.activePerspectiveId);
	if (perspective?.type !== "system") return null;

	let parentNodes: Set<string> | null = null;

	// Scope to process stage nodes if a process is active
	if (nav.activeProcessId) {
		const stageNodes = getProcessStageNodeIds(nav.activeProcessId);
		if (stageNodes.size > 0) parentNodes = stageNodes;
	}

	// Scope to journey step focus target nodes if a journey is active
	if (!parentNodes && nav.activeJourneyId) {
		const journeyNodes = getJourneyNodeIds(nav.activeJourneyId);
		if (journeyNodes.size > 0) parentNodes = journeyNodes;
	}

	if (!parentNodes) return null;

	// Expand to include child components of participating systems
	return expandWithChildComponents(parentNodes);
}

/**
 * Expand a set of node IDs to include any child components (nodes with parentNodeId in the set).
 */
function expandWithChildComponents(nodeIds: Set<string>): Set<string> {
	const expanded = new Set(nodeIds);
	for (const node of seedNodes) {
		if (node.parentNodeId && nodeIds.has(node.parentNodeId)) {
			expanded.add(node.id);
		}
	}
	return expanded;
}

function resolveProcessScope(nav: NavigationContext): Set<string> | null {
	if (!nav.activeProcessId) return null;
	const perspective = seedPerspectives.find((p) => p.id === nav.activePerspectiveId);
	if (perspective?.type !== "process") return null;
	const stageNodes = getProcessStageNodeIds(nav.activeProcessId);
	return stageNodes.size > 0 ? stageNodes : null;
}

function resolveCapabilityScope(
	nav: NavigationContext,
	capabilities: Capability[],
): Set<string> | null {
	if (!nav.activeCapabilityId) return null;
	const cap = capabilities.find((c) => c.id === nav.activeCapabilityId);
	return cap ? new Set(cap.nodeIds) : null;
}

function resolveDomainScope(
	nav: NavigationContext,
	capabilities: Capability[],
): Set<string> | null {
	if (!nav.activeDomainId) return null;
	const domainCaps = getCapabilitiesForDomain(nav.activeDomainId, capabilities);
	const nodeIds = new Set<string>();
	for (const cap of domainCaps) {
		for (const nodeId of cap.nodeIds) {
			nodeIds.add(nodeId);
		}
	}
	return nodeIds.size > 0 ? nodeIds : null;
}

function allNodeIds(graph: TerrainGraph): Set<string> {
	return new Set(graph.nodes.keys());
}

/**
 * Determine which edge IDs should be visible.
 * An edge is visible only if both its endpoints are in the visible node set.
 */
export function getVisibleEdgeIds(graph: TerrainGraph, visibleNodeIds: Set<string>): Set<string> {
	const edgeIds = new Set<string>();
	for (const [id, edge] of graph.edges) {
		if (visibleNodeIds.has(edge.sourceNodeId) && visibleNodeIds.has(edge.targetNodeId)) {
			edgeIds.add(id);
		}
	}
	return edgeIds;
}

/**
 * Get the set of node IDs that should be highlighted (focus targets).
 */
export function getHighlightedNodeIds(nav: NavigationContext): Set<string> {
	const ids = new Set<string>();
	for (const ft of nav.activeFocusTargets) {
		if (ft.type === "node") {
			ids.add(ft.targetId);
		}
	}
	return ids;
}

/**
 * Get the set of edge IDs that should be highlighted (focus targets).
 */
export function getHighlightedEdgeIds(nav: NavigationContext): Set<string> {
	const ids = new Set<string>();
	for (const ft of nav.activeFocusTargets) {
		if (ft.type === "edge") {
			ids.add(ft.targetId);
		}
	}
	return ids;
}

/**
 * Get node IDs from a process's stages.
 * Used to scope visibility when Process perspective is active with an active process.
 */
/**
 * Get node IDs from a journey's step focus targets.
 * Used to scope System perspective to participating nodes.
 */
function getJourneyNodeIds(journeyId: string): Set<string> {
	const nodeIds = new Set<string>();
	const steps = seedSteps.filter((s) => s.journeyId === journeyId);
	for (const step of steps) {
		for (const ft of step.focusTargets) {
			if (ft.type === "node") {
				nodeIds.add(ft.targetId);
			}
		}
	}
	return nodeIds;
}

function getProcessStageNodeIds(processId: string): Set<string> {
	const nodeIds = new Set<string>();
	const stages = seedProcessStages.filter((s) => s.processId === processId);
	for (const stage of stages) {
		for (const nodeId of stage.nodeIds) {
			nodeIds.add(nodeId);
		}
	}
	return nodeIds;
}
