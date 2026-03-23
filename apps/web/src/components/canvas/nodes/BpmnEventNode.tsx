import { Handle, Position } from "@xyflow/react";

interface BpmnEventNodeData {
	label: string;
	dimmed?: boolean;
	highlighted?: boolean;
	selected?: boolean;
	eventKind?: string;
	[key: string]: unknown;
}

export function BpmnEventNode({ data }: { data: BpmnEventNodeData }) {
	const kind = data.eventKind ?? "start";

	return (
		<div
			className={`bpmn-node bpmn-event bpmn-event--${kind} ${data.dimmed ? "bpmn-node--dimmed" : ""} ${data.highlighted ? "bpmn-node--highlighted" : ""} ${data.selected ? "bpmn-node--selected" : ""}`}
		>
			{kind !== "start" && <Handle type="target" position={Position.Left} />}
			<div className="bpmn-event__label">{data.label}</div>
			{kind !== "end" && <Handle type="source" position={Position.Right} />}
		</div>
	);
}
