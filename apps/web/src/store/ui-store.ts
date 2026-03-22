import { create } from "zustand";

interface UIState {
	leftPanelOpen: boolean;
	rightPanelOpen: boolean;
	toggleLeftPanel: () => void;
	toggleRightPanel: () => void;
	setRightPanelOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
	leftPanelOpen: true,
	rightPanelOpen: false,
	toggleLeftPanel: () => set((s) => ({ leftPanelOpen: !s.leftPanelOpen })),
	toggleRightPanel: () => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),
	setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
}));
