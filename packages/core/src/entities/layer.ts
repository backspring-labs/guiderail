import { z } from "zod";

export const LayoutStrategySchema = z.enum(["auto", "manual", "hybrid"]);

export const LayerSchema = z.object({
	id: z.string(),
	label: z.string(),
	eligibleNodeTypes: z.array(z.string()).default([]),
	eligibleEdgeTypes: z.array(z.string()).default([]),
	layoutStrategy: LayoutStrategySchema.default("auto"),
	renderingHints: z.record(z.string(), z.unknown()).default({}),
	metadata: z.record(z.string(), z.unknown()).default({}),
});

export type LayoutStrategy = z.infer<typeof LayoutStrategySchema>;
export type Layer = z.infer<typeof LayerSchema>;
