/**
 * Temporary development data bridge.
 *
 * Imports seed data directly from @guiderail/core source via @seed alias.
 * This will be replaced by a real ContentRepoAdapter when the backend is added.
 * Do not treat this as a long-term content loading contract.
 */

import { createGraph } from "@guiderail/core/graph";
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
} from "@seed/seed-banking.js";

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
