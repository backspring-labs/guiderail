import { describe, expect, it } from "vitest";
import { useUIStore } from "./ui-store.js";

describe("UI Store", () => {
	it("starts with left panel open and right panel closed", () => {
		const state = useUIStore.getState();
		expect(state.leftPanelOpen).toBe(true);
		expect(state.rightPanelOpen).toBe(false);
	});

	it("toggleLeftPanel toggles left panel state", () => {
		useUIStore.getState().toggleLeftPanel();
		expect(useUIStore.getState().leftPanelOpen).toBe(false);
		useUIStore.getState().toggleLeftPanel();
		expect(useUIStore.getState().leftPanelOpen).toBe(true);
	});

	it("toggleRightPanel toggles right panel state", () => {
		useUIStore.getState().toggleRightPanel();
		expect(useUIStore.getState().rightPanelOpen).toBe(true);
		useUIStore.getState().toggleRightPanel();
		expect(useUIStore.getState().rightPanelOpen).toBe(false);
	});

	it("setRightPanelOpen sets explicit state", () => {
		useUIStore.getState().setRightPanelOpen(true);
		expect(useUIStore.getState().rightPanelOpen).toBe(true);
		useUIStore.getState().setRightPanelOpen(false);
		expect(useUIStore.getState().rightPanelOpen).toBe(false);
	});
});
