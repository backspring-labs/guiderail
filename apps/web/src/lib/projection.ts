import { seedPerspectives, seedProcessStages } from "@/store/seed-loader.js";
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
		resolveProcessScope(nav) ??
		resolveCapabilityScope(nav, capabilities) ??
		resolveDomainScope(nav, capabilities) ??
		allNodeIds(graph)
	);
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
