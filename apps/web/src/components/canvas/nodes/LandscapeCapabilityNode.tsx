interface LandscapeCapabilityNodeData {
	capabilityId: string;
	domainId: string;
	label: string;
	nodeCount: number;
	providerCount: number;
	isActive?: boolean;
	[key: string]: unknown;
}

export function LandscapeCapabilityNode({ data }: { data: LandscapeCapabilityNodeData }) {
	const activeClass = data.isActive ? "landscape-capability--selected" : "";

	return (
		<div className={`landscape-capability ${activeClass}`}>
			<div className="landscape-capability__label">{data.label}</div>
			<div className="landscape-capability__metrics">
				<span className="landscape-capability__metric">{data.nodeCount} nodes</span>
				{data.providerCount > 0 && (
					<span className="landscape-capability__metric landscape-capability__metric--provider">
						{data.providerCount} providers
					</span>
				)}
			</div>
		</div>
	);
}
