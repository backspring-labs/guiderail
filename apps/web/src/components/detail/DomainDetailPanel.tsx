import { seedCapabilities } from "@/store/seed-loader.js";
import type { Domain } from "@guiderail/core/entities";
import { getCapabilitiesForDomain } from "@guiderail/core/graph";

interface DomainDetailPanelProps {
	domain: Domain;
	onSelectCapability: (capabilityId: string) => void;
}

export function DomainDetailPanel({ domain, onSelectCapability }: DomainDetailPanelProps) {
	const capabilities = getCapabilitiesForDomain(domain.id, seedCapabilities);

	return (
		<div className="detail-panel">
			<div className="detail-panel__header">
				<span className="detail-panel__type-badge" data-type="domain">
					domain
				</span>
				<h3 className="detail-panel__title">{domain.label}</h3>
			</div>

			{domain.description && <p className="detail-panel__description">{domain.description}</p>}

			{capabilities.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Capabilities</h4>
					<ul className="detail-panel__list">
						{capabilities.map((cap) => (
							<li key={cap.id}>
								<button
									type="button"
									className="detail-panel__link"
									onClick={() => onSelectCapability(cap.id)}
								>
									{cap.label}
									<span className="detail-panel__link-type">{cap.nodeIds.length} nodes</span>
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
