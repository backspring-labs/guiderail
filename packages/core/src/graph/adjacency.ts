import type { Edge } from "../entities/edge.js";

export type Direction = "in" | "out" | "both";

/**
 * The id on the other end of `edge` from `nodeId`, if the edge can be walked
 * from `nodeId` in `direction`. Returns undefined when it cannot, or when the
 * edge does not touch `nodeId`.
 *
 * Directed edges (the default) are followed as stored:
 * - "out" walks from source to target;
 * - "in" walks from target to source;
 * - "both" walks either way.
 *
 * Undirected edges (`directed: false`) join their two ends as peers, so they
 * are walkable from either end whatever `direction` is. Which end was stored as
 * the source carries no meaning for them.
 *
 * Every graph query that follows edges uses this function, so they agree.
 */
export function neighborAcross(
	edge: Edge,
	nodeId: string,
	direction: Direction,
): string | undefined {
	const undirected = edge.directed === false;
	if (edge.sourceNodeId === nodeId && (undirected || direction !== "in")) {
		return edge.targetNodeId;
	}
	if (edge.targetNodeId === nodeId && (undirected || direction !== "out")) {
		return edge.sourceNodeId;
	}
	return undefined;
}
