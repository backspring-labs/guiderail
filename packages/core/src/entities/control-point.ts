import { z } from "zod";
import { ProvenanceRefSchema } from "../provenance/provenance.js";

export const ControlSeveritySchema = z.enum(["info", "warning", "critical"]);

export const ControlTypeSchema = z.enum(["preventive", "detective", "corrective"]);

export const ControlStatusSchema = z.enum(["active", "pending", "not_implemented"]);

export const ControlPointSchema = z.object({
	id: z.string(),
	label: z.string(),
	processStageId: z.string(),
	severity: ControlSeveritySchema,
	controlType: ControlTypeSchema,
	status: ControlStatusSchema,
	description: z.string().optional(),
	regulatoryRef: z.string().optional(),
	metadata: z.record(z.unknown()).default({}),
	provenance: ProvenanceRefSchema.optional(),
});

export type ControlSeverity = z.infer<typeof ControlSeveritySchema>;
export type ControlType = z.infer<typeof ControlTypeSchema>;
export type ControlStatus = z.infer<typeof ControlStatusSchema>;
export type ControlPoint = z.infer<typeof ControlPointSchema>;
