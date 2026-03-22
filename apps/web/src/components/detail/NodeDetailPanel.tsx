import {
	seedAnnotations,
	seedCapabilities,
	seedEvidenceRefs,
	seedProviderAssociations,
	seedProviders,
} from "@/store/seed-loader.js";
import type { NavigationContext } from "@guiderail/core/context";
import type { Node } from "@guiderail/core/entities";
import type { TerrainGraph } from "@guiderail/core/graph";
import { getEdgesForNode, getNeighbors } from "@guiderail/core/graph";

interface NodeDetailPanelProps {
	node: Node;
	graph: TerrainGraph;
	onSelectNode: (nodeId: string) => void;
	onSelectEdge: (edgeId: string) => void;
}

export function NodeDetailPanel({ node, graph, onSelectNode, onSelectEdge }: NodeDetailPanelProps) {
	const edges = getEdgesForNode(graph, node.id);
	const neighbors = getNeighbors(graph, node.id);
	const annotations = seedAnnotations.filter((a) => a.targetId === node.id);
	const evidenceRefs = seedEvidenceRefs.filter((e) => e.relatedEntityIds.includes(node.id));
	const capabilities = seedCapabilities.filter((c) => c.nodeIds.includes(node.id));
	const nodeProviderAssocs = seedProviderAssociations.filter(
		(a) => a.targetType === "node" && a.targetId === node.id,
	);
	const nodeProviders = seedProviders.filter((p) =>
		nodeProviderAssocs.some((a) => a.providerId === p.id),
	);

	return (
		<div className="detail-panel">
			<div className="detail-panel__header">
				<span className="detail-panel__type-badge" data-type={node.type}>
					{node.type}
				</span>
				<h3 className="detail-panel__title">{node.label}</h3>
			</div>

			{node.description && <p className="detail-panel__description">{node.description}</p>}

			{node.tags.length > 0 && (
				<div className="detail-panel__tags">
					{node.tags.map((tag) => (
						<span key={tag} className="detail-panel__tag">
							{tag}
						</span>
					))}
				</div>
			)}

			{nodeProviders.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Providers</h4>
					<ul className="detail-panel__list">
						{nodeProviders.map((p) => (
							<li key={p.id} className="detail-panel__list-item">
								<span className="detail-panel__provider-badge" data-category={p.category}>
									{p.category}
								</span>
								{p.label}
							</li>
						))}
					</ul>
				</div>
			)}

			{capabilities.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Capabilities</h4>
					<ul className="detail-panel__list">
						{capabilities.map((cap) => (
							<li key={cap.id} className="detail-panel__list-item">
								{cap.label}
							</li>
						))}
					</ul>
				</div>
			)}

			{neighbors.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Connected Nodes</h4>
					<ul className="detail-panel__list">
						{neighbors.map((n) => (
							<li key={n.id}>
								<button
									type="button"
									className="detail-panel__link"
									onClick={() => onSelectNode(n.id)}
								>
									{n.label}
									<span className="detail-panel__link-type">{n.type}</span>
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			{edges.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Edges</h4>
					<ul className="detail-panel__list">
						{edges.map((e) => (
							<li key={e.id}>
								<button
									type="button"
									className="detail-panel__link"
									onClick={() => onSelectEdge(e.id)}
								>
									{e.label ?? e.type}
									<span className="detail-panel__link-type">{e.type}</span>
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			{annotations.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Notes</h4>
					{annotations.map((a) => (
						<div key={a.id} className="detail-panel__annotation">
							<span className="detail-panel__annotation-type">{a.type}</span>
							<p>{a.content}</p>
						</div>
					))}
				</div>
			)}

			{evidenceRefs.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Documents</h4>
					{evidenceRefs.map((e) => (
						<div key={e.id} className="detail-panel__evidence">
							<span className="detail-panel__evidence-title">{e.title}</span>
							{e.summary && <p>{e.summary}</p>}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
