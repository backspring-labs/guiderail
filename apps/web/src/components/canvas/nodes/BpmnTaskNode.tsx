import { Handle, Position } from "@xyflow/react";
import { ControlPointIndicator } from "./ControlPointIndicator.js";

interface BpmnTaskNodeData {
	label: string;
	dimmed?: boolean;
	highlighted?: boolean;
	selected?: boolean;
	isSubProcess?: boolean;
	controlIndicators?: Array<{
		controlPointId: string;
		label: string;
		severity: string;
		status: string;
	}>;
	[key: string]: unknown;
}

export function BpmnTaskNode({ data }: { data: BpmnTaskNodeData }) {
	const indicators = data.controlIndicators ?? [];

	const handleExpand = () => {
		if (data.isSubProcess) {
			window.dispatchEvent(
				new CustomEvent("guiderail:expand", {
					detail: { type: "subprocess", id: data.subProcessId },
				}),
			);
		}
	};

	return (
		<div
			className={`bpmn-node bpmn-task ${data.dimmed ? "bpmn-node--dimmed" : ""} ${data.highlighted ? "bpmn-node--highlighted" : ""} ${data.selected ? "bpmn-node--selected" : ""} ${data.isSubProcess ? "bpmn-task--subprocess" : ""}`}
		>
			<Handle type="target" position={Position.Left} />
			<div className="bpmn-task__label">{data.label}</div>
			{indicators.length > 0 && (
				<div className="bpmn-task__controls">
					{indicators.map((ind) => (
						<ControlPointIndicator
							key={ind.controlPointId}
							severity={ind.severity}
							label={ind.label}
						/>
					))}
				</div>
			)}
			{data.isSubProcess && (
				<button type="button" className="bpmn-task__subprocess-marker" onClick={handleExpand}>
					+
				</button>
			)}
			<Handle type="source" position={Position.Right} />
		</div>
	);
}
