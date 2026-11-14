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
			// Floors measured on 2026-11-14 (83.88 / 72.68 / 86.49 / 87.93), rounded down.
			// They only move up: raise them in the pull request that raises coverage.
			thresholds: {
				statements: 83,
				branches: 72,
				functions: 86,
				lines: 87,
			},
		},
	},
});
