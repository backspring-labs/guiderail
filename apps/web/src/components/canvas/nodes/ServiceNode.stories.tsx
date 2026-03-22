import type { StoryObj } from "@storybook/react";
import { ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { nodeTypes } from "./node-types.js";

const meta = {
	title: "Canvas/Nodes/ServiceNode",
};

export default meta;

const baseNode = {
	id: "svc-1",
	type: "service" as const,
	position: { x: 100, y: 50 },
	data: {
		kernelNode: {
			id: "svc-1",
			type: "service",
			label: "Account Service",
			description: "Account lifecycle management",
			tags: ["accounts", "core"],
			metadata: {},
			layoutByPerspective: {},
		},
		dimmed: false,
		label: "Account Service",
		highlighted: false,
	},
};

function NodeStory({ dimmed = false, highlighted = false }) {
	return (
		<ReactFlowProvider>
			<div style={{ width: 400, height: 150 }}>
				<ReactFlow
					nodes={[{ ...baseNode, data: { ...baseNode.data, dimmed, highlighted } }]}
					edges={[]}
					nodeTypes={nodeTypes}
					fitView
					proOptions={{ hideAttribution: true }}
				/>
			</div>
		</ReactFlowProvider>
	);
}

export const Default: StoryObj = { render: () => <NodeStory /> };
export const Dimmed: StoryObj = { render: () => <NodeStory dimmed /> };
export const Highlighted: StoryObj = { render: () => <NodeStory highlighted /> };
