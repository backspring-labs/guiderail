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
				"src/**/*.fixture.ts",
				"src/test-setup.ts",
				"src/vite-env.d.ts",
			],
			reporter: ["text", "json-summary"],
			// Floors are the last measured coverage (66.86 / 57.28 / 58.69 / 67.51), rounded
			// down. They only move up: raise them in the pull request that raises coverage.
			thresholds: {
				statements: 66,
				branches: 57,
				functions: 58,
				lines: 67,
			},
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
});
