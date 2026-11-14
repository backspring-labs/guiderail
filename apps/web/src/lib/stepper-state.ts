import type { Dataset } from "@/data/dataset.js";
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

type StepperData = Pick<
	Dataset,
	"orientationItems" | "steps" | "processStages" | "sequences" | "messages"
>;

function deriveOrientationStepper(nav: StepperNav, data: StepperData): StepperState | null {
	const total = orderedOrientationItems(data).length;
	if (total === 0) return null;
	return { currentIndex: nav.activeOrientationIndex ?? 0, totalItems: total, itemLabel: "Item" };
}

function deriveJourneyStepper(nav: StepperNav, data: StepperData): StepperState | null {
	if (!nav.activeJourneyId) return null;
	const total = orderedStepsOf(data, nav.activeJourneyId).length;
	return total > 0
		? { currentIndex: nav.activeStepIndex ?? 0, totalItems: total, itemLabel: "Step" }
		: null;
}

function deriveProcessStepper(nav: StepperNav, data: StepperData): StepperState | null {
	if (!nav.activeProcessId) return null;
	const total = orderedStagesOf(data, nav.activeProcessId).length;
	return total > 0
		? { currentIndex: nav.activeStageIndex ?? 0, totalItems: total, itemLabel: "Stage" }
		: null;
}

function deriveSequenceStepper(nav: StepperNav, data: StepperData): StepperState | null {
	if (!nav.activeSequenceId) return null;
	const total = orderedMessagesOf(data, nav.activeSequenceId).length;
	return total > 0
		? { currentIndex: nav.activeMessageIndex ?? 0, totalItems: total, itemLabel: "Message" }
		: null;
}

const STEPPER_RESOLVERS: Record<
	string,
	(nav: StepperNav, data: StepperData) => StepperState | null
> = {
	orientation: deriveOrientationStepper,
	journey: deriveJourneyStepper,
	process: deriveProcessStepper,
	sequence: deriveSequenceStepper,
};

/**
 * What the stepper transport control shows for the active perspective, or null
 * when that perspective has nothing to step through.
 */
export function deriveStepperState(
	nav: StepperNav,
	perspectiveType: string,
	data: StepperData,
): StepperState | null {
	const resolver = STEPPER_RESOLVERS[perspectiveType];
	return resolver ? resolver(nav, data) : null;
}
