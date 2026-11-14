import { useDataset } from "@/data/dataset-context.js";
import { orderedMessagesOf, positionOf } from "@/lib/ordered-groups.js";
import { orderBySequence } from "@guiderail/core/content";
import type { Message } from "@guiderail/core/entities";
import type { TerrainGraph } from "@guiderail/core/graph";
import { getNode } from "@guiderail/core/graph";

interface SequenceDetailPanelProps {
	selectedNodeId: string;
	activeSequenceId: string | null;
	graph: TerrainGraph;
	onSelectNode: (nodeId: string) => void;
}

export function SequenceDetailPanel({
	selectedNodeId,
	activeSequenceId,
	graph,
	onSelectNode,
}: SequenceDetailPanelProps) {
	const dataset = useDataset();
	// Numbers shown here are positions in the active sequence, so they match the
	// numbers on the canvas and the stepper counter.
	const sequenceMessages = activeSequenceId
		? orderedMessagesOf(dataset, activeSequenceId)
		: orderBySequence(dataset.messages);

	if (selectedNodeId.startsWith("lifeline-")) {
		return (
			<LifelineDetail
				ifaceId={selectedNodeId.replace("lifeline-", "")}
				sequenceMessages={sequenceMessages}
				graph={graph}
				onSelectNode={onSelectNode}
			/>
		);
	}

	if (selectedNodeId.startsWith("msg-node-")) {
		return (
			<MessageDetail
				msgId={selectedNodeId.replace("msg-node-", "")}
				sequenceMessages={sequenceMessages}
			/>
		);
	}

	return null;
}

interface LifelineDetailProps {
	ifaceId: string;
	sequenceMessages: Message[];
	graph: TerrainGraph;
	onSelectNode: (nodeId: string) => void;
}

function LifelineDetail({ ifaceId, sequenceMessages, graph, onSelectNode }: LifelineDetailProps) {
	const dataset = useDataset();
	const iface = dataset.interfaces.find((i) => i.id === ifaceId);
	if (!iface) return null;

	const terrainNode = getNode(graph, iface.nodeId);
	const originatingMessages = sequenceMessages
		.map((msg, position) => ({ msg, position }))
		.filter(({ msg }) => msg.sourceInterfaceId === ifaceId);

	return (
		<div className="detail-panel">
			<div className="detail-panel__header">
				<span className="detail-panel__type-badge" data-type="interface">
					interface
				</span>
				<h3 className="detail-panel__title">{iface.label}</h3>
			</div>

			{iface.description && <p className="detail-panel__description">{iface.description}</p>}

			{iface.protocol && (
				<div className="detail-panel__section">
					<span className="detail-panel__tag">{iface.protocol}</span>
				</div>
			)}

			{terrainNode && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">System</h4>
					<button
						type="button"
						className="detail-panel__link"
						onClick={() => onSelectNode(terrainNode.id)}
					>
						{terrainNode.label}
					</button>
				</div>
			)}

			{originatingMessages.length > 0 && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Sends ({originatingMessages.length})</h4>
					{originatingMessages.map(({ msg, position }) => {
						const targetIface = dataset.interfaces.find((i) => i.id === msg.targetInterfaceId);
						return (
							<div key={msg.id} className="detail-panel__message-item">
								<span className="detail-panel__message-seq">#{position + 1}</span>
								<span className="detail-panel__message-dir">→</span>
								<span className="detail-panel__message-label">{msg.label}</span>
								{targetIface && (
									<span className="detail-panel__message-target">to {targetIface.label}</span>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

function MessageDetail({
	msgId,
	sequenceMessages,
}: { msgId: string; sequenceMessages: Message[] }) {
	const dataset = useDataset();
	const msg = dataset.messages.find((m) => m.id === msgId);
	if (!msg) return null;
	const position = positionOf(sequenceMessages, msg.id);

	const sourceIface = dataset.interfaces.find((i) => i.id === msg.sourceInterfaceId);
	const targetIface = dataset.interfaces.find((i) => i.id === msg.targetInterfaceId);

	return (
		<div className="detail-panel">
			<div className="detail-panel__header">
				<span className="detail-panel__type-badge" data-type="message">
					{position >= 0 ? `message #${position + 1}` : "message"}
				</span>
				<h3 className="detail-panel__title">{msg.label}</h3>
			</div>

			{msg.description && <p className="detail-panel__description">{msg.description}</p>}

			<div className="detail-panel__section">
				<h4 className="detail-panel__section-title">Flow</h4>
				<div className="detail-panel__message-flow">
					<span className="detail-panel__tag">{msg.type}</span>
					<span className="detail-panel__message-from">
						{sourceIface?.label ?? msg.sourceInterfaceId}
					</span>
					<span className="detail-panel__message-dir">→</span>
					<span className="detail-panel__message-to">
						{targetIface?.label ?? msg.targetInterfaceId}
					</span>
				</div>
			</div>

			{msg.payloadSummary && (
				<div className="detail-panel__section">
					<h4 className="detail-panel__section-title">Payload</h4>
					<pre className="detail-panel__payload">{msg.payloadSummary}</pre>
				</div>
			)}
		</div>
	);
}
