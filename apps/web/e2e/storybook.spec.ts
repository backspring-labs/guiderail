import { expect, test } from "@playwright/test";
import { expectNoA11yViolations, trackErrors } from "./support.js";

/**
 * Every story in the static Storybook build renders, without errors, and
 * passes the accessibility scan. The story list comes from the build itself,
 * so a new story is covered without touching this file.
 */

interface StoryIndex {
	entries: Record<string, { id: string; title: string; name: string; type: string }>;
}

test("the Storybook build has stories", async ({ request }) => {
	const index = (await (await request.get("/index.json")).json()) as StoryIndex;
	const stories = Object.values(index.entries).filter((e) => e.type === "story");
	expect(stories.length).toBeGreaterThan(0);
});

test("every story renders without errors and passes the accessibility scan", async ({
	page,
	request,
}) => {
	const index = (await (await request.get("/index.json")).json()) as StoryIndex;
	const stories = Object.values(index.entries).filter((e) => e.type === "story");
	const errors = trackErrors(page);

	for (const story of stories) {
		await test.step(`${story.title} / ${story.name}`, async () => {
			await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
			const root = page.locator("#storybook-root");
			await expect(root).not.toBeEmpty();
			// Storybook shows its own error screen instead of throwing.
			await expect(page.locator(".sb-show-errordisplay")).toHaveCount(0);

			// A story is one component on a blank page, so page-level rules do not apply.
			await expectNoA11yViolations(page, {
				include: "#storybook-root",
				alsoDisable: ["region", "landmark-one-main", "page-has-heading-one"],
			});
		});
	}
	expect(errors).toEqual([]);
});
