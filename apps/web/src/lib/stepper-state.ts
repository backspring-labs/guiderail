import {
	seedMessages,
	seedOrientationItems,
	seedProcessStages,
	seedSequences,
	seedSteps,
} from "@/store/seed-loader.js";
import type { NavigationContext } from "@guiderail/core/context";

export interface StepperState {
	currentIndex: number;
	totalItems: number;
	itemLabel: string;
}

type StepperNav = Pick<
	NavigationContext,
	| "activeOrientationIndex"
	| "activeJourneyId"
	| "activeStepIndex"
	| "activeProcessId"
	| "activeStageIndex"
	| "activeSequenceId"
	| "activeMessageIndex"
>;

function countJourneySteps(journeyId: string): number {
	return seedSteps.filter((s) => s.journeyId === journeyId).length;
}

function countProcessStages(processId: string): number {
	return seedProcessStages.filter((s) => s.processId === processId).length;
}

function countSequenceMessages(sequenceId: string): number {
	const seq = seedSequences.find((s) => s.id === sequenceId);
	return seq ? seedMessages.filter((m) => seq.messageIds.includes(m.id)).length : 0;
}

function deriveOrientationStepper(nav: StepperNav): StepperState | null {
	if (seedOrientationItems.length === 0) return null;
	return {
		currentIndex: nav.activeOrientationIndex ?? 0,
		totalItems: seedOrientationItems.length,
		itemLabel: "Item",
	};
}

function deriveJourneyStepper(nav: StepperNav): StepperState | null {
	if (!nav.activeJourneyId) return null;
	const total = countJourneySteps(nav.activeJourneyId);
	return total > 0
		? { currentIndex: nav.activeStepIndex ?? 0, totalItems: total, itemLabel: "Step" }
		: null;
}

function deriveProcessStepper(nav: StepperNav): StepperState | null {
	if (!nav.activeProcessId) return null;
	const total = countProcessStages(nav.activeProcessId);
	return total > 0
		? { currentIndex: nav.activeStageIndex ?? 0, totalItems: total, itemLabel: "Stage" }
		: null;
}

function deriveSequenceStepper(nav: StepperNav): StepperState | null {
	if (!nav.activeSequenceId) return null;
	const total = countSequenceMessages(nav.activeSequenceId);
	return total > 0
		? { currentIndex: nav.activeMessageIndex ?? 0, totalItems: total, itemLabel: "Message" }
		: null;
}

const STEPPER_RESOLVERS: Record<string, (nav: StepperNav) => StepperState | null> = {
	orientation: deriveOrientationStepper,
	journey: deriveJourneyStepper,
	process: deriveProcessStepper,
	sequence: deriveSequenceStepper,
};

/**
 * What the stepper transport control shows for the active perspective, or null
 * when that perspective has nothing to step through.
 */
export function deriveStepperState(nav: StepperNav, perspectiveType: string): StepperState | null {
	const resolver = STEPPER_RESOLVERS[perspectiveType];
	return resolver ? resolver(nav) : null;
}
