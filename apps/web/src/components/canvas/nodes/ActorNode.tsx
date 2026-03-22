import type { TerrainNodeData } from "@/lib/react-flow-adapter.js";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { ProviderBadges } from "./ProviderBadges.js";

export function ActorNode({ data, selected }: NodeProps) {
	const nodeData = data as TerrainNodeData;
	const dimmed = nodeData.dimmed;
	const highlighted = (data as Record<string, unknown>).highlighted === true;

	return (
		<div
			className={`terrain-node terrain-node--actor ${highlighted ? "terrain-node--highlighted" : ""}`}
			style={{
				opacity: dimmed ? 0.2 : 1,
				borderColor: highlighted
					? "var(--color-highlighted)"
					: selected
						? "var(--color-selected)"
						: "var(--color-node-actor)",
			}}
			title={nodeData.kernelNode.description}
		>
			<div className="terrain-node__content">
				<div className="terrain-node__icon">&#x1F464;</div>
				<div className="terrain-node__label">{nodeData.kernelNode.label}</div>
			</div>
			<ProviderBadges badges={nodeData.providerBadges} />
			<Handle type="target" position={Position.Left} />
			<Handle type="source" position={Position.Right} />
		</div>
	);
}
