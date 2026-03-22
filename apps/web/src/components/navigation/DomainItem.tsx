interface DomainItemProps {
	label: string;
	capabilityCount: number;
	isActive: boolean;
	onClick: () => void;
}

export function DomainItem({ label, capabilityCount, isActive, onClick }: DomainItemProps) {
	return (
		<button
			type="button"
			className={`domain-browser__domain-btn ${isActive ? "domain-browser__domain-btn--active" : ""}`}
			onClick={onClick}
		>
			<span className="domain-browser__chevron">{isActive ? "\u25BE" : "\u25B8"}</span>
			<span>{label}</span>
			<span className="domain-browser__count">{capabilityCount}</span>
		</button>
	);
}
