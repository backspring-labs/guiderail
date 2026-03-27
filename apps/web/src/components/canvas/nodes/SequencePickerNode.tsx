interface SequencePickerNodeData {
	sequenceId: string;
	label: string;
	description?: string;
	interfaceCount: number;
	messageCount: number;
	[key: string]: unknown;
}

export function SequencePickerNode({ data }: { data: SequencePickerNodeData }) {
	const handleExpand = (e: React.MouseEvent) => {
		e.stopPropagation();
		window.dispatchEvent(
			new CustomEvent("guiderail:expand", {
				detail: { type: "sequence", id: data.sequenceId },
			}),
		);
	};

	return (
		<div className="sequence-picker">
			<div className="sequence-picker__header">
				<div className="sequence-picker__label">{data.label}</div>
				<button
					type="button"
					className="sequence-picker__expand"
					title="Open sequence"
					onClick={handleExpand}
				>
					+
				</button>
			</div>
			{data.description && <div className="sequence-picker__description">{data.description}</div>}
			<div className="sequence-picker__meta">
				{data.interfaceCount} interfaces &middot; {data.messageCount} messages
			</div>
		</div>
	);
}
