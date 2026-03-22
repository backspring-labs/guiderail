import type { TerrainNodeData } from "@/lib/react-flow-adapter.js";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { ProviderBadges } from "./ProviderBadges.js";

export function ServiceNode({ data, selected }: NodeProps) {
	const nodeData = data as TerrainNodeData;
	const dimmed = nodeData.dimmed;
	const highlighted = (data as Record<string, unknown>).highlighted === true;

	return (
		<div
			className={`terrain-node terrain-node--service ${highlighted ? "terrain-node--highlighted" : ""}`}
			style={{
				opacity: dimmed ? 0.2 : 1,
				borderColor: highlighted
					? "var(--color-highlighted)"
					: selected
						? "var(--color-selected)"
						: "var(--color-node-service)",
			}}
			title={nodeData.kernelNode.description}
		>
			<div className="terrain-node__content">
				<div className="terrain-node__icon">&#x2699;</div>
				<div className="terrain-node__label">{nodeData.kernelNode.label}</div>
			</div>
			<ProviderBadges badges={nodeData.providerBadges} />
			<Handle type="target" position={Position.Left} />
			<Handle type="source" position={Position.Right} />
		</div>
	);
}
