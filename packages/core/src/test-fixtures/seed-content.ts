import { AnnotationSchema } from "../entities/annotation.js";
import type { Annotation } from "../entities/annotation.js";
import { ControlPointSchema } from "../entities/control-point.js";
import type { ControlPoint } from "../entities/control-point.js";
import { EdgeSchema } from "../entities/edge.js";
import type { Edge } from "../entities/edge.js";
import { EvidenceRefSchema } from "../entities/evidence-ref.js";
import type { EvidenceRef } from "../entities/evidence-ref.js";
import { InterfaceSchema } from "../entities/interface.js";
import type { Interface } from "../entities/interface.js";
import { JourneySchema } from "../entities/journey.js";
import type { Journey } from "../entities/journey.js";
import { LayerSchema } from "../entities/layer.js";
import type { Layer } from "../entities/layer.js";
import { MessageSchema } from "../entities/message.js";
import type { Message } from "../entities/message.js";
import { NodeSchema } from "../entities/node.js";
import type { Node } from "../entities/node.js";
import { PerspectiveSchema } from "../entities/perspective.js";
import type { Perspective } from "../entities/perspective.js";
import { ProcessStageSchema } from "../entities/process-stage.js";
import type { ProcessStage } from "../entities/process-stage.js";
import { ProcessSchema } from "../entities/process.js";
import type { Process } from "../entities/process.js";
import { ProviderAssociationSchema } from "../entities/provider-association.js";
import type { ProviderAssociation } from "../entities/provider-association.js";
import { ProviderSchema } from "../entities/provider.js";
import type { Provider } from "../entities/provider.js";
import { SceneSchema } from "../entities/scene.js";
import type { Scene } from "../entities/scene.js";
import { SequenceSchema } from "../entities/sequence.js";
import type { Sequence } from "../entities/sequence.js";
import { StepSchema } from "../entities/step.js";
import type { Step } from "../entities/step.js";
import { ValueStreamSchema } from "../entities/value-stream.js";
import type { ValueStream } from "../entities/value-stream.js";

// ============================================================================
// Journeys
// ============================================================================

export const journeys: Journey[] = [
	{
		id: "j-full-descent",
		label: "The Full Descent",
		description:
			"One topic traced through every perspective — Landscape to Sequence, demonstrating the 7-perspective progression",
		entryCapabilityId: "cap-perspective-switching",
		capabilityIds: ["cap-perspective-switching", "cap-context-machine"],
		stepIds: [
			"step-fd-1",
			"step-fd-2",
			"step-fd-3",
			"step-fd-4",
			"step-fd-5",
			"step-fd-6",
			"step-fd-7",
			"step-fd-8",
			"step-fd-9",
			"step-fd-10",
		],
		tags: ["onboarding", "full-descent"],
	},
	{
		id: "j-left-panel-nav",
		label: "Left Panel Navigation",
		description:
			"Using the contextual navigator to discover and select entities across all perspectives",
		entryCapabilityId: "cap-left-panel",
		capabilityIds: ["cap-left-panel"],
		stepIds: ["step-lp-1", "step-lp-2", "step-lp-3", "step-lp-4", "step-lp-5"],
		tags: ["navigation", "left-panel"],
	},
	{
		id: "j-guided-route-playback",
		label: "Guided Route Playback",
		description:
			"Following an authored guided route from start to finish — waypoints, key messages, and stepper transport",
		entryCapabilityId: "cap-route-playback",
		capabilityIds: ["cap-route-playback"],
		stepIds: ["step-gr-1", "step-gr-2", "step-gr-3", "step-gr-4", "step-gr-5", "step-gr-6"],
		tags: ["routes", "playback"],
	},
].map((d) => JourneySchema.parse(d));

// ============================================================================
// Steps
// ============================================================================

