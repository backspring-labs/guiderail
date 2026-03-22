import { seedCapabilities, seedDomains } from "@/store/seed-loader.js";
import { getCapabilitiesForDomain } from "@guiderail/core/graph";
import { CapabilityItem } from "./CapabilityItem.js";
import { DomainItem } from "./DomainItem.js";

interface DomainCapabilityBrowserProps {
	activeDomainId: string | null;
	activeCapabilityId: string | null;
	onSelectDomain: (domainId: string) => void;
	onSelectCapability: (capabilityId: string) => void;
	onClearDomain: () => void;
}

export function DomainCapabilityBrowser({
	activeDomainId,
	activeCapabilityId,
	onSelectDomain,
	onSelectCapability,
	onClearDomain,
}: DomainCapabilityBrowserProps) {
	return (
		<div className="domain-browser">
			<div className="domain-browser__header">
				<span className="domain-browser__title">Domains</span>
				{activeDomainId && (
					<button type="button" className="domain-browser__clear" onClick={onClearDomain}>
						Clear
					</button>
				)}
			</div>
			<div className="domain-browser__list">
				{seedDomains.map((domain) => {
					const isActiveDomain = domain.id === activeDomainId;
					const domainCaps = getCapabilitiesForDomain(domain.id, seedCapabilities);

					return (
						<div key={domain.id} className="domain-browser__domain">
							<DomainItem
								label={domain.label}
								capabilityCount={domainCaps.length}
								isActive={isActiveDomain}
								onClick={() => onSelectDomain(domain.id)}
							/>

							{isActiveDomain && (
								<div className="domain-browser__capabilities">
									{domainCaps.map((cap) => (
										<CapabilityItem
											key={cap.id}
											label={cap.label}
											nodeCount={cap.nodeIds.length}
											isActive={cap.id === activeCapabilityId}
											onClick={() => onSelectCapability(cap.id)}
										/>
									))}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
