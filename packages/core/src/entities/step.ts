import { z } from "zod";
import { FocusTargetSchema } from "./focus-target.js";

export const StepTypeSchema = z
	.enum(["screen", "modal", "error", "info", "decision", "confirmation"])
	.default("screen");

export const StepTransitionSchema = z.object({
	targetStepId: z.string(),
	label: z.string().optional(),
	condition: z.string().optional(),
});

export const StepSchema = z.object({
	id: z.string(),
	journeyId: z.string(),
	sequenceNumber: z.number().int().nonnegative(),
	stepType: StepTypeSchema,
	focusTargets: z.array(FocusTargetSchema).default([]),
	capabilityId: z.string(),
	title: z.string(),
	narrative: z.string().optional(),
	actor: z.string().optional(),
	expectedAction: z.string().optional(),
	transitions: z.array(StepTransitionSchema).default([]),
	sceneId: z.string().optional(),
	evidenceRefIds: z.array(z.string()).default([]),
	metadata: z.record(z.unknown()).default({}),
});

export type StepType = z.infer<typeof StepTypeSchema>;
export type StepTransition = z.infer<typeof StepTransitionSchema>;
export type Step = z.infer<typeof StepSchema>;
