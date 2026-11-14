import { expect, test } from "@playwright/test";
import {
	activeTab,
	counter,
	pickFromLeftPanel,
	tab,
	trackErrors,
	visibleTexts,
} from "./support.js";

/**
 * Every perspective of the built app renders its own canvas with real content,
 * and none of them logs an error.
 */

// What each perspective must show, with the demo corpus, before anything is selected.
const PERSPECTIVES: Array<{ name: string; shows: string; atLeast: number }> = [
	{ name: "Orientation", shows: ".orientation-deck__tab", atLeast: 2 },
	{ name: "Landscape", shows: ".landscape-capability", atLeast: 5 },
	{ name: "Journey", shows: ".journey-picker", atLeast: 2 },
	{ name: "Process", shows: ".bpmn-task", atLeast: 3 },
	{ name: "Architecture", shows: ".react-flow__node", atLeast: 10 },
	{ name: "System", shows: ".react-flow__node", atLeast: 10 },
	{ name: "Sequence", shows: ".sequence-picker", atLeast: 2 },
];

test("there is a tab for each of the seven perspectives, in order", async ({ page }) => {
	await page.goto("/");
	await expect(page.locator(".perspective-switcher__tab")).toHaveText(
		PERSPECTIVES.map((p) => p.name),
	);
});

for (const perspective of PERSPECTIVES) {
	test(`${perspective.name} renders its canvas without errors`, async ({ page }) => {
		const errors = trackErrors(page);
		await page.goto("/");
		await tab(page, perspective.name).click();
		await expect(activeTab(page)).toHaveText(perspective.name);

		const content = page.locator(perspective.shows);
		await expect(content.first()).toBeVisible();
		expect(await content.count()).toBeGreaterThanOrEqual(perspective.atLeast);

		// Automatic layout did not fail.
		await expect(page.locator(".app-shell__canvas-notice")).toHaveCount(0);
		expect(errors).toEqual([]);
	});
}

test("Architecture lays every node out at its own position", async ({ page }) => {
	await page.goto("/");
	await tab(page, "Architecture").click();
	const nodes = page.locator(".react-flow__node");
	await expect(nodes.first()).toBeVisible();
	// Wait for layout: positions stop being all the same.
	await expect
		.poll(async () => {
			const transforms = await nodes.evaluateAll((els) =>
				els.map((el) => (el as HTMLElement).style.transform),
			);
			return new Set(transforms).size === transforms.length;
		})
		.toBe(true);
});

test("a journey steps forward and back with the stepper buttons", async ({ page }) => {
	await page.goto("/");
	await pickFromLeftPanel(page, "Journeys", "The Full Descent");
	await expect(activeTab(page)).toHaveText("Journey");

	const text = await counter(page).innerText();
	const total = Number(/of (\d+)$/.exec(text)?.[1]);
	expect(total).toBeGreaterThan(2);
	const active = page.locator(".journey-step--active");
	await expect(active).toHaveCount(1);
	const [first] = await visibleTexts(active.locator(".journey-step__title"));
	if (!first) throw new Error("the active step has no title");

	await page.getByTitle("Next (→)").click();
	await expect(counter(page)).toHaveText(`Step 2 of ${total}`);
	await expect(active).toHaveCount(1);
	await expect(active.locator(".journey-step__title")).not.toHaveText(first);

	await page.getByTitle("Previous (←)").click();
	await expect(counter(page)).toHaveText(`Step 1 of ${total}`);
	await expect(active.locator(".journey-step__title")).toHaveText(first);

	await page.getByTitle("Last (↓)").click();
	await expect(counter(page)).toHaveText(`Step ${total} of ${total}`);
	await expect(page.getByTitle("Next (→)")).toBeDisabled();
});

test("context survives a tour of the perspectives", async ({ page }) => {
	await page.goto("/");
	await pickFromLeftPanel(page, "Journeys", "The Full Descent");
	await page.getByTitle("Next (→)").click();
	const reached = await counter(page).innerText();

	for (const name of ["Process", "Architecture", "Sequence", "Landscape"]) {
		await tab(page, name).click();
		await expect(activeTab(page)).toHaveText(name);
		await expect(page.locator(".context-bar__breadcrumb")).toContainText("The Full Descent");
	}
	await tab(page, "Journey").click();
	await expect(counter(page)).toHaveText(reached);
});
