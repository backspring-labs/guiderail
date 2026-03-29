import type { OrientationItem } from "@guiderail/core/entities";

export function computeOrientationLayout(items: OrientationItem[]) {
	const nodes = items.map((item, i) => ({
		id: `orient-item-${item.id}`,
		type: "orientation_item" as const,
		position: { x: 0, y: i * 80 },
		draggable: false,
		data: {
			title: item.title,
			sequenceNumber: item.sequenceNumber,
			itemId: item.id,
		},
	}));
	return { nodes };
}
