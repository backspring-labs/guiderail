import type { Node as ReactFlowNode } from "@xyflow/react";
type ElkInstance = InstanceType<typeof import("elkjs/lib/elk.bundled.js").default>;

/*
 * ELK is about half of the app's JavaScript and is only needed to lay out the
 * Architecture and System canvases. It is loaded the first time a layout is
 * asked for, not at start-up. See docs/performance.md.
 */
let elkLoading: Promise<ElkInstance> | null = null;

function loadElk(): Promise<ElkInstance> {
	elkLoading ??= import("elkjs/lib/elk.bundled.js")
		.then((module) => new module.default())
		.catch((error) => {
			// Do not cache a failed load: a retry must be able to try again.
			elkLoading = null;
			throw error;
		});
	return elkLoading;
}

export type LayoutDirection = "DOWN" | "RIGHT";

interface LayoutOptions {
	direction: LayoutDirection;
	nodeWidth?: number;
	nodeHeight?: number;
	spacing?: number;
}

const DEFAULT_NODE_WIDTH = 200;
const DEFAULT_NODE_HEIGHT = 80;
const DEFAULT_SPACING = 80;

/**
 * Compute positions for React Flow nodes using ELK.js auto-layout.
 * Returns a map of nodeId → { x, y } positions.
 */
export async function computeElkLayout(
	nodes: ReactFlowNode[],
	edges: Array<{ id: string; source: string; target: string }>,
	options: LayoutOptions,
): Promise<Map<string, { x: number; y: number }>> {
	const {
		direction,
		nodeWidth = DEFAULT_NODE_WIDTH,
		nodeHeight = DEFAULT_NODE_HEIGHT,
		spacing = DEFAULT_SPACING,
	} = options;

	const elkGraph = {
		id: "root",
		layoutOptions: {
			"elk.algorithm": "layered",
			"elk.direction": direction,
			"elk.spacing.nodeNode": String(spacing),
			"elk.layered.spacing.nodeNodeBetweenLayers": String(spacing * 1.5),
			"elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
		},
		children: nodes.map((node) => ({
			id: node.id,
			width: nodeWidth,
			height: nodeHeight,
		})),
		edges: edges.map((edge) => ({
			id: edge.id,
			sources: [edge.source],
			targets: [edge.target],
		})),
	};

	const elk = await loadElk();
	const layoutResult = await elk.layout(elkGraph);

	const positions = new Map<string, { x: number; y: number }>();
	for (const child of layoutResult.children ?? []) {
		positions.set(child.id, { x: child.x ?? 0, y: child.y ?? 0 });
	}

	return positions;
}

/**
 * Get the ELK layout direction for a given perspective type.
 */
export function getLayoutDirection(perspectiveType: string): LayoutDirection {
	switch (perspectiveType) {
		case "architecture":
		case "system":
		case "process":
		case "journey":
			return "RIGHT";
		default:
			return "DOWN";
	}
}
