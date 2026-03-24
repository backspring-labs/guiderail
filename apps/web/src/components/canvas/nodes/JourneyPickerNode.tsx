interface JourneyPickerNodeData {
	journeyId: string;
	label: string;
	description?: string;
	stepCount: number;
	[key: string]: unknown;
}

export function JourneyPickerNode({ data }: { data: JourneyPickerNodeData }) {
	const handleExpand = (e: React.MouseEvent) => {
		e.stopPropagation();
		window.dispatchEvent(
			new CustomEvent("guiderail:expand", { detail: { type: "journey", id: data.journeyId } }),
		);
	};

	return (
		<div className="journey-picker">
			<div className="journey-picker__header">
				<div className="journey-picker__label">{data.label}</div>
				<button
					type="button"
					className="journey-picker__expand"
					title="Expand journey"
					onClick={handleExpand}
				>
					+
				</button>
			</div>
			{data.description && <div className="journey-picker__description">{data.description}</div>}
			<div className="journey-picker__meta">{data.stepCount} steps</div>
		</div>
	);
}
