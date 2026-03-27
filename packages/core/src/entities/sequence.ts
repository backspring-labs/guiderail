import { z } from "zod";
import { ProvenanceRefSchema } from "../provenance/provenance.js";

export const SequenceSchema = z.object({
	id: z.string(),
	label: z.string(),
	description: z.string().optional(),
	capabilityId: z.string(),
	journeyId: z.string().optional(),
	processId: z.string().optional(),
	interfaceIds: z.array(z.string()),
	messageIds: z.array(z.string()),
	tags: z.array(z.string()).default([]),
	metadata: z.record(z.unknown()).default({}),
	provenance: ProvenanceRefSchema.optional(),
});

export type Sequence = z.infer<typeof SequenceSchema>;
