import { PerspectiveSwitcher } from "@/components/navigation/PerspectiveSwitcher.js";

interface TopBarProps {
	activePerspectiveId: string;
	onSwitchPerspective: (perspectiveId: string) => void;
}

export function TopBar({ activePerspectiveId, onSwitchPerspective }: TopBarProps) {
	return (
		<div className="top-bar">
			<div className="top-bar__title">GuideRail</div>
			<PerspectiveSwitcher
				activePerspectiveId={activePerspectiveId}
				onSwitch={onSwitchPerspective}
			/>
		</div>
	);
}
