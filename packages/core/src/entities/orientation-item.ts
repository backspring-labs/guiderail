import { z } from "zod";
import { ProvenanceRefSchema } from "../provenance/provenance.js";

export const OrientationItemSchema = z.object({
	id: z.string(),
	sequenceNumber: z.number().int().nonnegative(),
	title: z.string(),
	body: z.string(),
	terms: z
		.array(
			z.object({
				term: z.string(),
				definition: z.string(),
			}),
		)
		.default([]),
	visualUrl: z.string().optional(),
	links: z
		.array(
			z.object({
				label: z.string(),
				perspectiveId: z.string(),
				entityId: z.string().optional(),
			}),
		)
		.default([]),
	tags: z.array(z.string()).default([]),
	metadata: z.record(z.unknown()).default({}),
	provenance: ProvenanceRefSchema.optional(),
});

export type OrientationItem = z.infer<typeof OrientationItemSchema>;
