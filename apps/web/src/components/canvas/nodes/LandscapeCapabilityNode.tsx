interface LandscapeCapabilityNodeData {
	capabilityId: string;
	domainId: string;
	label: string;
	nodeCount: number;
	providerCount: number;
	isActive?: boolean;
	showProviders?: boolean;
	providerNames?: string[];
	[key: string]: unknown;
}

export function LandscapeCapabilityNode({ data }: { data: LandscapeCapabilityNodeData }) {
	const activeClass = data.isActive ? "landscape-capability--selected" : "";
	const providerMode = data.showProviders && data.providerNames && data.providerNames.length > 0;

	return (
		<div className={`landscape-capability ${activeClass}`}>
			<div className="landscape-capability__label">{data.label}</div>
			{providerMode ? (
				<div className="landscape-capability__providers">
					{data.providerNames?.map((name) => (
						<span key={name} className="landscape-capability__provider-badge">
							{name}
						</span>
					))}
				</div>
			) : (
				<div className="landscape-capability__metrics">
					<span className="landscape-capability__metric">{data.nodeCount} nodes</span>
					{data.providerCount > 0 && (
						<span className="landscape-capability__metric landscape-capability__metric--provider">
							{data.providerCount} providers
						</span>
					)}
				</div>
			)}
		</div>
	);
}
