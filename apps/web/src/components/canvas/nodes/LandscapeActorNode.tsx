interface LandscapeActorNodeData {
	nodeId: string;
	label: string;
	description?: string;
	isActive?: boolean;
	[key: string]: unknown;
}

export function LandscapeActorNode({ data }: { data: LandscapeActorNodeData }) {
	const activeClass = data.isActive ? "landscape-actor--selected" : "";

	return (
		<div className={`landscape-actor ${activeClass}`}>
			<div className="landscape-actor__icon">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					role="img"
					aria-label={data.label}
				>
					<title>{data.label}</title>
					<circle cx="12" cy="8" r="4" fill="currentColor" />
					<path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" />
				</svg>
			</div>
			<div className="landscape-actor__label">{data.label}</div>
		</div>
	);
}
