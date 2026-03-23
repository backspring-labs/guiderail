import { z } from "zod";

export const ProcessCanvasModeSchema = z.enum(["operational", "activity", "risk_controls"]);

export const CanvasModeSchema = z.object({
	perspectiveType: z.string(),
	mode: z.string(),
});

export type ProcessCanvasMode = z.infer<typeof ProcessCanvasModeSchema>;
export type CanvasMode = z.infer<typeof CanvasModeSchema>;
