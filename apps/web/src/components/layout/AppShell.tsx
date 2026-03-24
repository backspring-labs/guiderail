import { edgeTypes } from "@/components/canvas/edges/edge-types.js";
import { nodeTypes } from "@/components/canvas/nodes/node-types.js";
import { ContextBar } from "@/components/navigation/ContextBar.js";
import { SearchPalette } from "@/components/navigation/SearchPalette.js";
import { StoryRouteBar } from "@/components/route/StoryRouteBar.js";
import { useInitializeContext, useNavigation } from "@/hooks/use-context-machine.js";
import { usePerspectiveProvider } from "@/hooks/use-perspective-provider.js";
import {
	seedPerspectives,
	seedSteps,
	seedStoryRoutes,
	seedStoryWaypoints,
} from "@/store/seed-loader.js";
import { useUIStore } from "@/store/ui-store.js";
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
import { useEffect, useState } from "react";
import { LeftPanel } from "./LeftPanel.js";
import { RightPanel } from "./RightPanel.js";
import { TopBar } from "./TopBar.js";

export function AppShell() {
	useInitializeContext();
	const { nav, graph, isReady, send } = useNavigation();
	const { rfNodes, rfEdges, layoutLoading, swimLanes } = usePerspectiveProvider(nav, graph);
	const setRightPanelOpen = useUIStore((s) => s.setRightPanelOpen);
	const [searchOpen, setSearchOpen] = useState(false);

	// Cmd+K / Ctrl+K keyboard shortcut for search
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setSearchOpen(true);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Expand events from canvas nodes (e.g., journey picker + button)
	useEffect(() => {
		const handleExpand = (e: Event) => {
			const detail = (e as CustomEvent).detail;
			if (detail?.type === "journey") {
				send({ type: "SELECT_JOURNEY", journeyId: detail.id });
			}
		};
		window.addEventListener("guiderail:expand", handleExpand);
		return () => window.removeEventListener("guiderail:expand", handleExpand);
	}, [send]);

	const [nodes, setNodes, onNodesChangeBase] = useNodesState(rfNodes as RFNode[]);
	const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges as RFEdge[]);

	// On custom canvas perspectives, filter out React Flow's internal selection changes
	// so our data-driven selection state isn't overridden
	const perspectiveType =
		seedPerspectives.find((p) => p.id === nav.activePerspectiveId)?.type ?? "landscape";
	const usesCustomSelection =
		perspectiveType === "landscape" ||
		perspectiveType === "journey" ||
		perspectiveType === "sequence" ||
		perspectiveType === "process";
	const onNodesChange = usesCustomSelection
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

	// Auto-open right panel on selection or focused context, auto-close on clear
	useEffect(() => {
		const hasContext =
			nav.selectedNodeId != null ||
			nav.selectedEdgeId != null ||
			nav.activeProcessId != null ||
			nav.activeValueStreamId != null ||
			nav.activeDomainId != null ||
			nav.activeCapabilityId != null;
		setRightPanelOpen(hasContext);
	}, [
		nav.selectedNodeId,
		nav.selectedEdgeId,
		nav.activeProcessId,
		nav.activeValueStreamId,
		nav.activeDomainId,
		nav.activeCapabilityId,
		setRightPanelOpen,
	]);

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
			/>
			<ContextBar
				activeDomainId={nav.activeDomainId}
				activeCapabilityId={nav.activeCapabilityId}
				activeJourneyId={nav.activeJourneyId}
				activeStepIndex={nav.activeStepIndex}
				totalSteps={journeySteps.length}
				activeValueStreamId={nav.activeValueStreamId}
				activeProcessId={nav.activeProcessId}
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
					onSelectDomain={(id) => send({ type: "SELECT_DOMAIN", domainId: id })}
					onSelectCapability={(id) => send({ type: "SELECT_CAPABILITY", capabilityId: id })}
					onClearDomain={() => send({ type: "CLEAR_DOMAIN" })}
				/>
				<div
					className={`app-shell__canvas ${nav.routeState !== "inactive" ? "app-shell__canvas--route-active" : ""}`}
				>
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						nodeTypes={nodeTypes}
						edgeTypes={edgeTypes}
						onNodeClick={(_, node) => {
							if (node.id.startsWith("journey-step-")) {
								const stepId = node.id.replace("journey-step-", "");
								const step = seedSteps.find((s) => s.id === stepId);
								if (step) {
									send({ type: "JUMP_TO_STEP", index: step.sequenceNumber });
								}
							} else if (node.id.startsWith("landscape-actor-")) {
								const nodeId = node.id.replace("landscape-actor-", "");
								send({ type: "SELECT_NODE", nodeId });
							} else if (node.id.startsWith("landscape-cap-")) {
								const capId = node.id.replace("landscape-cap-", "");
								send({ type: "SELECT_CAPABILITY", capabilityId: capId });
							} else if (node.id.startsWith("landscape-domain-")) {
								const domainId = node.id.replace("landscape-domain-", "");
								send({ type: "SELECT_DOMAIN", domainId });
							} else {
								send({ type: "SELECT_NODE", nodeId: node.id });
							}
						}}
						onEdgeClick={(_, edge) => send({ type: "SELECT_EDGE", edgeId: edge.id })}
						onPaneClick={() => {
							send({ type: "CLEAR_SELECTION" });
						}}
						fitView
						panOnScroll
						minZoom={0.3}
						maxZoom={2}
						proOptions={{ hideAttribution: false }}
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
				onStartRoute={(id) => send({ type: "START_ROUTE", storyRouteId: id })}
			/>
		</div>
	);
}
