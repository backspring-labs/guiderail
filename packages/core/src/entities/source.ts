import { z } from "zod";

export const SourceTypeSchema = z.enum([
	"content_repo",
	"code_repo",
	"api_registry",
	"service_catalog",
	"bpmn_source",
	"control_framework",
	"infra_config",
]);

export const SourceSchema = z.object({
	id: z.string(),
	type: SourceTypeSchema,
	uri: z.string(),
	label: z.string(),
	metadata: z.record(z.unknown()).default({}),
});

export type SourceType = z.infer<typeof SourceTypeSchema>;
export type Source = z.infer<typeof SourceSchema>;