export const steps: Step[] = [
	// --- Journey 1: The Full Descent (10 steps) ---
	{
		id: "step-fd-1",
		journeyId: "j-full-descent",
		sequenceNumber: 0,
		stepType: "screen",
		title: "See all domains",
		narrative:
			"The Landscape perspective shows all 7 domains as a terrain map. Each domain groups related capabilities.",
		actor: "User",
		expectedAction: "View the Landscape canvas and observe all domain regions",
		capabilityId: "cap-perspective-switching",
		focusTargets: [
			{ type: "node", targetId: "n-app-shell" },
			{ type: "node", targetId: "n-landscape-layout" },
		],
		transitions: [{ targetStepId: "step-fd-2" }],
	},
	{
		id: "step-fd-2",
		journeyId: "j-full-descent",
		sequenceNumber: 1,
		stepType: "screen",
		title: "Select a domain",
		narrative:
			"Click a domain to scope all downstream content. The left panel filters to show only capabilities within that domain.",
		actor: "User",
		expectedAction: "Click the Core Kernel domain",
		capabilityId: "cap-perspective-switching",
		focusTargets: [{ type: "node", targetId: "n-left-panel" }],
		transitions: [{ targetStepId: "step-fd-3" }],
	},
	{
		id: "step-fd-3",
		journeyId: "j-full-descent",
		sequenceNumber: 2,
		stepType: "screen",
		title: "Select a capability",
		narrative:
			"Capabilities are the anchor point. Journeys, processes, and sequences all hang off capabilities. Select one to scope everything downstream.",
		actor: "User",
		expectedAction: "Click the Context Machine capability",
		capabilityId: "cap-perspective-switching",
		focusTargets: [
			{ type: "node", targetId: "n-context-machine" },
			{ type: "node", targetId: "n-left-panel" },
		],
		transitions: [{ targetStepId: "step-fd-4" }],
	},
	{
		id: "step-fd-4",
		journeyId: "j-full-descent",
		sequenceNumber: 3,
		stepType: "screen",
		title: "Switch to Journey",
		narrative:
			"Switch perspective — the shared context contract preserves your domain and capability selection. You see the same capability's journey.",
		actor: "User",
		expectedAction: "Click the Journey tab in the perspective switcher",
		capabilityId: "cap-perspective-switching",
		focusTargets: [
			{ type: "node", targetId: "n-app-shell" },
			{ type: "node", targetId: "n-journey-layout" },
		],
		transitions: [{ targetStepId: "step-fd-5" }],
	},
	{
		id: "step-fd-5",
		journeyId: "j-full-descent",
		sequenceNumber: 4,
		stepType: "screen",
		title: "Step through the journey",
		narrative:
			"Use the stepper transport or arrow keys to advance through journey steps. Each step maps to a real UI interaction.",
		actor: "User",
		expectedAction: "Click the forward button or press ArrowRight to advance steps",
		capabilityId: "cap-perspective-switching",
		focusTargets: [
			{ type: "node", targetId: "n-stepper-control" },
			{ type: "node", targetId: "n-journey-layout" },
		],
		transitions: [{ targetStepId: "step-fd-6" }],
	},
	{
		id: "step-fd-6",
		journeyId: "j-full-descent",
		sequenceNumber: 5,
		stepType: "screen",
		title: "Switch to Process",
		narrative:
			"Same moment, operational view. BPMN swim lanes show how work executes across system boundaries.",
		actor: "User",
		expectedAction: "Click the Process tab in the perspective switcher",
		capabilityId: "cap-perspective-switching",
		focusTargets: [
			{ type: "node", targetId: "n-app-shell" },
			{ type: "node", targetId: "n-bpmn-layout" },
		],
		transitions: [{ targetStepId: "step-fd-7" }],
	},
	{
		id: "step-fd-7",
		journeyId: "j-full-descent",
		sequenceNumber: 6,
		stepType: "screen",
		title: "Toggle canvas modes",
		narrative:
			"Same topology, different emphasis. Toggle between Operational, Decision, and Controls modes to highlight different aspects.",
		actor: "User",
		expectedAction: "Click a canvas mode button in the context bar",
		capabilityId: "cap-canvas-mode-switching",
		focusTargets: [{ type: "node", targetId: "n-context-bar" }],
		transitions: [{ targetStepId: "step-fd-8" }],
	},
	{
		id: "step-fd-8",
		journeyId: "j-full-descent",
		sequenceNumber: 7,
		stepType: "screen",
		title: "Switch to Architecture",
		narrative:
			"The structural view shows packages, modules, and their dependencies. The same capability's code structure becomes visible.",
		actor: "User",
		expectedAction: "Click the Architecture tab in the perspective switcher",
		capabilityId: "cap-perspective-switching",
		focusTargets: [
			{ type: "node", targetId: "n-context-machine" },
			{ type: "node", targetId: "n-reconciler" },
			{ type: "node", targetId: "n-navigation-context" },
		],
		transitions: [{ targetStepId: "step-fd-9" }],
	},
	{
		id: "step-fd-9",
		journeyId: "j-full-descent",
		sequenceNumber: 8,
		stepType: "screen",
		title: "Switch to System",
		narrative:
			"Scoped to participants — only the systems involved in the current context. XState Actor, React Flow Instance, and other runtime participants.",
		actor: "User",
		expectedAction: "Click the System tab in the perspective switcher",
		capabilityId: "cap-perspective-switching",
		focusTargets: [
			{ type: "node", targetId: "n-xstate-actor" },
			{ type: "node", targetId: "n-react-flow-instance" },
		],
		transitions: [{ targetStepId: "step-fd-10" }],
	},
	{
		id: "step-fd-10",
		journeyId: "j-full-descent",
		sequenceNumber: 9,
		stepType: "screen",
		title: "Switch to Sequence",
		narrative:
			"Runtime interaction — the actual call sequence between services. Every request and response is visible as a lifeline diagram.",
		actor: "User",
		expectedAction: "Click the Sequence tab in the perspective switcher",
		capabilityId: "cap-perspective-switching",
		focusTargets: [
			{ type: "node", targetId: "n-app-shell" },
			{ type: "node", targetId: "n-sequence-layout" },
		],
		transitions: [],
	},

	// --- Journey 2: Left Panel Navigation (5 steps) ---
	{
		id: "step-lp-1",
		journeyId: "j-left-panel-nav",
		sequenceNumber: 0,
		stepType: "screen",
		title: "Filter entities",
		narrative:
			"Type in the filter box to search across all sections. The left panel filters journeys, processes, sequences, and more in real time.",
		actor: "User",
		expectedAction: "Type a search term in the left panel filter box",
		capabilityId: "cap-left-panel",
		focusTargets: [{ type: "node", targetId: "n-left-panel" }],
		transitions: [{ targetStepId: "step-lp-2" }],
	},
	{
		id: "step-lp-2",
		journeyId: "j-left-panel-nav",
		sequenceNumber: 1,
		stepType: "screen",
		title: "Select a journey",
		narrative:
			"Click a journey in the left panel — the perspective auto-switches to Journey and the step flow renders on the canvas.",
		actor: "User",
		expectedAction: "Click a journey entry in the Journeys section",
		capabilityId: "cap-left-panel",
		focusTargets: [
			{ type: "node", targetId: "n-left-panel" },
			{ type: "node", targetId: "n-journey-layout" },
		],
		transitions: [{ targetStepId: "step-lp-3" }],
	},
	{
		id: "step-lp-3",
		journeyId: "j-left-panel-nav",
		sequenceNumber: 2,
		stepType: "screen",
		title: "Select a process",
		narrative:
			"Click a process — the perspective auto-switches to Process and BPMN swim lanes appear.",
		actor: "User",
		expectedAction: "Click a process entry in the Processes section",
		capabilityId: "cap-left-panel",
		focusTargets: [
			{ type: "node", targetId: "n-left-panel" },
			{ type: "node", targetId: "n-bpmn-layout" },
		],
		transitions: [{ targetStepId: "step-lp-4" }],
	},
	{
		id: "step-lp-4",
		journeyId: "j-left-panel-nav",
		sequenceNumber: 3,
		stepType: "screen",
		title: "Select a sequence",
		narrative:
			"Click a sequence — the perspective auto-switches to Sequence and the lifeline diagram renders.",
		actor: "User",
		expectedAction: "Click a sequence entry in the Sequences section",
		capabilityId: "cap-left-panel",
		focusTargets: [
			{ type: "node", targetId: "n-left-panel" },
			{ type: "node", targetId: "n-sequence-layout" },
		],
		transitions: [{ targetStepId: "step-lp-5" }],
	},
	{
		id: "step-lp-5",
		journeyId: "j-left-panel-nav",
		sequenceNumber: 4,
		stepType: "screen",
		title: "View entity detail",
		narrative:
			"Each selection shows detail in the right panel — entity description, cross-navigation actions, and related entities.",
		actor: "User",
		expectedAction: "Observe the detail panel on the right showing entity information",
		capabilityId: "cap-detail-panel",
		focusTargets: [{ type: "node", targetId: "n-app-shell" }],
		transitions: [],
	},

	// --- Journey 3: Guided Route Playback (6 steps) ---
	{
		id: "step-gr-1",
		journeyId: "j-guided-route-playback",
		sequenceNumber: 0,
		stepType: "screen",
		title: "Start a guided route",
		narrative:
			"Click a guide in the Guides section of the left panel to begin an authored walkthrough experience.",
		actor: "User",
		expectedAction: "Click a guide entry in the Guides section",
		capabilityId: "cap-route-playback",
		focusTargets: [
			{ type: "node", targetId: "n-left-panel" },
			{ type: "node", targetId: "n-story-route-bar" },
		],
		transitions: [{ targetStepId: "step-gr-2" }],
	},
	{
		id: "step-gr-2",
		journeyId: "j-guided-route-playback",
		sequenceNumber: 1,
		stepType: "screen",
		title: "See the first waypoint",
		narrative:
			"The StoryRouteBar appears at the top with the first waypoint's key message. The canvas shows the first perspective and focus targets.",
		actor: "User",
		expectedAction: "Read the key message in the StoryRouteBar",
		capabilityId: "cap-route-playback",
		focusTargets: [{ type: "node", targetId: "n-story-route-bar" }],
		transitions: [{ targetStepId: "step-gr-3" }],
	},
	{
		id: "step-gr-3",
		journeyId: "j-guided-route-playback",
		sequenceNumber: 2,
		stepType: "screen",
		title: "Advance to next waypoint",
		narrative:
			"Click Next — the perspective switches, the canvas re-centers on new focus targets, and the key message updates.",
		actor: "User",
		expectedAction: "Click the Next button in the StoryRouteBar",
		capabilityId: "cap-waypoint-progression",
		focusTargets: [
			{ type: "node", targetId: "n-story-route-bar" },
			{ type: "node", targetId: "n-reconciler" },
		],
		transitions: [{ targetStepId: "step-gr-4" }],
	},
	{
		id: "step-gr-4",
		journeyId: "j-guided-route-playback",
		sequenceNumber: 3,
		stepType: "screen",
		title: "Pause the route",
		narrative:
			"Pause the route to explore freely. The current waypoint position is preserved so you can resume later.",
		actor: "User",
		expectedAction: "Click the Pause button in the StoryRouteBar",
		capabilityId: "cap-route-playback",
		focusTargets: [{ type: "node", targetId: "n-story-route-bar" }],
		transitions: [{ targetStepId: "step-gr-5" }],
	},
	{
		id: "step-gr-5",
		journeyId: "j-guided-route-playback",
		sequenceNumber: 4,
		stepType: "screen",
		title: "Resume the route",
		narrative:
			"Resume — the route returns to the paused position and the StoryRouteBar reappears with the current waypoint.",
		actor: "User",
		expectedAction: "Click the Resume button to continue the route",
		capabilityId: "cap-route-playback",
		focusTargets: [{ type: "node", targetId: "n-story-route-bar" }],
		transitions: [{ targetStepId: "step-gr-6" }],
	},
	{
		id: "step-gr-6",
		journeyId: "j-guided-route-playback",
		sequenceNumber: 5,
		stepType: "screen",
		title: "End the route",
		narrative: "End the route — the StoryRouteBar disappears and you return to free explorer mode.",
		actor: "User",
		expectedAction: "Click the End button or reach the final waypoint",
		capabilityId: "cap-route-playback",
		focusTargets: [{ type: "node", targetId: "n-app-shell" }],
		transitions: [],
	},
].map((d) => StepSchema.parse(d));

