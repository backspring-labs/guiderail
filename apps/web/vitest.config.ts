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
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			"@seed": resolve(__dirname, "../../packages/core/src/test-fixtures"),
		},
	},
});
