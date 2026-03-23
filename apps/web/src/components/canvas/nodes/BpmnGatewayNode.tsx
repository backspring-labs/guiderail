import { Handle, Position } from "@xyflow/react";

interface BpmnGatewayNodeData {
	label: string;
	dimmed?: boolean;
	highlighted?: boolean;
	selected?: boolean;
	gatewayKind?: string;
	[key: string]: unknown;
}

export function BpmnGatewayNode({ data }: { data: BpmnGatewayNodeData }) {
	const kind = data.gatewayKind ?? "exclusive";
	const marker = kind === "parallel" ? "+" : "×";

	return (
		<div
			className={`bpmn-node bpmn-gateway bpmn-gateway--${kind} ${data.dimmed ? "bpmn-node--dimmed" : ""} ${data.highlighted ? "bpmn-node--highlighted" : ""} ${data.selected ? "bpmn-node--selected" : ""}`}
		>
			<Handle type="target" position={Position.Left} />
			<div className="bpmn-gateway__diamond">
				<span className="bpmn-gateway__marker">{marker}</span>
			</div>
			<div className="bpmn-gateway__label">{data.label}</div>
			<Handle type="source" position={Position.Right} />
		</div>
	);
}
