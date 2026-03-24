interface JourneyStepNodeData {
	stepId: string;
	title: string;
	actor?: string;
	expectedAction?: string;
	narrative?: string;
	capabilityId?: string;
	sequenceNumber: number;
	isFirst: boolean;
	isLast: boolean;
	journeyLabel: string;
	valueStreamLabel: string | null;
	[key: string]: unknown;
}

interface JourneyStepNodeProps {
	data: JourneyStepNodeData;
	selected?: boolean;
}

export function JourneyStepNode({ data, selected }: JourneyStepNodeProps) {
	const selectedClass = selected ? "journey-step--selected" : "";
	const actorClass = data.actor === "Customer" ? "journey-step--customer" : "journey-step--system";

	return (
		<div className={`journey-step ${actorClass} ${selectedClass}`}>
			<div className="journey-step__seq">{data.sequenceNumber + 1}</div>
			<div className="journey-step__title">{data.title}</div>
			{data.actor && <div className="journey-step__actor">{data.actor}</div>}
			{data.expectedAction && <div className="journey-step__action">{data.expectedAction}</div>}
		</div>
	);
}