// ============================================================================
// Processes
// ============================================================================

export const processes: Process[] = [
	{
		id: "proc-perspective-switch",
		label: "Perspective Switch with Shared Context",
		description:
			"The full execution flow when a user switches perspectives — from event dispatch through reconciliation to canvas render",
		capabilityIds: ["cap-perspective-switching", "cap-state-reconciliation"],
		stageIds: [
			"ps-ps-1",
			"ps-ps-2",
			"ps-ps-3",
			"ps-ps-4",
			"ps-ps-5",
			"ps-ps-6",
			"ps-ps-7",
			"ps-ps-8",
		],
		tags: ["perspective", "context", "core-flow"],
	},
	{
		id: "proc-entity-selection",
		label: "Entity Selection Cascade",
		description:
			"The cascade triggered by selecting a capability — dual dispatch, reconciliation, panel re-scope, and canvas re-render",
		capabilityIds: ["cap-left-panel", "cap-state-reconciliation"],
		stageIds: ["ps-es-1", "ps-es-2", "ps-es-3", "ps-es-4", "ps-es-5", "ps-es-6", "ps-es-7"],
		tags: ["selection", "cascade", "navigation"],
	},
	{
		id: "proc-stepper-forward",
		label: "Stepper Forward",
		description:
			"The execution flow when the user advances the stepper — input, dispatch, guard, target resolution, reconciliation, and highlight",
		capabilityIds: ["cap-stepper-transport", "cap-state-reconciliation"],
		stageIds: ["ps-sf-1", "ps-sf-2", "ps-sf-3", "ps-sf-4", "ps-sf-5", "ps-sf-6", "ps-sf-7"],
		tags: ["stepper", "transport", "sequential"],
	},
	{
		id: "proc-reconcile-perspective",
		label: "Reconcile Perspective Switch",
		description:
			"The internal steps of reconcilePerspectiveSwitch — clearing selection, resetting canvas mode, preserving context, and updating viewport anchor",
		capabilityIds: ["cap-state-reconciliation"],
		stageIds: ["ps-rp-1", "ps-rp-2", "ps-rp-3", "ps-rp-4"],
		tags: ["reconciler", "sub-process"],
	},
].map((d) => ProcessSchema.parse(d));

