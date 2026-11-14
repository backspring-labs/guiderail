import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FIT_VIEW_DELAY_MS, useFitViewOnSwitch } from "./use-canvas-events.js";

function fakeInstance() {
	return {
		fitView: vi.fn(),
		getViewport: vi.fn(() => ({ x: 0, y: 0, zoom: 1 })),
		setViewport: vi.fn(),
		getNodes: vi.fn(() => [{ position: { x: 0, y: 0 } }, { position: { x: 300, y: 200 } }]),
		viewportInitialized: true,
	};
}

type Props = { perspective: string; mode: string | null; content: string | null };

function mount(initial: Props) {
	const instance = fakeInstance();
	const hook = renderHook(
		(props: Props) => useFitViewOnSwitch(props.perspective, props.mode, props.content),
		{ initialProps: initial },
	);
	hook.result.current.onInit(instance);
	instance.setViewport.mockClear();
	return { hook, instance };
}

describe("useFitViewOnSwitch", () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	const start: Props = { perspective: "p1", mode: null, content: null };

	it.each([
		["the perspective", { ...start, perspective: "p2" }],
		["the canvas mode", { ...start, mode: "deployment" }],
		["the content key", { ...start, content: "process-2" }],
	])("refits after a delay when %s changes", (_, next) => {
		const { hook, instance } = mount(start);
		hook.rerender(next);
		expect(instance.setViewport).not.toHaveBeenCalled();
		vi.advanceTimersByTime(FIT_VIEW_DELAY_MS);
		expect(instance.setViewport).toHaveBeenCalledTimes(1);
	});

	it("does nothing when nothing changed", () => {
		const { hook, instance } = mount(start);
		hook.rerender({ ...start });
		vi.advanceTimersByTime(FIT_VIEW_DELAY_MS * 2);
		expect(instance.setViewport).not.toHaveBeenCalled();
	});

	it("clears the pending timer on unmount", () => {
		const { hook, instance } = mount(start);
		hook.rerender({ ...start, perspective: "p2" });
		expect(vi.getTimerCount()).toBe(1);

		hook.unmount();
		expect(vi.getTimerCount()).toBe(0);
		vi.advanceTimersByTime(FIT_VIEW_DELAY_MS * 2);
		expect(instance.setViewport).not.toHaveBeenCalled();
	});

	it("fits once when the view changes twice within the delay", () => {
		const { hook, instance } = mount(start);
		hook.rerender({ ...start, perspective: "p2" });
		hook.rerender({ ...start, perspective: "p3" });
		expect(vi.getTimerCount()).toBe(1);
		vi.advanceTimersByTime(FIT_VIEW_DELAY_MS);
		expect(instance.setViewport).toHaveBeenCalledTimes(1);
	});
});
