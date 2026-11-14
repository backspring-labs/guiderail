import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

/**
 * Browser tests run against the production build, served by `vite preview`.
 * Build first: `pnpm build`. The root `pnpm test:e2e` does both.
 */
export default defineConfig({
	testDir: "./e2e",
	// A flaky browser test is a failing one. No retries, so flakiness is visible.
	retries: 0,
	forbidOnly: Boolean(process.env.CI),
	reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: {
		command: `pnpm exec vite preview --port ${PORT} --strictPort`,
		url: `http://localhost:${PORT}`,
		reuseExistingServer: !process.env.CI,
		timeout: 60_000,
	},
});
