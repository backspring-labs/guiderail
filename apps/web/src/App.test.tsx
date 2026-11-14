import { App } from "@/App.js";
import { tinyDataset } from "@/data/tiny-dataset.fixture.js";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode } from "react";
import { describe, expect, it } from "vitest";

/**
 * The app takes its content through one boundary, the `dataset` prop. These
 * tests mount the real App, under StrictMode as in main.tsx.
 *
 * The tiny dataset is nothing like the demo corpus and is deliberately partial
 * (see tiny-dataset.fixture.ts). Everything asserted about it comes out of the
 * same dataset the kernel was initialised with, so the kernel and the views
 * cannot be reading different data.
 */

function mount(dataset?: ReturnType<typeof tinyDataset>) {
	const user = userEvent.setup();
	const view = render(
		<StrictMode>
			<App dataset={dataset} />
		</StrictMode>,
	);
	return { user, ...view };
}

const activeTab = () => document.querySelector(".perspective-switcher__tab--active");
const counter = () => document.querySelector(".stepper-control__counter");
const leftPanel = () => within(document.querySelector(".left-panel") as HTMLElement);
const leftPanelItem = (label: string) => leftPanel().getByRole("button", { name: label });

/** Journeys and sequences are listed in context; the filter finds them from anywhere. */
async function pickFromLeftPanel(user: ReturnType<typeof userEvent.setup>, label: string) {
	const filter = document.querySelector(".left-panel__filter-input") as HTMLInputElement;
	await user.clear(filter);
	await user.type(filter, label);
	await user.click(leftPanelItem(label));
}

describe("App with the demo corpus", () => {
	it("mounts and lands on Orientation with a stepper", () => {
		mount();
		expect(screen.getByText("GuideRail")).toBeInTheDocument();
		expect(activeTab()).toHaveTextContent("Orientation");
		expect(counter()).toHaveTextContent(/^Item 1 of \d+$/);
	});
});

describe("App with a different, partial dataset", () => {
	it("shows that dataset's perspectives, not the demo's", () => {
		mount(tinyDataset());
		expect(activeTab()).toHaveTextContent("Map");
		expect(screen.getByRole("button", { name: "Trip" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Calls" })).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "Orientation" })).not.toBeInTheDocument();
	});

	it("lists that dataset's content in the left panel, and none of the demo's", async () => {
		const { user } = mount(tinyDataset());
		expect(leftPanelItem("Shop")).toBeInTheDocument();

		const filter = document.querySelector(".left-panel__filter-input") as HTMLInputElement;
		await user.type(filter, "Buy");
		expect(leftPanelItem("Buy something")).toBeInTheDocument();
		await user.clear(filter);
		await user.type(filter, "Charge");
		expect(leftPanelItem("Charge a card")).toBeInTheDocument();

		// A label from the demo corpus finds nothing here.
		await user.clear(filter);
		await user.type(filter, "Full Descent");
		expect(leftPanel().queryByRole("button", { name: /Full Descent/ })).not.toBeInTheDocument();
	});

	it("navigates to a journey and steps it by position, with gapped sequence numbers", async () => {
		const { user } = mount(tinyDataset());
		await pickFromLeftPanel(user, "Buy something");

		// The kernel found the journey perspective by type: its id is "view-2".
		expect(activeTab()).toHaveTextContent("Trip");
		expect(counter()).toHaveTextContent("Step 1 of 2");
		// Steps are numbered 10 and 40; the first is the one numbered 10.
		expect(document.querySelector(".journey-step--active .journey-step__title")).toHaveTextContent(
			"Review cart",
		);

		await user.click(screen.getByTitle("Next (→)"));
		expect(counter()).toHaveTextContent("Step 2 of 2");
		expect(document.querySelector(".journey-step--active .journey-step__title")).toHaveTextContent(
			"Pay",
		);
		expect(screen.getByTitle("Next (→)")).toBeDisabled();
	});

	it("counts only the messages that exist when a sequence names a missing one", async () => {
		const { user } = mount(tinyDataset());
		await pickFromLeftPanel(user, "Charge a card");

		expect(activeTab()).toHaveTextContent("Calls");
		// The sequence lists three message ids; one does not exist.
		expect(counter()).toHaveTextContent("Message 1 of 2");
		expect(document.querySelectorAll(".sequence-message")).toHaveLength(2);
		expect(document.querySelectorAll(".sequence-message--active")).toHaveLength(1);

		await user.click(screen.getByTitle("Last (↓)"));
		expect(counter()).toHaveTextContent("Message 2 of 2");
		expect(
			document.querySelector(".sequence-message--active .sequence-message__label"),
		).toHaveTextContent("receipt");
	});

	it("renders perspectives whose collections were omitted, without failing", async () => {
		const { user } = mount(tinyDataset());
		// The dataset has no processes, providers, routes or orientation items.
		await user.click(screen.getByRole("button", { name: "Calls" }));
		expect(activeTab()).toHaveTextContent("Calls");
		await user.click(screen.getByRole("button", { name: "Map" }));
		expect(activeTab()).toHaveTextContent("Map");
		expect(document.querySelector(".stepper-control")).toBeNull();
	});
});
