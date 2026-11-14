import { expect, test } from "@playwright/test";
import { activeTab, counter, pickFromLeftPanel, tab } from "./support.js";

/** Keyboard use of the built app in a real browser: the stepper and search. */

test("the arrow keys drive the stepper", async ({ page }) => {
	await page.goto("/");
	await pickFromLeftPanel(page, "Journeys", "The Full Descent");
	await expect(activeTab(page)).toHaveText("Journey");
	const total = Number(/of (\d+)$/.exec(await counter(page).innerText())?.[1]);

	// Move focus out of the filter field so the keys reach the stepper.
	await page.locator(".left-panel__filter-input").fill("");
	await tab(page, "Journey").focus();

	await page.keyboard.press("ArrowRight");
	await expect(counter(page)).toHaveText(`Step 2 of ${total}`);
	await page.keyboard.press("ArrowDown");
	await expect(counter(page)).toHaveText(`Step ${total} of ${total}`);
	await page.keyboard.press("ArrowLeft");
	await expect(counter(page)).toHaveText(`Step ${total - 1} of ${total}`);
	await page.keyboard.press("ArrowUp");
	await expect(counter(page)).toHaveText(`Step 1 of ${total}`);
});

test("arrow keys do not step while typing in the filter field", async ({ page }) => {
	await page.goto("/");
	await pickFromLeftPanel(page, "Journeys", "The Full Descent");
	const before = await counter(page).innerText();

	await page.locator(".left-panel__filter-input").focus();
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("ArrowDown");
	await expect(counter(page)).toHaveText(before);
});

test("search works from the keyboard and returns focus when dismissed", async ({ page }) => {
	await page.goto("/");
	const origin = tab(page, "Landscape");
	await origin.focus();

	await page.keyboard.press("ControlOrMeta+k");
	const input = page.locator(".search-palette__input");
	await expect(input).toBeFocused();
	await expect(page.getByRole("dialog", { name: "Search" })).toBeVisible();

	await page.keyboard.press("Escape");
	await expect(input).toHaveCount(0);
	await expect(origin).toBeFocused();
	await expect(activeTab(page)).toHaveText("Orientation");
});

test("search selects with the arrow keys and Enter, and navigates", async ({ page }) => {
	await page.goto("/");
	await tab(page, "Landscape").focus();
	await page.keyboard.press("ControlOrMeta+k");
	await expect(page.locator(".search-palette__input")).toBeFocused();
	await page.keyboard.type("The Full Descent");

	// A journey and a guided route share this name, so there are two results.
	const results = page.locator(".search-palette__result");
	await expect(results).toHaveCount(2);
	const selectedClass = /search-palette__result--selected/;
	await expect(results.nth(0)).toHaveClass(selectedClass);

	await page.keyboard.press("ArrowDown");
	await expect(results.nth(1)).toHaveClass(selectedClass);
	await expect(results.nth(0)).not.toHaveClass(selectedClass);
	// Down at the bottom stays at the bottom.
	await page.keyboard.press("ArrowDown");
	await expect(results.nth(1)).toHaveClass(selectedClass);
	await page.keyboard.press("ArrowUp");
	await expect(results.nth(0)).toHaveClass(selectedClass);

	await expect(results.nth(0).locator(".search-palette__result-type")).toHaveText("journey");
	await page.keyboard.press("Enter");
	await expect(page.locator(".search-palette")).toHaveCount(0);
	await expect(activeTab(page)).toHaveText("Journey");
	await expect(counter(page)).toHaveText(/^Step 1 of \d+$/);
});
