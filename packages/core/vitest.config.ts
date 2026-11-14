import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["tests/**/*.test.ts"],
		globals: true,
		coverage: {
			provider: "v8",
			include: ["src/**/*.ts"],
			// Fixtures and the demo corpus are data and test support, not kernel code.
			exclude: ["src/test-fixtures/**", "src/demo/**"],
			reporter: ["text", "json-summary"],
			// Floors are the last measured coverage (88.86 / 78.01 / 89.23 / 92.92), rounded
			// down. They only move up: raise them in the pull request that raises coverage.
			thresholds: {
				statements: 88,
				branches: 78,
				functions: 89,
				lines: 92,
			},
		},
	},
});
