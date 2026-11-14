export type ContentIssueCode =
	| "not_an_array"
	| "invalid_entity"
	| "duplicate_id"
	| "dangling_reference"
	| "unknown_section"
	| "duplicate_sequence_number";

export type ContentIssueSeverity = "error" | "warning";

/**
 * One thing the loader noticed about a dataset. See
 * docs/architecture/data-integrity.md for what each code means.
 */
export interface ContentError {
	code: ContentIssueCode;
	severity: ContentIssueSeverity;
	/** The collection the issue is in, or the unknown top-level key. */
	entityType: string;
	/** Position of the entity in its input array, where there is one. */
	index?: number;
	/** The entity's id, where it has a readable one. */
	id?: string;
	message: string;
}

const SEVERITY: Record<ContentIssueCode, ContentIssueSeverity> = {
	not_an_array: "error",
	invalid_entity: "error",
	duplicate_id: "error",
	dangling_reference: "error",
	unknown_section: "warning",
	duplicate_sequence_number: "warning",
};

export function issue(
	code: ContentIssueCode,
	entityType: string,
	message: string,
	where: { index?: number; id?: string } = {},
): ContentError {
	return { code, severity: SEVERITY[code], entityType, message, ...where };
}

export function splitBySeverity(issues: ContentError[]): {
	errors: ContentError[];
	warnings: ContentError[];
} {
	return {
		errors: issues.filter((i) => i.severity === "error"),
		warnings: issues.filter((i) => i.severity === "warning"),
	};
}
