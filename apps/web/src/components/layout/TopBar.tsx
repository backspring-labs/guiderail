import { PerspectiveSwitcher } from "@/components/navigation/PerspectiveSwitcher.js";

interface TopBarProps {
	activePerspectiveId: string;
	onSwitchPerspective: (perspectiveId: string) => void;
	onSearchOpen: () => void;
}

export function TopBar({ activePerspectiveId, onSwitchPerspective, onSearchOpen }: TopBarProps) {
	return (
		<div className="top-bar">
			<div className="top-bar__left">
				<div className="top-bar__title">GuideRail</div>
				<button type="button" className="top-bar__search" onClick={onSearchOpen}>
					<span className="top-bar__search-text">Search...</span>
					<span className="top-bar__search-hint">⌘K</span>
				</button>
			</div>
			<PerspectiveSwitcher
				activePerspectiveId={activePerspectiveId}
				onSwitch={onSwitchPerspective}
			/>
			<div className="top-bar__right" />
		</div>
	);
}
