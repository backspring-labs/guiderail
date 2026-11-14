import { type Page, expect, test } from "@playwright/test";
import { pickFromLeftPanel } from "./support.js";

/**
 * Selecting a journey, process or sequence shows it, from every entry point.
 * Before, only the left panel switched perspective; search and the right panel
 * selected the entity and left the user where they were.
 */

const PROCESS = "Perspective Switch with Shared Context";
const JOURNEY = "The Full Descent";

const activeTab = (page: Page) => page.locator(".perspective-switcher__tab--active");
const counter = (page: Page) => page.locator(".stepper-control__counter");
const breadcrumb = (page: Page) => page.locator(".context-bar__breadcrumb");

async function viaSearch(page: Page, label: string) {
	await page.locator(".top-bar__search").click();
	await page.locator(".search-palette__input").fill(label);
	await expect(page.locator(".search-palette__result--selected")).toContainText(label);
	await page.keyboard.press("Enter");
	await expect(page.locator(".search-palette")).toHaveCount(0);
}

async function viaRightPanel(page: Page, capability: string, process: string) {
	await page.locator(".perspective-switcher").getByRole("button", { name: "Landscape" }).click();
	await page.locator(".landscape-capability", { hasText: capability }).click();
	await page.locator(".detail-panel").getByRole("button", { name: process }).click();
}

async function landing(page: Page) {
	return {
		tab: await activeTab(page).innerText(),
		counter: await counter(page).innerText(),
		breadcrumb: await breadcrumb(page).innerText(),
		selectedNodes: await page.locator(".react-flow__node.selected").count(),
	};
}

test("search navigates to a journey, the same as the left panel", async ({ page }) => {
	await page.goto("/");
	await pickFromLeftPanel(page, "Journeys", JOURNEY);
	await expect(activeTab(page)).toHaveText("Journey");
	const fromLeftPanel = await landing(page);

	await page.goto("/");
	await viaSearch(page, JOURNEY);
	await expect(activeTab(page)).toHaveText("Journey");
	expect(await landing(page)).toEqual(fromLeftPanel);
});

test("the left panel, search and the right panel land on the same process view", async ({
	page,
}) => {
	await page.goto("/");
	await pickFromLeftPanel(page, "Processes", PROCESS);
	await expect(activeTab(page)).toHaveText("Process");
	await expect(counter(page)).toHaveText("Stage 1 of 8");
	const fromLeftPanel = await landing(page);

	await page.goto("/");
	await viaSearch(page, PROCESS);
	await expect(activeTab(page)).toHaveText("Process");
	const fromSearch = await landing(page);

	await page.goto("/");
	await viaRightPanel(page, "Perspective Switching", PROCESS);
	await expect(activeTab(page)).toHaveText("Process");
	const fromRightPanel = await landing(page);

	expect(fromSearch.tab).toBe(fromLeftPanel.tab);
	expect(fromSearch.counter).toBe(fromLeftPanel.counter);
	expect(fromRightPanel.tab).toBe(fromLeftPanel.tab);
	expect(fromRightPanel.counter).toBe(fromLeftPanel.counter);
	// The right panel route passes through a capability, so its breadcrumb also
	// names that capability's domain; all three end on the same process.
	for (const result of [fromLeftPanel, fromSearch, fromRightPanel]) {
		expect(result.breadcrumb).toContain(PROCESS);
		expect(result.selectedNodes).toBe(0);
	}
});

test("search navigates to a sequence", async ({ page }) => {
	await page.goto("/");
	await viaSearch(page, "Capability Selection from Landscape");
	await expect(activeTab(page)).toHaveText("Sequence");
	await expect(counter(page)).toHaveText(/^Message 1 of \d+$/);
});
