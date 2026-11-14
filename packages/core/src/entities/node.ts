import { z } from "zod";
import { ProvenanceRefSchema } from "../provenance/provenance.js";

const PositionSchema = z.object({
	x: z.number(),
	y: z.number(),
});

export const NodeSchema = z.object({
	id: z.string(),
	type: z.string(),
	label: z.string(),
	description: z.string().optional(),
	parentNodeId: z.string().nullable().optional(),
	tags: z.array(z.string()).default([]),
	metadata: z.record(z.string(), z.unknown()).default({}),
	layoutByPerspective: z.record(z.string(), PositionSchema).default({}),
	provenance: ProvenanceRefSchema.optional(),
});

export type Node = z.infer<typeof NodeSchema>;
