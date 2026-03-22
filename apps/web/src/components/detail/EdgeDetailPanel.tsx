import type { Edge } from "@guiderail/core/entities";
import type { TerrainGraph } from "@guiderail/core/graph";
import { getNode } from "@guiderail/core/graph";

interface EdgeDetailPanelProps {
	edge: Edge;
	graph: TerrainGraph;
	onSelectNode: (nodeId: string) => void;
}

export function EdgeDetailPanel({ edge, graph, onSelectNode }: EdgeDetailPanelProps) {
	const sourceNode = getNode(graph, edge.sourceNodeId);
	const targetNode = getNode(graph, edge.targetNodeId);

	return (
		<div className="detail-panel">
			<div className="detail-panel__header">
				<span className="detail-panel__type-badge" data-type="edge">
					{edge.type}
				</span>
				<h3 className="detail-panel__title">{edge.label ?? "Edge"}</h3>
			</div>

			<div className="detail-panel__section">
				<h4 className="detail-panel__section-title">Connection</h4>
				<div className="detail-panel__edge-direction">
					<button
						type="button"
						className="detail-panel__link"
						onClick={() => onSelectNode(edge.sourceNodeId)}
					>
						{sourceNode?.label ?? edge.sourceNodeId}
					</button>
					<span className="detail-panel__arrow">{edge.directed ? "\u2192" : "\u2194"}</span>
					<button
						type="button"
						className="detail-panel__link"
						onClick={() => onSelectNode(edge.targetNodeId)}
					>
						{targetNode?.label ?? edge.targetNodeId}
					</button>
				</div>
			</div>
		</div>
	);
}
