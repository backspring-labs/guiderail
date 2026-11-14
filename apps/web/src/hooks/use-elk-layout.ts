import { type LayoutDirection, computeElkLayout } from "@/lib/elk-layout.js";
import { useCallback, useEffect, useRef, useState } from "react";

export type Positions = Map<string, { x: number; y: number }>;
export type LayoutStatus = "idle" | "loading" | "ready" | "error";

/**
 * One layout computation. `key` identifies the inputs: two requests with the
 * same key are the same layout, and its result is reused instead of recomputed.
 */
export interface LayoutRequest {
	key: string;
	nodes: Array<{ id: string }>;
	edges: Array<{ id: string; source: string; target: string }>;
	direction: LayoutDirection;
}

export type ComputeLayout = (
	nodes: Array<{ id: string; position: { x: number; y: number }; data: Record<string, unknown> }>,
	edges: LayoutRequest["edges"],
	options: { direction: LayoutDirection },
) => Promise<Positions>;

export interface ElkLayout {
	positions: Positions;
	status: LayoutStatus;
	/** Runs the current request again after a failure. */
	retry: () => void;
}

const NO_POSITIONS: Positions = new Map();
const GRID_COLUMNS = 4;
const GRID_SPACING_X = 280;
const GRID_SPACING_Y = 160;

/** Builds the cache key for a layout from everything that affects its result. */
export function layoutKey(
	direction: LayoutDirection,
	nodes: Array<{ id: string }>,
	edges: Array<{ id: string }>,
): string {
	return `${direction}|${nodes.map((n) => n.id).join(",")}|${edges.map((e) => e.id).join(",")}`;
}

/** A plain grid, used when automatic layout fails, so nodes stay visible and separate. */
export function gridFallback(nodes: Array<{ id: string }>): Positions {
	const positions: Positions = new Map();
	nodes.forEach((node, i) => {
		positions.set(node.id, {
			x: (i % GRID_COLUMNS) * GRID_SPACING_X,
			y: Math.floor(i / GRID_COLUMNS) * GRID_SPACING_Y,
		});
	});
	return positions;
}

interface State {
	key: string | null;
	positions: Positions;
	status: LayoutStatus;
}

/**
 * Runs an asynchronous layout for `request` and keeps only the result that
 * belongs to the current request.
 *
 * - A result that arrives after the request changed, or after unmount, is
 *   discarded. A slow earlier layout can never overwrite a later one.
 * - Results are cached by `request.key`, so returning to a layout is instant.
 * - A failure is reported as `status: "error"` with a grid fallback, and
 *   `retry()` runs it again. Nothing fails silently.
 *
 * Pass a memoised `request` (or null when no layout is needed).
 */
export function useElkLayout(
	request: LayoutRequest | null,
	compute: ComputeLayout = computeElkLayout,
): ElkLayout {
	const cache = useRef(new Map<string, Positions>());
	const [state, setState] = useState<State>({ key: null, positions: NO_POSITIONS, status: "idle" });
	const [attempt, setAttempt] = useState(0);

	// `attempt` is a dependency on purpose: bumping it reruns a failed request.
	// biome-ignore lint/correctness/useExhaustiveDependencies: see above
	useEffect(() => {
		if (!request) return;

		const cached = cache.current.get(request.key);
		if (cached) {
			setState({ key: request.key, positions: cached, status: "ready" });
			return;
		}

		let superseded = false;
		setState((previous) => ({ ...previous, key: request.key, status: "loading" }));

		const nodes = request.nodes.map((n) => ({ id: n.id, position: { x: 0, y: 0 }, data: {} }));
		compute(nodes, request.edges, { direction: request.direction })
			.then((positions) => {
				if (superseded) return;
				cache.current.set(request.key, positions);
				setState({ key: request.key, positions, status: "ready" });
			})
			.catch(() => {
				if (superseded) return;
				setState({ key: request.key, positions: gridFallback(request.nodes), status: "error" });
			});

		return () => {
			superseded = true;
		};
	}, [request, compute, attempt]);

	const retry = useCallback(() => setAttempt((n) => n + 1), []);

	return { positions: state.positions, status: request ? state.status : "idle", retry };
}
