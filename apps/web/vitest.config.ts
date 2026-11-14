import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		include: ["src/**/*.test.{ts,tsx}"],
		globals: true,
		setupFiles: ["./src/test-setup.ts"],
		coverage: {
			provider: "v8",
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"src/**/*.stories.tsx",
				"src/**/*.test.{ts,tsx}",
				"src/test-setup.ts",
				"src/vite-env.d.ts",
			],
			reporter: ["text", "json-summary"],
			// Floors measured on 2026-11-14 (8.89 / 6.80 / 8.08 / 8.89), rounded down.
			// The app is barely tested today; these exist to stop it getting worse and
			// only move up. Issues #12 and #24 are where they rise.
			thresholds: {
				statements: 8,
				branches: 6,
				functions: 8,
				lines: 8,
			},
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			"@seed": resolve(__dirname, "../../packages/core/src/test-fixtures"),
		},
	},
});
