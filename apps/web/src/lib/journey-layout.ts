import type { Journey, Step } from "@guiderail/core/entities";

const STEP_SPACING_X = 280;
const STEP_START_X = 40;
const STEP_START_Y = 60;
const BRANCH_OFFSET_Y = 180;
const JOURNEY_PICKER_SPACING = 200;

export interface JourneyNode {
	id: string;
	type: string;
	position: { x: number; y: number };
	draggable: boolean;
	data: Record<string, unknown>;
}

interface JourneyEdge {
	id: string;
	source: string;
	target: string;
	type: string;
	label?: string;
	style?: Record<string, unknown>;
}

export interface JourneyLayoutResult {
	nodes: JourneyNode[];
	edges: JourneyEdge[];
}

/**
 * Layout for an active journey: happy path horizontal, error/alternate paths branch below.
 */
export function computeJourneyLayout(
	journey: Journey,
	steps: Step[],
	valueStreamLabel: string | null,
): JourneyLayoutResult {
	const journeySteps = steps.filter((s) => s.journeyId === journey.id);
	const stepMap = new Map(journeySteps.map((s) => [s.id, s]));

	// Determine happy path: follow first transition from each step
	const happyPathIds = resolveHappyPath(journeySteps);
	const branchStepIds = journeySteps.filter((s) => !happyPathIds.has(s.id)).map((s) => s.id);

	const nodes: JourneyNode[] = [];
	const edges: JourneyEdge[] = [];

	// Position happy path steps horizontally
	let xIndex = 0;
	for (const stepId of happyPathIds) {
		const step = stepMap.get(stepId);
		if (!step) continue;
		nodes.push(
			buildStepNode(
				step,
				STEP_START_X + xIndex * STEP_SPACING_X,
				STEP_START_Y,
				journey,
				valueStreamLabel,
			),
		);
		xIndex++;
	}

	// Position branch steps below their parent
	for (const stepId of branchStepIds) {
		const step = stepMap.get(stepId);
		if (!step) continue;
		const parentX = findParentX(step.id, journeySteps, happyPathIds, nodes);
		nodes.push(
			buildStepNode(step, parentX, STEP_START_Y + BRANCH_OFFSET_Y, journey, valueStreamLabel),
		);
	}

	// Build edges from transitions
	for (const step of journeySteps) {
		for (const transition of step.transitions) {
			const isErrorPath = !happyPathIds.has(transition.targetStepId) || step.stepType === "error";
			edges.push({
				id: `journey-edge-${step.id}-${transition.targetStepId}`,
				source: `journey-step-${step.id}`,
				target: `journey-step-${transition.targetStepId}`,
				type: "default",
				label: transition.label,
				style: isErrorPath ? { stroke: "#ef4444", strokeDasharray: "6 3" } : undefined,
			});
		}
	}

	return { nodes, edges };
}

/**
 * Resolve the happy path by following the first transition from each step.
 */
function resolveHappyPath(steps: Step[]): Set<string> {
	const sorted = [...steps].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
	if (sorted.length === 0) return new Set();

	const happyPath = new Set<string>();
	const visited = new Set<string>();

	// Start from the step with the lowest sequence number
	let current = sorted[0];
	while (current && !visited.has(current.id)) {
		happyPath.add(current.id);
		visited.add(current.id);

		// Follow the first non-error transition
		const nextTransition = current.transitions.find((t) => {
			const targetStep = sorted.find((s) => s.id === t.targetStepId);
			return targetStep && targetStep.stepType !== "error";
		});

		current = nextTransition ? sorted.find((s) => s.id === nextTransition.targetStepId) : undefined;
	}

	return happyPath;
}

function findParentX(
	stepId: string,
	allSteps: Step[],
	happyPathIds: Set<string>,
	placedNodes: JourneyNode[],
): number {
	// Find the step that transitions to this branch step
	const parent = allSteps.find((s) => s.transitions.some((t) => t.targetStepId === stepId));
	if (parent) {
		const parentNode = placedNodes.find((n) => n.id === `journey-step-${parent.id}`);
		if (parentNode) return parentNode.position.x;
	}
	return STEP_START_X;
}

function buildStepNode(
	step: Step,
	x: number,
	y: number,
	journey: Journey,
	valueStreamLabel: string | null,
): JourneyNode {
	return {
		id: `journey-step-${step.id}`,
		type: "journey_step",
		position: { x, y },
		draggable: false,
		data: {
			stepId: step.id,
			title: step.title,
			actor: step.actor,
			expectedAction: step.expectedAction,
			narrative: step.narrative,
			capabilityId: step.capabilityId,
			sequenceNumber: step.sequenceNumber,
			stepType: step.stepType,
			journeyLabel: journey.label,
			valueStreamLabel,
		},
	};
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
