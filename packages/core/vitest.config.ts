import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["tests/**/*.test.ts"],
		globals: true,
		coverage: {
			provider: "v8",
			include: ["src/**/*.ts"],
			// Fixtures and demo data are test support, not kernel code.
			exclude: ["src/test-fixtures/**"],
			reporter: ["text", "json-summary"],
			// Floors are the last measured coverage (86.35 / 74.89 / 87.62 / 89.62), rounded
			// down. They only move up: raise them in the pull request that raises coverage.
			thresholds: {
				statements: 86,
				branches: 74,
				functions: 87,
				lines: 89,
			},
		},
	},
});
