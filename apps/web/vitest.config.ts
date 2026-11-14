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
			// Floors are the last measured coverage (25.13 / 15.89 / 21.35 / 24.04), rounded
			// down. Most of the app is still untested; these exist to stop it getting
			// worse and only move up. Issues #12 and #24 are where they rise.
			thresholds: {
				statements: 25,
				branches: 15,
				functions: 21,
				lines: 24,
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
