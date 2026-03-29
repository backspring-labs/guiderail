import type { Edge, Node } from "@guiderail/core/entities";

export interface SwimLane {
	label: string;
	y: number;
	height: number;
	width: number;
}

export interface BpmnLayoutResult {
	positions: Map<string, { x: number; y: number }>;
	swimLanes: SwimLane[];
}

const LANE_HEIGHT = 120;
const LANE_HEADER_WIDTH = 140;
const COLUMN_WIDTH = 220;
const NODE_START_X = LANE_HEADER_WIDTH + 40;

/**
 * Compute BPMN swim lane layout for Process perspective.
 * Nodes are placed in columns (by topological order) within their lane row.
 * Lanes stack vertically with no gap — forming one continuous table.
 */
export function computeBpmnLayout(bpmnNodes: Node[], bpmnEdges: Edge[]): BpmnLayoutResult {
	const laneOrder = extractLaneOrder(bpmnNodes);
	const nodesByLane = groupNodesByLane(bpmnNodes, laneOrder);
	const topoOrder = computeTopologicalOrder(bpmnNodes, bpmnEdges);

	// Determine the total number of columns from the max topological order
	let maxColumn = 0;
	for (const order of topoOrder.values()) {
		if (order > maxColumn) maxColumn = order;
	}
	const totalColumns = maxColumn + 1;
	const totalWidth = NODE_START_X + totalColumns * COLUMN_WIDTH;

	const positions = new Map<string, { x: number; y: number }>();
	const swimLanes: SwimLane[] = [];

	let laneY = 0;
	for (const lane of laneOrder) {
		const laneNodes = nodesByLane.get(lane) ?? [];
		laneNodes.sort((a, b) => (topoOrder.get(a.id) ?? 0) - (topoOrder.get(b.id) ?? 0));

		const laneCenterY = laneY + LANE_HEIGHT / 2 - 30; // center nodes vertically in lane
		for (const node of laneNodes) {
			const column = topoOrder.get(node.id) ?? 0;
			const x = NODE_START_X + column * COLUMN_WIDTH;
			positions.set(node.id, { x, y: laneCenterY });
		}

		swimLanes.push({ label: lane, y: laneY, height: LANE_HEIGHT, width: totalWidth });
		laneY += LANE_HEIGHT; // no gap — lanes stack directly
	}

	return { positions, swimLanes };
}

function getSwimLane(node: Node): string | undefined {
	return (node.metadata as Record<string, unknown>).swimLane as string | undefined;
}

function extractLaneOrder(nodes: Node[]): string[] {
	const order: string[] = [];
	for (const node of nodes) {
		const lane = getSwimLane(node);
		if (lane && !order.includes(lane)) {
			order.push(lane);
		}
	}
	return order;
}

function groupNodesByLane(nodes: Node[], laneOrder: string[]): Map<string, Node[]> {
	const groups = new Map<string, Node[]>();
	for (const lane of laneOrder) {
		groups.set(lane, []);
	}
	for (const node of nodes) {
		const lane = getSwimLane(node);
		if (lane) {
			groups.get(lane)?.push(node);
		}
	}
	return groups;
}

function buildAdjacency(
	nodes: Node[],
	edges: Edge[],
): { outgoing: Map<string, string[]>; incomingCount: Map<string, number> } {
	const outgoing = new Map<string, string[]>();
	const incomingCount = new Map<string, number>();

	for (const node of nodes) {
		incomingCount.set(node.id, 0);
	}
	for (const edge of edges) {
		const existing = outgoing.get(edge.sourceNodeId) ?? [];
		existing.push(edge.targetNodeId);
		outgoing.set(edge.sourceNodeId, existing);
		incomingCount.set(edge.targetNodeId, (incomingCount.get(edge.targetNodeId) ?? 0) + 1);
	}

	return { outgoing, incomingCount };
}

function computeTopologicalOrder(nodes: Node[], edges: Edge[]): Map<string, number> {
	const { outgoing, incomingCount } = buildAdjacency(nodes, edges);

	const topoOrder = new Map<string, number>();
	const queue: string[] = [];

	for (const [nodeId, count] of incomingCount) {
		if (count === 0) {
			queue.push(nodeId);
			topoOrder.set(nodeId, 0);
		}
	}

	while (queue.length > 0) {
		const current = queue.shift();
		if (!current) break;
		const currentOrder = topoOrder.get(current) ?? 0;
		for (const next of outgoing.get(current) ?? []) {
			const existingOrder = topoOrder.get(next) ?? 0;
			topoOrder.set(next, Math.max(existingOrder, currentOrder + 1));
			const remaining = (incomingCount.get(next) ?? 1) - 1;
			incomingCount.set(next, remaining);
			if (remaining === 0) {
				queue.push(next);
			}
		}
	}

	return topoOrder;
}
