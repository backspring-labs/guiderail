interface JourneyStepNodeData {
	stepId: string;
	title: string;
	actor?: string;
	expectedAction?: string;
	narrative?: string;
	capabilityId?: string;
	sequenceNumber: number;
	stepType: string;
	journeyLabel: string;
	valueStreamLabel: string | null;
	[key: string]: unknown;
}

interface JourneyStepNodeProps {
	data: JourneyStepNodeData;
	selected?: boolean;
}

const STEP_TYPE_ICONS: Record<string, string> = {
	screen: "S",
	modal: "M",
	error: "!",
	info: "i",
	decision: "?",
	confirmation: "✓",
};

export function JourneyStepNode({ data, selected }: JourneyStepNodeProps) {
	const selectedClass = selected ? "journey-step--selected" : "";
	const actorClass = data.actor === "Customer" ? "journey-step--customer" : "journey-step--system";
	const typeClass = `journey-step--${data.stepType}`;

	return (
		<div className={`journey-step ${actorClass} ${typeClass} ${selectedClass}`}>
			<div className={`journey-step__seq journey-step__seq--${data.stepType}`}>
				{STEP_TYPE_ICONS[data.stepType] ?? data.sequenceNumber + 1}
			</div>
			<div className="journey-step__title">{data.title}</div>
			{data.actor && <div className="journey-step__actor">{data.actor}</div>}
			{data.expectedAction && <div className="journey-step__action">{data.expectedAction}</div>}
		</div>
	);
}
