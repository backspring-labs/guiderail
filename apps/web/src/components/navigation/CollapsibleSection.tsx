import { useState } from "react";

interface CollapsibleSectionProps {
	label: string;
	count: number;
	defaultExpanded?: boolean;
	children: React.ReactNode;
}

export function CollapsibleSection({
	label,
	count,
	defaultExpanded = false,
	children,
}: CollapsibleSectionProps) {
	const [expanded, setExpanded] = useState(defaultExpanded);

	if (count === 0) return null;

	return (
		<div className="collapsible-section">
			<button
				type="button"
				className="collapsible-section__header"
				onClick={() => setExpanded(!expanded)}
			>
				<span className="collapsible-section__toggle">{expanded ? "▼" : "▶"}</span>
				<span className="collapsible-section__label">{label}</span>
				<span className="collapsible-section__count">{count}</span>
			</button>
			{expanded && <div className="collapsible-section__content">{children}</div>}
		</div>
	);
}
