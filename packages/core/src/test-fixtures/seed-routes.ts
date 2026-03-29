import { StoryRouteSchema } from "../entities/story-route.js";
import type { StoryRoute } from "../entities/story-route.js";
import { StoryWaypointSchema } from "../entities/story-waypoint.js";
import type { StoryWaypoint } from "../entities/story-waypoint.js";

// ============================================================================
// Story Waypoints
// ============================================================================

// --- Route 1: The Full Descent (9 waypoints) ---

const fullDescentWaypoints: StoryWaypoint[] = [
	{
		id: "sw-fd-1",
		storyRouteId: "sr-full-descent",
		sequenceNumber: 0,
		title: "The Landscape",
		keyMessage:
			"This is the terrain — domains group capabilities. Click one to scope everything downstream.",
		whyItMatters: "The Landscape is where you orient yourself in the problem space.",
		perspectiveId: "persp-landscape",
		focusTargets: [{ type: "node", targetId: "n-context-machine" }],
	},
	{
		id: "sw-fd-2",
		storyRouteId: "sr-full-descent",
		sequenceNumber: 1,
		title: "Capabilities as anchor",
		keyMessage:
			"Capabilities are the anchor point. Journeys, processes, and sequences all hang off capabilities.",
		whyItMatters:
			"Everything downstream is scoped by capability — this is the canonical model at work.",
		perspectiveId: "persp-landscape",
		focusTargets: [],
	},
	{
		id: "sw-fd-3",
		storyRouteId: "sr-full-descent",
		sequenceNumber: 2,
		title: "Journey lens",
		keyMessage: "Same capability, different lens. Now you see the user-facing flow.",
		whyItMatters: "Journey shows what the user experiences. Same topic, different perspective.",
		perspectiveId: "persp-journey",
		focusTargets: [{ type: "node", targetId: "n-journey-layout" }],
	},
	{
		id: "sw-fd-4",
		storyRouteId: "sr-full-descent",
		sequenceNumber: 3,
		title: "Stepper walkthrough",
		keyMessage:
			"Use the stepper to walk through steps. Each step has a type — screen, modal, decision, error.",
		whyItMatters: "The stepper gives you linear control over sequential content.",
		perspectiveId: "persp-journey",
		focusTargets: [{ type: "node", targetId: "n-stepper-control" }],
	},
	{
		id: "sw-fd-5",
		storyRouteId: "sr-full-descent",
		sequenceNumber: 4,
		title: "Process view",
		keyMessage: "Same moment, operational view. BPMN swim lanes show how work executes.",
		whyItMatters: "Process reveals the operational machinery behind the user experience.",
		perspectiveId: "persp-process",
		focusTargets: [{ type: "node", targetId: "n-bpmn-layout" }],
	},
	{
		id: "sw-fd-6",
		storyRouteId: "sr-full-descent",
		sequenceNumber: 5,
		title: "Canvas modes",
		keyMessage: "Toggle canvas modes. Same topology, different emphasis.",
		whyItMatters: "Canvas modes let you see the same process through different analytical lenses.",
		perspectiveId: "persp-process",
		focusTargets: [{ type: "node", targetId: "n-context-bar" }],
	},
	{
		id: "sw-fd-7",
		storyRouteId: "sr-full-descent",
		sequenceNumber: 6,
		title: "Architecture",
		keyMessage: "The structural view. Packages, modules, and their dependencies.",
		whyItMatters: "Architecture shows how the system is organized — what depends on what.",
		perspectiveId: "persp-architecture",
		focusTargets: [{ type: "node", targetId: "n-context-machine" }],
	},
	{
		id: "sw-fd-8",
		storyRouteId: "sr-full-descent",
		sequenceNumber: 7,
		title: "System participants",
		keyMessage: "Scoped to participants. Only the systems involved in the current context.",
		whyItMatters: "System narrows the view to what actually runs for this scenario.",
		perspectiveId: "persp-system",
		focusTargets: [{ type: "node", targetId: "n-xstate-actor" }],
	},
	{
		id: "sw-fd-9",
		storyRouteId: "sr-full-descent",
		sequenceNumber: 8,
		title: "Sequence interaction",
		keyMessage: "Runtime interaction. The actual call sequence between services.",
		whyItMatters: "Sequence shows the time-ordered conversation between participants.",
		perspectiveId: "persp-sequence",
		focusTargets: [{ type: "message", targetId: "msg-cs-1" }],
	},
].map((d) => StoryWaypointSchema.parse(d));

// --- Route 2: The Shared Context Contract (4 waypoints) ---

const sharedContextWaypoints: StoryWaypoint[] = [
	{
		id: "sw-sc-1",
		storyRouteId: "sr-shared-context",
		sequenceNumber: 0,
		title: "Select a capability",
		keyMessage:
			"Select a capability. The left panel scopes to show only related journeys, processes, and sequences.",
		whyItMatters: "Capability selection is the entry point for the shared context contract.",
		perspectiveId: "persp-landscape",
		focusTargets: [{ type: "node", targetId: "n-left-panel" }],
	},
	{
		id: "sw-sc-2",
		storyRouteId: "sr-shared-context",
		sequenceNumber: 1,
		title: "Context survives Journey switch",
		keyMessage:
			"Switch perspective. The capability selection survived — same capability's journey.",
		whyItMatters:
			"The shared context contract preserves your selection across perspective switches.",
		perspectiveId: "persp-journey",
		focusTargets: [{ type: "node", targetId: "n-journey-layout" }],
	},
	{
		id: "sw-sc-3",
		storyRouteId: "sr-shared-context",
		sequenceNumber: 2,
		title: "Context survives Process switch",
		keyMessage:
			"Switch again. Still the same capability. The breadcrumb trail shows your context thread.",
		whyItMatters:
			"The breadcrumb trail in the context bar visualizes the preserved context thread.",
		perspectiveId: "persp-process",
		focusTargets: [{ type: "node", targetId: "n-context-bar" }],
	},
	{
		id: "sw-sc-4",
		storyRouteId: "sr-shared-context",
		sequenceNumber: 3,
		title: "The contract holds",
		keyMessage:
			"One more switch. Domain, capability, process — all preserved. This is the shared context contract.",
		whyItMatters:
			"The shared context contract is what makes perspective switching meaningful rather than disorienting.",
		perspectiveId: "persp-architecture",
		focusTargets: [{ type: "node", targetId: "n-context-machine" }],
	},
].map((d) => StoryWaypointSchema.parse(d));

