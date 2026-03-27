import {
	seedCapabilities,
	seedDomains,
	seedJourneys,
	seedPerspectives,
	seedProcesses,
	seedSequences,
	seedStoryRoutes,
	seedValueStreams,
} from "@/store/seed-loader.js";

const CANVAS_MODES: Record<string, Array<{ id: string; label: string; defaultMode: string }>> = {
	process: [
		{ id: "operational", label: "Operational", defaultMode: "operational" },
		{ id: "activity", label: "Decision", defaultMode: "operational" },
		{ id: "risk_controls", label: "Controls", defaultMode: "operational" },
	],
	landscape: [
		{ id: "capability", label: "Capability", defaultMode: "capability" },
		{ id: "providers", label: "Providers", defaultMode: "capability" },
	],
	architecture: [
		{ id: "logical", label: "Logical", defaultMode: "logical" },
		{ id: "deployment", label: "Deployment", defaultMode: "logical" },
	],
};

interface ContextBarProps {
	activeDomainId: string | null;
	activeCapabilityId: string | null;
	activeJourneyId: string | null;
	activeStepIndex: number | null;
	totalSteps: number;
	activeValueStreamId: string | null;
	activeProcessId: string | null;
	activeSequenceId: string | null;
	activeStoryRouteId: string | null;
	activePerspectiveId: string;
	activeCanvasMode: string | null;
	routeState: "inactive" | "active" | "paused";
	onClearDomain: () => void;
	onClearCapability: () => void;
	onSwitchCanvasMode: (mode: string) => void;
}

export function ContextBar(props: ContextBarProps) {
	const perspectiveType =
		seedPerspectives.find((p) => p.id === props.activePerspectiveId)?.type ?? "landscape";

	return (
		<div className="context-bar">
			<BreadcrumbTrail
				activeDomainId={props.activeDomainId}
				activeCapabilityId={props.activeCapabilityId}
				activeJourneyId={props.activeJourneyId}
				activeStepIndex={props.activeStepIndex}
				totalSteps={props.totalSteps}
				activeValueStreamId={props.activeValueStreamId}
				activeProcessId={props.activeProcessId}
				activeSequenceId={props.activeSequenceId}
				activeStoryRouteId={props.activeStoryRouteId}
				routeState={props.routeState}
				onClearDomain={props.onClearDomain}
				onClearCapability={props.onClearCapability}
			/>
			{CANVAS_MODES[perspectiveType] && (
				<CanvasModeSwitcher
					modes={CANVAS_MODES[perspectiveType]}
					activeCanvasMode={props.activeCanvasMode}
					onSwitchCanvasMode={props.onSwitchCanvasMode}
				/>
			)}
		</div>
	);
}

interface BreadcrumbTrailProps {
	activeDomainId: string | null;
	activeCapabilityId: string | null;
	activeJourneyId: string | null;
	activeStepIndex: number | null;
	totalSteps: number;
	activeValueStreamId: string | null;
	activeProcessId: string | null;
	activeSequenceId: string | null;
	activeStoryRouteId: string | null;
	routeState: "inactive" | "active" | "paused";
	onClearDomain: () => void;
	onClearCapability: () => void;
}

function BreadcrumbTrail(props: BreadcrumbTrailProps) {
	const domain = props.activeDomainId
		? seedDomains.find((d) => d.id === props.activeDomainId)
		: null;
	const capability = props.activeCapabilityId
		? seedCapabilities.find((c) => c.id === props.activeCapabilityId)
		: null;
	const journey = props.activeJourneyId
		? seedJourneys.find((j) => j.id === props.activeJourneyId)
		: null;
	const valueStream = props.activeValueStreamId
		? seedValueStreams.find((vs) => vs.id === props.activeValueStreamId)
		: null;
	const process = props.activeProcessId
		? seedProcesses.find((p) => p.id === props.activeProcessId)
		: null;
	const sequence = props.activeSequenceId
		? seedSequences.find((s) => s.id === props.activeSequenceId)
		: null;
	const storyRoute = props.activeStoryRouteId
		? seedStoryRoutes.find((sr) => sr.id === props.activeStoryRouteId)
		: null;

	return (
		<div className="context-bar__breadcrumb">
			<button type="button" className="context-bar__segment" onClick={props.onClearDomain}>
				All Domains
			</button>
			{domain && (
				<>
					<span className="context-bar__separator">&rsaquo;</span>
					<button type="button" className="context-bar__segment" onClick={props.onClearCapability}>
						{domain.label}
					</button>
				</>
			)}
			{valueStream && (
				<>
					<span className="context-bar__separator">&rsaquo;</span>
					<span className="context-bar__segment context-bar__segment--value-stream">
						{valueStream.label}
					</span>
				</>
			)}
			{capability && (
				<>
					<span className="context-bar__separator">&rsaquo;</span>
					<span className="context-bar__segment context-bar__segment--current">
						{capability.label}
					</span>
				</>
			)}
			{process && (
				<>
					<span className="context-bar__separator">&rsaquo;</span>
					<span className="context-bar__segment context-bar__segment--process">
						{process.label}
					</span>
				</>
			)}
			{sequence && (
				<>
					<span className="context-bar__separator">&rsaquo;</span>
					<span className="context-bar__segment context-bar__segment--sequence">
						{sequence.label}
					</span>
				</>
			)}
			{journey && (
				<>
					<span className="context-bar__separator">&rsaquo;</span>
					<span className="context-bar__segment context-bar__segment--journey">
						{journey.label}
						{props.activeStepIndex != null && (
							<span className="context-bar__step-count">
								{" "}
								(Step {props.activeStepIndex + 1}/{props.totalSteps})
							</span>
						)}
					</span>
				</>
			)}
			{storyRoute && props.routeState !== "inactive" && (
				<>
					<span className="context-bar__separator">&rsaquo;</span>
					<span className="context-bar__segment context-bar__segment--route">
						<span
							className={`context-bar__route-state ${props.routeState === "paused" ? "context-bar__route-state--paused" : "context-bar__route-state--active"}`}
						/>
						{storyRoute.title}
					</span>
				</>
			)}
		</div>
	);
}

interface CanvasModeSwitcherProps {
	modes: Array<{ id: string; label: string; defaultMode: string }>;
	activeCanvasMode: string | null;
	onSwitchCanvasMode: (mode: string) => void;
}

function CanvasModeSwitcher({
	modes,
	activeCanvasMode,
	onSwitchCanvasMode,
}: CanvasModeSwitcherProps) {
	const defaultMode = modes[0]?.defaultMode ?? modes[0]?.id ?? "";
	const currentMode = activeCanvasMode ?? defaultMode;

	return (
		<div className="context-bar__canvas-modes">
			{modes.map((mode) => (
				<button
					key={mode.id}
					type="button"
					className={`context-bar__canvas-mode ${currentMode === mode.id ? "context-bar__canvas-mode--active" : ""}`}
					onClick={() => onSwitchCanvasMode(mode.id)}
				>
					{mode.label}
				</button>
			))}
		</div>
	);
}
