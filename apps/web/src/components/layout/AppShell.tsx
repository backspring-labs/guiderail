import { edgeTypes } from "@/components/canvas/edges/edge-types.js";
import { nodeTypes } from "@/components/canvas/nodes/node-types.js";
import { Breadcrumb } from "@/components/navigation/Breadcrumb.js";
import { StoryRouteBar } from "@/components/route/StoryRouteBar.js";
import { useInitializeContext, useNavigation } from "@/hooks/use-context-machine.js";
import { usePerspectiveProvider } from "@/hooks/use-perspective-provider.js";
import { seedSteps, seedStoryRoutes, seedStoryWaypoints } from "@/store/seed-loader.js";
import { useUIStore } from "@/store/ui-store.js";
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

export function AppShell() {
	useInitializeContext();
	const { nav, graph, isReady, send } = useNavigation();
	const { rfNodes, rfEdges } = usePerspectiveProvider(nav, graph);
	const setRightPanelOpen = useUIStore((s) => s.setRightPanelOpen);

	const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges);

	// Sync projected nodes/edges into React Flow state when they change
	useEffect(() => {
		setNodes(rfNodes);
	}, [rfNodes, setNodes]);

	useEffect(() => {
		setEdges(rfEdges);
	}, [rfEdges, setEdges]);

	// Auto-open right panel on selection or focused context, auto-close on clear
	useEffect(() => {
		const hasContext =
			nav.selectedNodeId != null ||
			nav.selectedEdgeId != null ||
			nav.activeProcessId != null ||
			nav.activeValueStreamId != null;
		setRightPanelOpen(hasContext);
	}, [
		nav.selectedNodeId,
		nav.selectedEdgeId,
		nav.activeProcessId,
		nav.activeValueStreamId,
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
			<Breadcrumb
				activeDomainId={nav.activeDomainId}
				activeCapabilityId={nav.activeCapabilityId}
				activeJourneyId={nav.activeJourneyId}
				activeStepIndex={nav.activeStepIndex}
				totalSteps={journeySteps.length}
				activeValueStreamId={nav.activeValueStreamId}
				activeProcessId={nav.activeProcessId}
				activeStoryRouteId={nav.activeStoryRouteId}
				routeState={nav.routeState}
				onClearDomain={() => send({ type: "CLEAR_DOMAIN" })}
				onClearCapability={() => send({ type: "CLEAR_CAPABILITY" })}
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
						onNodeClick={(_, node) => send({ type: "SELECT_NODE", nodeId: node.id })}
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
		</div>
	);
}
