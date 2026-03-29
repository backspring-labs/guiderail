import { z } from "zod";

export const PerspectiveTypeSchema = z.enum([
	"orientation",
	"landscape",
	"journey",
	"process",
	"architecture",
	"system",
	"sequence",
]);

export const PerspectiveSchema = z.object({
	id: z.string(),
	type: PerspectiveTypeSchema,
	label: z.string(),
	description: z.string().optional(),
	highlightRules: z.record(z.unknown()).default({}),
	visibilityRules: z.record(z.unknown()).default({}),
	defaultLayerId: z.string().optional(),
});

export type PerspectiveType = z.infer<typeof PerspectiveTypeSchema>;
export type Perspective = z.infer<typeof PerspectiveSchema>;
