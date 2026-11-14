import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * ELK is loaded on demand. These tests replace the ELK module so they can
 * observe when it is loaded and constructed.
 */
const elk = vi.hoisted(() => ({
	constructed: 0,
	failNextLoad: false,
	layout: vi.fn(),
}));

vi.mock("elkjs/lib/elk.bundled.js", () => ({
	default: class {
		constructor() {
			// Stands in for the chunk failing to load or initialise.
			if (elk.failNextLoad) {
				elk.failNextLoad = false;
				throw new Error("ELK failed to load");
			}
			elk.constructed++;
		}
		layout = elk.layout;
	},
}));

const nodes = [
	{ id: "a", position: { x: 0, y: 0 }, data: {} },
	{ id: "b", position: { x: 0, y: 0 }, data: {} },
];
const edges = [{ id: "e", source: "a", target: "b" }];

describe("computeElkLayout", () => {
	beforeEach(() => {
		vi.resetModules();
		elk.constructed = 0;
		elk.failNextLoad = false;
		elk.layout.mockReset();
		elk.layout.mockResolvedValue({
			children: [
				{ id: "a", x: 10, y: 20 },
				{ id: "b", x: 300 },
			],
		});
	});

	it("does not load ELK until a layout is asked for", async () => {
		await import("./elk-layout.js");
		expect(elk.constructed).toBe(0);
	});

	it("returns a position for every node ELK placed, defaulting a missing coordinate to 0", async () => {
		const { computeElkLayout } = await import("./elk-layout.js");
		const positions = await computeElkLayout(nodes, edges, { direction: "RIGHT" });
		expect([...positions]).toEqual([
			["a", { x: 10, y: 20 }],
			["b", { x: 300, y: 0 }],
		]);
	});

	it("passes the direction, nodes and edges to ELK", async () => {
		const { computeElkLayout } = await import("./elk-layout.js");
		await computeElkLayout(nodes, edges, { direction: "DOWN", nodeWidth: 50, nodeHeight: 40 });
		const graph = elk.layout.mock.calls[0]?.[0];
		expect(graph.layoutOptions["elk.direction"]).toBe("DOWN");
		expect(graph.children).toEqual([
			{ id: "a", width: 50, height: 40 },
			{ id: "b", width: 50, height: 40 },
		]);
		expect(graph.edges).toEqual([{ id: "e", sources: ["a"], targets: ["b"] }]);
	});

	it("loads ELK once and reuses it", async () => {
		const { computeElkLayout } = await import("./elk-layout.js");
		await computeElkLayout(nodes, edges, { direction: "RIGHT" });
		await computeElkLayout(nodes, edges, { direction: "DOWN" });
		await Promise.all([
			computeElkLayout(nodes, edges, { direction: "RIGHT" }),
			computeElkLayout(nodes, edges, { direction: "RIGHT" }),
		]);
		expect(elk.constructed).toBe(1);
		expect(elk.layout).toHaveBeenCalledTimes(4);
	});

	it("rejects when ELK fails to load, and a later call tries again", async () => {
		elk.failNextLoad = true;
		const { computeElkLayout } = await import("./elk-layout.js");
		await expect(computeElkLayout(nodes, edges, { direction: "RIGHT" })).rejects.toThrow(
			"ELK failed to load",
		);
		expect(elk.constructed).toBe(0);

		const positions = await computeElkLayout(nodes, edges, { direction: "RIGHT" });
		expect(positions.size).toBe(2);
		expect(elk.constructed).toBe(1);
	});
});

describe("getLayoutDirection", () => {
	it.each([
		["architecture", "RIGHT"],
		["system", "RIGHT"],
		["process", "RIGHT"],
		["journey", "RIGHT"],
		["landscape", "DOWN"],
		["anything-else", "DOWN"],
	])("%s lays out %s", async (type, direction) => {
		const { getLayoutDirection } = await import("./elk-layout.js");
		expect(getLayoutDirection(type)).toBe(direction);
	});
});
