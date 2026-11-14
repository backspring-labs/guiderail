import { orderBySequence } from "@guiderail/core/content";
import type { OrientationItem } from "@guiderail/core/entities";

export function computeOrientationLayout(items: OrientationItem[]) {
	const nodes = orderBySequence(items).map((item, position) => ({
		id: `orient-item-${item.id}`,
		type: "orientation_item" as const,
		position: { x: 0, y: position * 80 },
		draggable: false,
		data: {
			title: item.title,
			// What the kernel's activeOrientationIndex refers to.
			position,
			itemId: item.id,
		},
	}));
	return { nodes };
}
