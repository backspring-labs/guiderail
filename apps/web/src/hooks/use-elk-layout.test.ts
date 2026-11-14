import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	type ComputeLayout,
	type LayoutRequest,
	type Positions,
	gridFallback,
	layoutKey,
	useElkLayout,
} from "./use-elk-layout.js";

/** A layout function whose promises the test settles by hand, in any order. */
function deferredLayout() {
	const pending: Array<{
		direction: string;
		resolve: (positions: Positions) => void;
		reject: (error: Error) => void;
	}> = [];
	const compute: ComputeLayout = vi.fn(
		(_nodes, _edges, options) =>
			new Promise<Positions>((resolve, reject) => {
				pending.push({ direction: options.direction, resolve, reject });
			}),
	);
	return { compute, pending };
}

const nodes = [{ id: "a" }, { id: "b" }];
const request = (direction: "DOWN" | "RIGHT"): LayoutRequest => ({
	key: layoutKey(direction, nodes, []),
	nodes,
	edges: [],
	direction,
});
const DOWN = request("DOWN");
const RIGHT = request("RIGHT");
const at = (x: number): Positions => new Map([["a", { x, y: 0 }]]);

function render(initial: LayoutRequest | null, compute: ComputeLayout) {
	return renderHook(({ req }: { req: LayoutRequest | null }) => useElkLayout(req, compute), {
		initialProps: { req: initial },
	});
}

describe("useElkLayout — superseded requests", () => {
	it("a slow earlier layout cannot overwrite a later one", async () => {
		const { compute, pending } = deferredLayout();
		const hook = render(DOWN, compute);
		expect(hook.result.current.status).toBe("loading");

		hook.rerender({ req: RIGHT });
		expect(pending.map((p) => p.direction)).toEqual(["DOWN", "RIGHT"]);

		// The later request finishes first, then the earlier one arrives late.
		await act(async () => pending[1]?.resolve(at(200)));
		expect(hook.result.current.positions.get("a")?.x).toBe(200);
		await act(async () => pending[0]?.resolve(at(100)));

		expect(hook.result.current.positions.get("a")?.x).toBe(200);
		expect(hook.result.current.status).toBe("ready");
	});

	it("a late failure of a superseded request does not put the current one in error", async () => {
		const { compute, pending } = deferredLayout();
		const hook = render(DOWN, compute);
		hook.rerender({ req: RIGHT });

		await act(async () => pending[1]?.resolve(at(200)));
		await act(async () => pending[0]?.reject(new Error("late")));

		expect(hook.result.current.status).toBe("ready");
		expect(hook.result.current.positions.get("a")?.x).toBe(200);
	});

	it("a result that arrives after unmount is ignored", async () => {
		const { compute, pending } = deferredLayout();
		const errors = vi.spyOn(console, "error").mockImplementation(() => {});
		const hook = render(DOWN, compute);
		const before = hook.result.current;

		hook.unmount();
		await act(async () => pending[0]?.resolve(at(100)));

		expect(hook.result.current).toBe(before);
		expect(errors).not.toHaveBeenCalled();
		errors.mockRestore();
	});
});

describe("useElkLayout — cache identity", () => {
	it("reuses a layout when its inputs come round again, without recomputing", async () => {
		const { compute, pending } = deferredLayout();
		const hook = render(DOWN, compute);
		await act(async () => pending[0]?.resolve(at(100)));

		hook.rerender({ req: RIGHT });
		await act(async () => pending[1]?.resolve(at(200)));

		hook.rerender({ req: DOWN });
		expect(hook.result.current.status).toBe("ready");
		expect(hook.result.current.positions.get("a")?.x).toBe(100);
		expect(compute).toHaveBeenCalledTimes(2);
	});

	it("gives different inputs different keys", () => {
		expect(layoutKey("DOWN", nodes, [])).not.toBe(layoutKey("RIGHT", nodes, []));
		expect(layoutKey("DOWN", nodes, [])).not.toBe(layoutKey("DOWN", [{ id: "a" }], []));
		expect(layoutKey("DOWN", nodes, [])).not.toBe(layoutKey("DOWN", nodes, [{ id: "e" }]));
		expect(layoutKey("DOWN", nodes, [])).toBe(layoutKey("DOWN", [{ id: "a" }, { id: "b" }], []));
	});

	it("is idle, with no computation, when no layout is requested", () => {
		const { compute } = deferredLayout();
		const hook = render(null, compute);
		expect(hook.result.current.status).toBe("idle");
		expect(compute).not.toHaveBeenCalled();
	});
});

describe("useElkLayout — failure is visible and recoverable", () => {
	it("reports an error with a grid fallback, and retry computes again", async () => {
		const { compute, pending } = deferredLayout();
		const hook = render(DOWN, compute);

		await act(async () => pending[0]?.reject(new Error("elk failed")));
		expect(hook.result.current.status).toBe("error");
		expect(hook.result.current.positions).toEqual(gridFallback(nodes));

		act(() => hook.result.current.retry());
		expect(hook.result.current.status).toBe("loading");
		expect(compute).toHaveBeenCalledTimes(2);

		await act(async () => pending[1]?.resolve(at(100)));
		expect(hook.result.current.status).toBe("ready");
		expect(hook.result.current.positions.get("a")?.x).toBe(100);
	});

	it("does not cache a failure", async () => {
		const { compute, pending } = deferredLayout();
		const hook = render(DOWN, compute);
		await act(async () => pending[0]?.reject(new Error("elk failed")));

		hook.rerender({ req: RIGHT });
		await act(async () => pending[1]?.resolve(at(200)));
		hook.rerender({ req: DOWN });

		// DOWN failed last time, so it is computed again rather than served from cache.
		expect(compute).toHaveBeenCalledTimes(3);
	});

	it("the grid fallback gives every node its own position", () => {
		const many = Array.from({ length: 9 }, (_, i) => ({ id: `n${i}` }));
		const positions = [...gridFallback(many).values()].map((p) => `${p.x},${p.y}`);
		expect(new Set(positions).size).toBe(9);
	});
});
