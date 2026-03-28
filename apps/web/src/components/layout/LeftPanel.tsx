import { CollapsibleSection } from "@/components/navigation/CollapsibleSection.js";
import {
	seedCapabilities,
	seedDomains,
	seedJourneys,
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

	// Scoped data
	const domainItems = seedDomains.filter((d) => matchesFilter(d.label));
	const activeCap = props.activeCapabilityId;
	const capItems = props.activeDomainId
		? seedCapabilities.filter((c) => c.domainId === props.activeDomainId && matchesFilter(c.label))
		: [];
	const journeyItems = activeCap
		? seedJourneys.filter(
				(j) =>
					(j.capabilityIds.includes(activeCap) || j.entryCapabilityId === activeCap) &&
					matchesFilter(j.label),
			)
		: [];
	const processItems = activeCap
		? seedProcesses.filter((p) => p.capabilityIds.includes(activeCap) && matchesFilter(p.label))
		: [];
	const sequenceItems = seedSequences.filter(
		(s) =>
			(s.capabilityId === props.activeCapabilityId || s.processId === props.activeProcessId) &&
			matchesFilter(s.label),
	);
	const providerItems = props.activeCapabilityId
		? resolveProviders(props.activeCapabilityId, filterLower)
		: [];
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
					<CollapsibleSection label="Domains" count={domainItems.length} defaultExpanded>
						{domainItems.map((d) => (
							<SectionItem
								key={d.id}
								label={d.label}
								active={d.id === props.activeDomainId}
								onClick={() => props.onSelectDomain(d.id)}
							/>
						))}
					</CollapsibleSection>

					<CollapsibleSection label="Capabilities" count={capItems.length} defaultExpanded>
						{capItems.map((c) => (
							<SectionItem
								key={c.id}
								label={c.label}
								active={c.id === props.activeCapabilityId}
								onClick={() => props.onSelectCapability(c.id)}
							/>
						))}
					</CollapsibleSection>

					<CollapsibleSection label="Journeys" count={journeyItems.length}>
						{journeyItems.map((j) => (
							<SectionItem
								key={j.id}
								label={j.label}
								active={j.id === props.activeJourneyId}
								onClick={() => props.onSelectJourney(j.id)}
							/>
						))}
					</CollapsibleSection>

					<CollapsibleSection label="Processes" count={processItems.length}>
						{processItems.map((p) => (
							<SectionItem
								key={p.id}
								label={p.label}
								active={p.id === props.activeProcessId}
								onClick={() => props.onSelectProcess(p.id)}
							/>
						))}
					</CollapsibleSection>

					<CollapsibleSection label="Sequences" count={sequenceItems.length}>
						{sequenceItems.map((s) => (
							<SectionItem
								key={s.id}
								label={s.label}
								active={s.id === props.activeSequenceId}
								onClick={() => props.onSelectSequence(s.id)}
							/>
						))}
					</CollapsibleSection>

					<CollapsibleSection label="Providers" count={providerItems.length}>
						{providerItems.map((p) => (
							<SectionItem key={p.id} label={p.label} active={false} onClick={() => {}} />
						))}
					</CollapsibleSection>
				</div>

				<div className="left-panel__teaching-zone">
					<CollapsibleSection label="Guides" count={guideItems.length} defaultExpanded>
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
