import type { StoryObj } from "@storybook/react";
import { ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { nodeTypes } from "./node-types.js";

const meta = {
	title: "Canvas/Nodes/ScreenNode",
};

export default meta;

const baseNode = {
	id: "screen-1",
	type: "screen" as const,
	position: { x: 100, y: 50 },
	data: {
		kernelNode: {
			id: "screen-1",
			type: "screen",
			label: "Mobile Banking App",
			description: "Customer-facing mobile application",
			tags: ["channel", "mobile"],
			metadata: {},
			layoutByPerspective: {},
		},
		dimmed: false,
		label: "Mobile Banking App",
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
