import type { Node } from "@guiderail/core/entities";
import { createGraph } from "@guiderail/core/graph";
import { describe, expect, it } from "vitest";

describe("GuideRail", () => {
	it("@guiderail/core is linked and exports work", () => {
		const testNode: Node = {
			id: "test-1",
			type: "service",
			label: "Test Service",
			tags: [],
			metadata: {},
			layoutByPerspective: {},
		};
		const graph = createGraph([testNode], []);
		expect(graph.nodes.size).toBe(1);
	});
});
