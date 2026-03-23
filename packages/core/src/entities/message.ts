import { z } from "zod";
import { ProvenanceRefSchema } from "../provenance/provenance.js";

export const MessageTypeSchema = z.enum(["request", "response", "event", "callback"]);

export const MessageSchema = z.object({
	id: z.string(),
	sequenceNumber: z.number().int(),
	sourceInterfaceId: z.string(),
	targetInterfaceId: z.string(),
	type: MessageTypeSchema,
	label: z.string(),
	description: z.string().optional(),
	payloadSummary: z.string().optional(),
	metadata: z.record(z.unknown()).default({}),
	provenance: ProvenanceRefSchema.optional(),
});

export type MessageType = z.infer<typeof MessageTypeSchema>;
export type Message = z.infer<typeof MessageSchema>;
