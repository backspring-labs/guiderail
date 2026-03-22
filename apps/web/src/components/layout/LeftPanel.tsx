import { DomainCapabilityBrowser } from "@/components/navigation/DomainCapabilityBrowser.js";
import { useUIStore } from "@/store/ui-store.js";

interface LeftPanelProps {
	activeDomainId: string | null;
	activeCapabilityId: string | null;
	onSelectDomain: (domainId: string) => void;
	onSelectCapability: (capabilityId: string) => void;
	onClearDomain: () => void;
}

export function LeftPanel({
	activeDomainId,
	activeCapabilityId,
	onSelectDomain,
	onSelectCapability,
	onClearDomain,
}: LeftPanelProps) {
	const { leftPanelOpen, toggleLeftPanel } = useUIStore();

	return (
		<div className={`left-panel ${leftPanelOpen ? "left-panel--open" : "left-panel--closed"}`}>
			<button type="button" className="left-panel__toggle" onClick={toggleLeftPanel}>
				{leftPanelOpen ? "\u25C0" : "\u25B6"}
			</button>
			{leftPanelOpen && (
				<DomainCapabilityBrowser
					activeDomainId={activeDomainId}
					activeCapabilityId={activeCapabilityId}
					onSelectDomain={onSelectDomain}
					onSelectCapability={onSelectCapability}
					onClearDomain={onClearDomain}
				/>
			)}
		</div>
	);
}
