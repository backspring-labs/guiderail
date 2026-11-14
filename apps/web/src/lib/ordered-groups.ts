import {
	seedMessages,
	seedOrientationItems,
	seedProcessStages,
	seedSequences,
	seedSteps,
	seedStoryWaypoints,
} from "@/store/seed-loader.js";
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
 * uses. Every index the kernel holds (step, stage, message, waypoint,
 * orientation) is a POSITION in one of these arrays.
 *
 * Never compare a kernel index with an item's sequenceNumber: sequence numbers
 * only decide order, and need not start at 0 or be contiguous. See
 * docs/architecture/data-integrity.md, section 5.
 */

export const orderedOrientationItems: OrientationItem[] = orderBySequence(seedOrientationItems);

export function orderedStepsOf(journeyId: string): Step[] {
	return orderBySequence(seedSteps.filter((s) => s.journeyId === journeyId));
}

export function orderedStagesOf(processId: string): ProcessStage[] {
	return orderBySequence(seedProcessStages.filter((s) => s.processId === processId));
}

/** The messages a sequence lists that actually exist, in order. */
export function orderedMessagesOf(sequenceId: string): Message[] {
	const sequence = seedSequences.find((s) => s.id === sequenceId);
	if (!sequence) return [];
	return orderBySequence(seedMessages.filter((m) => sequence.messageIds.includes(m.id)));
}

export function orderedWaypointsOf(storyRouteId: string): StoryWaypoint[] {
	return orderBySequence(seedStoryWaypoints.filter((w) => w.storyRouteId === storyRouteId));
}

/** Position of the item with `id` in an ordered group, or -1 if it is not there. */
export function positionOf(items: readonly { id: string }[], id: string): number {
	return items.findIndex((item) => item.id === id);
}
