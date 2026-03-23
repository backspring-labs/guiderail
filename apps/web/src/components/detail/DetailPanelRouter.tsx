import {
	seedCapabilities,
	seedDomains,
	seedProcesses,
	seedValueStreams,
} from "@/store/seed-loader.js";
import type { NavigationContext } from "@guiderail/core/context";
import type { TerrainGraph } from "@guiderail/core/graph";
import { getEdge, getNode } from "@guiderail/core/graph";
import type { ReactNode } from "react";
import { CapabilityDetailPanel } from "./CapabilityDetailPanel.js";
import { DomainDetailPanel } from "./DomainDetailPanel.js";
import { EdgeDetailPanel } from "./EdgeDetailPanel.js";
import { NodeDetailPanel } from "./NodeDetailPanel.js";
import { ProcessDetailPanel } from "./ProcessDetailPanel.js";
import { SequenceDetailPanel } from "./SequenceDetailPanel.js";
import { ValueStreamDetailPanel } from "./ValueStreamDetailPanel.js";

interface DetailPanelRouterProps {
	nav: NavigationContext;
	graph: TerrainGraph;
	onSelectNode: (nodeId: string) => void;
	onSelectEdge: (edgeId: string) => void;
	onSelectCapability: (capabilityId: string) => void;
	onSelectJourney: (journeyId: string) => void;
	onSelectValueStream?: (valueStreamId: string) => void;
	onSelectProcess?: (processId: string) => void;
	onStartRoute?: (storyRouteId: string) => void;
}

/**
 * Priority order (binding product rule, with rationale):
 * 1. Selected node — direct selection is the strongest user intent
 * 2. Selected edge — direct selection
 * 3. Active process — focused operational context
 * 4. Active capability — focused business context
 * 5. Active value stream — broader value context
 * 6. Active domain — broadest context default
 * 7. Nothing → empty state
 *
 * The right panel is a contextual detail surface, not a second route playback engine.
 */

function resolveSelectedNode(
	nav: NavigationContext,
	graph: TerrainGraph,
	onSelectNode: (id: string) => void,
	onSelectEdge: (id: string) => void,
): ReactNode | null {
	if (!nav.selectedNodeId) return null;

	// Sequence diagram nodes (lifelines and messages)
	if (nav.selectedNodeId.startsWith("lifeline-") || nav.selectedNodeId.startsWith("msg-node-")) {
		return (
			<SequenceDetailPanel
				selectedNodeId={nav.selectedNodeId}
				graph={graph}
				onSelectNode={onSelectNode}
			/>
		);
	}

	// Terrain nodes
	const node = getNode(graph, nav.selectedNodeId);
	if (!node) return null;
	return (
		<NodeDetailPanel
			node={node}
			graph={graph}
			onSelectNode={onSelectNode}
			onSelectEdge={onSelectEdge}
		/>
	);
}

function resolveSelectedEdge(
	nav: NavigationContext,
	graph: TerrainGraph,
	onSelectNode: (id: string) => void,
): ReactNode | null {
	if (!nav.selectedEdgeId) return null;
	const edge = getEdge(graph, nav.selectedEdgeId);
	if (!edge) return null;
	return <EdgeDetailPanel edge={edge} graph={graph} onSelectNode={onSelectNode} />;
}

function resolveActiveProcess(
	nav: NavigationContext,
	graph: TerrainGraph,
	onSelectNode: (id: string) => void,
): ReactNode | null {
	if (!nav.activeProcessId) return null;
	const process = seedProcesses.find((p) => p.id === nav.activeProcessId);
	if (!process) return null;
	return <ProcessDetailPanel process={process} graph={graph} onSelectNode={onSelectNode} />;
}

function resolveActiveCapability(
	nav: NavigationContext,
	graph: TerrainGraph,
	props: Pick<
		DetailPanelRouterProps,
		"onSelectNode" | "onSelectJourney" | "onSelectValueStream" | "onSelectProcess" | "onStartRoute"
	>,
): ReactNode | null {
	if (!nav.activeCapabilityId) return null;
	const capability = seedCapabilities.find((c) => c.id === nav.activeCapabilityId);
	if (!capability) return null;
	return (
		<CapabilityDetailPanel
			capability={capability}
			graph={graph}
			onSelectNode={props.onSelectNode}
			onSelectJourney={props.onSelectJourney}
			onSelectValueStream={props.onSelectValueStream}
			onSelectProcess={props.onSelectProcess}
			onStartRoute={props.onStartRoute}
		/>
	);
}

function resolveActiveValueStream(
	nav: NavigationContext,
	onSelectCapability: (id: string) => void,
): ReactNode | null {
	if (!nav.activeValueStreamId) return null;
	const valueStream = seedValueStreams.find((vs) => vs.id === nav.activeValueStreamId);
	if (!valueStream) return null;
	return (
		<ValueStreamDetailPanel valueStream={valueStream} onSelectCapability={onSelectCapability} />
	);
}

function resolveActiveDomain(
	nav: NavigationContext,
	onSelectCapability: (id: string) => void,
): ReactNode | null {
	if (!nav.activeDomainId) return null;
	const domain = seedDomains.find((d) => d.id === nav.activeDomainId);
	if (!domain) return null;
	return <DomainDetailPanel domain={domain} onSelectCapability={onSelectCapability} />;
}

export function DetailPanelRouter(props: DetailPanelRouterProps) {
	const { nav, graph, onSelectNode, onSelectEdge, onSelectCapability } = props;

	return (
		resolveSelectedNode(nav, graph, onSelectNode, onSelectEdge) ??
		resolveSelectedEdge(nav, graph, onSelectNode) ??
		resolveActiveProcess(nav, graph, onSelectNode) ??
		resolveActiveCapability(nav, graph, props) ??
		resolveActiveValueStream(nav, onSelectCapability) ??
		resolveActiveDomain(nav, onSelectCapability) ?? (
			<div className="detail-panel detail-panel--empty">
				<p className="detail-panel__empty-text">
					Select a domain, capability, or node to see details.
				</p>
			</div>
		)
	);
}
