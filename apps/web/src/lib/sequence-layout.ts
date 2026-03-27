import type { Interface, Message, Sequence } from "@guiderail/core/entities";

const LIFELINE_SPACING_X = 250;
const MESSAGE_SPACING_Y = 60;
const LIFELINE_START_Y = 0;
const LIFELINE_HEADER_HEIGHT = 80;
const LIFELINE_WIDTH = 160;

interface SequenceNode {
	id: string;
	type: string;
	position: { x: number; y: number };
	draggable: boolean;
	data: Record<string, unknown>;
}

export interface SequenceLayoutResult {
	nodes: SequenceNode[];
	edges: Array<{
		id: string;
		source: string;
		target: string;
		type: string;
	}>;
}

/**
 * Compute sequence diagram layout.
 * Lifelines are positioned horizontally. Messages are rendered as
 * positioned nodes (horizontal arrows) at vertical offsets by sequence number.
 */
export function computeSequenceLayout(
	interfaces: Interface[],
	messages: Message[],
): SequenceLayoutResult {
	const sortedMessages = [...messages].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
	const lifelineHeight = LIFELINE_HEADER_HEIGHT + sortedMessages.length * MESSAGE_SPACING_Y + 60;

	const interfaceXPositions = buildInterfacePositions(interfaces);
	const lifelineNodes = buildLifelineNodes(interfaces, lifelineHeight);
	const messageNodes = buildMessageNodes(sortedMessages, interfaceXPositions);

	return {
		nodes: [...lifelineNodes, ...messageNodes],
		edges: [],
	};
}

function buildInterfacePositions(interfaces: Interface[]): Map<string, number> {
	const positions = new Map<string, number>();
	for (let i = 0; i < interfaces.length; i++) {
		const iface = interfaces[i];
		if (iface) {
			positions.set(iface.id, i * LIFELINE_SPACING_X);
		}
	}
	return positions;
}

function buildLifelineNodes(interfaces: Interface[], lifelineHeight: number): SequenceNode[] {
	return interfaces.map((iface, index) => ({
		id: `lifeline-${iface.id}`,
		type: "lifeline",
		position: { x: index * LIFELINE_SPACING_X, y: LIFELINE_START_Y },
		draggable: false,
		data: {
			label: iface.label,
			nodeId: iface.nodeId,
			protocol: iface.protocol,
			description: iface.description,
			lifelineHeight,
		},
	}));
}

function buildMessageNodes(
	messages: Message[],
	interfacePositions: Map<string, number>,
): SequenceNode[] {
	return messages.map((msg) => {
		const sourceX = interfacePositions.get(msg.sourceInterfaceId) ?? 0;
		const targetX = interfacePositions.get(msg.targetInterfaceId) ?? 0;
		const y = LIFELINE_HEADER_HEIGHT + msg.sequenceNumber * MESSAGE_SPACING_Y;

		const leftX = Math.min(sourceX, targetX);
		const isReverse = targetX < sourceX;

		return {
			id: `msg-node-${msg.id}`,
			type: "sequence_message",
			position: { x: leftX + LIFELINE_WIDTH / 2, y },
			draggable: false,
			data: {
				label: msg.label,
				messageType: msg.type,
				sequenceNumber: msg.sequenceNumber,
				description: msg.description,
				payloadSummary: msg.payloadSummary,
				width: Math.abs(targetX - sourceX),
				isReverse,
				sourceLifelineId: `lifeline-${msg.sourceInterfaceId}`,
				targetLifelineId: `lifeline-${msg.targetInterfaceId}`,
			},
		};
	});
}

const PICKER_START_X = 40;
const PICKER_START_Y = 40;
const PICKER_SPACING = 200;

/**
 * Layout for sequence selection: available sequences as clickable cards.
 */
export function computeSequencePickerLayout(sequences: Sequence[]): SequenceLayoutResult {
	const nodes: SequenceNode[] = sequences.map((seq, index) => ({
		id: `sequence-pick-${seq.id}`,
		type: "sequence_picker",
		position: { x: PICKER_START_X, y: PICKER_START_Y + index * PICKER_SPACING },
		draggable: false,
		data: {
			sequenceId: seq.id,
			label: seq.label,
			description: seq.description,
			interfaceCount: seq.interfaceIds.length,
			messageCount: seq.messageIds.length,
		},
	}));

	return { nodes, edges: [] };
}
