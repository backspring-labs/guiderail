interface LifelineNodeData {
	label: string;
	nodeId: string;
	protocol?: string;
	description?: string;
	lifelineHeight: number;
	[key: string]: unknown;
}

export function LifelineNode({ data }: { data: LifelineNodeData }) {
	return (
		<div className="lifeline-node" style={{ height: data.lifelineHeight }}>
			<div className="lifeline-node__header">
				<div className="lifeline-node__label">{data.label}</div>
				{data.protocol && <div className="lifeline-node__protocol">{data.protocol}</div>}
			</div>
			<div className="lifeline-node__line" />
		</div>
	);
}