// ============================================================================
// Process Stages
// ============================================================================

export const processStages: ProcessStage[] = [
	// --- Process 1: Perspective Switch with Shared Context (8 stages) ---
	{
		id: "ps-ps-1",
		processId: "proc-perspective-switch",
		sequenceNumber: 0,
		label: "Event dispatch",
		description:
			'send({ type: "SWITCH_PERSPECTIVE", perspectiveId }) — the user action enters the state machine',
		nodeIds: ["n-app-shell"],
		metadata: { sourceFile: "AppShell.tsx" },
	},
	{
		id: "ps-ps-2",
		processId: "proc-perspective-switch",
		sequenceNumber: 1,
		label: "Guard check",
		description:
			"Context machine validates the event in the ready state — ensures perspective ID is valid",
		nodeIds: ["n-context-machine"],
		metadata: { sourceFile: "context.machine.ts" },
	},
	{
		id: "ps-ps-3",
		processId: "proc-perspective-switch",
		sequenceNumber: 2,
		label: "Reconciliation",
		description:
			"reconcilePerspectiveSwitch — clears selection, resets canvas mode, preserves domain/capability/journey/process",
		nodeIds: ["n-reconciler"],
		subProcessId: "proc-reconcile-perspective",
		metadata: { sourceFile: "reconciler.ts" },
	},
	{
		id: "ps-ps-4",
		processId: "proc-perspective-switch",
		sequenceNumber: 3,
		label: "State commit",
		description: "XState assign writes the new NavigationContext into the machine state",
		nodeIds: ["n-context-machine"],
		metadata: { sourceFile: "context.machine.ts" },
	},
	{
		id: "ps-ps-5",
		processId: "proc-perspective-switch",
		sequenceNumber: 4,
		label: "Layout routing",
		description:
			"usePerspectiveProvider routes to the correct layout engine based on perspective type",
		nodeIds: ["n-use-perspective-provider"],
		metadata: { sourceFile: "use-perspective-provider.ts" },
	},
	{
		id: "ps-ps-6",
		processId: "proc-perspective-switch",
		sequenceNumber: 5,
		label: "Layout computation",
		description:
			"The perspective-specific layout engine runs — BPMN, Journey, Landscape, or Sequence",
		nodeIds: ["n-bpmn-layout", "n-journey-layout", "n-landscape-layout", "n-sequence-layout"],
		metadata: { sourceFile: "lib/*.ts" },
	},
	{
		id: "ps-ps-7",
		processId: "proc-perspective-switch",
		sequenceNumber: 6,
		label: "Canvas render",
		description: "React Flow receives new nodes and edges from the layout engine",
		nodeIds: ["n-react-flow-instance"],
		metadata: { sourceFile: "AppShell.tsx" },
	},
	{
		id: "ps-ps-8",
		processId: "proc-perspective-switch",
		sequenceNumber: 7,
		label: "Viewport position",
		description: "fitViewTopLeft computes zoom and 40px top-left offset for the new canvas",
		nodeIds: ["n-app-shell"],
		metadata: { sourceFile: "use-canvas-events.ts" },
	},

	// --- Process 2: Entity Selection Cascade (7 stages) ---
	{
		id: "ps-es-1",
		processId: "proc-entity-selection",
		sequenceNumber: 0,
		label: "User click",
		description: "Left panel fires onSelectCapability(id) — the user selects an entity",
		nodeIds: ["n-left-panel"],
		metadata: { sourceFile: "LeftPanel.tsx" },
	},
	{
		id: "ps-es-2",
		processId: "proc-entity-selection",
		sequenceNumber: 1,
		label: "Dual dispatch",
		description:
			"AppShell sends SELECT_CAPABILITY then SWITCH_PERSPECTIVE — two events in sequence",
		nodeIds: ["n-app-shell"],
		metadata: { sourceFile: "AppShell.tsx" },
	},
	{
		id: "ps-es-3",
		processId: "proc-entity-selection",
		sequenceNumber: 2,
		label: "Selection reconciliation",
		description: "reconcileCapabilitySwitch — clears stale children, preserves domain context",
		nodeIds: ["n-reconciler"],
		metadata: { sourceFile: "reconciler.ts" },
	},
	{
		id: "ps-es-4",
		processId: "proc-entity-selection",
		sequenceNumber: 3,
		label: "Left panel re-scope",
		description:
			"Journeys, Processes, Sequences, and Providers filter to show only items related to the active capability",
		nodeIds: ["n-left-panel"],
		metadata: { sourceFile: "LeftPanel.tsx" },
	},
	{
		id: "ps-es-5",
		processId: "proc-entity-selection",
		sequenceNumber: 4,
		label: "Right panel update",
		description: "Detail panel router shows capability detail with cross-navigation actions",
		nodeIds: ["n-app-shell"],
		metadata: { sourceFile: "DetailPanelRouter.tsx" },
	},
	{
		id: "ps-es-6",
		processId: "proc-entity-selection",
		sequenceNumber: 5,
		label: "Perspective switch",
		description:
			"reconcilePerspectiveSwitch runs for the auto-switch triggered by entity selection",
		nodeIds: ["n-reconciler"],
		metadata: { sourceFile: "reconciler.ts" },
	},
	{
		id: "ps-es-7",
		processId: "proc-entity-selection",
		sequenceNumber: 6,
		label: "Canvas re-render",
		description: "Perspective provider assembles new canvas data for the switched perspective",
		nodeIds: ["n-use-perspective-provider"],
		metadata: { sourceFile: "use-perspective-provider.ts" },
	},

	// --- Process 3: Stepper Forward (7 stages) ---
	{
		id: "ps-sf-1",
		processId: "proc-stepper-forward",
		sequenceNumber: 0,
		label: "Input",
		description:
			"StepperControl onClick or keyboard ArrowRight — the user triggers a forward action",
		nodeIds: ["n-stepper-control"],
		metadata: { sourceFile: "StepperControl.tsx" },
	},
	{
		id: "ps-sf-2",
		processId: "proc-stepper-forward",
		sequenceNumber: 1,
		label: "Event dispatch",
		description: 'send({ type: "STEPPER_FORWARD" }) — the stepper event enters the state machine',
		nodeIds: ["n-app-shell"],
		metadata: { sourceFile: "AppShell.tsx" },
	},
	{
		id: "ps-sf-3",
		processId: "proc-stepper-forward",
		sequenceNumber: 2,
		label: "Guard",
		description: "canStepperForward checks perspective type and bounds against total items",
		nodeIds: ["n-context-machine"],
		metadata: { sourceFile: "context.machine.ts" },
	},
	{
		id: "ps-sf-4",
		processId: "proc-stepper-forward",
		sequenceNumber: 3,
		label: "Target resolution",
		description: 'resolveStepperTarget returns "journey", "process", "sequence", or "orientation"',
		nodeIds: ["n-context-machine"],
		metadata: { sourceFile: "context.machine.ts" },
	},
	{
		id: "ps-sf-5",
		processId: "proc-stepper-forward",
		sequenceNumber: 4,
		label: "Reconciliation",
		description:
			"Routes to reconcileStepChange, reconcileStageChange, or reconcileMessageChange based on target",
		nodeIds: ["n-reconciler"],
		metadata: { sourceFile: "reconciler.ts" },
	},
	{
		id: "ps-sf-6",
		processId: "proc-stepper-forward",
		sequenceNumber: 5,
		label: "Focus update",
		description:
			"Sets activeFocusTargets, selectedNodeId, and viewport anchor for the new position",
		nodeIds: ["n-reconciler"],
		metadata: { sourceFile: "reconciler.ts" },
	},
	{
		id: "ps-sf-7",
		processId: "proc-stepper-forward",
		sequenceNumber: 6,
		label: "Canvas highlight",
		description:
			"Perspective provider sets isActive on the current node to highlight the active step",
		nodeIds: ["n-use-perspective-provider"],
		metadata: { sourceFile: "use-perspective-provider.ts" },
	},

	// --- Sub-Process: Reconcile Perspective Switch (4 stages) ---
	{
		id: "ps-rp-1",
		processId: "proc-reconcile-perspective",
		sequenceNumber: 0,
		label: "Clear selection",
		description: "Set selectedNodeId and selectedEdgeId to null",
		nodeIds: ["n-reconciler"],
		metadata: { sourceFile: "reconciler.ts" },
	},
	{
		id: "ps-rp-2",
		processId: "proc-reconcile-perspective",
		sequenceNumber: 1,
		label: "Reset canvas mode",
		description: "Set activeCanvasMode to null — new perspective starts in default mode",
		nodeIds: ["n-reconciler"],
		metadata: { sourceFile: "reconciler.ts" },
	},
	{
		id: "ps-rp-3",
		processId: "proc-reconcile-perspective",
		sequenceNumber: 2,
		label: "Preserve context",
		description:
			"Keep activeDomainId, activeCapabilityId, activeJourneyId, activeProcessId — the shared context contract",
		nodeIds: ["n-reconciler"],
		metadata: { sourceFile: "reconciler.ts" },
	},
	{
		id: "ps-rp-4",
		processId: "proc-reconcile-perspective",
		sequenceNumber: 3,
		label: "Update viewport anchor",
		description: "Recompute viewport position for the primary focus node in the new perspective",
		nodeIds: ["n-reconciler"],
		metadata: { sourceFile: "reconciler.ts" },
	},
].map((d) => ProcessStageSchema.parse(d));

