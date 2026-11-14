import { OrientationItemSchema } from "../entities/orientation-item.js";
import type { OrientationItem } from "../entities/orientation-item.js";

export const orientationItems: OrientationItem[] = [
	{
		id: "orient-welcome",
		sequenceNumber: 0,
		title: "Welcome to GuideRail",
		body: `GuideRail is a guided architecture navigator. It moves you from business understanding to implementation reality through structured perspectives and reusable routes.

- **The application** — the canvas, navigation, perspectives, and guided routes you're using right now
- **The corpus** — the structured dataset the application renders (this one models GuideRail itself)
- **Your external corpus** — any complex system you eventually model and load

Use the stepper or arrow keys to advance.`,
		terms: [
			{
				term: "Perspective",
				definition:
					"A distinct visual lens on the same system. Each renders a different canvas type.",
			},
			{
				term: "Corpus",
				definition: "A structured dataset containing all entities GuideRail renders.",
			},
			{
				term: "Canonical Model",
				definition:
					"The internal schema that preserves identity, relationships, and provenance across perspectives.",
			},
		],
		links: [{ label: "Explore the Landscape", perspectiveId: "persp-landscape" }],
		tags: ["introduction", "overview"],
	},
	{
		id: "orient-perspectives",
		sequenceNumber: 1,
		title: "The Perspective Model",
		body: `7 perspectives, each answering a different question:

- **Orientation** — What am I looking at? *(concept deck)*
- **Landscape** — What world are we in? *(capability map)*
- **Journey** — What path is the user taking? *(step flow)*
- **Process** — How is it operationally executed? *(BPMN swim lanes)*
- **Architecture** — What structure supports this? *(module dependency graph)*
- **System** — What parts matter here? *(scoped participants)*
- **Sequence** — How do the parts interact? *(lifeline diagram)*

The ordering is deliberate — each perspective builds on the one before it.`,
		terms: [
			{
				term: "Canvas Type",
				definition:
					"The rendering strategy for a perspective — concept deck, capability map, step flow, BPMN, node graph, or lifeline diagram.",
			},
			{
				term: "Canvas Mode",
				definition:
					"A perspective-internal toggle. Process supports Operational, Decision, and Controls modes.",
			},
		],
		links: [
			{ label: "Landscape", perspectiveId: "persp-landscape" },
			{ label: "Journey", perspectiveId: "persp-journey" },
			{ label: "Process", perspectiveId: "persp-process" },
			{ label: "Architecture", perspectiveId: "persp-architecture" },
			{ label: "System", perspectiveId: "persp-system" },
			{ label: "Sequence", perspectiveId: "persp-sequence" },
		],
		tags: ["perspectives", "model"],
	},
	{
		id: "orient-shared-context",
		sequenceNumber: 2,
		title: "Shared Context Contract",
		body: `The core design principle:

> A perspective switch means "show me this same moment through another lens," not "take me somewhere else."

- Select a capability in Landscape → switch to Journey → you see **that capability's** journey
- Switch to Process → you see **that journey's** process
- Switch to Architecture → you see **that process's** modules

The Context Machine maintains shared state. The Reconciler computes how to translate your selection into each new view.`,
		terms: [
			{
				term: "Shared Context",
				definition:
					"Navigation state that persists across switches — active domain, capability, journey, process.",
			},
			{
				term: "Selection",
				definition:
					"The entity you've explicitly clicked. Drives the detail panel and focus targets.",
			},
			{
				term: "Focus Targets",
				definition: "Entity IDs highlighted on the current canvas. Computed by the reconciler.",
			},
			{
				term: "Reconciler",
				definition:
					"Pure functions that map navigation context into focus targets when anything changes.",
			},
		],
		links: [{ label: "See Architecture", perspectiveId: "persp-architecture" }],
		tags: ["context", "contract"],
	},
	{
		id: "orient-domains-capabilities",
		sequenceNumber: 3,
		title: "Domains & Capabilities",
		body: `The Landscape organizes everything into two levels:

- **Domains** — bounded regions of related functionality (e.g., Core Kernel, Navigation, Canvas Rendering)
- **Capabilities** — the anchor point of the canonical model (e.g., Context Machine, Left Panel, Stepper Transport)

Capabilities are where cross-perspective threads converge. Every capability connects to:

- A **journey** that walks through it
- A **process** that operationalizes it
- A **sequence** that traces its runtime behavior

This is the **capability triad**: journey / process / sequence.`,
		terms: [
			{ term: "Domain", definition: "A bounded region of related capabilities in the Landscape." },
			{
				term: "Capability",
				definition:
					"The fundamental anchor entity. Connects to journeys, processes, and sequences.",
			},
			{
				term: "Capability Triad",
				definition: "The journey/process/sequence trio that every capability can expand into.",
			},
		],
		links: [{ label: "Explore the Landscape", perspectiveId: "persp-landscape" }],
		tags: ["landscape", "domains", "capabilities"],
	},
	{
		id: "orient-full-descent",
		sequenceNumber: 4,
		title: "The Full Descent",
		body: `Trace one topic through every perspective:

1. **Landscape** — see where it fits in the domain map
2. **Journey** — see the user-facing flow
3. **Process** — see the operational execution (BPMN)
4. **Architecture** — see the code modules that implement it
5. **System** — see the runtime participants
6. **Sequence** — see the actual call chain

Each step reveals a different truth about the same reality. The shared context contract keeps you anchored throughout.`,
		terms: [
			{
				term: "Full Descent",
				definition: "Tracing one topic from Landscape to Sequence through every perspective.",
			},
			{
				term: "Cross-Perspective Continuity",
				definition:
					"A single topic followed coherently across all perspectives via the canonical model.",
			},
		],
		links: [
			{ label: "Start at Landscape", perspectiveId: "persp-landscape" },
			{ label: "See Sequence", perspectiveId: "persp-sequence" },
		],
		tags: ["descent", "continuity"],
	},
	{
		id: "orient-canonical-model",
		sequenceNumber: 5,
		title: "The Canonical Model",
		body: `The internal schema that makes cross-perspective traversal work. Four properties:

- **Identity** — every entity has a stable ID and declared type
- **Relationships** — foreign keys link entities across perspectives (capabilityId, domainId, journeyId)
- **Provenance** — tracks where each entity originated (source system, artifact, mapping)
- **Continuity** — the reconciler follows foreign keys to preserve context across switches

**Ingestion mapping** transforms external sources (ArchiMate, BPMN, PlantUML) into this model. The quality of the mapping determines the quality of the traversal.

This corpus is the reference implementation — every entity demonstrates what a well-formed canonical entity looks like.`,
		terms: [
			{
				term: "Entity",
				definition:
					"Any object in the model with a stable ID: domain, capability, node, step, message, etc.",
			},
			{
				term: "Foreign Key",
				definition: "A field referencing another entity's ID, creating a cross-perspective link.",
			},
			{
				term: "Provenance",
				definition:
					"A record of where an entity originated — source system, artifact, and mapping.",
			},
			{
				term: "Ingestion Mapping",
				definition: "Transforming external source artifacts into canonical model entities.",
			},
		],
		links: [{ label: "See Architecture", perspectiveId: "persp-architecture" }],
		tags: ["canonical-model", "schema", "provenance"],
	},
	{
		id: "orient-guided-routes",
		sequenceNumber: 6,
		title: "Guided Routes",
		body: `Authored tours that walk you through a curated path:

- A **story route** defines a sequence of **waypoints**
- Each waypoint sets a perspective, highlights focus targets, and shows a **key message**
- The **stepper** (arrow keys or buttons) advances through waypoints
- Routes overlay the current context — when a route ends, you stay where it left you

This corpus includes three routes:

1. **The Full Descent** — one topic through every perspective
2. **The Shared Context Contract** — watch context survive across switches
3. **How GuideRail Is Built** — a meta-tour through the actual architecture`,
		terms: [
			{
				term: "Story Route",
				definition:
					"An authored sequence of waypoints guiding the user through perspectives and entities.",
			},
			{
				term: "Waypoint",
				definition: "A single stop — perspective, focus targets, and key message.",
			},
			{
				term: "Key Message",
				definition: "Explanatory text at each waypoint telling you what to notice.",
			},
			{
				term: "Stepper",
				definition:
					"Transport control (arrow keys or buttons) for advancing through sequential content.",
			},
		],
		links: [{ label: "See Journey", perspectiveId: "persp-journey" }],
		tags: ["routes", "guided", "stepper"],
	},
	{
		id: "orient-start-exploring",
		sequenceNumber: 7,
		title: "Start Exploring",
		body: `You now know:

- **7 perspectives** forming a deliberate progression
- **Shared context contract** preserving your place across switches
- **Canonical model** enabling cross-perspective continuity
- **Guided routes** providing authored tours with key messages

**Next steps:**

- Switch to **Landscape** to browse domains and capabilities
- Start the **Full Descent** guided route for a complete walkthrough
- Pick any capability and trace it through every perspective

The best way to understand GuideRail is to use it.`,
		terms: [],
		links: [
			{ label: "Switch to Landscape", perspectiveId: "persp-landscape" },
			{ label: "Back to Orientation", perspectiveId: "persp-orientation" },
		],
		tags: ["summary", "action"],
	},
].map((d) => OrientationItemSchema.parse(d));
