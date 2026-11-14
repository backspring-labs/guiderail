import { App } from "@/App.js";
import { parseContentBundle } from "@guiderail/core/content";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import example from "../../../../docs/examples/minimal-content.json";
import { createDataset } from "./dataset.js";

/**
 * docs/examples/minimal-content.json is the content example the README points
 * to. These tests keep it honest: it must load cleanly and the app must show it.
 */
describe("the documented content example", () => {
	const result = parseContentBundle(example, "docs/examples/minimal-content.json");

	it("loads with no errors and no warnings", () => {
		expect(result.errors).toEqual([]);
		expect(result.warnings).toEqual([]);
		expect(result.bundle.steps.map((s) => s.title)).toEqual([
			"Review the basket",
			"Confirm the order",
		]);
	});

	it("is shown by the app exactly as the README describes", async () => {
		const user = userEvent.setup();
		render(<App dataset={createDataset(result.bundle)} />);

		const tabs = within(document.querySelector(".perspective-switcher") as HTMLElement);
		expect(tabs.getAllByRole("button").map((b) => b.textContent)).toEqual([
			"Landscape",
			"Journey",
			"Architecture",
		]);

		const filter = document.querySelector(".left-panel__filter-input") as HTMLInputElement;
		await user.type(filter, "Check out");
		await user.click(
			within(document.querySelector(".left-panel") as HTMLElement).getByRole("button", {
				name: "Check out",
			}),
		);
		expect(document.querySelector(".stepper-control__counter")).toHaveTextContent("Step 1 of 2");
		expect(screen.getByText("Review the basket")).toBeInTheDocument();
	});
});
