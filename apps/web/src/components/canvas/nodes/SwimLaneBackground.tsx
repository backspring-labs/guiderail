interface SwimLane {
	label: string;
	y: number;
	height: number;
}

interface SwimLaneBackgroundProps {
	swimLanes: SwimLane[];
}

export function SwimLaneBackground({ swimLanes }: SwimLaneBackgroundProps) {
	return (
		<div className="swim-lane-background">
			{swimLanes.map((lane) => (
				<div
					key={lane.label}
					className="swim-lane"
					style={{
						top: lane.y,
						height: lane.height,
					}}
				>
					<div className="swim-lane__header">
						<span className="swim-lane__header-text">{lane.label}</span>
					</div>
				</div>
			))}
		</div>
	);
}
