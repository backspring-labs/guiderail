import type { Edge, Node } from "@guiderail/core/entities";

interface SwimLane {
	label: string;
	y: number;
	height: number;
}

export interface BpmnLayoutResult {
	positions: Map<string, { x: number; y: number }>;
	swimLanes: SwimLane[];
}

const LANE_HEIGHT = 120;
const LANE_PADDING = 20;
const NODE_SPACING_X = 200;
const LANE_HEADER_WIDTH = 160;
const NODE_WIDTH = 160;
const NODE_HEIGHT = 60;

/**
 * Compute BPMN swim lane layout for Process perspective.
 * Groups nodes into horizontal lanes by swimLane metadata,
 * arranges nodes left-to-right within each lane by topological flow order.
 */
export function computeBpmnLayout(bpmnNodes: Node[], bpmnEdges: Edge[]): BpmnLayoutResult {
	const laneOrder = extractLaneOrder(bpmnNodes);
	const nodesByLane = groupNodesByLane(bpmnNodes, laneOrder);
	const topoOrder = computeTopologicalOrder(bpmnNodes, bpmnEdges);
	return positionNodesInLanes(laneOrder, nodesByLane, topoOrder);
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

function positionNodesInLanes(
	laneOrder: string[],
	nodesByLane: Map<string, Node[]>,
	topoOrder: Map<string, number>,
): BpmnLayoutResult {
	const positions = new Map<string, { x: number; y: number }>();
	const swimLanes: SwimLane[] = [];

	let laneY = LANE_PADDING;
	for (const lane of laneOrder) {
		const laneNodes = nodesByLane.get(lane) ?? [];
		laneNodes.sort((a, b) => (topoOrder.get(a.id) ?? 0) - (topoOrder.get(b.id) ?? 0));

		const laneCenterY = laneY + LANE_HEIGHT / 2 - NODE_HEIGHT / 2;
		for (const node of laneNodes) {
			const order = topoOrder.get(node.id) ?? 0;
			const x = LANE_HEADER_WIDTH + order * (NODE_WIDTH + NODE_SPACING_X);
			positions.set(node.id, { x, y: laneCenterY });
		}

		swimLanes.push({ label: lane, y: laneY, height: LANE_HEIGHT });
		laneY += LANE_HEIGHT + LANE_PADDING;
	}

	return { positions, swimLanes };
}
