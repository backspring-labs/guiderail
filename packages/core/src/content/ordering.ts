import type { ContentBundle } from "./collections.js";
import { type ContentError, issue } from "./diagnostics.js";

/**
 * The one definition of navigation order: ascending `sequenceNumber`, ties in
 * input order. An item's position is its index in the returned array.
 *
 * Sequence numbers do not have to start at 0 or be contiguous, so never treat a
 * `sequenceNumber` as a position. Returns a new array; the input is untouched.
 */
export function orderBySequence<T extends { sequenceNumber: number }>(items: readonly T[]): T[] {
	return items
		.map((item, inputIndex) => ({ item, inputIndex }))
		.sort((a, b) => a.item.sequenceNumber - b.item.sequenceNumber || a.inputIndex - b.inputIndex)
		.map(({ item }) => item);
}

interface OrderedItem {
	id: string;
	sequenceNumber: number;
}

function duplicateNumbers(
	entityType: string,
	groupLabel: string,
	items: readonly OrderedItem[],
): ContentError[] {
	const firstByNumber = new Map<number, string>();
	const issues: ContentError[] = [];
	for (const item of items) {
		const first = firstByNumber.get(item.sequenceNumber);
		if (first == null) {
			firstByNumber.set(item.sequenceNumber, item.id);
		} else {
			issues.push(
				issue(
					"duplicate_sequence_number",
					entityType,
					`"${item.id}" and "${first}" both have sequenceNumber ${item.sequenceNumber} in ${groupLabel}; their order falls back to input order`,
					{ id: item.id },
				),
			);
		}
	}
	return issues;
}

function groupBy<T>(items: readonly T[], key: (item: T) => string): Map<string, T[]> {
	const groups = new Map<string, T[]>();
	for (const item of items) {
		const k = key(item);
		const group = groups.get(k);
		if (group) group.push(item);
		else groups.set(k, [item]);
	}
	return groups;
}

/** Warns where two items in one ordered group share a sequence number. */
export function checkOrdering(bundle: ContentBundle): ContentError[] {
	const issues: ContentError[] = [];

	for (const [journeyId, steps] of groupBy(bundle.steps, (s) => s.journeyId)) {
		issues.push(...duplicateNumbers("steps", `journey "${journeyId}"`, steps));
	}
	for (const [processId, stages] of groupBy(bundle.processStages, (s) => s.processId)) {
		issues.push(...duplicateNumbers("processStages", `process "${processId}"`, stages));
	}
	for (const [routeId, waypoints] of groupBy(bundle.storyWaypoints, (w) => w.storyRouteId)) {
		issues.push(...duplicateNumbers("storyWaypoints", `story route "${routeId}"`, waypoints));
	}
	for (const sequence of bundle.sequences) {
		const members = bundle.messages.filter((m) => sequence.messageIds.includes(m.id));
		issues.push(...duplicateNumbers("messages", `sequence "${sequence.id}"`, members));
	}
	issues.push(
		...duplicateNumbers("orientationItems", "the orientation deck", bundle.orientationItems),
	);

	return issues;
}
