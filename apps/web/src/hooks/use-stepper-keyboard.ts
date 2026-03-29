import type { ContextMachineEvent } from "@guiderail/core/context";
import { useEffect } from "react";

export function useStepperKeyboard(active: boolean, send: (event: ContextMachineEvent) => void) {
	useEffect(() => {
		if (!active) return;
		const handleStepperKey = (e: KeyboardEvent) => {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
			switch (e.key) {
				case "ArrowRight":
					e.preventDefault();
					send({ type: "STEPPER_FORWARD" });
					break;
				case "ArrowLeft":
					e.preventDefault();
					send({ type: "STEPPER_BACKWARD" });
					break;
				case "ArrowUp":
					e.preventDefault();
					send({ type: "STEPPER_RESET" });
					break;
				case "ArrowDown":
					e.preventDefault();
					send({ type: "STEPPER_END" });
					break;
			}
		};
		window.addEventListener("keydown", handleStepperKey);
		return () => window.removeEventListener("keydown", handleStepperKey);
	}, [active, send]);
}
