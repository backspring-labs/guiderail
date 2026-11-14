import type { ZodTypeAny } from "zod";
import {
	CONTENT_COLLECTIONS,
	CONTENT_COLLECTION_NAMES,
	type ContentBundle,
	type ContentCollectionName,
	emptyContentBundle,
	isContentCollectionName,
} from "./collections.js";
import { type ContentError, issue, splitBySeverity } from "./diagnostics.js";
import { checkOrdering } from "./ordering.js";
import { checkDuplicateIds, checkReferences } from "./references.js";

export type { ContentBundle } from "./collections.js";
export { emptyContentBundle } from "./collections.js";
export type { ContentError } from "./diagnostics.js";

/**
 * Result of loading content. Follows docs/architecture/data-integrity.md:
 * loading never throws on bad content, and nothing is dropped silently.
 */
export interface LoadResult {
	bundle: ContentBundle;
	/** Input that was unusable, dropped, or does not resolve. */
	errors: ContentError[];
	/** Input that was ignored or is ambiguous, but nothing was lost. */
	warnings: ContentError[];
	provenance: ContentProvenance;
}

export interface ContentProvenance {
	sourceType: string;
	sourcePath: string;
	loadedAt: string;
	entityCounts: Record<string, number>;
}

export interface ValidationResult {
	errors: ContentError[];
	warnings: ContentError[];
}

export interface MergeResult {
	bundle: ContentBundle;
	/** Ids in the second bundle that collided with the first and were dropped. */
	errors: ContentError[];
}

type Identified = { id: string };

function readableId(value: unknown): string | undefined {
	if (typeof value !== "object" || value === null) return undefined;
	const id = (value as { id?: unknown }).id;
	return typeof id === "string" ? id : undefined;
}

/** Parses one collection: validates each entity and keeps the first of any duplicated id. */
function parseCollection(
	name: ContentCollectionName,
	rawArray: unknown[],
	issues: ContentError[],
): Identified[] {
	const schema: ZodTypeAny = CONTENT_COLLECTIONS[name];
	const kept: Identified[] = [];
	const seen = new Set<string>();

	rawArray.forEach((rawEntity, index) => {
		const result = schema.safeParse(rawEntity);
		if (!result.success) {
			const id = readableId(rawEntity);
			issues.push(
				issue("invalid_entity", name, result.error.message, id == null ? { index } : { index, id }),
			);
			return;
		}
		const entity = result.data as Identified;
		if (seen.has(entity.id)) {
			issues.push(
				issue(
					"duplicate_id",
					name,
					`id "${entity.id}" is already used in ${name}; this later entity was dropped`,
					{ index, id: entity.id },
				),
			);
			return;
		}
		seen.add(entity.id);
		kept.push(entity);
	});

	return kept;
}

/**
 * Parse a raw JSON object into a validated ContentBundle.
 *
 * - An omitted collection loads as empty, with no diagnostic.
 * - A collection that is present but not an array is an error.
 * - An entity that fails its schema, or reuses an id, is dropped and reported.
 * - A reference that does not resolve is reported; the entity is kept.
 * - An unknown top-level key is ignored with a warning.
 */
export function parseContentBundle(raw: unknown, sourcePath: string): LoadResult {
	const issues: ContentError[] = [];
	const entityCounts: Record<string, number> = {};
	const bundle = emptyContentBundle();
	const writable = bundle as Record<ContentCollectionName, Identified[]>;
	const present = new Set<ContentCollectionName>();

	const isObject = typeof raw === "object" && raw !== null && !Array.isArray(raw);
	if (!isObject) {
		issues.push(
			issue("not_an_array", "(root)", "content must be an object whose keys are collections"),
		);
	}
	const source: Record<string, unknown> = isObject ? (raw as Record<string, unknown>) : {};

	for (const key of Object.keys(source)) {
		if (!isContentCollectionName(key)) {
			issues.push(
				issue("unknown_section", key, `"${key}" is not a known collection and was ignored`),
			);
		}
	}

	for (const name of CONTENT_COLLECTION_NAMES) {
		const rawArray = source[name];
		if (rawArray === undefined) {
			entityCounts[name] = 0;
			continue;
		}
		if (!Array.isArray(rawArray)) {
			issues.push(
				issue(
					"not_an_array",
					name,
					`"${name}" must be an array but is ${rawArray === null ? "null" : typeof rawArray}; it was loaded as empty`,
				),
			);
			entityCounts[name] = 0;
			continue;
		}
		present.add(name);
		writable[name] = parseCollection(name, rawArray, issues);
		entityCounts[name] = writable[name].length;
	}

	issues.push(...checkReferences(bundle, present), ...checkOrdering(bundle));

	return {
		bundle,
		...splitBySeverity(issues),
		provenance: {
			sourceType: "content_file",
			sourcePath,
			loadedAt: new Date().toISOString(),
			entityCounts,
		},
	};
}

/**
 * Checks a complete bundle for duplicate ids, dangling references and ambiguous
 * ordering. Use it on a bundle assembled in code or produced by a merge, where
 * every collection is expected to be present.
 */
export function validateContentBundle(bundle: ContentBundle): ValidationResult {
	return splitBySeverity([
		...checkDuplicateIds(bundle),
		...checkReferences(bundle),
		...checkOrdering(bundle),
	]);
}

/**
 * Merge two ContentBundles. Entities from the second are appended.
 *
 * An id that already exists in the first bundle's collection is not overwritten
 * and not duplicated: the first bundle's entity wins and the collision is
 * reported. Call validateContentBundle() on the result to check references
 * across the merged whole.
 */
export function mergeContentBundles(a: ContentBundle, b: ContentBundle): MergeResult {
	const bundle = emptyContentBundle();
	const writable = bundle as Record<ContentCollectionName, Identified[]>;
	const errors: ContentError[] = [];

	for (const name of CONTENT_COLLECTION_NAMES) {
		const merged = [...(a[name] as Identified[])];
		const seen = new Set(merged.map((e) => e.id));
		(b[name] as Identified[]).forEach((entity, index) => {
			if (seen.has(entity.id)) {
				errors.push(
					issue(
						"duplicate_id",
						name,
						`id "${entity.id}" exists in both bundles; the first bundle's entity was kept`,
						{ index, id: entity.id },
					),
				);
				return;
			}
			seen.add(entity.id);
			merged.push(entity);
		});
		writable[name] = merged;
	}

	return { bundle, errors };
}
