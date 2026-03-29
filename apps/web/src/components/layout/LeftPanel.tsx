import { CollapsibleSection } from "@/components/navigation/CollapsibleSection.js";
import {
	seedCapabilities,
	seedDomains,
	seedJourneys,
	seedNodes,
	seedProcessStages,
	seedProcesses,
	seedProviderAssociations,
	seedProviders,
	seedSequences,
	seedStoryRoutes,
} from "@/store/seed-loader.js";
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

export function LeftPanel(props: LeftPanelProps) {
	const { leftPanelOpen, toggleLeftPanel } = useUIStore();
	const [filter, setFilter] = useState("");

	if (!leftPanelOpen) {
		return (
			<div className="left-panel left-panel--closed">
				<button type="button" className="left-panel__toggle" onClick={toggleLeftPanel}>
					▶
				</button>
			</div>
		);
	}

	const filterLower = filter.toLowerCase();
	const matchesFilter = (label: string) => !filter || label.toLowerCase().includes(filterLower);

	// When filtering, show all matching items regardless of scoping.
	// When not filtering, scope to active selection.
	const isFiltering = filter.length > 0;
	const activeCap = props.activeCapabilityId;

	const domainItems = seedDomains.filter((d) => matchesFilter(d.label));
	const capItems = isFiltering
		? seedCapabilities.filter((c) => matchesFilter(c.label))
		: props.activeDomainId
			? seedCapabilities.filter((c) => c.domainId === props.activeDomainId)
			: [];
	const journeyItems = isFiltering
		? seedJourneys.filter((j) => matchesFilter(j.label))
		: activeCap
			? seedJourneys.filter(
					(j) => j.capabilityIds.includes(activeCap) || j.entryCapabilityId === activeCap,
				)
			: [];
	const processItems = isFiltering
		? seedProcesses.filter((p) => matchesFilter(p.label))
		: activeCap
			? seedProcesses.filter((p) => p.capabilityIds.includes(activeCap))
			: [];
	const sequenceItems = isFiltering
		? seedSequences.filter((s) => matchesFilter(s.label))
		: seedSequences.filter(
				(s) => s.capabilityId === props.activeCapabilityId || s.processId === props.activeProcessId,
			);
	const providerItems = isFiltering
		? seedProviders.filter((p) => matchesFilter(p.label))
		: props.activeCapabilityId
			? resolveProviders(props.activeCapabilityId, "")
			: [];
	const systemItems = isFiltering
		? seedNodes.filter((n) => matchesFilter(n.label))
		: resolveSystemNodes(props.activeProcessId, props.activeCapabilityId);
	const guideItems = seedStoryRoutes.filter((r) => matchesFilter(r.title));

	return (
		<div className="left-panel left-panel--open">
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
				</div>

				<div className="left-panel__entity-zone">
					<CollapsibleSection
						label="Domains"
						count={domainItems.length}
						defaultExpanded
						forceExpanded={isFiltering}
					>
						{domainItems.map((d) => (
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
						count={capItems.length}
						defaultExpanded
						forceExpanded={isFiltering}
					>
						{capItems.map((c) => (
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
						count={journeyItems.length}
						forceExpanded={isFiltering}
					>
						{journeyItems.map((j) => (
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
						count={processItems.length}
						forceExpanded={isFiltering}
					>
						{processItems.map((p) => (
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
						count={sequenceItems.length}
						forceExpanded={isFiltering}
					>
						{sequenceItems.map((s) => (
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
						count={providerItems.length}
						forceExpanded={isFiltering}
					>
						{providerItems.map((p) => (
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
						count={systemItems.length}
						forceExpanded={isFiltering}
					>
						{systemItems.map((n) => (
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
						count={guideItems.length}
						defaultExpanded
						forceExpanded={isFiltering}
					>
						{guideItems.map((r) => (
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
		</div>
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

function resolveProviders(capabilityId: string, filterLower: string) {
	const associationProviderIds = seedProviderAssociations
		.filter((pa) => pa.targetType === "capability" && pa.targetId === capabilityId)
		.map((pa) => pa.providerId);
	return seedProviders
		.filter((p) => associationProviderIds.includes(p.id))
		.filter((p) => !filterLower || p.label.toLowerCase().includes(filterLower));
}

function resolveSystemNodes(activeProcessId: string | null, activeCapabilityId: string | null) {
	if (activeProcessId) {
		const stageNodeIds = new Set(
			seedProcessStages.filter((s) => s.processId === activeProcessId).flatMap((s) => s.nodeIds),
		);
		return seedNodes.filter((n) => stageNodeIds.has(n.id));
	}
	if (activeCapabilityId) {
		const processIds = seedProcesses
			.filter((p) => p.capabilityIds.includes(activeCapabilityId))
			.map((p) => p.id);
		const stageNodeIds = new Set(
			seedProcessStages.filter((s) => processIds.includes(s.processId)).flatMap((s) => s.nodeIds),
		);
		return seedNodes.filter((n) => stageNodeIds.has(n.id));
	}
	return [];
}