// ============================================================================
// BPMN Nodes — Process 1: Perspective Switch with Shared Context
// ============================================================================

export const bpmnNodes: Node[] = [
	// Start event
	{
		id: "bpmn-ps-start",
		type: "bpmn_event",
		label: "User clicks perspective tab",
		description: "Start event — user initiates a perspective switch",
		metadata: {
			swimLane: "app-shell",
			terrainNodeId: "n-app-shell",
			eventKind: "start",
		},
		layoutByPerspective: {
			"persp-process": { x: 0, y: 0 },
		},
	},
	// Task: Event dispatch
	{
		id: "bpmn-ps-dispatch",
		type: "bpmn_task",
		label: "Dispatch SWITCH_PERSPECTIVE",
		description: 'send({ type: "SWITCH_PERSPECTIVE", perspectiveId })',
		metadata: {
			swimLane: "app-shell",
			terrainNodeId: "n-app-shell",
			stageId: "ps-ps-1",
		},
		layoutByPerspective: {
			"persp-process": { x: 200, y: 0 },
		},
	},
	// Task: Guard check
	{
		id: "bpmn-ps-guard",
		type: "bpmn_task",
		label: "Validate in ready state",
		description: "Context machine validates event — perspective ID must be valid",
		metadata: {
			swimLane: "context-machine",
			terrainNodeId: "n-context-machine",
			stageId: "ps-ps-2",
		},
		layoutByPerspective: {
			"persp-process": { x: 400, y: 100 },
		},
	},
	// Task: Reconciliation
	{
		id: "bpmn-ps-reconcile",
		type: "bpmn_task",
		label: "reconcilePerspectiveSwitch",
		description: "Clear selection, reset canvas mode, preserve domain/capability context",
		metadata: {
			swimLane: "reconciler",
			terrainNodeId: "n-reconciler",
			stageId: "ps-ps-3",
		},
		layoutByPerspective: {
			"persp-process": { x: 600, y: 200 },
		},
	},
	// Task: State commit
	{
		id: "bpmn-ps-commit",
		type: "bpmn_task",
		label: "Assign new NavigationContext",
		description: "XState assign writes reconciled state",
		metadata: {
			swimLane: "context-machine",
			terrainNodeId: "n-context-machine",
			stageId: "ps-ps-4",
		},
		layoutByPerspective: {
			"persp-process": { x: 800, y: 100 },
		},
	},
	// Gateway: Which layout engine?
	{
		id: "bpmn-ps-layout-gw",
		type: "bpmn_gateway",
		label: "Route to layout engine",
		description: "Perspective provider selects the correct layout engine based on perspective type",
		metadata: {
			swimLane: "perspective-provider",
			terrainNodeId: "n-use-perspective-provider",
			gatewayKind: "exclusive",
		},
		layoutByPerspective: {
			"persp-process": { x: 1000, y: 150 },
		},
	},
	// Task: Layout computation
	{
		id: "bpmn-ps-layout",
		type: "bpmn_task",
		label: "Compute layout",
		description: "BPMN, Journey, Landscape, or Sequence layout engine produces nodes and edges",
		metadata: {
			swimLane: "perspective-provider",
			terrainNodeId: "n-use-perspective-provider",
			stageId: "ps-ps-6",
		},
		layoutByPerspective: {
			"persp-process": { x: 1200, y: 150 },
		},
	},
	// Task: Canvas render
	{
		id: "bpmn-ps-render",
		type: "bpmn_task",
		label: "setNodes + setEdges",
		description: "React Flow receives new canvas data",
		metadata: {
			swimLane: "react-flow",
			terrainNodeId: "n-react-flow-instance",
			stageId: "ps-ps-7",
		},
		layoutByPerspective: {
			"persp-process": { x: 1400, y: 300 },
		},
	},
	// Task: Viewport position
	{
		id: "bpmn-ps-viewport",
		type: "bpmn_task",
		label: "fitViewTopLeft",
		description: "Compute zoom and 40px top-left offset",
		metadata: {
			swimLane: "app-shell",
			terrainNodeId: "n-app-shell",
			stageId: "ps-ps-8",
		},
		layoutByPerspective: {
			"persp-process": { x: 1600, y: 0 },
		},
	},
	// End event
	{
		id: "bpmn-ps-end",
		type: "bpmn_event",
		label: "Perspective rendered",
		description: "End event — new perspective is fully visible",
		metadata: {
			swimLane: "app-shell",
			terrainNodeId: "n-app-shell",
			eventKind: "end",
		},
		layoutByPerspective: {
			"persp-process": { x: 1800, y: 0 },
		},
	},
].map((d) => NodeSchema.parse(d));

