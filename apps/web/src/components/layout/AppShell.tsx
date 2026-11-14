import { OrientationDeck } from "@/components/canvas/OrientationDeck.js";
import { edgeTypes } from "@/components/canvas/edges/edge-types.js";
import { nodeTypes } from "@/components/canvas/nodes/node-types.js";
import { ContextBar } from "@/components/navigation/ContextBar.js";
import { SearchPalette } from "@/components/navigation/SearchPalette.js";
import { StepperControl } from "@/components/navigation/StepperControl.js";
import { StoryRouteBar } from "@/components/route/StoryRouteBar.js";
import { useDataset } from "@/data/dataset-context.js";
import type { Dataset } from "@/data/dataset.js";
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
	orderedOrientationItems,
	orderedStepsOf,
	orderedWaypointsOf,
	positionOf,
} from "@/lib/ordered-groups.js";
import { deriveStepperState } from "@/lib/stepper-state.js";
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

import type { ContextMachineEvent, NavigationTarget } from "@guiderail/core/context";

type SendFn = (event: ContextMachineEvent) => void;

const CUSTOM_SELECTION_PERSPECTIVES = new Set([
	"orientation",
	"landscape",
	"journey",
	"sequence",
	"process",
]);

const NODE_CLICK_HANDLERS: Array<{
	prefix: string;
	action: (id: string, send: SendFn, dataset: Dataset) => void;
}> = [
	{
		prefix: "orient-item-",
		action: (id, send, dataset) => {
			const position = positionOf(orderedOrientationItems(dataset), id);
			if (position >= 0) send({ type: "JUMP_TO_ORIENTATION", index: position });
		},
	},
	{
		prefix: "journey-step-",
		action: (id, send, dataset) => {
			const step = dataset.steps.find((s) => s.id === id);
			if (!step) return;
			const position = positionOf(orderedStepsOf(dataset, step.journeyId), id);
			if (position >= 0) send({ type: "JUMP_TO_STEP", index: position });
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

function deriveRouteState(
	nav: { activeStoryRouteId: string | null; activeWaypointIndex: number | null },
	dataset: Dataset,
) {
	const activeRoute = nav.activeStoryRouteId
		? (dataset.storyRoutes.find((sr) => sr.id === nav.activeStoryRouteId) ?? null)
		: null;
	const routeWaypoints = activeRoute ? orderedWaypointsOf(dataset, activeRoute.id) : [];
	const currentWaypoint =
		nav.activeWaypointIndex != null ? (routeWaypoints[nav.activeWaypointIndex] ?? null) : null;
	return { activeRoute, routeWaypoints, currentWaypoint };
}

function handleNodeClick(nodeId: string, send: SendFn, dataset: Dataset) {
	for (const handler of NODE_CLICK_HANDLERS) {
		if (nodeId.startsWith(handler.prefix)) {
			handler.action(nodeId.replace(handler.prefix, ""), send, dataset);
			return;
		}
	}
	send({ type: "SELECT_NODE", nodeId });
}

export function AppShell() {
	const dataset = useDataset();
	useInitializeContext();
	const { nav, graph, isReady, send } = useNavigation();
	const { rfNodes, rfEdges, layoutError, retryLayout, processDiagramSource } =
		usePerspectiveProvider(nav, graph);
	useAutoPanel(nav);
	const { searchOpen, setSearchOpen } = useSearchShortcut();

	// Selecting a domain, capability, journey, process or sequence from a panel or
	// search also shows it: the kernel picks the perspective. Every entry point
	// goes through this one event, so they all land in the same place.
	const navigateTo = (kind: NavigationTarget["kind"], id: string) =>
		send({ type: "NAVIGATE_TO", target: { kind, id } });

	useExpandEvents(send);
	const perspectiveType =
		dataset.perspectives.find((p) => p.id === nav.activePerspectiveId)?.type ?? "landscape";
	// On the Process perspective a different process is a different diagram.
	const { onInit } = useFitViewOnSwitch(
		nav.activePerspectiveId,
		nav.activeCanvasMode,
		perspectiveType === "process" ? nav.activeProcessId : null,
	);

	const [nodes, setNodes, onNodesChangeBase] = useNodesState(rfNodes as RFNode[]);
	const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges as RFEdge[]);

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
	const stepper = deriveStepperState(nav, perspectiveType, dataset);
	const stepperVisible = stepper != null && !routeActive;

	useStepperKeyboard(stepperVisible, send);

	const isOrientationPerspective = perspectiveType === "orientation";
	useOrientationEvents(send, isOrientationPerspective, nav.activeOrientationIndex);

	if (!isReady) {
		return <div className="app-shell__loading">Loading...</div>;
	}

	const journeySteps = nav.activeJourneyId
		? dataset.steps.filter((s) => s.journeyId === nav.activeJourneyId)
		: [];

	const { activeRoute, routeWaypoints, currentWaypoint } = deriveRouteState(nav, dataset);

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
				onSelectProcess={(id) => navigateTo("process", id)}
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
					onSelectDomain={(id) => navigateTo("domain", id)}
					onSelectCapability={(id) => navigateTo("capability", id)}
					onSelectJourney={(id) => navigateTo("journey", id)}
					onSelectProcess={(id) => navigateTo("process", id)}
					onSelectSequence={(id) => navigateTo("sequence", id)}
					onStartRoute={(id) => send({ type: "START_ROUTE", storyRouteId: id })}
					onSelectNode={(id) => send({ type: "SELECT_NODE", nodeId: id })}
					onClearDomain={() => send({ type: "CLEAR_DOMAIN" })}
				/>
				<main
					className={`app-shell__canvas ${nav.routeState !== "inactive" ? "app-shell__canvas--route-active" : ""}`}
				>
					{isOrientationPerspective ? (
						<OrientationDeck
							items={orderedOrientationItems(dataset)}
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
							onNodeClick={(_, node) => handleNodeClick(node.id, send, dataset)}
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
					{layoutError && (
						<div className="app-shell__canvas-notice" role="alert">
							Automatic layout failed, so nodes are shown in a simple grid.
							<button
								type="button"
								className="app-shell__canvas-notice-action"
								onClick={retryLayout}
							>
								Retry layout
							</button>
						</div>
					)}
					{processDiagramSource === "empty" && (
						<div className="app-shell__canvas-empty">
							This process has no diagram and no stages to show yet.
						</div>
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
				</main>
				{graph && (
					<RightPanel
						nav={nav}
						graph={graph}
						onSelectNode={(id) => send({ type: "SELECT_NODE", nodeId: id })}
						onSelectEdge={(id) => send({ type: "SELECT_EDGE", edgeId: id })}
						onSelectCapability={(id) => navigateTo("capability", id)}
						onSelectJourney={(id) => navigateTo("journey", id)}
						onSelectValueStream={(id) => send({ type: "SELECT_VALUE_STREAM", valueStreamId: id })}
						onSelectProcess={(id) => navigateTo("process", id)}
						onSelectSequence={(id) => navigateTo("sequence", id)}
						onStartRoute={(id) => send({ type: "START_ROUTE", storyRouteId: id })}
					/>
				)}
			</div>
			<SearchPalette
				open={searchOpen}
				onClose={() => setSearchOpen(false)}
				onSelectDomain={(id) => navigateTo("domain", id)}
				onSelectCapability={(id) => navigateTo("capability", id)}
				onSelectNode={(id) => send({ type: "SELECT_NODE", nodeId: id })}
				onSelectProcess={(id) => navigateTo("process", id)}
				onSelectJourney={(id) => navigateTo("journey", id)}
				onSelectSequence={(id) => navigateTo("sequence", id)}
				onStartRoute={(id) => send({ type: "START_ROUTE", storyRouteId: id })}
			/>
		</div>
	);
}
