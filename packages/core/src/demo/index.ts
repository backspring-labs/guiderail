/**
 * The demo corpus: GuideRail described in its own model.
 *
 * It is one dataset in the shape any content takes, a ContentBundle, and it is
 * the data the web app shows today. The kernel's tests also use it as their
 * fixture, which is why it lives in this package.
 *
 * It is not part of the kernel's API. Nothing under src/ outside this directory
 * and src/test-fixtures may import it.
 */
import type { ContentBundle } from "../content/collections.js";
import {
	annotations,
	bpmnEdges,
	bpmnNodes,
	controlPoints,
	evidenceRefs,
	interfaces,
	journeys,
	layers,
	messages,
	perspectives,
	processStages,
	processes,
	providerAssociations,
	providers,
	scenes,
	sequences,
	steps,
	valueStreams,
} from "./seed-content.js";
import { capabilities, domains } from "./seed-domains.js";
import { orientationItems } from "./seed-orientation.js";
import { storyRoutes, storyWaypoints } from "./seed-routes.js";
import { edges, nodes } from "./seed-terrain.js";

export { domains, capabilities } from "./seed-domains.js";
export { nodes, edges } from "./seed-terrain.js";
export {
	steps,
	journeys,
	perspectives,
	layers,
	scenes,
	annotations,
	evidenceRefs,
	providers,
	providerAssociations,
	valueStreams,
	processStages,
	controlPoints,
	bpmnNodes,
	bpmnEdges,
	interfaces,
	messages,
	sequences,
	processes,
} from "./seed-content.js";
export { storyWaypoints, storyRoutes } from "./seed-routes.js";
export { orientationItems } from "./seed-orientation.js";

/** The whole corpus as one bundle, with every collection present. */
export const demoContent: ContentBundle = {
	domains,
	capabilities,
	nodes,
	edges,
	journeys,
	steps,
	scenes,
	perspectives,
	layers,
	annotations,
	evidenceRefs,
	providers,
	providerAssociations,
	valueStreams,
	processes,
	processStages,
	controlPoints,
	bpmnNodes,
	bpmnEdges,
	storyRoutes,
	storyWaypoints,
	interfaces,
	messages,
	sequences,
	orientationItems,
};
