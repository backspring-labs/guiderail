import { PerspectiveSwitcher } from "@/components/navigation/PerspectiveSwitcher.js";

interface TopBarProps {
	activePerspectiveId: string;
	onSwitchPerspective: (perspectiveId: string) => void;
	onSearchOpen: () => void;
}

export function TopBar({ activePerspectiveId, onSwitchPerspective, onSearchOpen }: TopBarProps) {
	return (
		<header className="top-bar">
			<div className="top-bar__left">
				<h1 className="top-bar__title">GuideRail</h1>
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
		</header>
	);
}
