import { seedPerspectives } from "@/store/seed-loader.js";
import type { Perspective } from "@guiderail/core/entities";

interface PerspectiveSwitcherProps {
	activePerspectiveId: string;
	onSwitch: (perspectiveId: string) => void;
}

export function PerspectiveSwitcher({ activePerspectiveId, onSwitch }: PerspectiveSwitcherProps) {
	return (
		<div className="perspective-switcher">
			{seedPerspectives.map((p) => (
				<button
					key={p.id}
					type="button"
					className={`perspective-switcher__tab ${p.id === activePerspectiveId ? "perspective-switcher__tab--active" : ""}`}
					onClick={() => onSwitch(p.id)}
					title={p.description}
				>
					{p.label}
				</button>
			))}
		</div>
	);
}
