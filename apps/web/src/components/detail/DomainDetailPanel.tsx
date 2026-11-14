import { useDataset } from "@/data/dataset-context.js";
import type { Domain } from "@guiderail/core/entities";
import { getCapabilitiesForDomain } from "@guiderail/core/graph";

interface DomainDetailPanelProps {
	domain: Domain;
	onSelectCapability: (capabilityId: string) => void;
}

export function DomainDetailPanel({ domain, onSelectCapability }: DomainDetailPanelProps) {
	const dataset = useDataset();
	const capabilities = getCapabilitiesForDomain(domain.id, dataset.capabilities);

	return (
		<div className="detail-panel">
			<div className="detail-panel__header">
				<span className="detail-panel__type-badge" data-type="domain">
					domain
				</span>
				<h2 className="detail-panel__title">{domain.label}</h2>
			</div>

			{domain.description && <p className="detail-panel__description">{domain.description}</p>}

			{capabilities.length > 0 && (
				<div className="detail-panel__section">
					<h3 className="detail-panel__section-title">Capabilities</h3>
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
