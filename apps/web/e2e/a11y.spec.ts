import { expect, test } from "@playwright/test";
import { expectNoA11yViolations, pickFromLeftPanel, tab } from "./support.js";

/**
 * Automated accessibility checks (axe) on each view of the built app.
 * They catch structural problems: missing landmarks, headings, names and roles.
 * They do not replace testing with a keyboard and a screen reader.
 *
 * Colour contrast is included. A rule that starts failing and cannot be fixed at
 * once is listed, with its issue, in support.ts; today that list is empty.
 */

const VIEWS = [
	"Orientation",
	"Landscape",
	"Journey",
	"Process",
	"Architecture",
	"System",
	"Sequence",
];

for (const view of VIEWS) {
	test(`${view} has no accessibility violations`, async ({ page }) => {
		await page.goto("/");
		await tab(page, view).click();
		await expect(page.locator(".perspective-switcher__tab--active")).toHaveText(view);
		// Let the canvas settle so the scan sees the rendered nodes.
		await page.waitForLoadState("networkidle");
		await expectNoA11yViolations(page);
	});
}

test("an open journey with its stepper has no accessibility violations", async ({ page }) => {
	await page.goto("/");
	await pickFromLeftPanel(page, "Journeys", "The Full Descent");
	await expect(page.locator(".stepper-control")).toBeVisible();
	await expectNoA11yViolations(page);
});

test("a selected capability and its detail panel have no accessibility violations", async ({
	page,
}) => {
	await page.goto("/");
	await pickFromLeftPanel(page, "Capabilities", "Context Machine");
	await expect(page.locator(".detail-panel__type-badge").first()).toBeVisible();
	await expectNoA11yViolations(page);
});

test("a selected process and its stages have no accessibility violations", async ({ page }) => {
	await page.goto("/");
	await pickFromLeftPanel(page, "Processes", "Stepper Forward");
	await expect(page.locator(".stepper-control")).toBeVisible();
	await page.waitForLoadState("networkidle");
	await expectNoA11yViolations(page);
});

test("a guided route in progress has no accessibility violations", async ({ page }) => {
	await page.goto("/");
	await pickFromLeftPanel(page, "Guides", "How GuideRail Is Built");
	await expect(page.locator(".story-route-bar")).toBeVisible();
	await expectNoA11yViolations(page);
});

test("the search dialog has no accessibility violations", async ({ page }) => {
	await page.goto("/");
	await page.locator(".top-bar__search").click();
	await page.locator(".search-palette__input").fill("perspective");
	await expect(page.locator(".search-palette__result").first()).toBeVisible();
	await expectNoA11yViolations(page);
});

test("the page has the landmarks and heading a screen reader navigates by", async ({ page }) => {
	await page.goto("/");
	await expect(page.getByRole("banner")).toHaveCount(1);
	await expect(page.getByRole("main")).toHaveCount(1);
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("GuideRail");
	await expect(page.getByRole("navigation", { name: "Current context" })).toHaveCount(1);
	await expect(page.getByRole("complementary", { name: "Browse" })).toHaveCount(1);
	await expect(page.getByRole("complementary", { name: "Details" })).toHaveCount(1);
});
