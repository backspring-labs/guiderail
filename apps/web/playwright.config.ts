import { defineConfig, devices } from "@playwright/test";

const APP_PORT = 4173;
const STORYBOOK_PORT = 6007;

/**
 * Browser tests run against built output, never a dev server:
 * - "app": the production build, served by `vite preview`.
 * - "storybook": the static Storybook build, served the same way.
 *
 * Build both first. The root `pnpm test:e2e` does that.
 */
export default defineConfig({
	testDir: "./e2e",
	// A flaky browser test is a failing one. No retries, so flakiness is visible.
	retries: 0,
	forbidOnly: Boolean(process.env.CI),
	reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
	use: {
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "app",
			testIgnore: "storybook.spec.ts",
			use: { ...devices["Desktop Chrome"], baseURL: `http://localhost:${APP_PORT}` },
		},
		{
			name: "storybook",
			testMatch: "storybook.spec.ts",
			use: { ...devices["Desktop Chrome"], baseURL: `http://localhost:${STORYBOOK_PORT}` },
		},
	],
	webServer: [
		{
			command: `pnpm exec vite preview --port ${APP_PORT} --strictPort`,
			url: `http://localhost:${APP_PORT}`,
			reuseExistingServer: !process.env.CI,
			timeout: 60_000,
		},
		{
			command: `pnpm exec vite preview --outDir storybook-static --port ${STORYBOOK_PORT} --strictPort`,
			url: `http://localhost:${STORYBOOK_PORT}/index.json`,
			reuseExistingServer: !process.env.CI,
			timeout: 60_000,
		},
	],
});
