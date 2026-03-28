import { z } from "zod";
import { ProvenanceRefSchema } from "../provenance/provenance.js";

export const WorkspaceSchema = z.object({
	id: z.string(),
	name: z.string(),
	sourceIds: z.array(z.string()).default([]),
	indexId: z.string().optional(),
	createdAt: z.string().datetime(),
	provenance: ProvenanceRefSchema.optional(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;
