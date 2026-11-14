import { useDataset } from "@/data/dataset-context.js";
import type { Perspective } from "@guiderail/core/entities";

interface PerspectiveSwitcherProps {
	activePerspectiveId: string;
	onSwitch: (perspectiveId: string) => void;
}

export function PerspectiveSwitcher({ activePerspectiveId, onSwitch }: PerspectiveSwitcherProps) {
	const dataset = useDataset();
	return (
		<div className="perspective-switcher">
			{dataset.perspectives.map((p) => (
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
