import type { Dataset } from "@/data/dataset.js";
import { orderBySequence } from "@guiderail/core/content";
import type {
	Message,
	OrientationItem,
	ProcessStage,
	Step,
	StoryWaypoint,
} from "@guiderail/core/entities";

/*
 * The ordered groups the steppers walk, built with the same function the kernel
 * uses, from the same dataset the kernel was initialised with. Every index the
 * kernel holds (step, stage, message, waypoint, orientation) is a POSITION in
 * one of these arrays.
 *
 * Never compare a kernel index with an item's sequenceNumber: sequence numbers
 * only decide order, and need not start at 0 or be contiguous. See
 * docs/architecture/data-integrity.md, section 5.
 */

export function orderedOrientationItems(
	dataset: Pick<Dataset, "orientationItems">,
): OrientationItem[] {
	return orderBySequence(dataset.orientationItems);
}

export function orderedStepsOf(dataset: Pick<Dataset, "steps">, journeyId: string): Step[] {
	return orderBySequence(dataset.steps.filter((s) => s.journeyId === journeyId));
}

export function orderedStagesOf(
	dataset: Pick<Dataset, "processStages">,
	processId: string,
): ProcessStage[] {
	return orderBySequence(dataset.processStages.filter((s) => s.processId === processId));
}

/** The messages a sequence lists that actually exist, in order. */
export function orderedMessagesOf(
	dataset: Pick<Dataset, "sequences" | "messages">,
	sequenceId: string,
): Message[] {
	const sequence = dataset.sequences.find((s) => s.id === sequenceId);
	if (!sequence) return [];
	return orderBySequence(dataset.messages.filter((m) => sequence.messageIds.includes(m.id)));
}

export function orderedWaypointsOf(
	dataset: Pick<Dataset, "storyWaypoints">,
	storyRouteId: string,
): StoryWaypoint[] {
	return orderBySequence(dataset.storyWaypoints.filter((w) => w.storyRouteId === storyRouteId));
}

/** Position of the item with `id` in an ordered group, or -1 if it is not there. */
export function positionOf(items: readonly { id: string }[], id: string): number {
	return items.findIndex((item) => item.id === id);
}
