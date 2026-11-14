/**
 * The demo corpus, re-exported under the names the app uses.
 *
 * It comes from the built `@guiderail/core/demo` entry point, never from core's
 * source. Components still read these arrays directly; issue #13 replaces that
 * with one typed dataset boundary so other content can be supplied.
 */

import {
	annotations,
	bpmnEdges,
	bpmnNodes,
	capabilities,
	controlPoints,
	domains,
	edges,
	evidenceRefs,
	interfaces,
	journeys,
	layers,
	messages,
	nodes,
	orientationItems,
	perspectives,
	processStages,
	processes,
	providerAssociations,
	providers,
	scenes,
	sequences,
	steps,
	storyRoutes,
	storyWaypoints,
	valueStreams,
} from "@guiderail/core/demo";
import { createGraph } from "@guiderail/core/graph";

export const seedGraph = createGraph(nodes, edges);
export const seedDomains = domains;
export const seedCapabilities = capabilities;
export const seedNodes = nodes;
export const seedEdges = edges;
export const seedJourneys = journeys;
export const seedSteps = steps;
export const seedPerspectives = perspectives;
export const seedLayers = layers;
export const seedScenes = scenes;
export const seedAnnotations = annotations;
export const seedEvidenceRefs = evidenceRefs;
export const seedProviders = providers;
export const seedProviderAssociations = providerAssociations;
export const seedValueStreams = valueStreams;
export const seedProcesses = processes;
export const seedProcessStages = processStages;
export const seedStoryRoutes = storyRoutes;
export const seedStoryWaypoints = storyWaypoints;
export const seedControlPoints = controlPoints;
export const seedBpmnNodes = bpmnNodes;
export const seedBpmnEdges = bpmnEdges;
export const seedInterfaces = interfaces;
export const seedMessages = messages;
export const seedSequences = sequences;
export const seedOrientationItems = orientationItems;
