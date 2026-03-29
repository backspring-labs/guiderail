import { OrientationDeck } from "@/components/canvas/OrientationDeck.js";
import { edgeTypes } from "@/components/canvas/edges/edge-types.js";
import { nodeTypes } from "@/components/canvas/nodes/node-types.js";
import { ContextBar } from "@/components/navigation/ContextBar.js";
import { SearchPalette } from "@/components/navigation/SearchPalette.js";
import { StepperControl } from "@/components/navigation/StepperControl.js";
import { StoryRouteBar } from "@/components/route/StoryRouteBar.js";
import { useAutoPanel } from "@/hooks/use-auto-panel.js";
import {
	useExpandEvents,
	useFitViewOnSwitch,
	useSearchShortcut,
} from "@/hooks/use-canvas-events.js";
import { useInitializeContext, useNavigation } from "@/hooks/use-context-machine.js";
import { useOrientationEvents } from "@/hooks/use-orientation-events.js";
import { usePerspectiveProvider } from "@/hooks/use-perspective-provider.js";
import { useStepperKeyboard } from "@/hooks/use-stepper-keyboard.js";
import {
	seedMessages,
	seedOrientationItems,
	seedPerspectives,
	seedProcessStages,
	seedSequences,
	seedSteps,
	seedStoryRoutes,
	seedStoryWaypoints,
} from "@/store/seed-loader.js";
import type { Edge as RFEdge, Node as RFNode } from "@xyflow/react";
import {
	Background,
	BackgroundVariant,
	Controls,
	MiniMap,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import { useEffect } from "react";
import { LeftPanel } from "./LeftPanel.js";
import { RightPanel } from "./RightPanel.js";
import { TopBar } from "./TopBar.js";

import type { ContextMachineEvent } from "@guiderail/core/context";

type SendFn = (event: ContextMachineEvent) => void;

const CUSTOM_SELECTION_PERSPECTIVES = new Set([
	"orientation",
	"landscape",
	"journey",
	"sequence",
	"process",
]);

const NODE_CLICK_HANDLERS: Array<{ prefix: string; action: (id: string, send: SendFn) => void }> = [
	{
		prefix: "orient-item-",
		action: (id, send) => {
			const item = seedOrientationItems.find((o) => o.id === id);
			if (item) send({ type: "JUMP_TO_ORIENTATION", index: item.sequenceNumber });
		},
	},
	{
		prefix: "journey-step-",
		action: (id, send) => {
			const step = seedSteps.find((s) => s.id === id);
			if (step) send({ type: "JUMP_TO_STEP", index: step.sequenceNumber });
		},
	},
	{ prefix: "landscape-actor-", action: (id, send) => send({ type: "SELECT_NODE", nodeId: id }) },
	{
		prefix: "landscape-cap-",
		action: (id, send) => send({ type: "SELECT_CAPABILITY", capabilityId: id }),
	},
	{
		prefix: "landscape-domain-",
		action: (id, send) => send({ type: "SELECT_DOMAIN", domainId: id }),
	},
];

interface StepperState {
	currentIndex: number;
	totalItems: number;
	itemLabel: string;
}

function countJourneySteps(journeyId: string): number {
	return seedSteps.filter((s) => s.journeyId === journeyId).length;
}

function countProcessStages(processId: string): number {
	return seedProcessStages.filter((s) => s.processId === processId).length;
}

function countSequenceMessages(sequenceId: string): number {
	const seq = seedSequences.find((s) => s.id === sequenceId);
	return seq ? seedMessages.filter((m) => seq.messageIds.includes(m.id)).length : 0;
}

function deriveOrientationStepper(nav: {
	activeOrientationIndex: number | null;
}): StepperState | null {
	if (seedOrientationItems.length === 0) return null;
	return {
		currentIndex: nav.activeOrientationIndex ?? 0,
		totalItems: seedOrientationItems.length,
		itemLabel: "Item",
	};
}

function deriveJourneyStepper(nav: {
	activeJourneyId: string | null;
	activeStepIndex: number | null;
}): StepperState | null {
	if (!nav.activeJourneyId) return null;
	const total = countJourneySteps(nav.activeJourneyId);
	return total > 0
		? { currentIndex: nav.activeStepIndex ?? 0, totalItems: total, itemLabel: "Step" }
		: null;
}

function deriveProcessStepper(nav: {
	activeProcessId: string | null;
	activeStageIndex: number | null;
}): StepperState | null {
	if (!nav.activeProcessId) return null;
	const total = countProcessStages(nav.activeProcessId);
	return total > 0
		? { currentIndex: nav.activeStageIndex ?? 0, totalItems: total, itemLabel: "Stage" }
		: null;
}

function deriveSequenceStepper(nav: {
	activeSequenceId: string | null;
	activeMessageIndex: number | null;
}): StepperState | null {
	if (!nav.activeSequenceId) return null;
	const total = countSequenceMessages(nav.activeSequenceId);
	return total > 0
		? { currentIndex: nav.activeMessageIndex ?? 0, totalItems: total, itemLabel: "Message" }
		: null;
}

const STEPPER_RESOLVERS: Record<string, (nav: Record<string, unknown>) => StepperState | null> = {
	orientation: deriveOrientationStepper as (nav: Record<string, unknown>) => StepperState | null,
	journey: deriveJourneyStepper as (nav: Record<string, unknown>) => StepperState | null,
	process: deriveProcessStepper as (nav: Record<string, unknown>) => StepperState | null,
	sequence: deriveSequenceStepper as (nav: Record<string, unknown>) => StepperState | null,
};

function deriveStepperState(
	nav: Record<string, unknown>,
	perspectiveType: string,
): StepperState | null {
	const resolver = STEPPER_RESOLVERS[perspectiveType];
	return resolver ? resolver(nav) : null;
}

function handleNodeClick(nodeId: string, send: SendFn) {
	for (const handler of NODE_CLICK_HANDLERS) {
		if (nodeId.startsWith(handler.prefix)) {
			handler.action(nodeId.replace(handler.prefix, ""), send);
			return;
		}
	}
	send({ type: "SELECT_NODE", nodeId });
}

export function AppShell() {
	useInitializeContext();
	const { nav, graph, isReady, send } = useNavigation();
	const { rfNodes, rfEdges, layoutLoading, swimLanes } = usePerspectiveProvider(nav, graph);
	useAutoPanel(nav);
	const { searchOpen, setSearchOpen } = useSearchShortcut();

	useExpandEvents(send);
	const { onInit } = useFitViewOnSwitch(nav.activePerspectiveId, nav.activeCanvasMode);

	const [nodes, setNodes, onNodesChangeBase] = useNodesState(rfNodes as RFNode[]);
	const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges as RFEdge[]);

	const perspectiveType =
		seedPerspectives.find((p) => p.id === nav.activePerspectiveId)?.type ?? "landscape";
	const onNodesChange = CUSTOM_SELECTION_PERSPECTIVES.has(perspectiveType)
		? (changes: Parameters<typeof onNodesChangeBase>[0]) => {
				const filtered = changes.filter((c) => c.type !== "select");
				if (filtered.length > 0) onNodesChangeBase(filtered);
			}
		: onNodesChangeBase;

	// Sync projected nodes/edges into React Flow state when they change
	useEffect(() => {
		setNodes(rfNodes as RFNode[]);
	}, [rfNodes, setNodes]);

	useEffect(() => {
		setEdges(rfEdges as RFEdge[]);
	}, [rfEdges, setEdges]);

	// Stepper transport control — derive state from active perspective + entity
	const routeActive = nav.routeState !== "inactive";
	const stepper = deriveStepperState(nav, perspectiveType);
	const stepperVisible = stepper != null && !routeActive;

	useStepperKeyboard(stepperVisible, send);

	const isOrientationPerspective = perspectiveType === "orientation";
	useOrientationEvents(send, isOrientationPerspective, nav.activeOrientationIndex);

	if (!isReady) {
		return <div className="app-shell__loading">Loading...</div>;
	}

	const journeySteps = nav.activeJourneyId
		? seedSteps.filter((s) => s.journeyId === nav.activeJourneyId)
		: [];

	// Derive current story route and waypoint from nav state
	const activeRoute = nav.activeStoryRouteId
		? (seedStoryRoutes.find((sr) => sr.id === nav.activeStoryRouteId) ?? null)
		: null;
	const routeWaypoints = activeRoute
		? seedStoryWaypoints
				.filter((sw) => sw.storyRouteId === activeRoute.id)
				.sort((a, b) => a.sequenceNumber - b.sequenceNumber)
		: [];
	const currentWaypoint =
		nav.activeWaypointIndex != null ? (routeWaypoints[nav.activeWaypointIndex] ?? null) : null;

	return (
		<div className="app-shell">
			<TopBar
				activePerspectiveId={nav.activePerspectiveId}
				onSwitchPerspective={(id) => send({ type: "SWITCH_PERSPECTIVE", perspectiveId: id })}
				onSearchOpen={() => setSearchOpen(true)}
			/>
			<ContextBar
				activeDomainId={nav.activeDomainId}
				activeCapabilityId={nav.activeCapabilityId}
				activeJourneyId={nav.activeJourneyId}
				activeStepIndex={nav.activeStepIndex}
				totalSteps={journeySteps.length}
				activeValueStreamId={nav.activeValueStreamId}
				activeProcessId={nav.activeProcessId}
				activeSequenceId={nav.activeSequenceId}
				activeStoryRouteId={nav.activeStoryRouteId}
				activePerspectiveId={nav.activePerspectiveId}
				activeCanvasMode={nav.activeCanvasMode}
				routeState={nav.routeState}
				onClearDomain={() => send({ type: "CLEAR_DOMAIN" })}
				onClearCapability={() => send({ type: "CLEAR_CAPABILITY" })}
				onSwitchCanvasMode={(mode) => send({ type: "SWITCH_CANVAS_MODE", canvasMode: mode })}
			/>
			<div className="app-shell__body">
				<LeftPanel
					activeDomainId={nav.activeDomainId}
					activeCapabilityId={nav.activeCapabilityId}
					activeJourneyId={nav.activeJourneyId}
					activeProcessId={nav.activeProcessId}
					activeSequenceId={nav.activeSequenceId}
					activeStoryRouteId={nav.activeStoryRouteId}
					routeState={nav.routeState}
					onSelectDomain={(id) => {
						send({ type: "SELECT_DOMAIN", domainId: id });
						send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-landscape" });
					}}
					onSelectCapability={(id) => {
						send({ type: "SELECT_CAPABILITY", capabilityId: id });
						send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-landscape" });
					}}
					onSelectJourney={(id) => {
						send({ type: "SELECT_JOURNEY", journeyId: id });
						send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-journey" });
					}}
					onSelectProcess={(id) => {
						send({ type: "SELECT_PROCESS", processId: id });
						send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-process" });
					}}
					onSelectSequence={(id) => {
						send({ type: "SELECT_SEQUENCE", sequenceId: id });
						send({ type: "SWITCH_PERSPECTIVE", perspectiveId: "persp-sequence" });
					}}
					onStartRoute={(id) => send({ type: "START_ROUTE", storyRouteId: id })}
					onSelectNode={(id) => send({ type: "SELECT_NODE", nodeId: id })}
					onClearDomain={() => send({ type: "CLEAR_DOMAIN" })}
				/>
				<div
					className={`app-shell__canvas ${nav.routeState !== "inactive" ? "app-shell__canvas--route-active" : ""}`}
				>
					{isOrientationPerspective ? (
						<OrientationDeck
							items={seedOrientationItems}
							activeIndex={nav.activeOrientationIndex ?? 0}
							onSelect={(i) => send({ type: "JUMP_TO_ORIENTATION", index: i })}
						/>
					) : (
						<ReactFlow
							nodes={nodes}
							edges={edges}
							onNodesChange={onNodesChange}
							onEdgesChange={onEdgesChange}
							nodeTypes={nodeTypes}
							edgeTypes={edgeTypes}
							onInit={onInit}
							onNodeClick={(_, node) => handleNodeClick(node.id, send)}
							onEdgeClick={(_, edge) => send({ type: "SELECT_EDGE", edgeId: edge.id })}
							onPaneClick={() => {
								send({ type: "CLEAR_SELECTION" });
							}}
							fitView
							panOnScroll
							minZoom={0.3}
							maxZoom={2}
							proOptions={{ hideAttribution: true }}
						>
							<Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#334155" />
							<Controls position="bottom-left" />
							<MiniMap
								position="bottom-right"
								pannable
								zoomable
								nodeColor={(n) => {
									const data = n.data as Record<string, unknown> | undefined;
									const dimmed = data?.dimmed === true;
									const highlighted = data?.highlighted === true;

									if (dimmed) return "#334155";
									if (highlighted) return "#f59e0b";

									const type = n.type ?? "service";
									const colors: Record<string, string> = {
										actor: "#3b82f6",
										service: "#10b981",
										system: "#8b5cf6",
										screen: "#f59e0b",
										bpmn_task: "#10b981",
										bpmn_event: "#6366f1",
										bpmn_gateway: "#f59e0b",
									};
									return colors[type] ?? "#64748b";
								}}
								style={{ background: "#1e293b" }}
							/>
						</ReactFlow>
					)}
					<StoryRouteBar
						routeState={nav.routeState}
						route={activeRoute}
						currentWaypoint={currentWaypoint}
						waypointIndex={nav.activeWaypointIndex ?? 0}
						totalWaypoints={routeWaypoints.length}
						onNext={() => send({ type: "NEXT_WAYPOINT" })}
						onPrevious={() => send({ type: "PREVIOUS_WAYPOINT" })}
						onPause={() => send({ type: "PAUSE_ROUTE" })}
						onResume={() => send({ type: "RESUME_ROUTE" })}
						onEnd={() => send({ type: "END_ROUTE" })}
					/>
					{stepperVisible && stepper && (
						<StepperControl
							currentIndex={stepper.currentIndex}
							totalItems={stepper.totalItems}
							itemLabel={stepper.itemLabel}
							onForward={() => send({ type: "STEPPER_FORWARD" })}
							onBackward={() => send({ type: "STEPPER_BACKWARD" })}
							onReset={() => send({ type: "STEPPER_RESET" })}
							onEnd={() => send({ type: "STEPPER_END" })}
						/>
					)}
				</div>
				{graph && (
					<RightPanel
						nav={nav}
						graph={graph}
						onSelectNode={(id) => send({ type: "SELECT_NODE", nodeId: id })}
						onSelectEdge={(id) => send({ type: "SELECT_EDGE", edgeId: id })}
						onSelectCapability={(id) => send({ type: "SELECT_CAPABILITY", capabilityId: id })}
						onSelectJourney={(id) => send({ type: "SELECT_JOURNEY", journeyId: id })}
						onSelectValueStream={(id) => send({ type: "SELECT_VALUE_STREAM", valueStreamId: id })}
						onSelectProcess={(id) => send({ type: "SELECT_PROCESS", processId: id })}
						onSelectSequence={(id) => send({ type: "SELECT_SEQUENCE", sequenceId: id })}
						onStartRoute={(id) => send({ type: "START_ROUTE", storyRouteId: id })}
					/>
				)}
			</div>
			<SearchPalette
				open={searchOpen}
				onClose={() => setSearchOpen(false)}
				onSelectDomain={(id) => send({ type: "SELECT_DOMAIN", domainId: id })}
				onSelectCapability={(id) => send({ type: "SELECT_CAPABILITY", capabilityId: id })}
				onSelectNode={(id) => send({ type: "SELECT_NODE", nodeId: id })}
				onSelectProcess={(id) => send({ type: "SELECT_PROCESS", processId: id })}
				onSelectJourney={(id) => send({ type: "SELECT_JOURNEY", journeyId: id })}
				onSelectSequence={(id) => send({ type: "SELECT_SEQUENCE", sequenceId: id })}
				onStartRoute={(id) => send({ type: "START_ROUTE", storyRouteId: id })}
			/>
		</div>
	);
}
