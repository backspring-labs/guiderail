import { expect, it } from "vitest";

// Disposable: proves that the CI gate blocks a failing change. Never merge.
it("fails on purpose", () => {
	expect(1 + 1).toBe(3);
});
