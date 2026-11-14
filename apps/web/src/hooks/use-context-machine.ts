import { createInitializeEvent } from "@/store/kernel-init.js";
import { seedOrientationItems } from "@/store/seed-loader.js";
import { contextMachine } from "@guiderail/core/context";
import { createActorContext } from "@xstate/react";

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

/**
 * Initialize the context machine with seed data.
 * Call this once from the component that provides KernelContext.
 */
export function useInitializeContext() {
	const actorRef = KernelContext.useActorRef();
	const isReady = KernelContext.useSelector((s) => s.value === "ready");

	if (!isReady) {
		actorRef.send(createInitializeEvent());

		// Set the default perspective so nodes have positions on first render.
		// Orientation is the entry perspective — first item selected on first load.
		actorRef.send({
			type: "SWITCH_PERSPECTIVE",
			perspectiveId: "persp-orientation",
		});

		// Select the first orientation item so the content panel renders immediately
		if (seedOrientationItems.length > 0) {
			actorRef.send({ type: "JUMP_TO_ORIENTATION", index: 0 });
		}
	}
}
