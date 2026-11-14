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
			// Floors are the last measured coverage (88.08 / 77.37 / 88.73 / 92.54), rounded
			// down. They only move up: raise them in the pull request that raises coverage.
			thresholds: {
				statements: 88,
				branches: 77,
				functions: 88,
				lines: 92,
			},
		},
	},
});
