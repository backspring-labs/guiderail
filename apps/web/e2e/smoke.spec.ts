import { expect, test } from "@playwright/test";
import { trackErrors } from "./support.js";

/**
 * Minimal smoke test of the built app: it opens, and the Sequence stepper walks
 * a sequence from its first message to its last, with the counter and the
 * highlighted message agreeing at every step.
 *
 * This is the browser evidence for the kernel receiving messages at
 * initialization. Without that, the counter shows a total but Next does nothing.
 */

test("the built app opens without errors", async ({ page }) => {
	const errors = trackErrors(page);
	await page.goto("/");

	await expect(page.locator(".top-bar__title")).toHaveText("GuideRail");
	await expect(page.locator(".perspective-switcher__tab--active")).toBeVisible();
	expect(errors).toEqual([]);
});

test("the Sequence stepper walks a sequence to its last message", async ({ page }) => {
	const errors = trackErrors(page);
	await page.goto("/");

	await page.locator(".perspective-switcher").getByRole("button", { name: "Sequence" }).click();

	// The picker card states how many messages the sequence has.
	const picker = page.locator(".sequence-picker").first();
	await expect(picker).toBeVisible();
	const meta = await picker.locator(".sequence-picker__meta").innerText();
	const total = Number(/(\d+)\s+messages/.exec(meta)?.[1]);
	expect(total).toBeGreaterThan(1);

	await picker.getByTitle("Open sequence").click();

	const counter = page.locator(".stepper-control__counter");
	const activeNumber = page.locator(".sequence-message--active .sequence-message__seq");
	const next = page.locator(".stepper-control").getByTitle("Next (→)");

	await expect(counter).toHaveText(`Message 1 of ${total}`);
	await expect(activeNumber).toHaveText("1");

	for (let position = 2; position <= total; position++) {
		await next.click();
		await expect(counter).toHaveText(`Message ${position} of ${total}`);
		// Exactly one message is highlighted, and it is the one the counter names.
		await expect(activeNumber).toHaveCount(1);
		await expect(activeNumber).toHaveText(String(position));
	}

	await expect(next).toBeDisabled();
	expect(errors).toEqual([]);
});
