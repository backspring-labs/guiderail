/**
 * Internal test support: mock adapters and entity factories, plus the demo
 * corpus re-exported from src/demo for the tests that use it as their fixture.
 *
 * This directory is not part of the published package. It is excluded from the
 * build (tsconfig.build.json) and has no entry in package.json "exports". Tests
 * import it by relative path.
 */
export {
	domains,
	capabilities,
	nodes,
	edges,
	journeys,
	steps,
	perspectives,
	layers,
	scenes,
	annotations,
	evidenceRefs,
	providers,
	providerAssociations,
	valueStreams,
	processes,
	processStages,
	storyRoutes,
	storyWaypoints,
	controlPoints,
	bpmnNodes,
	bpmnEdges,
	interfaces,
	messages,
	sequences,
	orientationItems,
} from "../demo/index.js";

export { MockContentRepoAdapter } from "./mock-content-adapter.js";
export { MockNormalizer } from "./mock-normalizer.js";

export {
	resetIdCounter,
	makeDomain,
	makeCapability,
	makeNode,
	makeEdge,
	makeJourney,
	makeStep,
	makePerspective,
	makeLayer,
	makeScene,
	makeAnnotation,
	makeEvidenceRef,
	makeProvider,
	makeProviderAssociation,
	makeValueStream,
	makeProcess,
	makeProcessStage,
	makeStoryRoute,
	makeStoryWaypoint,
} from "./helpers.js";
