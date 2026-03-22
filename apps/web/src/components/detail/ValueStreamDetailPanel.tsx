import { seedCapabilities, seedProviderAssociations, seedProviders } from "@/store/seed-loader.js";
import type { ValueStream } from "@guiderail/core/entities";
import { getProvidersForValueStream } from "@guiderail/core/graph";

interface ValueStreamDetailPanelProps {
	valueStream: ValueStream;
	onSelectCapability: (capabilityId: string) => void;
}

export function ValueStreamDetailPanel({
	valueStream,
	onSelectCapability,
}: ValueStreamDetailPanelProps) {
	const linkedCapabilities = seedCapabilities.filter((c) =>
		valueStream.capabilityIds.includes(c.id),
	);
	const providerIds = getProvidersForValueStream(valueStream.id, seedProviderAssociations);
	const linkedProviders = seedProviders.filter((p) => providerIds.includes(p.id));

	return (
		<div className="detail-panel">
			<div className="detail-panel__header">
				<span className="detail-panel__type-badge" data-type="value-stream">
					value stream
				</span>
				<h3 className="detail-panel__title">{valueStream.label}</h3>
			</div>

			{valueStream.description && (
				<p className="detail-panel__description">{valueStream.description}</p>
			)}

			{valueStream.tags.length > 0 && (
				<div className="detail-panel__tags">
					{valueStream.tags.map((tag) => (
						<span key={tag} className="detail-panel__tag">
							{tag}
						</span>
					))}
				</div>
			)}

			{linkedCapabilities.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Capabilities</h4>
					<ul className="detail-panel__list">
						{linkedCapabilities.map((cap) => (
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

			{linkedProviders.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Providers</h4>
					<ul className="detail-panel__list">
						{linkedProviders.map((p) => (
							<li key={p.id} className="detail-panel__list-item">
								<span className="detail-panel__provider-badge" data-category={p.category}>
									{p.category}
								</span>
								{p.label}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
