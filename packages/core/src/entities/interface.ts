import { z } from "zod";
import { ProvenanceRefSchema } from "../provenance/provenance.js";

export const InterfaceProtocolSchema = z.enum(["rest", "grpc", "event", "internal"]);

export const InterfaceSchema = z.object({
	id: z.string(),
	nodeId: z.string(),
	label: z.string(),
	protocol: InterfaceProtocolSchema.optional(),
	description: z.string().optional(),
	metadata: z.record(z.unknown()).default({}),
	provenance: ProvenanceRefSchema.optional(),
});

export type InterfaceProtocol = z.infer<typeof InterfaceProtocolSchema>;
export type Interface = z.infer<typeof InterfaceSchema>;
