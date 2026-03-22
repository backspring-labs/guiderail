import type { ProviderBadge } from "@/lib/react-flow-adapter.js";

const MAX_VISIBLE = 2;

interface ProviderBadgesProps {
	badges: ProviderBadge[];
}

export function ProviderBadges({ badges }: ProviderBadgesProps) {
	if (badges.length === 0) return null;

	const visible = badges.slice(0, MAX_VISIBLE);
	const overflow = badges.length - MAX_VISIBLE;

	return (
		<div className="terrain-node__badges">
			{visible.map((badge) => (
				<span key={badge.providerId} className="terrain-node__badge" data-category={badge.category}>
					{badge.label}
				</span>
			))}
			{overflow > 0 && (
				<span className="terrain-node__badge terrain-node__badge--overflow">+{overflow}</span>
			)}
		</div>
	);
}
