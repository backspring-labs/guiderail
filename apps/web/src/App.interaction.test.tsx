import { App } from "@/App.js";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode } from "react";
import { describe, expect, it } from "vitest";

/**
 * Interaction regression tests on the real, mounted App with the demo corpus:
 * context surviving perspective switches, the stepper from the keyboard, and
 * search from the keyboard with focus handled sensibly.
 */

const JOURNEY = "The Full Descent";

function mount() {
	const user = userEvent.setup();
	render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
	return user;
}

const activeTab = () => document.querySelector(".perspective-switcher__tab--active");
const counter = () => document.querySelector(".stepper-control__counter");
const breadcrumb = () => document.querySelector(".context-bar__breadcrumb");
const tab = (name: string) =>
	within(document.querySelector(".perspective-switcher") as HTMLElement).getByRole("button", {
		name,
	});
const filterInput = () => document.querySelector(".left-panel__filter-input") as HTMLInputElement;
const searchInput = () => document.querySelector(".search-palette__input");

async function openJourney(user: ReturnType<typeof userEvent.setup>) {
	await user.type(filterInput(), JOURNEY);
	// A guided route shares the journey's name; the Journeys section comes first.
	const [journeyItem] = within(document.querySelector(".left-panel") as HTMLElement).getAllByRole(
		"button",
		{ name: JOURNEY },
	);
	if (!journeyItem) throw new Error("the journey is not listed");
	await user.click(journeyItem);
	await user.clear(filterInput());
	// Leave the filter so arrow keys reach the stepper.
	filterInput().blur();
	expect(activeTab()).toHaveTextContent("Journey");
}

describe("context survives perspective switches", () => {
	it("keeps the journey and the step reached when leaving and coming back", async () => {
		const user = mount();
		await openJourney(user);
		await user.click(screen.getByTitle("Next (→)"));
		await user.click(screen.getByTitle("Next (→)"));
		const reached = counter()?.textContent;
		expect(reached).toMatch(/^Step 3 of \d+$/);

		for (const name of ["Sequence", "Architecture", "Landscape"]) {
			await user.click(tab(name));
			expect(activeTab()).toHaveTextContent(name);
			// The journey stays in the breadcrumb on every perspective.
			expect(breadcrumb()).toHaveTextContent(JOURNEY);
		}

		await user.click(tab("Journey"));
		expect(counter()).toHaveTextContent(reached ?? "");
		expect(breadcrumb()).toHaveTextContent(JOURNEY);
	});

	it("keeps the orientation item reached", async () => {
		const user = mount();
		await user.click(screen.getByTitle("Next (→)"));
		expect(counter()).toHaveTextContent(/^Item 2 of/);
		await user.click(tab("Landscape"));
		await user.click(tab("Orientation"));
		expect(counter()).toHaveTextContent(/^Item 2 of/);
	});
});

describe("stepper from the keyboard", () => {
	it("steps with the arrow keys: right, left, down to the end, up to the start", async () => {
		const user = mount();
		await openJourney(user);
		const total = Number(/of (\d+)$/.exec(counter()?.textContent ?? "")?.[1]);
		expect(total).toBeGreaterThan(2);

		await user.keyboard("{ArrowRight}");
		expect(counter()).toHaveTextContent(`Step 2 of ${total}`);
		await user.keyboard("{ArrowRight}");
		expect(counter()).toHaveTextContent(`Step 3 of ${total}`);
		await user.keyboard("{ArrowLeft}");
		expect(counter()).toHaveTextContent(`Step 2 of ${total}`);
		await user.keyboard("{ArrowDown}");
		expect(counter()).toHaveTextContent(`Step ${total} of ${total}`);
		await user.keyboard("{ArrowRight}");
		expect(counter()).toHaveTextContent(`Step ${total} of ${total}`);
		await user.keyboard("{ArrowUp}");
		expect(counter()).toHaveTextContent(`Step 1 of ${total}`);
	});

	it("does not step while the user is typing in a field", async () => {
		const user = mount();
		await openJourney(user);
		const before = counter()?.textContent;

		await user.click(filterInput());
		await user.keyboard("{ArrowRight}{ArrowDown}");

		expect(counter()).toHaveTextContent(before ?? "");
	});
});

describe("search from the keyboard", () => {
	it("opens on ⌘K with focus in the input, and Escape closes it and returns focus", async () => {
		const user = mount();
		const origin = tab("Landscape");
		origin.focus();
		expect(searchInput()).toBeNull();

		await user.keyboard("{Meta>}k{/Meta}");
		await waitFor(() => expect(searchInput()).toHaveFocus());

		await user.keyboard("{Escape}");
		expect(searchInput()).toBeNull();
		expect(origin).toHaveFocus();
		// Nothing was selected and nothing navigated.
		expect(activeTab()).toHaveTextContent("Orientation");
	});

	it("opens on Ctrl+K as well", async () => {
		const user = mount();
		await user.keyboard("{Control>}k{/Control}");
		await waitFor(() => expect(searchInput()).toHaveFocus());
	});

	it("moves through results with the arrow keys and Enter navigates to the chosen one", async () => {
		const user = mount();
		await user.keyboard("{Meta>}k{/Meta}");
		await waitFor(() => expect(searchInput()).toHaveFocus());

		await user.keyboard("Perspective Switch");
		const results = () => [...document.querySelectorAll(".search-palette__result")];
		const selected = () => document.querySelector(".search-palette__result--selected");
		expect(results().length).toBeGreaterThan(1);
		expect(selected()).toBe(results()[0]);

		await user.keyboard("{ArrowDown}");
		expect(selected()).toBe(results()[1]);
		await user.keyboard("{ArrowUp}");
		expect(selected()).toBe(results()[0]);
		// Up at the top stays at the top.
		await user.keyboard("{ArrowUp}");
		expect(selected()).toBe(results()[0]);

		const chosenType = selected()?.querySelector(".search-palette__result-type")?.textContent;
		await user.keyboard("{Enter}");
		expect(searchInput()).toBeNull();
		// Arrow keys in the palette drove the palette, not the stepper behind it.
		expect(chosenType).toBeTruthy();
		expect(activeTab()).not.toHaveTextContent("Orientation");
	});

	it("says so when nothing matches, and Enter then does nothing", async () => {
		const user = mount();
		await user.keyboard("{Meta>}k{/Meta}");
		await waitFor(() => expect(searchInput()).toHaveFocus());
		await user.keyboard("zzzz-no-such-thing");
		expect(screen.getByText("No results found")).toBeInTheDocument();
		await user.keyboard("{Enter}");
		expect(searchInput()).not.toBeNull();
		expect(activeTab()).toHaveTextContent("Orientation");
	});
});
