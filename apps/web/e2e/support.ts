import AxeBuilder from "@axe-core/playwright";
import { type Locator, type Page, expect } from "@playwright/test";

/** Collects page errors and console errors for the life of the page. */
export function trackErrors(page: Page): string[] {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
	page.on("console", (message) => {
		if (message.type() === "error") errors.push(`console.error: ${message.text()}`);
	});
	return errors;
}

export const tab = (page: Page, name: string) =>
	page.locator(".perspective-switcher").getByRole("button", { name, exact: true });
export const activeTab = (page: Page) => page.locator(".perspective-switcher__tab--active");
export const counter = (page: Page) => page.locator(".stepper-control__counter");

/**
 * The visible text of each matching canvas node, once they have all been laid
 * out. React Flow keeps a node hidden until it has measured it, and the text of
 * a hidden element reads as empty, so reading too early yields blanks.
 */
export async function visibleTexts(locator: Locator): Promise<string[]> {
	await expect(locator.first()).toBeVisible();
	await expect
		.poll(async () => (await locator.allInnerTexts()).every((t) => t.trim() !== ""))
		.toBe(true);
	return locator.allInnerTexts();
}

export type LeftPanelSection =
	| "Domains"
	| "Capabilities"
	| "Journeys"
	| "Processes"
	| "Sequences"
	| "Guides";

/**
 * Chooses an item from one section of the left panel, using the filter as a
 * user would. The section is named because labels are not unique across
 * sections: a journey and a guided route can share a name.
 */
export async function pickFromLeftPanel(page: Page, section: LeftPanelSection, label: string) {
	await page.locator(".left-panel__filter-input").fill(label);
	const heading = page.locator(".collapsible-section__label", {
		hasText: new RegExp(`^${section}$`),
	});
	await page
		.locator(".collapsible-section", { has: heading })
		.locator(".section-item", { hasText: label })
		.click();
}

/**
 * Accessibility rules that are known to fail and are tracked, not ignored.
 * Each entry needs an issue. Remove the entry in the pull request that fixes it.
 */
export const KNOWN_A11Y_EXCEPTIONS = [
	// Text and control colours in the dark theme are below the contrast threshold
	// on every view. Fixing it is a palette decision. Tracked in issue #66.
	"color-contrast",
];

/** Runs axe on the page (or one region of it) and fails on any violation outside the known exceptions. */
export async function expectNoA11yViolations(
	page: Page,
	options: { include?: string; alsoDisable?: string[] } = {},
) {
	let builder = new AxeBuilder({ page }).disableRules([
		...KNOWN_A11Y_EXCEPTIONS,
		...(options.alsoDisable ?? []),
	]);
	if (options.include) builder = builder.include(options.include);
	const { violations } = await builder.analyze();
	const summary = violations.map(
		(v) =>
			`${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} element(s), e.g. ${v.nodes[0]?.target}`,
	);
	expect(summary).toEqual([]);
}
