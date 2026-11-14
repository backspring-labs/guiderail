import { orderBySequence } from "@guiderail/core/content";
import type { Edge, Node, Process, ProcessStage } from "@guiderail/core/entities";

/**
 * Where a process diagram came from:
 * - "authored": BPMN nodes written for this process.
 * - "derived": the process has no BPMN of its own, so its stages are shown as a
 *   simple flow in navigation order.
 * - "empty": the process has neither, or no process exists.
 */
export type ProcessDiagramSource = "authored" | "derived" | "empty";

export interface ProcessDiagram {
	/** The process the diagram shows, or null when there is nothing to show. */
	processId: string | null;
	source: ProcessDiagramSource;
	nodes: Node[];
	edges: Edge[];
}

export interface ProcessDiagramData {
	processes: readonly Process[];
	processStages: readonly ProcessStage[];
	bpmnNodes: readonly Node[];
	bpmnEdges: readonly Edge[];
}

function authoredNodesFor(processId: string, bpmnNodes: readonly Node[]): Node[] {
	return bpmnNodes.filter((n) => n.metadata.processId === processId);
}

/**
 * The process shown when none is selected: the first with an authored diagram,
 * else the first process.
 */
function defaultProcessId(data: ProcessDiagramData): string | null {
	const withDiagram = data.processes.find((p) => authoredNodesFor(p.id, data.bpmnNodes).length > 0);
	return (withDiagram ?? data.processes[0])?.id ?? null;
}

/** One task per stage, in navigation order, joined by sequence flows. */
function deriveFromStages(
	process: Process,
	stages: ProcessStage[],
): { nodes: Node[]; edges: Edge[] } {
	const nodeId = (stage: ProcessStage) => `derived-stage-${stage.id}`;
	const nodes: Node[] = stages.map((stage) => ({
		id: nodeId(stage),
		type: "bpmn_task",
		label: stage.label,
		description: stage.description,
		tags: [],
		metadata: {
			processId: process.id,
			stageId: stage.id,
			swimLane: process.label,
			terrainNodeId: stage.nodeIds[0],
			derived: true,
		},
		layoutByPerspective: {},
	}));

	const edges: Edge[] = [];
	for (let i = 1; i < stages.length; i++) {
		const from = stages[i - 1];
		const to = stages[i];
		if (!from || !to) continue;
		edges.push({
			id: `derived-flow-${from.id}-${to.id}`,
			sourceNodeId: nodeId(from),
			targetNodeId: nodeId(to),
			type: "sequence_flow",
			directed: true,
			metadata: { derived: true },
		});
	}
	return { nodes, edges };
}

/**
 * The diagram the Process canvas shows for `activeProcessId`.
 *
 * The canvas always shows exactly one process. BPMN nodes belong to a process
 * through `metadata.processId`; nodes of other processes are never mixed in.
 */
export function resolveProcessDiagram(
	activeProcessId: string | null,
	data: ProcessDiagramData,
): ProcessDiagram {
	const processId = activeProcessId ?? defaultProcessId(data);
	const process = data.processes.find((p) => p.id === processId);
	if (!process) return { processId: null, source: "empty", nodes: [], edges: [] };

	const authored = authoredNodesFor(process.id, data.bpmnNodes);
	if (authored.length > 0) {
		const ids = new Set(authored.map((n) => n.id));
		const edges = data.bpmnEdges.filter((e) => ids.has(e.sourceNodeId) && ids.has(e.targetNodeId));
		return { processId: process.id, source: "authored", nodes: authored, edges };
	}

	const stages = orderBySequence(data.processStages.filter((s) => s.processId === process.id));
	if (stages.length === 0) return { processId: process.id, source: "empty", nodes: [], edges: [] };

	return { processId: process.id, source: "derived", ...deriveFromStages(process, stages) };
}

/**
 * The process that contains `processId` as a sub-process of one of its stages,
 * or null when it is a top-level process.
 */
export function parentProcessOf(
	processId: string,
	data: Pick<ProcessDiagramData, "processes" | "processStages">,
): Process | null {
	const stage = data.processStages.find((s) => s.subProcessId === processId);
	if (!stage) return null;
	return data.processes.find((p) => p.id === stage.processId) ?? null;
}
