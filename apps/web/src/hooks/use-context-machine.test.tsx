import { deriveStepperState } from "@/lib/stepper-state.js";
import { seedInterfaces, seedMessages, seedSequences } from "@/store/seed-loader.js";
import { act, renderHook } from "@testing-library/react";
import { type ReactNode, StrictMode } from "react";
import { describe, expect, it } from "vitest";
import { KernelContext, useInitializeContext, useNavigation } from "./use-context-machine.js";

/**
 * These tests go through the app's own initialization (useInitializeContext
 * inside KernelContext.Provider, under StrictMode as in main.tsx). They do not
 * build an INITIALIZE payload of their own, so they fail if the app stops
 * handing the kernel a collection the views read.
 */
function wrapper({ children }: { children: ReactNode }) {
	return (
		<StrictMode>
			<KernelContext.Provider>{children}</KernelContext.Provider>
		</StrictMode>
	);
}

function useApp() {
	useInitializeContext();
	const navigation = useNavigation();
	const kernelMessages = KernelContext.useSelector((s) => s.context.messages);
	const kernelInterfaces = KernelContext.useSelector((s) => s.context.interfaces);
	return { ...navigation, kernelMessages, kernelInterfaces };
}

function renderApp() {
	const { result } = renderHook(() => useApp(), { wrapper });
	expect(result.current.isReady).toBe(true);
	return result;
}

describe("app initialization — sequence state", () => {
	it("hands the kernel the same messages and interfaces the views read", () => {
		const app = renderApp();
		expect(seedMessages.length).toBeGreaterThan(0);
		expect(app.current.kernelMessages).toEqual(seedMessages);
		expect(app.current.kernelInterfaces).toEqual(seedInterfaces);
	});

	it.each(seedSequences.map((s) => [s.id, s] as const))(
		"steps %s from the first message to a valid end",
		(sequenceId, sequence) => {
			const app = renderApp();
			act(() => {
				app.current.send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-sequence" });
				app.current.send({ type: "SELECT_SEQUENCE", sequenceId });
			});

			// The count the stepper control shows and the kernel's own collection agree.
			const stepper = deriveStepperState(app.current.nav, "sequence");
			const kernelCount = app.current.kernelMessages.filter((m) =>
				sequence.messageIds.includes(m.id),
			).length;
			expect(stepper?.totalItems).toBe(kernelCount);
			expect(kernelCount).toBe(sequence.messageIds.length);
			expect(kernelCount).toBeGreaterThan(1);
			expect(app.current.nav.activeMessageIndex).toBe(0);

			const lastIndex = kernelCount - 1;
			for (let expected = 1; expected <= lastIndex; expected++) {
				act(() => app.current.send({ type: "STEPPER_FORWARD" }));
				expect(app.current.nav.activeMessageIndex).toBe(expected);
			}

			// Past the end is a no-op, not an out-of-range index.
			act(() => app.current.send({ type: "STEPPER_FORWARD" }));
			expect(app.current.nav.activeMessageIndex).toBe(lastIndex);

			act(() => app.current.send({ type: "STEPPER_RESET" }));
			expect(app.current.nav.activeMessageIndex).toBe(0);

			act(() => app.current.send({ type: "STEPPER_END" }));
			expect(app.current.nav.activeMessageIndex).toBe(lastIndex);
			expect(deriveStepperState(app.current.nav, "sequence")?.currentIndex).toBe(lastIndex);
		},
	);
});
