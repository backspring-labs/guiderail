import { seedProcessStages } from "@/store/seed-loader.js";
import type { Process } from "@guiderail/core/entities";
import type { TerrainGraph } from "@guiderail/core/graph";
import { getNode } from "@guiderail/core/graph";

interface ProcessDetailPanelProps {
	process: Process;
	graph: TerrainGraph;
	onSelectNode: (nodeId: string) => void;
}

export function ProcessDetailPanel({ process, graph, onSelectNode }: ProcessDetailPanelProps) {
	const stages = seedProcessStages
		.filter((ps) => ps.processId === process.id)
		.sort((a, b) => a.sequenceNumber - b.sequenceNumber);

	return (
		<div className="detail-panel">
			<div className="detail-panel__header">
				<span className="detail-panel__type-badge" data-type="process">
					process
				</span>
				<h3 className="detail-panel__title">{process.label}</h3>
			</div>

			{process.description && <p className="detail-panel__description">{process.description}</p>}

			{process.tags.length > 0 && (
				<div className="detail-panel__tags">
					{process.tags.map((tag) => (
						<span key={tag} className="detail-panel__tag">
							{tag}
						</span>
					))}
				</div>
			)}

			{stages.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Stages</h4>
					<div className="detail-panel__stages">
						{stages.map((stage, index) => (
							<div key={stage.id} className="detail-panel__stage">
								<div className="detail-panel__stage-header">
									<span className="detail-panel__stage-number">{index + 1}</span>
									<span className="detail-panel__stage-label">{stage.label}</span>
								</div>
								{stage.description && (
									<p className="detail-panel__stage-description">{stage.description}</p>
								)}
								{stage.controlPoints.length > 0 && (
									<div className="detail-panel__control-points">
										{stage.controlPoints.map((cp) => (
											<span key={cp} className="detail-panel__control-point">
												{cp}
											</span>
										))}
									</div>
								)}
								{stage.nodeIds.length > 0 && (
									<div className="detail-panel__stage-nodes">
										{stage.nodeIds.map((nodeId) => {
											const node = getNode(graph, nodeId);
											return (
												<button
													key={nodeId}
													type="button"
													className="detail-panel__link"
													onClick={() => onSelectNode(nodeId)}
												>
													{node?.label ?? nodeId}
												</button>
											);
										})}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
