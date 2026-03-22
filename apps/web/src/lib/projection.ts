import type { NavigationContext } from "@guiderail/core/context";
import type { Capability, Domain, Edge, Node } from "@guiderail/core/entities";
import type { TerrainGraph } from "@guiderail/core/graph";
import { getCapabilitiesForDomain } from "@guiderail/core/graph";

/**
 * Determine which node IDs should be visible given current navigation state.
 * If no domain is selected, all nodes are visible.
 * If a domain is selected, only nodes from that domain's capabilities are visible.
 * If a capability is selected, only that capability's nodes are visible.
 */
export function getVisibleNodeIds(
	nav: NavigationContext,
	graph: TerrainGraph,
	domains: Domain[],
	capabilities: Capability[],
): Set<string> {
	// Capability selected — show only that capability's nodes
	if (nav.activeCapabilityId) {
		const cap = capabilities.find((c) => c.id === nav.activeCapabilityId);
		if (cap) {
			return new Set(cap.nodeIds);
		}
	}

	// Domain selected — show all nodes from that domain's capabilities
	if (nav.activeDomainId) {
		const domainCaps = getCapabilitiesForDomain(nav.activeDomainId, capabilities);
		const nodeIds = new Set<string>();
		for (const cap of domainCaps) {
			for (const nodeId of cap.nodeIds) {
				nodeIds.add(nodeId);
			}
		}
		return nodeIds;
	}

	// Nothing selected — all nodes visible
	const allIds = new Set<string>();
	for (const id of graph.nodes.keys()) {
		allIds.add(id);
	}
	return allIds;
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
