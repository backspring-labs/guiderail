import "@testing-library/jest-dom/vitest";

// jsdom has no layout engine. React Flow needs these two browser APIs to mount;
// the stubs let it render its nodes without measuring them. Anything that
// depends on real measurement belongs in the browser tests under e2e/.
class ResizeObserverStub {
	observe() {}
	unobserve() {}
	disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;

class DOMMatrixReadOnlyStub {
	m22: number;
	constructor(transform?: string) {
		const scale = transform?.match(/scale\(([\d.]+)\)/)?.[1];
		this.m22 = scale ? Number(scale) : 1;
	}
}
globalThis.DOMMatrixReadOnly ??= DOMMatrixReadOnlyStub as unknown as typeof DOMMatrixReadOnly;
