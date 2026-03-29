import { seedOrientationItems } from "@/store/seed-loader.js";
import type { ContextMachineEvent } from "@guiderail/core/context";
import type { OrientationItem } from "@guiderail/core/entities";
import { useCallback, useEffect } from "react";

type SendFn = (event: ContextMachineEvent) => void;

/**
 * Manages orientation perspective event listeners and derives the current item.
 */
export function useOrientationEvents(
	send: SendFn,
	isOrientationPerspective: boolean,
	activeOrientationIndex: number | null,
) {
	const handleOrientationSelect = useCallback(
		(e: Event) => {
			const detail = (e as CustomEvent).detail as { sequenceNumber: number };
			send({ type: "JUMP_TO_ORIENTATION", index: detail.sequenceNumber });
		},
		[send],
	);

	const handleOrientationLink = useCallback(
		(e: Event) => {
			const detail = (e as CustomEvent).detail as {
				perspectiveId: string;
				entityId?: string;
			};
			send({ type: "SWITCH_PERSPECTIVE", perspectiveId: detail.perspectiveId });
		},
		[send],
	);

	useEffect(() => {
		window.addEventListener("guiderail:orientation-select", handleOrientationSelect);
		window.addEventListener("guiderail:orientation-link", handleOrientationLink);
		return () => {
			window.removeEventListener("guiderail:orientation-select", handleOrientationSelect);
			window.removeEventListener("guiderail:orientation-link", handleOrientationLink);
		};
	}, [handleOrientationSelect, handleOrientationLink]);

	const currentOrientationItem: OrientationItem | null =
		isOrientationPerspective && activeOrientationIndex != null
			? (seedOrientationItems[activeOrientationIndex] ?? null)
			: null;

	return { currentOrientationItem };
}
