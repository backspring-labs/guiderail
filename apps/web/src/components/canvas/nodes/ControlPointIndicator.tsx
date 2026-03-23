interface ControlPointIndicatorProps {
	severity: string;
	label: string;
}

export function ControlPointIndicator({ severity, label }: ControlPointIndicatorProps) {
	return (
		<span className={`control-indicator control-indicator--${severity}`} title={label}>
			{severity === "critical" ? "!" : severity === "warning" ? "~" : "i"}
		</span>
	);
}
