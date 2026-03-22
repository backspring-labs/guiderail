import {
	seedCapabilities,
	seedDomains,
	seedJourneys,
	seedProcesses,
	seedStoryRoutes,
	seedValueStreams,
} from "@/store/seed-loader.js";

interface BreadcrumbProps {
	activeDomainId: string | null;
	activeCapabilityId: string | null;
	activeJourneyId: string | null;
	activeStepIndex: number | null;
	totalSteps: number;
	activeValueStreamId: string | null;
	activeProcessId: string | null;
	activeStoryRouteId: string | null;
	routeState: "inactive" | "active" | "paused";
	onClearDomain: () => void;
	onClearCapability: () => void;
}

export function Breadcrumb({
	activeDomainId,
	activeCapabilityId,
	activeJourneyId,
	activeStepIndex,
	totalSteps,
	activeValueStreamId,
	activeProcessId,
	activeStoryRouteId,
	routeState,
	onClearDomain,
	onClearCapability,
}: BreadcrumbProps) {
	const domain = activeDomainId ? seedDomains.find((d) => d.id === activeDomainId) : null;
	const capability = activeCapabilityId
		? seedCapabilities.find((c) => c.id === activeCapabilityId)
		: null;
	const journey = activeJourneyId ? seedJourneys.find((j) => j.id === activeJourneyId) : null;
	const valueStream = activeValueStreamId
		? seedValueStreams.find((vs) => vs.id === activeValueStreamId)
		: null;
	const process = activeProcessId ? seedProcesses.find((p) => p.id === activeProcessId) : null;
	const storyRoute = activeStoryRouteId
		? seedStoryRoutes.find((sr) => sr.id === activeStoryRouteId)
		: null;

	return (
		<div className="breadcrumb">
			<button type="button" className="breadcrumb__segment" onClick={onClearDomain}>
				All Domains
			</button>
			{domain && (
				<>
					<span className="breadcrumb__separator">&rsaquo;</span>
					<button type="button" className="breadcrumb__segment" onClick={onClearCapability}>
						{domain.label}
					</button>
				</>
			)}
			{valueStream && (
				<>
					<span className="breadcrumb__separator">&rsaquo;</span>
					<span className="breadcrumb__segment breadcrumb__segment--value-stream">
						{valueStream.label}
					</span>
				</>
			)}
			{capability && (
				<>
					<span className="breadcrumb__separator">&rsaquo;</span>
					<span className="breadcrumb__segment breadcrumb__segment--current">
						{capability.label}
					</span>
				</>
			)}
			{process && (
				<>
					<span className="breadcrumb__separator">&rsaquo;</span>
					<span className="breadcrumb__segment breadcrumb__segment--process">{process.label}</span>
				</>
			)}
			{journey && (
				<>
					<span className="breadcrumb__separator">&rsaquo;</span>
					<span className="breadcrumb__segment breadcrumb__segment--journey">
						{journey.label}
						{activeStepIndex != null && (
							<span className="breadcrumb__step-count">
								{" "}
								(Step {activeStepIndex + 1}/{totalSteps})
							</span>
						)}
					</span>
				</>
			)}
			{storyRoute && routeState !== "inactive" && (
				<>
					<span className="breadcrumb__separator">&rsaquo;</span>
					<span className="breadcrumb__segment breadcrumb__segment--route">
						<span
							className={`breadcrumb__route-state ${routeState === "paused" ? "breadcrumb__route-state--paused" : "breadcrumb__route-state--active"}`}
						/>
						{storyRoute.title}
					</span>
				</>
			)}
		</div>
	);
}
