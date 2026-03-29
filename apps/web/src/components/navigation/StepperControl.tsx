interface StepperControlProps {
	currentIndex: number;
	totalItems: number;
	itemLabel: string;
	onForward: () => void;
	onBackward: () => void;
	onReset: () => void;
	onEnd: () => void;
}

export function StepperControl({
	currentIndex,
	totalItems,
	itemLabel,
	onForward,
	onBackward,
	onReset,
	onEnd,
}: StepperControlProps) {
	const isFirst = currentIndex <= 0;
	const isLast = currentIndex >= totalItems - 1;

	return (
		<div className="stepper-control">
			<div className="stepper-control__buttons">
				<button
					type="button"
					className="stepper-control__btn"
					onClick={onReset}
					disabled={isFirst}
					title="First (↑)"
				>
					⏮
				</button>
				<button
					type="button"
					className="stepper-control__btn"
					onClick={onBackward}
					disabled={isFirst}
					title="Previous (←)"
				>
					◀
				</button>
				<button
					type="button"
					className="stepper-control__btn"
					onClick={onForward}
					disabled={isLast}
					title="Next (→)"
				>
					▶
				</button>
				<button
					type="button"
					className="stepper-control__btn"
					onClick={onEnd}
					disabled={isLast}
					title="Last (↓)"
				>
					⏭
				</button>
			</div>
			<div className="stepper-control__counter">
				{itemLabel} {currentIndex + 1} of {totalItems}
			</div>
		</div>
	);
}
