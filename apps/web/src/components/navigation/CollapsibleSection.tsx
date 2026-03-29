import { useState } from "react";

interface CollapsibleSectionProps {
	label: string;
	count: number;
	defaultExpanded?: boolean;
	forceExpanded?: boolean;
	children: React.ReactNode;
}

export function CollapsibleSection({
	label,
	count,
	defaultExpanded = false,
	forceExpanded = false,
	children,
}: CollapsibleSectionProps) {
	const [expanded, setExpanded] = useState(defaultExpanded);
	const isExpanded = forceExpanded || expanded;

	if (count === 0) return null;

	return (
		<div className="collapsible-section">
			<button
				type="button"
				className="collapsible-section__header"
				onClick={() => setExpanded(!expanded)}
			>
				<span className="collapsible-section__toggle">{isExpanded ? "▼" : "▶"}</span>
				<span className="collapsible-section__label">{label}</span>
				<span className="collapsible-section__count">{count}</span>
			</button>
			{isExpanded && <div className="collapsible-section__content">{children}</div>}
		</div>
	);
}
