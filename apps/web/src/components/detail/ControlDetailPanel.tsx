import { seedControlPoints } from "@/store/seed-loader.js";

interface ControlDetailPanelProps {
	nodeId: string;
	nodeLabel: string;
	processStageIds: string[];
}

export function ControlDetailPanel({
	nodeId,
	nodeLabel,
	processStageIds,
}: ControlDetailPanelProps) {
	const relevantControls = seedControlPoints.filter((cp) =>
		processStageIds.includes(cp.processStageId),
	);

	if (relevantControls.length === 0) {
		return (
			<div className="detail-panel">
				<div className="detail-panel__header">
					<span className="detail-panel__type-badge" data-type="control">
						controls
					</span>
					<h3 className="detail-panel__title">{nodeLabel}</h3>
				</div>
				<p className="detail-panel__description">No control points associated with this element.</p>
			</div>
		);
	}

	return (
		<div className="detail-panel">
			<div className="detail-panel__header">
				<span className="detail-panel__type-badge" data-type="control">
					controls
				</span>
				<h3 className="detail-panel__title">{nodeLabel}</h3>
			</div>

			<div className="detail-panel__section">
				<h4 className="detail-panel__section-title">Control Points</h4>
				{relevantControls.map((cp) => (
					<div key={cp.id} className="detail-panel__control-item">
						<div className="detail-panel__control-header">
							<span className={`control-indicator control-indicator--${cp.severity}`}>
								{cp.severity === "critical" ? "!" : cp.severity === "warning" ? "~" : "i"}
							</span>
							<span className="detail-panel__control-label">{cp.label}</span>
							<span className="detail-panel__control-type">{cp.controlType}</span>
							<span
								className={`detail-panel__control-status detail-panel__control-status--${cp.status}`}
							>
								{cp.status.replace("_", " ")}
							</span>
						</div>
						{cp.description && (
							<p className="detail-panel__control-description">{cp.description}</p>
						)}
						{cp.regulatoryRef && (
							<p className="detail-panel__control-ref">Ref: {cp.regulatoryRef}</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
