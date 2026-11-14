import { CollapsibleSection } from "@/components/navigation/CollapsibleSection.js";
import { useDataset } from "@/data/dataset-context.js";
import type { Dataset } from "@/data/dataset.js";
import { useUIStore } from "@/store/ui-store.js";
import { useState } from "react";

interface LeftPanelProps {
	activeDomainId: string | null;
	activeCapabilityId: string | null;
	activeJourneyId: string | null;
	activeProcessId: string | null;
	activeSequenceId: string | null;
	activeStoryRouteId: string | null;
	routeState: "inactive" | "active" | "paused";
	onSelectDomain: (domainId: string) => void;
	onSelectCapability: (capabilityId: string) => void;
	onSelectJourney: (journeyId: string) => void;
	onSelectProcess: (processId: string) => void;
	onSelectSequence: (sequenceId: string) => void;
	onStartRoute: (routeId: string) => void;
	onSelectNode: (nodeId: string) => void;
	onClearDomain: () => void;
}

function resolveSections(filter: string, props: LeftPanelProps, dataset: Dataset) {
	const filterLower = filter.toLowerCase();
	const matchesFilter = (label: string) => !filter || label.toLowerCase().includes(filterLower);
	const isFiltering = filter.length > 0;
	const activeCap = props.activeCapabilityId;

	const domains = dataset.domains.filter((d) => matchesFilter(d.label));
	const capabilities = isFiltering
		? dataset.capabilities.filter((c) => matchesFilter(c.label))
		: props.activeDomainId
			? dataset.capabilities.filter((c) => c.domainId === props.activeDomainId)
			: [];
	const journeys = isFiltering
		? dataset.journeys.filter((j) => matchesFilter(j.label))
		: activeCap
			? dataset.journeys.filter(
					(j) => j.capabilityIds.includes(activeCap) || j.entryCapabilityId === activeCap,
				)
			: [];
	const processes = isFiltering
		? dataset.processes.filter((p) => matchesFilter(p.label))
		: activeCap
			? dataset.processes.filter((p) => p.capabilityIds.includes(activeCap))
			: [];
	const sequences = isFiltering
		? dataset.sequences.filter((s) => matchesFilter(s.label))
		: dataset.sequences.filter(
				(s) => s.capabilityId === props.activeCapabilityId || s.processId === props.activeProcessId,
			);
	const providers = isFiltering
		? dataset.providers.filter((p) => matchesFilter(p.label))
		: props.activeCapabilityId
			? resolveProviders(props.activeCapabilityId, "", dataset)
			: [];
	const systems = isFiltering
		? dataset.nodes.filter((n) => matchesFilter(n.label))
		: resolveSystemNodes(props.activeProcessId, props.activeCapabilityId, dataset);
	const guides = dataset.storyRoutes.filter((r) => matchesFilter(r.title));

	return {
		domains,
		capabilities,
		journeys,
		processes,
		sequences,
		providers,
		systems,
		guides,
		isFiltering,
	};
}