// ============================================================================
// BPMN Edges — Process 1: Perspective Switch with Shared Context
// ============================================================================

export const bpmnEdges: Edge[] = [
	{
		id: "be-ps-start-dispatch",
		sourceNodeId: "bpmn-ps-start",
		targetNodeId: "bpmn-ps-dispatch",
		type: "sequence_flow",
		label: "click",
	},
	{
		id: "be-ps-dispatch-guard",
		sourceNodeId: "bpmn-ps-dispatch",
		targetNodeId: "bpmn-ps-guard",
		type: "sequence_flow",
		label: "SWITCH_PERSPECTIVE",
	},
	{
		id: "be-ps-guard-reconcile",
		sourceNodeId: "bpmn-ps-guard",
		targetNodeId: "bpmn-ps-reconcile",
		type: "sequence_flow",
		label: "valid",
	},
	{
		id: "be-ps-reconcile-commit",
		sourceNodeId: "bpmn-ps-reconcile",
		targetNodeId: "bpmn-ps-commit",
		type: "sequence_flow",
		label: "new NavigationContext",
	},
	{
		id: "be-ps-commit-gw",
		sourceNodeId: "bpmn-ps-commit",
		targetNodeId: "bpmn-ps-layout-gw",
		type: "sequence_flow",
		label: "state change",
	},
	{
		id: "be-ps-gw-layout",
		sourceNodeId: "bpmn-ps-layout-gw",
		targetNodeId: "bpmn-ps-layout",
		type: "sequence_flow",
		label: "selected engine",
	},
	{
		id: "be-ps-layout-render",
		sourceNodeId: "bpmn-ps-layout",
		targetNodeId: "bpmn-ps-render",
		type: "sequence_flow",
		label: "nodes[] + edges[]",
	},
	{
		id: "be-ps-render-viewport",
		sourceNodeId: "bpmn-ps-render",
		targetNodeId: "bpmn-ps-viewport",
		type: "sequence_flow",
		label: "rendered",
	},
	{
		id: "be-ps-viewport-end",
		sourceNodeId: "bpmn-ps-viewport",
		targetNodeId: "bpmn-ps-end",
		type: "sequence_flow",
		label: "viewport set",
	},
].map((d) => EdgeSchema.parse(d));

// ============================================================================
// Interfaces (Sequence Perspective)
// ============================================================================

export const interfaces: Interface[] = [
	{
		id: "iface-user",
		nodeId: "n-user",
		label: "User",
		protocol: "internal",
		description: "The person interacting with the GuideRail UI",
	},
	{
		id: "iface-landscape-node",
		nodeId: "n-landscape-layout",
		label: "LandscapeCapabilityNode",
		protocol: "internal",
		description: "Clickable capability tile on the Landscape canvas",
	},
	{
		id: "iface-node-handlers",
		nodeId: "n-app-shell",
		label: "NODE_CLICK_HANDLERS",
		protocol: "internal",
		description: "Click handler map in AppShell — routes node clicks by ID prefix",
	},
	{
		id: "iface-xstate-actor",
		nodeId: "n-xstate-actor",
		label: "XState Actor",
		protocol: "internal",
		description: "The XState state machine actor that processes all navigation events",
	},
	{
		id: "iface-reconciler",
		nodeId: "n-reconciler",
		label: "Reconciler",
		protocol: "internal",
		description: "Pure reconciliation functions that transform NavigationContext",
	},
	{
		id: "iface-perspective-provider",
		nodeId: "n-use-perspective-provider",
		label: "Perspective Provider",
		protocol: "internal",
		description: "Hook that routes kernel state to perspective-specific layout engines",
	},
	{
		id: "iface-react-flow",
		nodeId: "n-react-flow-instance",
		label: "React Flow Instance",
		protocol: "internal",
		description: "Canvas renderer that receives nodes, edges, and viewport state",
	},
	{
		id: "iface-left-panel",
		nodeId: "n-left-panel",
		label: "Left Panel",
		protocol: "internal",
		description: "Contextual navigator that re-scopes on nav state changes",
	},
].map((d) => InterfaceSchema.parse(d));

