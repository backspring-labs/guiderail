export {
	parseContentBundle,
	validateContentBundle,
	mergeContentBundles,
} from "./file-loader.js";
export type {
	LoadResult,
	MergeResult,
	ValidationResult,
	ContentProvenance,
} from "./file-loader.js";

export {
	CONTENT_COLLECTIONS,
	CONTENT_COLLECTION_NAMES,
	emptyContentBundle,
	isContentCollectionName,
} from "./collections.js";
export type { ContentBundle, ContentCollectionName } from "./collections.js";

export type { ContentError, ContentIssueCode, ContentIssueSeverity } from "./diagnostics.js";

export { orderBySequence } from "./ordering.js";
export { checkReferences, checkDuplicateIds } from "./references.js";