export function LeftPanel(props: LeftPanelProps) {
	const dataset = useDataset();
	const { leftPanelOpen, toggleLeftPanel } = useUIStore();
	const [filter, setFilter] = useState("");

	if (!leftPanelOpen) {
		return (
			<aside className="left-panel left-panel--closed" aria-label="Browse">
				<button type="button" className="left-panel__toggle" onClick={toggleLeftPanel}>
					▶
				</button>
			</aside>
		);
	}

	const sections = resolveSections(filter, props, dataset);

	return (
		<aside className="left-panel left-panel--open" aria-label="Browse">
			<button type="button" className="left-panel__toggle" onClick={toggleLeftPanel}>
				◀
			</button>
			<div className="left-panel__content">
				<div className="left-panel__filter">
					<input
						type="text"
						className="left-panel__filter-input"
						placeholder="Filter..."
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
					/>
					{filter && (
						<button
							type="button"
							className="left-panel__filter-clear"
							onClick={() => setFilter("")}
						>
							×
						</button>
					)}
				</div>

				<div className="left-panel__entity-zone">
					<CollapsibleSection
						label="Domains"
						count={sections.domains.length}
						defaultExpanded
						forceExpanded={sections.isFiltering}
					>
						{sections.domains.map((d) => (
							<SectionItem
								key={d.id}
								label={d.label}
								active={d.id === props.activeDomainId}
								onClick={() => props.onSelectDomain(d.id)}
							/>
						))}
					</CollapsibleSection>

					<CollapsibleSection
						label="Capabilities"
						count={sections.capabilities.length}
						defaultExpanded
						forceExpanded={sections.isFiltering}
					>
						{sections.capabilities.map((c) => (
							<SectionItem
								key={c.id}
								label={c.label}
								active={c.id === props.activeCapabilityId}
								onClick={() => props.onSelectCapability(c.id)}
							/>
						))}
					</CollapsibleSection>

					<CollapsibleSection
						label="Journeys"
						count={sections.journeys.length}
						forceExpanded={sections.isFiltering}
					>
						{sections.journeys.map((j) => (
							<SectionItem
								key={j.id}
								label={j.label}
								active={j.id === props.activeJourneyId}
								onClick={() => props.onSelectJourney(j.id)}
							/>
						))}
					</CollapsibleSection>

					<CollapsibleSection
						label="Processes"
						count={sections.processes.length}
						forceExpanded={sections.isFiltering}
					>
						{sections.processes.map((p) => (
							<SectionItem
								key={p.id}
								label={p.label}
								active={p.id === props.activeProcessId}
								onClick={() => props.onSelectProcess(p.id)}
							/>
						))}
					</CollapsibleSection>

					<CollapsibleSection
						label="Sequences"
						count={sections.sequences.length}
						forceExpanded={sections.isFiltering}
					>
						{sections.sequences.map((s) => (
							<SectionItem
								key={s.id}
								label={s.label}
								active={s.id === props.activeSequenceId}
								onClick={() => props.onSelectSequence(s.id)}
							/>
						))}
					</CollapsibleSection>

					<CollapsibleSection
						label="Providers"
						count={sections.providers.length}
						forceExpanded={sections.isFiltering}
					>
						{sections.providers.map((p) => (
							<SectionItem
								key={p.id}
								label={p.label}
								active={false}
								onClick={() => props.onSelectNode(p.id)}
							/>
						))}
					</CollapsibleSection>

					<CollapsibleSection
						label="Systems"
						count={sections.systems.length}
						forceExpanded={sections.isFiltering}
					>
						{sections.systems.map((n) => (
							<SectionItem
								key={n.id}
								label={n.label}
								active={false}
								onClick={() => props.onSelectNode(n.id)}
							/>
						))}
					</CollapsibleSection>
				</div>

				<div className="left-panel__teaching-zone">
					<CollapsibleSection
						label="Guides"
						count={sections.guides.length}
						defaultExpanded
						forceExpanded={sections.isFiltering}
					>
						{sections.guides.map((r) => (
							<SectionItem
								key={r.id}
								label={r.title}
								active={r.id === props.activeStoryRouteId && props.routeState !== "inactive"}
								onClick={() => props.onStartRoute(r.id)}
							/>
						))}
					</CollapsibleSection>
				</div>
			</div>
		</aside>
	);
}

interface SectionItemProps {
	label: string;
	active: boolean;
	onClick: () => void;
}

function SectionItem({ label, active, onClick }: SectionItemProps) {
	return (
		<button
			type="button"
			className={`section-item ${active ? "section-item--active" : ""}`}
			onClick={onClick}
		>
			{label}
		</button>
	);
}

function resolveProviders(capabilityId: string, filterLower: string, dataset: Dataset) {
	const associationProviderIds = dataset.providerAssociations
		.filter((pa) => pa.targetType === "capability" && pa.targetId === capabilityId)
		.map((pa) => pa.providerId);
	return dataset.providers
		.filter((p) => associationProviderIds.includes(p.id))
		.filter((p) => !filterLower || p.label.toLowerCase().includes(filterLower));
}

function resolveSystemNodes(
	activeProcessId: string | null,
	activeCapabilityId: string | null,
	dataset: Dataset,
) {
	if (activeProcessId) {
		const stageNodeIds = new Set(
			dataset.processStages
				.filter((s) => s.processId === activeProcessId)
				.flatMap((s) => s.nodeIds),
		);
		return dataset.nodes.filter((n) => stageNodeIds.has(n.id));
	}
	if (activeCapabilityId) {
		const processIds = dataset.processes
			.filter((p) => p.capabilityIds.includes(activeCapabilityId))
			.map((p) => p.id);
		const stageNodeIds = new Set(
			dataset.processStages
				.filter((s) => processIds.includes(s.processId))
				.flatMap((s) => s.nodeIds),
		);
		return dataset.nodes.filter((n) => stageNodeIds.has(n.id));
	}
	return [];
}