// ============================================================================
// Messages — Sequence 1: Capability Selection from Landscape
// ============================================================================

const capabilitySelectionMessages: Message[] = [
	{
		id: "msg-cs-1",
		sequenceNumber: 0,
		sourceInterfaceId: "iface-user",
		targetInterfaceId: "iface-landscape-node",
		type: "event",
		label: "click",
		description: "User clicks a capability tile on the Landscape canvas",
	},
	{
		id: "msg-cs-2",
		sequenceNumber: 1,
		sourceInterfaceId: "iface-landscape-node",
		targetInterfaceId: "iface-node-handlers",
		type: "request",
		label: 'matches "landscape-cap-" prefix',
		description: "Node click event routes to the landscape capability handler by ID prefix",
	},
	{
		id: "msg-cs-3",
		sequenceNumber: 2,
		sourceInterfaceId: "iface-node-handlers",
		targetInterfaceId: "iface-xstate-actor",
		type: "request",
		label: "SELECT_CAPABILITY",
		description: "Handler dispatches SELECT_CAPABILITY event to the state machine",
	},
	{
		id: "msg-cs-4",
		sequenceNumber: 3,
		sourceInterfaceId: "iface-xstate-actor",
		targetInterfaceId: "iface-reconciler",
		type: "request",
		label: "reconcileCapabilitySwitch",
		description: "State machine calls reconcileCapabilitySwitch to transform navigation context",
	},
	{
		id: "msg-cs-5",
		sequenceNumber: 4,
		sourceInterfaceId: "iface-reconciler",
		targetInterfaceId: "iface-xstate-actor",
		type: "response",
		label: "new NavigationContext",
		description: "Reconciler returns the updated NavigationContext",
	},
	{
		id: "msg-cs-6",
		sequenceNumber: 5,
		sourceInterfaceId: "iface-xstate-actor",
		targetInterfaceId: "iface-perspective-provider",
		type: "event",
		label: "state change triggers re-render",
		description: "XState state change triggers React re-render of the perspective provider",
	},
	{
		id: "msg-cs-7",
		sequenceNumber: 6,
		sourceInterfaceId: "iface-perspective-provider",
		targetInterfaceId: "iface-landscape-node",
		type: "request",
		label: "computeLandscapeLayout",
		description: "Perspective provider calls the landscape layout engine with updated state",
	},
	{
		id: "msg-cs-8",
		sequenceNumber: 7,
		sourceInterfaceId: "iface-landscape-node",
		targetInterfaceId: "iface-perspective-provider",
		type: "response",
		label: "nodes[] + edges[]",
		description: "Layout engine returns positioned nodes and edges for the canvas",
	},
	{
		id: "msg-cs-9",
		sequenceNumber: 8,
		sourceInterfaceId: "iface-perspective-provider",
		targetInterfaceId: "iface-react-flow",
		type: "request",
		label: "setNodes, setEdges",
		description: "Perspective provider updates React Flow with new canvas data",
	},
	{
		id: "msg-cs-10",
		sequenceNumber: 9,
		sourceInterfaceId: "iface-xstate-actor",
		targetInterfaceId: "iface-left-panel",
		type: "event",
		label: "nav state update — sections re-scope",
		description:
			"Left panel re-scopes all sections to show only entities related to the selected capability",
	},
	{
		id: "msg-cs-11",
		sequenceNumber: 10,
		sourceInterfaceId: "iface-xstate-actor",
		targetInterfaceId: "iface-react-flow",
		type: "event",
		label: "selectedNodeId update — detail renders",
		description: "Right panel renders detail for the selected entity based on selectedNodeId",
	},
].map((d) => MessageSchema.parse(d));

// ============================================================================
// Messages — Sequence 2: Perspective Switch with Shared Context
// ============================================================================

const perspectiveSwitchMessages: Message[] = [
	{
		id: "msg-ps-1",
		sequenceNumber: 0,
		sourceInterfaceId: "iface-user",
		targetInterfaceId: "iface-node-handlers",
		type: "event",
		label: "click tab",
		description: "User clicks a perspective tab in the PerspectiveSwitcher",
	},
	{
		id: "msg-ps-2",
		sequenceNumber: 1,
		sourceInterfaceId: "iface-node-handlers",
		targetInterfaceId: "iface-xstate-actor",
		type: "request",
		label: "SWITCH_PERSPECTIVE",
		description: "PerspectiveSwitcher dispatches SWITCH_PERSPECTIVE event to the state machine",
	},
	{
		id: "msg-ps-3",
		sequenceNumber: 2,
		sourceInterfaceId: "iface-xstate-actor",
		targetInterfaceId: "iface-reconciler",
		type: "request",
		label: "reconcilePerspectiveSwitch",
		description:
			"Clear selection, reset canvas mode, preserve domain/capability/journey/process context",
	},
	{
		id: "msg-ps-4",
		sequenceNumber: 3,
		sourceInterfaceId: "iface-reconciler",
		targetInterfaceId: "iface-xstate-actor",
		type: "response",
		label: "new NavigationContext",
		description: "Reconciler returns the updated NavigationContext",
	},
	{
		id: "msg-ps-5",
		sequenceNumber: 4,
		sourceInterfaceId: "iface-xstate-actor",
		targetInterfaceId: "iface-perspective-provider",
		type: "event",
		label: "perspective type changed",
		description: "Perspective provider detects the type change and routes to the new layout engine",
	},
	{
		id: "msg-ps-6",
		sequenceNumber: 5,
		sourceInterfaceId: "iface-perspective-provider",
		targetInterfaceId: "iface-react-flow",
		type: "request",
		label: "new nodes/edges for new perspective",
		description: "Perspective provider sends new canvas data to React Flow",
	},
	{
		id: "msg-ps-7",
		sequenceNumber: 6,
		sourceInterfaceId: "iface-perspective-provider",
		targetInterfaceId: "iface-react-flow",
		type: "request",
		label: "fitViewTopLeft",
		description: "Compute zoom + top-left position for the new perspective canvas",
	},
	{
		id: "msg-ps-8",
		sequenceNumber: 7,
		sourceInterfaceId: "iface-react-flow",
		targetInterfaceId: "iface-react-flow",
		type: "request",
		label: "setViewport",
		description: "React Flow applies the computed viewport position and zoom",
	},
].map((d) => MessageSchema.parse(d));

