interface SwimLaneNodeData {
	label: string;
	width: number;
	height: number;
	[key: string]: unknown;
}

export function SwimLaneNode({ data }: { data: SwimLaneNodeData }) {
	return (
		<div className="swim-lane-node" style={{ width: data.width, height: data.height }}>
			<div className="swim-lane-node__header">
				<span className="swim-lane-node__label">{data.label}</span>
			</div>
		</div>
	);
}
