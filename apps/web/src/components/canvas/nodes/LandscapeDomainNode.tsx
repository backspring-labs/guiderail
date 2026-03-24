interface LandscapeDomainNodeData {
	domainId: string;
	label: string;
	description?: string;
	capabilityCount: number;
	width: number;
	height: number;
	isActive?: boolean;
	[key: string]: unknown;
}

export function LandscapeDomainNode({ data }: { data: LandscapeDomainNodeData }) {
	const activeClass = data.isActive ? "landscape-domain--selected" : "";

	return (
		<div
			className={`landscape-domain ${activeClass}`}
			style={{ width: data.width, height: data.height }}
		>
			<div className="landscape-domain__header">
				<span className="landscape-domain__label">{data.label}</span>
				<span className="landscape-domain__count">{data.capabilityCount}</span>
			</div>
		</div>
	);
}
