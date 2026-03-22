import {
	seedCapabilities,
	seedDomains,
	seedProcessStages,
	seedProcesses,
	seedValueStreams,
} from "@/store/seed-loader.js";
import type { NavigationContext } from "@guiderail/core/context";
import type { TerrainGraph } from "@guiderail/core/graph";
import { getEdge, getNode } from "@guiderail/core/graph";
import { CapabilityDetailPanel } from "./CapabilityDetailPanel.js";
import { DomainDetailPanel } from "./DomainDetailPanel.js";
import { EdgeDetailPanel } from "./EdgeDetailPanel.js";
import { NodeDetailPanel } from "./NodeDetailPanel.js";
import { ProcessDetailPanel } from "./ProcessDetailPanel.js";
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
 * Routes the right panel to the appropriate detail component.
 *
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
export function DetailPanelRouter({
	nav,
	graph,
	onSelectNode,
	onSelectEdge,
	onSelectCapability,
	onSelectJourney,
	onSelectValueStream,
	onSelectProcess,
	onStartRoute,
}: DetailPanelRouterProps) {
	// 1. Selected node
	if (nav.selectedNodeId) {
		const node = getNode(graph, nav.selectedNodeId);
		if (node) {
			return (
				<NodeDetailPanel
					node={node}
					graph={graph}
					onSelectNode={onSelectNode}
					onSelectEdge={onSelectEdge}
				/>
			);
		}
	}

	// 2. Selected edge
	if (nav.selectedEdgeId) {
		const edge = getEdge(graph, nav.selectedEdgeId);
		if (edge) {
			return <EdgeDetailPanel edge={edge} graph={graph} onSelectNode={onSelectNode} />;
		}
	}

	// 3. Active process
	if (nav.activeProcessId) {
		const process = seedProcesses.find((p) => p.id === nav.activeProcessId);
		if (process) {
			return <ProcessDetailPanel process={process} graph={graph} onSelectNode={onSelectNode} />;
		}
	}

	// 4. Active capability
	if (nav.activeCapabilityId) {
		const capability = seedCapabilities.find((c) => c.id === nav.activeCapabilityId);
		if (capability) {
			return (
				<CapabilityDetailPanel
					capability={capability}
					graph={graph}
					onSelectNode={onSelectNode}
					onSelectJourney={onSelectJourney}
					onSelectValueStream={onSelectValueStream}
					onSelectProcess={onSelectProcess}
					onStartRoute={onStartRoute}
				/>
			);
		}
	}

	// 5. Active value stream
	if (nav.activeValueStreamId) {
		const valueStream = seedValueStreams.find((vs) => vs.id === nav.activeValueStreamId);
		if (valueStream) {
			return (
				<ValueStreamDetailPanel valueStream={valueStream} onSelectCapability={onSelectCapability} />
			);
		}
	}

	// 6. Active domain
	if (nav.activeDomainId) {
		const domain = seedDomains.find((d) => d.id === nav.activeDomainId);
		if (domain) {
			return <DomainDetailPanel domain={domain} onSelectCapability={onSelectCapability} />;
		}
	}

	// 7. Empty state
	return (
		<div className="detail-panel detail-panel--empty">
			<p className="detail-panel__empty-text">
				Select a domain, capability, or node to see details.
			</p>
		</div>
	);
}
