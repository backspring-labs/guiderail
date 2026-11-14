import { useDataset } from "@/data/dataset-context.js";
import type { Dataset } from "@/data/dataset.js";
import { createInitializeEvent } from "@/store/kernel-init.js";
import { contextMachine } from "@guiderail/core/context";
import { createActorContext } from "@xstate/react";
import { useLayoutEffect } from "react";

/**
 * React context for the Context Machine.
 * Instantiated once at the app root. All descendants read nav state
 * exclusively from this context — never from child machines directly.
 */
export const KernelContext = createActorContext(contextMachine);

/**
 * Hook to access the navigation context from the Context Machine.
 * Returns the current NavigationContext (read-only snapshot).
 */
export function useNavigation() {
	const actorRef = KernelContext.useActorRef();
	const snapshot = KernelContext.useSelector((s) => s);

	return {
		nav: snapshot.context.nav,
		graph: snapshot.context.graph,
		isReady: snapshot.value === "ready",
		send: actorRef.send,
	};
}

type KernelActor = ReturnType<typeof KernelContext.useActorRef>;

/**
 * Brings the kernel to its first usable state: the dataset loaded, the Orientation
 * perspective active, and its first item selected.
 *
 * Idempotent: once the kernel is ready this does nothing, so it is safe to call
 * again (React StrictMode runs effects twice) and can never reset navigation
 * the user has done since.
 */
export function initializeKernel(actor: KernelActor, dataset: Dataset) {
	if (actor.getSnapshot().value === "ready") return;

	actor.send(createInitializeEvent(dataset));

	// Orientation is the entry perspective, with its first item selected so the
	// content panel renders immediately. It is found by type, not by id.
	const entry =
		dataset.perspectives.find((p) => p.type === "orientation") ?? dataset.perspectives[0];
	if (entry) actor.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: entry.id });
	if (dataset.orientationItems.length > 0) {
		actor.send({ type: "JUMP_TO_ORIENTATION", index: 0 });
	}
}

/**
 * Initializes the kernel once, when the app mounts.
 *
 * This runs in a layout effect, not during render: rendering stays free of side
 * effects, and the kernel is ready before the first paint.
 */
export function useInitializeContext() {
	const actorRef = KernelContext.useActorRef();
	const dataset = useDataset();
	useLayoutEffect(() => {
		initializeKernel(actorRef, dataset);
	}, [actorRef, dataset]);
}
