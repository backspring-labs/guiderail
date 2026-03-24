import type { Journey, Step } from "@guiderail/core/entities";

const STEP_SPACING_X = 280;
const STEP_WIDTH = 220;
const STEP_HEIGHT = 120;
const STEP_START_X = 40;
const STEP_START_Y = 60;
const JOURNEY_PICKER_SPACING = 200;

interface JourneyNode {
	id: string;
	type: string;
	position: { x: number; y: number };
	draggable: boolean;
	data: Record<string, unknown>;
}

export interface JourneyLayoutResult {
	nodes: JourneyNode[];
	edges: Array<{
		id: string;
		source: string;
		target: string;
		type: string;
	}>;
}

/**
 * Layout for an active journey: steps as horizontal nodes with flow arrows.
 */
export function computeJourneyLayout(
	journey: Journey,
	steps: Step[],
	valueStreamLabel: string | null,
): JourneyLayoutResult {
	const sortedSteps = [...steps]
		.filter((s) => s.journeyId === journey.id)
		.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

	const nodes: JourneyNode[] = sortedSteps.map((step, index) => ({
		id: `journey-step-${step.id}`,
		type: "journey_step",
		position: { x: STEP_START_X + index * STEP_SPACING_X, y: STEP_START_Y },
		draggable: false,
		data: {
			stepId: step.id,
			title: step.title,
			actor: step.actor,
			expectedAction: step.expectedAction,
			narrative: step.narrative,
			capabilityId: step.capabilityId,
			sequenceNumber: step.sequenceNumber,
			isFirst: index === 0,
			isLast: index === sortedSteps.length - 1,
			journeyLabel: journey.label,
			valueStreamLabel,
		},
	}));

	const edges = sortedSteps.slice(0, -1).map((step, index) => ({
		id: `journey-edge-${step.id}`,
		source: `journey-step-${step.id}`,
		target: `journey-step-${sortedSteps[index + 1]?.id}`,
		type: "default",
	}));

	return { nodes, edges };
}

/**
 * Layout for journey selection: available journeys as clickable cards.
 */
export function computeJourneyPickerLayout(journeys: Journey[]): JourneyLayoutResult {
	const nodes: JourneyNode[] = journeys.map((journey, index) => ({
		id: `journey-pick-${journey.id}`,
		type: "journey_picker",
		position: { x: STEP_START_X, y: STEP_START_Y + index * JOURNEY_PICKER_SPACING },
		draggable: false,
		data: {
			journeyId: journey.id,
			label: journey.label,
			description: journey.description,
			stepCount: journey.stepIds.length,
		},
	}));

	return { nodes, edges: [] };
}
