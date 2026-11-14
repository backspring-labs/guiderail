import { emptyContentBundle } from "@guiderail/core/content";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DatasetProvider, useDataset } from "./dataset-context.js";
import { createDataset } from "./dataset.js";
import { demoDataset } from "./demo-dataset.js";
import { tinyBundle, tinyDataset } from "./tiny-dataset.fixture.js";

describe("createDataset", () => {
	it("carries every collection of the bundle and builds the graph from its nodes and edges", () => {
		const bundle = tinyBundle();
		const dataset = createDataset(bundle);
		for (const [name, entities] of Object.entries(bundle)) {
			expect(dataset[name as keyof typeof bundle]).toBe(entities);
		}
		expect([...dataset.graph.nodes.keys()]).toEqual(["n-cart", "n-pay"]);
		expect(dataset.graph.edges.size).toBe(2);
	});

	it("accepts an empty bundle", () => {
		const dataset = createDataset(emptyContentBundle());
		expect(dataset.graph.nodes.size).toBe(0);
		expect(dataset.perspectives).toEqual([]);
	});

	it("the demo dataset is the demo corpus with its graph", () => {
		expect(demoDataset.graph.nodes.size).toBe(demoDataset.nodes.length);
		expect(demoDataset.graph.edges.size).toBe(demoDataset.edges.length);
	});
});

describe("useDataset", () => {
	function Probe() {
		return (
			<span>
				{useDataset()
					.domains.map((d) => d.label)
					.join(",")}
			</span>
		);
	}

	it("returns the dataset given to the nearest provider", () => {
		const { container } = render(
			<DatasetProvider dataset={tinyDataset()}>
				<Probe />
			</DatasetProvider>,
		);
		expect(container).toHaveTextContent("Shop");
	});

	it("fails loudly outside a provider instead of falling back to some default content", () => {
		const errors = vi.spyOn(console, "error").mockImplementation(() => {});
		expect(() => render(<Probe />)).toThrow("useDataset must be used inside a DatasetProvider");
		errors.mockRestore();
	});
});
