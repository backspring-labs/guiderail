interface SequenceMessageNodeData {
	label: string;
	messageType: string;
	sequenceNumber: number;
	description?: string;
	payloadSummary?: string;
	width: number;
	isReverse: boolean;
	sourceLifelineId?: string;
	targetLifelineId?: string;
	selectedLifelineId?: string;
	[key: string]: unknown;
}

interface SequenceMessageNodeProps {
	data: SequenceMessageNodeData;
	selected?: boolean;
}

export function SequenceMessageNode({ data, selected }: SequenceMessageNodeProps) {
	const isResponse = data.messageType === "response";
	const isEvent = data.messageType === "event";

	// Highlight circle if this message originates from the selected lifeline
	const originatesFromSelected =
		data.selectedLifelineId != null && data.sourceLifelineId === data.selectedLifelineId;

	const baseColor = isEvent ? "#8b5cf6" : "#94a3b8";
	const activeColor = selected ? "var(--color-selected, #3b82f6)" : baseColor;
	const lineStyle = isResponse ? "sequence-message--dashed" : "";
	const arrowDirection = data.isReverse ? "sequence-message--reverse" : "";
	const selectedClass = selected ? "sequence-message--selected" : "";
	const arrowStyle = data.isReverse
		? { borderRightColor: activeColor }
		: { borderLeftColor: activeColor };

	const seqClass = selected
		? "sequence-message__seq--selected"
		: originatesFromSelected
			? "sequence-message__seq--lifeline-highlight"
			: "";

	return (
		<div
			className={`sequence-message ${lineStyle} ${arrowDirection} ${selectedClass}`}
			style={{ width: data.width, cursor: "pointer" }}
		>
			<div className="sequence-message__line" style={{ borderColor: activeColor }} />
			<div className="sequence-message__arrow" style={arrowStyle} />
			<div className={`sequence-message__seq ${seqClass}`}>{data.sequenceNumber + 1}</div>
			<div
				className={`sequence-message__label ${selected ? "sequence-message__label--selected" : ""}`}
			>
				{data.label}
			</div>
		</div>
	);
}
