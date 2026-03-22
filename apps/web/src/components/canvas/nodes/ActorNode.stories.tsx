import type { Meta, StoryObj } from "@storybook/react";
import { ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { nodeTypes } from "./node-types.js";

const meta = {
	title: "Canvas/Nodes/ActorNode",
	decorators: [
		(Story) => (
			<ReactFlowProvider>
				<div style={{ width: 400, height: 200 }}>
					<ReactFlow
						nodes={[]}
						edges={[]}
						nodeTypes={nodeTypes}
						fitView
						proOptions={{ hideAttribution: true }}
					>
						<Story />
					</ReactFlow>
				</div>
			</ReactFlowProvider>
		),
	],
} satisfies Meta;

export default meta;

const baseNode = {
	id: "actor-1",
	type: "actor" as const,
	position: { x: 100, y: 50 },
	data: {
		kernelNode: {
			id: "actor-1",
			type: "actor",
			label: "Customer",
			description: "Retail banking customer",
			tags: ["external"],
			metadata: {},
			layoutByPerspective: {},
		},
		dimmed: false,
		label: "Customer",
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

export const Default: StoryObj = {
	render: () => <NodeStory />,
};

export const Dimmed: StoryObj = {
	render: () => <NodeStory dimmed />,
};

export const Highlighted: StoryObj = {
	render: () => <NodeStory highlighted />,
};
