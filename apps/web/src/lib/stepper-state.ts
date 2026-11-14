import {
	orderedMessagesOf,
	orderedOrientationItems,
	orderedStagesOf,
	orderedStepsOf,
} from "@/lib/ordered-groups.js";
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

function deriveOrientationStepper(nav: StepperNav): StepperState | null {
	if (orderedOrientationItems.length === 0) return null;
	return {
		currentIndex: nav.activeOrientationIndex ?? 0,
		totalItems: orderedOrientationItems.length,
		itemLabel: "Item",
	};
}

function deriveJourneyStepper(nav: StepperNav): StepperState | null {
	if (!nav.activeJourneyId) return null;
	const total = orderedStepsOf(nav.activeJourneyId).length;
	return total > 0
		? { currentIndex: nav.activeStepIndex ?? 0, totalItems: total, itemLabel: "Step" }
		: null;
}

function deriveProcessStepper(nav: StepperNav): StepperState | null {
	if (!nav.activeProcessId) return null;
	const total = orderedStagesOf(nav.activeProcessId).length;
	return total > 0
		? { currentIndex: nav.activeStageIndex ?? 0, totalItems: total, itemLabel: "Stage" }
		: null;
}

function deriveSequenceStepper(nav: StepperNav): StepperState | null {
	if (!nav.activeSequenceId) return null;
	const total = orderedMessagesOf(nav.activeSequenceId).length;
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
