interface CapabilityItemProps {
	label: string;
	nodeCount: number;
	isActive: boolean;
	onClick: () => void;
}

export function CapabilityItem({ label, nodeCount, isActive, onClick }: CapabilityItemProps) {
	return (
		<button
			type="button"
			className={`domain-browser__cap-btn ${isActive ? "domain-browser__cap-btn--active" : ""}`}
			onClick={onClick}
		>
			<span>{label}</span>
			<span className="domain-browser__count">{nodeCount}</span>
		</button>
	);
}
