import { useUIStore } from "@/store/ui-store.js";
import { useEffect } from "react";

export function useAutoPanel(nav: {
	selectedNodeId: string | null;
	selectedEdgeId: string | null;
	activeProcessId: string | null;
	activeValueStreamId: string | null;
	activeDomainId: string | null;
	activeCapabilityId: string | null;
}) {
	const setRightPanelOpen = useUIStore((s) => s.setRightPanelOpen);

	useEffect(() => {
		const hasContext =
			nav.selectedNodeId != null ||
			nav.selectedEdgeId != null ||
			nav.activeProcessId != null ||
			nav.activeValueStreamId != null ||
			nav.activeDomainId != null ||
			nav.activeCapabilityId != null;
		setRightPanelOpen(hasContext);
	}, [
		nav.selectedNodeId,
		nav.selectedEdgeId,
		nav.activeProcessId,
		nav.activeValueStreamId,
		nav.activeDomainId,
		nav.activeCapabilityId,
		setRightPanelOpen,
	]);
}
