import type { StoryRoute, StoryWaypoint } from "@guiderail/core/entities";

interface StoryRouteBarProps {
	routeState: "inactive" | "active" | "paused";
	route: StoryRoute | null;
	currentWaypoint: StoryWaypoint | null;
	waypointIndex: number;
	totalWaypoints: number;
	onNext: () => void;
	onPrevious: () => void;
	onPause: () => void;
	onResume: () => void;
	onEnd: () => void;
}

export function StoryRouteBar({
	routeState,
	route,
	currentWaypoint,
	waypointIndex,
	totalWaypoints,
	onNext,
	onPrevious,
	onPause,
	onResume,
	onEnd,
}: StoryRouteBarProps) {
	if (routeState === "inactive" || !route) return null;

	const isFirstWaypoint = waypointIndex === 0;
	const isLastWaypoint = waypointIndex >= totalWaypoints - 1;
	const isIntroState = isFirstWaypoint;

	if (routeState === "paused") {
		return (
			<div className="story-route-bar story-route-bar--paused">
				<div className="story-route-bar__header">
					<span className="story-route-bar__paused-badge">Paused</span>
					<span className="story-route-bar__title">{route.title}</span>
				</div>
				<div className="story-route-bar__controls">
					<button
						type="button"
						className="story-route-bar__btn story-route-bar__btn--resume"
						onClick={onResume}
					>
						Return to Route
					</button>
					<button
						type="button"
						className="story-route-bar__btn story-route-bar__btn--end"
						onClick={onEnd}
					>
						End Route
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="story-route-bar story-route-bar--active">
			<div className="story-route-bar__header">
				<span className="story-route-bar__title">{route.title}</span>
				<span className="story-route-bar__progress">
					{waypointIndex + 1} / {totalWaypoints}
				</span>
			</div>

			{isIntroState && (
				<div className="story-route-bar__objective">{route.destinationObjective}</div>
			)}

			{currentWaypoint && (
				<div className="story-route-bar__message">
					<div className="story-route-bar__key-message">{currentWaypoint.keyMessage}</div>
					{currentWaypoint.whyItMatters && (
						<div className="story-route-bar__why">{currentWaypoint.whyItMatters}</div>
					)}
				</div>
			)}

			<div className="story-route-bar__controls">
				<button
					type="button"
					className="story-route-bar__btn"
					onClick={onPrevious}
					disabled={isFirstWaypoint}
				>
					Previous
				</button>
				<button
					type="button"
					className="story-route-bar__btn"
					onClick={onNext}
					disabled={isLastWaypoint}
				>
					Next
				</button>
				<button
					type="button"
					className="story-route-bar__btn story-route-bar__btn--pause"
					onClick={onPause}
				>
					Pause
				</button>
				<button
					type="button"
					className="story-route-bar__btn story-route-bar__btn--end"
					onClick={onEnd}
				>
					End
				</button>
			</div>
		</div>
	);
}
