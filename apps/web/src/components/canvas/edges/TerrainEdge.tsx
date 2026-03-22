import type { TerrainEdgeData } from "@/lib/react-flow-adapter.js";
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";

export function TerrainEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	data,
	selected,
}: EdgeProps) {
	const edgeData = data as TerrainEdgeData | undefined;
	const dimmed = edgeData?.dimmed ?? false;
	const label = edgeData?.kernelEdge.label ?? "";
	const edgeType = edgeData?.kernelEdge.type ?? "";

	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
	});

	const isDependency = edgeType === "dependency";
	const strokeColor = selected ? "var(--color-selected)" : "var(--color-edge-default)";

	return (
		<>
			<BaseEdge
				id={id}
				path={edgePath}
				style={{
					stroke: strokeColor,
					strokeWidth: selected ? 2.5 : 1.5,
					strokeDasharray: isDependency ? "6 3" : undefined,
					opacity: dimmed ? 0.15 : 1,
				}}
			/>
			{label && (
				<EdgeLabelRenderer>
					<div
						className="terrain-edge__label"
						style={{
							position: "absolute",
							transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
							pointerEvents: "all",
							opacity: dimmed ? 0.15 : 0.8,
						}}
					>
						{label}
					</div>
				</EdgeLabelRenderer>
			)}
		</>
	);
}
