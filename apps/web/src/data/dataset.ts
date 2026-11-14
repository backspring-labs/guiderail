import type { ContentBundle } from "@guiderail/core/content";
import { type TerrainGraph, createGraph } from "@guiderail/core/graph";

/**
 * Everything the app shows: one content bundle, plus the terrain graph built
 * from its nodes and edges.
 *
 * This is the single data boundary of the web app. The kernel is initialised
 * from a Dataset and every view reads the same Dataset, so the two cannot
 * disagree about what exists. Nothing in the app imports content directly;
 * only `demo-dataset.ts` knows where the default content comes from.
 */
export interface Dataset extends ContentBundle {
	graph: TerrainGraph;
}

/** Builds a Dataset from any content bundle, including a partial one. */
export function createDataset(bundle: ContentBundle): Dataset {
	return { ...bundle, graph: createGraph(bundle.nodes, bundle.edges) };
}
