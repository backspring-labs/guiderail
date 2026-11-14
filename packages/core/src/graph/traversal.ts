import type { Edge } from "../entities/edge.js";
import type { Node } from "../entities/node.js";
import type { TerrainGraph } from "./graph.js";

type Direction = "in" | "out" | "both";

function getNeighborId(edge: Edge, nodeId: string, direction: Direction): string | undefined {
	if (direction !== "in" && edge.sourceNodeId === nodeId) {
		return edge.targetNodeId;
	}
	if (direction !== "out" && edge.targetNodeId === nodeId) {
		return edge.sourceNodeId;
	}
	return undefined;
}

/**
 * Ids adjacent to `nodeId` in edge insertion order, each at most once.
 * Skips ids already visited and endpoints that are not nodes in the graph.
 */
function collectNeighborIds(
	graph: TerrainGraph,
	nodeId: string,
	direction: Direction,
	visited: ReadonlySet<string>,
): string[] {
	const neighbors = new Set<string>();
	for (const edge of graph.edges.values()) {
		const neighborId = getNeighborId(edge, nodeId, direction);
		if (neighborId != null && !visited.has(neighborId) && graph.nodes.has(neighborId)) {
			neighbors.add(neighborId);
		}
	}
	return [...neighbors];
}

/**
 * Breadth-first traversal from a starting node.
 *
 * Contract:
 * - Returns the start node first, then every reachable node in breadth-first
 *   order. Within one depth level, nodes appear in edge insertion order.
 * - Each node appears exactly once, however many edges or paths lead to it
 *   (parallel edges, cycles and self-loops included).
 * - `maxDepth` bounds the distance from the start: 0 returns only the start
 *   node. Omitted means unbounded.
 * - `direction` follows edges as stored: "out" from source to target, "in"
 *   from target to source, "both" either way.
 * - Dangling references are ignored: an edge endpoint that is not a node in
 *   the graph is neither returned nor traversed through, and an unknown start
 *   id returns an empty array.
 */
export function bfsTraverse(
	graph: TerrainGraph,
	startNodeId: string,
	options: { maxDepth?: number; direction?: Direction } = {},
): Node[] {
	const { maxDepth, direction = "both" } = options;
	const start = graph.nodes.get(startNodeId);
	if (!start) return [];

	const visited = new Set<string>([startNodeId]);
	const result: Node[] = [];
	const queue: Array<{ node: Node; depth: number }> = [{ node: start, depth: 0 }];

	while (queue.length > 0) {
		const current = queue.shift();
		if (!current) break;
		result.push(current.node);

		if (maxDepth != null && current.depth >= maxDepth) {
			continue;
		}

		for (const neighborId of collectNeighborIds(graph, current.node.id, direction, visited)) {
			const neighbor = graph.nodes.get(neighborId);
			if (!neighbor) continue;
			visited.add(neighborId);
			queue.push({ node: neighbor, depth: current.depth + 1 });
		}
	}

	return result;
}
