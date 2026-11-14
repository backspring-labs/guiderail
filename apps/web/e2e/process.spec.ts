import { type Page, expect, test } from "@playwright/test";

/**
 * The Process canvas shows the active process and nothing else. Before this was
 * fixed, every process rendered the same diagram while the stepper counter
 * changed underneath it.
 */

const PERSPECTIVE_SWITCH = "Perspective Switch with Shared Context";
const ENTITY_SELECTION = "Entity Selection Cascade";
const RECONCILE = "Reconcile Perspective Switch";

const tasks = (page: Page) => page.locator(".bpmn-task__label");
const lanes = (page: Page) => page.locator(".swim-lane-node__label");
const counter = (page: Page) => page.locator(".stepper-control__counter");
const highlighted = (page: Page) => page.locator(".bpmn-node--highlighted .bpmn-task__label");

async function selectProcess(page: Page, label: string) {
	await page.locator(".left-panel__filter-input").fill(label);
	await page.locator(".section-item", { hasText: label }).first().click();
	await expect(page.locator(".perspective-switcher__tab--active")).toHaveText("Process");
}

test("each process shows its own diagram", async ({ page }) => {
	await page.goto("/");

	// A process with an authored BPMN diagram across several lanes.
	await selectProcess(page, PERSPECTIVE_SWITCH);
	await expect(tasks(page).filter({ hasText: "Dispatch SWITCH_PERSPECTIVE" })).toHaveCount(1);
	await expect(lanes(page)).toHaveCount(5);
	await expect(counter(page)).toHaveText("Stage 1 of 8");

	// A process with no BPMN of its own: one task per stage, in one lane.
	await selectProcess(page, ENTITY_SELECTION);
	await expect(tasks(page).filter({ hasText: "Dispatch SWITCH_PERSPECTIVE" })).toHaveCount(0);
	await expect(counter(page)).toHaveText("Stage 1 of 7");
	await expect(tasks(page)).toHaveCount(7);
	await expect(lanes(page)).toHaveCount(1);
	await expect(lanes(page)).toHaveText(ENTITY_SELECTION, { ignoreCase: true });
});

test("the stepper highlights the stages of the process on screen", async ({ page }) => {
	await page.goto("/");
	await selectProcess(page, ENTITY_SELECTION);

	const labels = await tasks(page).allInnerTexts();
	await expect(highlighted(page)).toHaveText(labels[0] ?? "");

	await page.locator(".stepper-control").getByTitle("Next (→)").click();
	await expect(counter(page)).toHaveText("Stage 2 of 7");
	await expect(highlighted(page)).toHaveCount(1);
	await expect(highlighted(page)).toHaveText(labels[1] ?? "");
});

test("drilling into a sub-process and going back both change the diagram", async ({ page }) => {
	await page.goto("/");
	await selectProcess(page, PERSPECTIVE_SWITCH);
	const parentTasks = await tasks(page).allInnerTexts();

	// Drill in through the + marker on the stage that has a sub-process.
	await page.locator(".bpmn-task__subprocess-marker").click();
	await expect(counter(page)).toHaveText("Stage 1 of 4");
	await expect(tasks(page)).toHaveCount(4);
	await expect(lanes(page)).toHaveText(RECONCILE, { ignoreCase: true });
	expect(await tasks(page).allInnerTexts()).not.toEqual(parentTasks);

	// The breadcrumb shows the parent and leads back to it.
	const back = page.locator(".context-bar__segment--parent-process");
	await expect(back).toHaveText(PERSPECTIVE_SWITCH);
	await back.click();
	await expect(counter(page)).toHaveText("Stage 1 of 8");
	await expect(tasks(page)).toHaveText(parentTasks);
	await expect(back).toHaveCount(0);
});