// --- Route 3: How GuideRail Is Built (5 waypoints) ---

const howBuiltWaypoints: StoryWaypoint[] = [
	{
		id: "sw-hb-1",
		storyRouteId: "sr-how-built",
		sequenceNumber: 0,
		title: "Seven domains",
		keyMessage:
			"GuideRail has 7 domains. Core Kernel owns all state. Canvas Rendering owns all visualization.",
		whyItMatters: "The domain structure reflects the product's separation of concerns.",
		perspectiveId: "persp-landscape",
		focusTargets: [],
	},
	{
		id: "sw-hb-2",
		storyRouteId: "sr-how-built",
		sequenceNumber: 1,
		title: "Two packages",
		keyMessage:
			"Two packages: @guiderail/core and @guiderail/web. Dependency flows one direction only.",
		whyItMatters: "The one-way dependency boundary keeps the kernel independent from the UI.",
		perspectiveId: "persp-architecture",
		focusTargets: [{ type: "node", targetId: "n-context-machine" }],
	},
	{
		id: "sw-hb-3",
		storyRouteId: "sr-how-built",
		sequenceNumber: 2,
		title: "Context Machine and Reconciler",
		keyMessage:
			"The Context Machine is an XState actor with 35 events. The Reconciler enforces the shared context contract.",
		whyItMatters: "These two modules are the heart of GuideRail's navigation system.",
		perspectiveId: "persp-architecture",
		focusTargets: [{ type: "node", targetId: "n-reconciler" }],
	},
	{
		id: "sw-hb-4",
		storyRouteId: "sr-how-built",
		sequenceNumber: 3,
		title: "Perspective switch process",
		keyMessage:
			"When you switch perspectives, reconcilePerspectiveSwitch runs — preserving your context.",
		whyItMatters:
			"The reconciler is the operational implementation of the shared context contract.",
		perspectiveId: "persp-process",
		focusTargets: [{ type: "process_stage", targetId: "bpmn-ps-reconcile" }],
	},
	{
		id: "sw-hb-5",
		storyRouteId: "sr-how-built",
		sequenceNumber: 4,
		title: "Capability click call flow",
		keyMessage:
			"Here's the actual call flow when you click a capability — from click to rendered detail.",
		whyItMatters: "The sequence diagram traces the full event path through the system.",
		perspectiveId: "persp-sequence",
		focusTargets: [{ type: "message", targetId: "msg-cs-1" }],
	},
].map((d) => StoryWaypointSchema.parse(d));

// ============================================================================
// Aggregate all waypoints
// ============================================================================

export const storyWaypoints: StoryWaypoint[] = [
	...fullDescentWaypoints,
	...sharedContextWaypoints,
	...howBuiltWaypoints,
];

// ============================================================================
// Story Routes
// ============================================================================

export const storyRoutes: StoryRoute[] = [
	{
		id: "sr-full-descent",
		title: "The Full Descent",
		destinationObjective:
			"Trace one topic through every perspective — from Landscape to Sequence — demonstrating the 7-perspective progression.",
		audienceTag: "new-user",
		overview:
			"Walk through all perspectives in order, seeing how the same capability looks through each lens. This is the canonical onboarding experience for understanding GuideRail's multi-perspective model.",
		waypointIds: [
			"sw-fd-1",
			"sw-fd-2",
			"sw-fd-3",
			"sw-fd-4",
			"sw-fd-5",
			"sw-fd-6",
			"sw-fd-7",
			"sw-fd-8",
			"sw-fd-9",
		],
		tags: ["onboarding", "full-descent", "perspectives"],
	},
	{
		id: "sr-shared-context",
		title: "The Shared Context Contract",
		destinationObjective:
			"Demonstrate that perspective switches preserve domain, capability, and process context — the shared context contract in action.",
		audienceTag: "new-user",
		overview:
			"Select a capability and switch perspectives repeatedly, observing that your selection survives every transition. This route proves the shared context contract.",
		waypointIds: ["sw-sc-1", "sw-sc-2", "sw-sc-3", "sw-sc-4"],
		tags: ["context", "shared-context-contract", "perspectives"],
	},
	{
		id: "sr-how-built",
		title: "How GuideRail Is Built",
		destinationObjective:
			"Explore GuideRail's own architecture — domains, packages, the Context Machine, Reconciler, and the actual call flow when you click a capability.",
		audienceTag: "developer",
		overview:
			"A self-referential tour of GuideRail's internal structure. See the 7 domains, the two-package architecture, the XState state machine, and the actual runtime call sequence.",
		waypointIds: ["sw-hb-1", "sw-hb-2", "sw-hb-3", "sw-hb-4", "sw-hb-5"],
		tags: ["architecture", "self-referential", "developer"],
	},
].map((d) => StoryRouteSchema.parse(d));
