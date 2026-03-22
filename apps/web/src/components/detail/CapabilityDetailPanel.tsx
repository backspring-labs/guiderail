import {
	seedJourneys,
	seedProcesses,
	seedProviderAssociations,
	seedProviders,
	seedStoryRoutes,
	seedValueStreams,
} from "@/store/seed-loader.js";
import type { Capability } from "@guiderail/core/entities";
import type { TerrainGraph } from "@guiderail/core/graph";
import { getNode, getProvidersForCapability } from "@guiderail/core/graph";

interface CapabilityDetailPanelProps {
	capability: Capability;
	graph: TerrainGraph;
	onSelectNode: (nodeId: string) => void;
	onSelectJourney: (journeyId: string) => void;
	onSelectValueStream?: (valueStreamId: string) => void;
	onSelectProcess?: (processId: string) => void;
	onStartRoute?: (storyRouteId: string) => void;
}

export function CapabilityDetailPanel({
	capability,
	graph,
	onSelectNode,
	onSelectJourney,
	onSelectValueStream,
	onSelectProcess,
	onStartRoute,
}: CapabilityDetailPanelProps) {
	const referencedNodes = capability.nodeIds
		.map((id) => getNode(graph, id))
		.filter((n) => n != null);

	const availableJourneys = seedJourneys.filter((j) => capability.journeyIds.includes(j.id));

	const providerIds = getProvidersForCapability(capability.id, seedProviderAssociations);
	const capProviders = seedProviders.filter((p) => providerIds.includes(p.id));

	const capValueStreams = seedValueStreams.filter((vs) => vs.capabilityIds.includes(capability.id));

	const capProcesses = seedProcesses.filter((p) => p.capabilityIds.includes(capability.id));

	const capStoryRoutes = seedStoryRoutes.filter((sr) =>
		sr.tags.some((t) => capability.tags.includes(t)),
	);

	return (
		<div className="detail-panel">
			<div className="detail-panel__header">
				<span className="detail-panel__type-badge" data-type="capability">
					capability
				</span>
				<h3 className="detail-panel__title">{capability.label}</h3>
			</div>

			{capability.description && (
				<p className="detail-panel__description">{capability.description}</p>
			)}

			{capability.tags.length > 0 && (
				<div className="detail-panel__tags">
					{capability.tags.map((tag) => (
						<span key={tag} className="detail-panel__tag">
							{tag}
						</span>
					))}
				</div>
			)}

			{capProviders.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Providers</h4>
					<ul className="detail-panel__list">
						{capProviders.map((p) => (
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

			{referencedNodes.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Referenced Nodes</h4>
					<ul className="detail-panel__list">
						{referencedNodes.map((n) => (
							<li key={n.id}>
								<button
									type="button"
									className="detail-panel__link"
									onClick={() => onSelectNode(n.id)}
								>
									{n.label}
									<span className="detail-panel__link-type">{n.type}</span>
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			{capValueStreams.length > 0 && onSelectValueStream && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Value Streams</h4>
					<ul className="detail-panel__list">
						{capValueStreams.map((vs) => (
							<li key={vs.id}>
								<button
									type="button"
									className="detail-panel__link"
									onClick={() => onSelectValueStream(vs.id)}
								>
									{vs.label}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			{capProcesses.length > 0 && onSelectProcess && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Processes</h4>
					<ul className="detail-panel__list">
						{capProcesses.map((p) => (
							<li key={p.id}>
								<button
									type="button"
									className="detail-panel__link"
									onClick={() => onSelectProcess(p.id)}
								>
									{p.label}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			{availableJourneys.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Journeys</h4>
					<ul className="detail-panel__list">
						{availableJourneys.map((j) => (
							<li key={j.id}>
								<button
									type="button"
									className="detail-panel__link detail-panel__link--journey"
									onClick={() => onSelectJourney(j.id)}
								>
									{j.label}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			{capStoryRoutes.length > 0 && onStartRoute && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Guided Routes</h4>
					<ul className="detail-panel__list">
						{capStoryRoutes.map((sr) => (
							<li key={sr.id}>
								<button
									type="button"
									className="detail-panel__link detail-panel__link--route"
									onClick={() => onStartRoute(sr.id)}
								>
									{sr.title}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