export const messages: Message[] = [...capabilitySelectionMessages, ...perspectiveSwitchMessages];

// ============================================================================
// Sequences
// ============================================================================

export const sequences: Sequence[] = [
	{
		id: "seq-capability-selection",
		label: "Capability Selection from Landscape",
		description:
			"The full call flow when a user clicks a capability tile on the Landscape canvas — 11 steps from click to rendered detail",
		capabilityId: "cap-perspective-switching",
		interfaceIds: [
			"iface-user",
			"iface-landscape-node",
			"iface-node-handlers",
			"iface-xstate-actor",
			"iface-reconciler",
			"iface-perspective-provider",
			"iface-react-flow",
			"iface-left-panel",
		],
		messageIds: [
			"msg-cs-1",
			"msg-cs-2",
			"msg-cs-3",
			"msg-cs-4",
			"msg-cs-5",
			"msg-cs-6",
			"msg-cs-7",
			"msg-cs-8",
			"msg-cs-9",
			"msg-cs-10",
			"msg-cs-11",
		],
		tags: ["landscape", "selection", "core-flow"],
	},
	{
		id: "seq-perspective-switch",
		label: "Perspective Switch with Shared Context",
		description:
			"The call flow when a user switches perspectives — from click through reconciliation to viewport positioning",
		capabilityId: "cap-state-reconciliation",
		interfaceIds: [
			"iface-user",
			"iface-node-handlers",
			"iface-xstate-actor",
			"iface-reconciler",
			"iface-perspective-provider",
			"iface-react-flow",
		],
		messageIds: [
			"msg-ps-1",
			"msg-ps-2",
			"msg-ps-3",
			"msg-ps-4",
			"msg-ps-5",
			"msg-ps-6",
			"msg-ps-7",
			"msg-ps-8",
		],
		tags: ["perspective", "context", "core-flow"],
	},
].map((d) => SequenceSchema.parse(d));

// ============================================================================
// Perspectives
// ============================================================================

export const perspectives: Perspective[] = [
	{
		id: "persp-orientation",
		type: "orientation",
		label: "Orientation",
		description: "Conceptual grounding — vocabulary, perspective model, and design principles",
	},
	{
		id: "persp-landscape",
		type: "landscape",
		label: "Landscape",
		description: "Broad terrain — domains, capabilities, and cross-domain relationships",
		defaultLayerId: "layer-default",
	},
	{
		id: "persp-journey",
		type: "journey",
		label: "Journey",
		description: "User journey step-by-step traversal",
		defaultLayerId: "layer-journey",
	},
	{
		id: "persp-process",
		type: "process",
		label: "Process",
		description: "Business process and workflow steps",
		defaultLayerId: "layer-process",
	},
	{
		id: "persp-architecture",
		type: "architecture",
		label: "Architecture",
		description: "System boundaries, modules, and dependencies — the actual code structure",
		defaultLayerId: "layer-default",
	},
	{
		id: "persp-system",
		type: "system",
		label: "System",
		description: "Scenario-scoped participating systems and runtime participants",
		defaultLayerId: "layer-default",
	},
	{
		id: "persp-sequence",
		type: "sequence",
		label: "Sequence",
		description: "Runtime call flow between participating interfaces",
		defaultLayerId: "layer-default",
	},
].map((d) => PerspectiveSchema.parse(d));

// ============================================================================
// Layers
// ============================================================================

export const layers: Layer[] = [
	{
		id: "layer-default",
		label: "Default",
		eligibleNodeTypes: [],
		eligibleEdgeTypes: [],
		layoutStrategy: "auto",
	},
	{
		id: "layer-process",
		label: "Process",
		eligibleNodeTypes: ["service", "system"],
		eligibleEdgeTypes: ["dependency", "service_call", "event"],
		layoutStrategy: "auto",
	},
	{
		id: "layer-journey",
		label: "Journey",
		eligibleNodeTypes: ["actor", "service", "system"],
		eligibleEdgeTypes: ["user_interaction", "dependency", "event"],
		layoutStrategy: "manual",
	},
].map((d) => LayerSchema.parse(d));

// ============================================================================
// Scenes
// ============================================================================

export const scenes: Scene[] = [];

// ============================================================================
// Annotations
// ============================================================================

export const annotations: Annotation[] = [];

// ============================================================================
// Evidence Refs
// ============================================================================

export const evidenceRefs: EvidenceRef[] = [];

// ============================================================================
// Providers
// ============================================================================

export const providers: Provider[] = [];

// ============================================================================
// Provider Associations
// ============================================================================

export const providerAssociations: ProviderAssociation[] = [];

// ============================================================================
// Value Streams
// ============================================================================

export const valueStreams: ValueStream[] = [];

// ============================================================================
// Control Points
// ============================================================================

export const controlPoints: ControlPoint[] = [];
