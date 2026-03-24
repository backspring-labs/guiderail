import type { TerrainNodeData } from "@/lib/react-flow-adapter.js";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { ProviderBadges } from "./ProviderBadges.js";

export function ServiceNode({ data, selected }: NodeProps) {
	const nodeData = data as TerrainNodeData;
	const dimmed = nodeData.dimmed;
	const highlighted = (data as Record<string, unknown>).highlighted === true;
	const extra = data as Record<string, unknown>;
	const deploymentRuntime = extra.deploymentRuntime as string | undefined;
	const deploymentTier = extra.deploymentTier as string | undefined;
	const isComponent = extra.isComponent === true;
	const parentLabel = extra.parentLabel as string | undefined;

	return (
		<div
			className={`terrain-node terrain-node--service ${highlighted ? "terrain-node--highlighted" : ""} ${isComponent ? "terrain-node--component" : ""}`}
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
			{isComponent && parentLabel && (
				<div className="terrain-node__parent-label">{parentLabel}</div>
			)}
			<div className="terrain-node__content">
				<div className="terrain-node__icon">{isComponent ? "◇" : "⚙"}</div>
				<div className="terrain-node__label">{nodeData.kernelNode.label}</div>
			</div>
			{deploymentRuntime && (
				<div className="terrain-node__deployment">
					<span className="terrain-node__deploy-runtime">{deploymentRuntime}</span>
					{deploymentTier && <span className="terrain-node__deploy-tier">{deploymentTier}</span>}
				</div>
			)}
			<ProviderBadges badges={nodeData.providerBadges} />
			<Handle type="target" position={Position.Left} />
			<Handle type="source" position={Position.Right} />
		</div>
	);
}
