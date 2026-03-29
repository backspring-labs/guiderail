# GuideRail 0.7.0 Implementation Plan

## Context

GuideRail 0.6.0 shipped the navigation hub release — left panel contextual navigator, stepper transport control, search bar, top-bar grid layout, seed file split, and complexity refactors. The product now has 6 perspectives, guided routes, and a fully functional explorer.

GuideRail 0.7.0 is the **self-referential corpus release**. It adds Orientation as a 7th perspective, replaces the fintech seed data with a corpus that models GuideRail itself, and demonstrates the canonical model through its own structure.

### 0.7.0 proof statement

GuideRail 0.7.0 proves that the product can teach itself through a self-referential corpus anchored to real code, with Orientation as the grounding entry perspective.

### What 0.7.0 delivers

- Orientation perspective with concept deck canvas — the 7th perspective
- Complete seed data rewrite: self-referential corpus replacing fintech
- 7-perspective progression: Orientation → Landscape → Journey → Process → Architecture → System → Sequence
- 3 guided routes anchored to real code flows
- Orientation as the default first-load perspective

### Scope boundaries

- Presentation Mode deferred to 0.8.0 — pairs naturally with Orientation once content is stable
- External corpus loading UI, Author Mode, Evidence Mode deferred
- No backend or persistence layer

### Reference

- `docs/ideas/guiderail_orientation_new_perspective_idea_v3.md` — full design
- `docs/ideas/presentation-mode-idea.md` — deferred to 0.8.0

---

## Why Orientation Is a Perspective

Orientation is a first-class perspective because it presents a distinct lens of understanding. Its canvas type is the **concept deck** — a structured presentation surface for terms, semantics, and conceptual grounding. Its purpose is semantic preparation, not process flow, not structural mapping, not runtime interaction.

Orientation belongs in the 7-perspective descent because it prepares the user to interpret every downstream perspective. Without it, users are dropped into a Landscape with no context for what domains, capabilities, or perspectives mean. With it, they arrive at Landscape already knowing the vocabulary, the progression model, and the product's design principles.

Every perspective answers a different question:

| Perspective | Question |
|---|---|
| Orientation | What am I looking at and how should I think about it? |
| Landscape | What world are we in? |
| Journey | What real path is being taken? |
| Process | How is it operationally executed? |
| Architecture | What structural design supports this? |
| System | What participating parts matter here? |
| Sequence | How do the parts interact at runtime? |

---

## The Canonical Model

GuideRail depends on an internal canonical model. This model preserves:

- **Identity** — every entity has a stable ID and a declared type
- **Relationships** — foreign keys link entities across perspectives (capabilityId on Sequence, domainId on Capability, journeyId on Step)
- **Provenance** — ProvenanceRef tracks where each entity originated
- **Cross-perspective continuity** — the shared context contract ensures that switching perspectives means "show me this same moment through another lens," not "take me somewhere else"

The canonical model is what makes guided traversal coherent. Without it, perspectives are disconnected diagram types. With it, they are linked views of the same reality.

**Ingestion mapping** is the act of transforming external source artifacts into this canonical model. The quality of the mapping determines the quality of the traversal.

The self-referential corpus is the **reference implementation** of the canonical model. Every seed entity demonstrates what a well-formed canonical entity looks like, how relationships are expressed, and how cross-perspective continuity is achieved. Orientation explicitly teaches this to the user.

### Architecture and System as canonical-model teachers

Architecture teaches the structural containers, dependency boundaries, and the canonical model layer itself — where entities are defined, where schemas live, where the reconciler enforces the shared context contract.

System teaches the live runtime participants that operationalize those structures — the XState actor that processes events, the perspective provider that assembles canvas data, the React Flow instance that renders it.

Both are linked by the same canonical model and the same shared context contract. Architecture shows where the contract is defined. System shows where the contract is executed. Together they demonstrate why the canonical model matters and what a future adopter's own architecture would need to support.

### Success criterion

A new user should be able to understand not only how to use GuideRail, but why a future external corpus must be mapped into a canonical internal model for cross-perspective traversal to work.

---

## Phase 1: Orientation Perspective Infrastructure

### Goal
Add Orientation as a 7th perspective with its concept deck canvas.

### Core changes

**Add `orientation` to PerspectiveType enum:**
- Update `packages/core/src/entities/perspective.ts` enum to include `orientation`

**Add OrientationItem entity:**
```
OrientationItemSchema = z.object({
  id: z.string(),
  sequenceNumber: z.number().int().nonnegative(),
  title: z.string(),
  body: z.string(),                    // markdown or HTML content
  terms: z.array(z.object({
    term: z.string(),
    definition: z.string(),
  })).default([]),
  visualUrl: z.string().optional(),    // path to illustration/diagram
  links: z.array(z.object({
    label: z.string(),
    perspectiveId: z.string(),
    entityId: z.string().optional(),
  })).default([]),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.unknown()).default({}),
  provenance: ProvenanceRefSchema.optional(),
})
```

**Add `activeOrientationIndex` to NavigationContext:**
- Nullable, default null
- Reset when switching away from Orientation perspective

**Add stepper support for Orientation:**
- `resolveStepperTarget` returns `"orientation"` when on Orientation perspective with items
- `canStepperForward`/`canStepperBackward` check bounds against orientation items
- `reconcileOrientationChange` sets `activeOrientationIndex`

**Add to context machine:**
- OrientationItem[] to ContextMachineContext
- orientationItems to INITIALIZE event
- Stepper events route through orientation when on Orientation perspective

**Export OrientationItem from @guiderail/core/entities:**
- Add to entities barrel export

### Orientation canvas type

**Orientation layout engine (`orientation-layout.ts`):**
- `computeOrientationLayout(items: OrientationItem[])` → produces left-column agenda nodes
- Each node is an `OrientationItemNode` with sequential vertical positioning
- Returns `{ nodes }` — no edges

**Orientation node model (`OrientationItemNode.tsx`):**
- Left-column agenda item: sequence number + title
- Active item highlighted with accent border
- Click dispatches jump-to-item event

**Orientation content panel (`OrientationContentPanel.tsx`):**
- Right-side rich content panel, part of the Orientation perspective rendering strategy
- Renders: title (large typography), body (markdown/HTML), terms list, visual, perspective links
- Positioned within the canvas area, right-aligned
- Scrollable if content overflows

**Orientation stylesheet (`orientation.css`):**
- Concept deck layout: left agenda column (~240px) + right content panel (flex: 1)
- Large typography: title at 1.5rem+, body at 1rem with generous line-height
- Term definitions styled as definition list with subtle borders
- Visual area with max-width constraint
- Active item highlight with accent color

**Perspective provider integration:**
- Add `isOrientationPerspective` branch in `use-perspective-provider.ts`
- When orientation: return agenda nodes from `computeOrientationLayout`
- Set `isActive` based on `activeOrientationIndex`

**AppShell integration:**
- Render `OrientationContentPanel` when on Orientation perspective
- Pass current orientation item data to the panel
- Wire stepper to orientation items

**Stepper integration:**
- Add orientation branch to `deriveStepperState`: returns item count and current index

**Perspective switcher:**
- 7 tabs: Orientation, Landscape, Journey, Process, Architecture, System, Sequence

### Done when
- Orientation tab visible in perspective switcher
- Concept deck canvas renders: agenda on left, content on right
- Clicking an agenda item shows its content
- Stepper (buttons and arrow keys) advances through items
- Content panel renders large typography, terms, and structured content
- Switching away from Orientation and back preserves position
- `pnpm build && pnpm test && pnpm check` clean

---

## Phase 2: Orientation Seed Content

### Goal
Author the 8 orientation items that teach GuideRail concepts.

### Items

| # | Title | Content scope |
|---|---|---|
| 1 | Welcome to GuideRail | Product overview — guided architecture navigator from business understanding to code reality |
| 2 | The Perspective Model | All 7 perspectives, what each renders, the progression from Orientation to Sequence |
| 3 | Shared Context Contract | Core principle: "same moment, different lens." Terms: perspective, context, selection, focus targets |
| 4 | Domains & Capabilities | Landscape structure. Terms: domain, capability, capability triad (journey/process/sequence) |
| 5 | The Full Descent | Tracing one topic through every perspective. Preview of each canvas type |
| 6 | The Canonical Model | Entities, relationships, provenance, cross-perspective continuity, ingestion mapping |
| 7 | Guided Routes | Story routes, waypoints, key messages, stepper transport |
| 8 | Start Exploring | Summary + prominent action: "Start the Full Descent" or "Explore the Landscape" |

### Cross-perspective bindings

Orientation items link into the rest of the corpus:
- Item 2 (Perspective Model) → links to each perspective by ID
- Item 4 (Domains & Capabilities) → links to specific domains and capabilities in Landscape
- Item 5 (The Full Descent) → links to the Full Descent guided route
- Item 6 (Canonical Model) → links to Entity Model domain, Architecture nodes for entities/schemas
- Item 7 (Guided Routes) → links to all 3 guided routes

These bindings reinforce that Orientation is part of the canonical model, not a detached intro screen.

### Authoring format
Each item is an OrientationItem in the seed data with:
- Markdown body content (rendered as HTML in the content panel)
- Terms array with term/definition pairs
- Links to relevant perspectives and entities

### Done when
- All 8 items render with meaningful content
- Terms are defined and styled
- Cross-perspective links navigate correctly
- Item 8 has a working action to start a guided route or switch to Landscape
- Content is accurate to the actual codebase (verifiability principle)

---

## Phase 3: Self-Referential Seed Corpus — Domains, Capabilities, Architecture, System

### Goal
Replace the fintech seed data with entities that model GuideRail itself. Start with the non-sequential perspectives.

### Seed data to create

**Domains (7):**
- Core Kernel, Entity Model, Graph, Content Pipeline, Canvas Rendering, Navigation, Guided Routes
- Each with description, id, label matching the idea doc

**Capabilities (~20):**
- Core Kernel: Context Machine, State Reconciliation, Navigation Context
- Entity Model: Schema Validation, Entity Relationships, Provenance Tracking
- Canvas Rendering: Perspective Provider, BPMN Layout, Journey Layout, Landscape Layout, Sequence Layout, Canvas Mode Switching
- Navigation: Contextual Left Panel, Breadcrumb Trail, Search Palette, Perspective Switching, Detail Panel
- Guided Routes: Route Playback, Stepper Transport, Waypoint Progression

**Nodes (~25):**
- Architecture nodes: one per real module (context.machine.ts, reconciler.ts, AppShell.tsx, use-perspective-provider.ts, etc.)
- System nodes: XState Actor, Zustand Store, React Flow Instance, Perspective Provider, Seed Loader, Vite, Biome
- Node types: service (core modules), system (runtime participants), actor (user)

**Edges (~20):**
- Dependency edges matching the actual import graph
- `@guiderail/web` → `@guiderail/core`
- AppShell → useNavigation → contextMachine
- contextMachine → reconciler
- usePerspectiveProvider → layout engines
- Layout engines → React Flow

**Perspectives (7):**
- Add `persp-orientation` with type `orientation`
- Update existing 6 perspectives

**Providers, Interfaces, Messages, ControlPoints:**
- Minimal or empty for 0.7.0 — populated in follow-up releases

### Fintech data migration
- Copy current seed files to a `seed-banking-archive/` directory (preserves history)
- New seed files use the same schemas — only subject matter changes
- Existing test IDs break — updated in Phase 7

### Done when
- Landscape renders 7 GuideRail domains with capabilities
- Architecture renders the actual module dependency graph
- System renders runtime participants
- All nodes/edges map to real code constructs
- `pnpm build` clean (tests may fail — fixed in Phase 7)

---

## Phase 4: Self-Referential Seed Corpus — Journeys, Processes, Sequences

### Goal
Add sequential content that models real GuideRail user workflows and code execution flows.

### Seed data to create

**Journeys (3):**
1. The Full Descent — 10 steps tracing one topic through every perspective
2. Left Panel Navigation — 5 steps using the contextual navigator
3. Guided Route Playback — 6 steps following a tour

**Steps (~21):**
- Each step maps to a real UI interaction
- Step types: screen (most), decision (where user chooses perspective)
- Focus targets reference architecture/landscape nodes

**Processes (3):**
1. Perspective Switch with Shared Context — 8 stages
2. Entity Selection Cascade — 7 stages
3. Stepper Forward — 7 stages

**Process Stages (~22):**
- Each stage maps to a real function call with source file reference
- nodeIds reference architecture nodes

**Sequences (2):**
1. Capability Selection from Landscape Canvas — 11 messages
2. Perspective Switch with Shared Context — 8 messages

**Interfaces (~8):**
- User, LandscapeCapabilityNode, NODE_CLICK_HANDLERS, XState Actor, Reconciler, Perspective Provider, React Flow Instance, LeftPanel/RightPanel

**Messages (~19):**
- Each message maps to a real function call or event dispatch

**BPMN nodes/edges:**
- Process perspective nodes for the 3 processes above
- Tasks, gateways, events representing actual code execution stages

### Done when
- Journey perspective renders step flows for all 3 journeys
- Process perspective renders BPMN swim lanes for all 3 processes
- Sequence perspective renders lifeline diagrams for both sequences
- Stepper works on all sequential perspectives
- Cross-perspective links work: selecting a capability in Landscape, switching to Journey shows that capability's journey

---

## Phase 5: Guided Routes

### Goal
Author 3 guided routes that demonstrate the perspective progression using the self-referential corpus.

### Routes

**Route 1: The Full Descent (9 waypoints)**
- Progresses Orientation → Landscape → Journey → Process → Architecture → System → Sequence
- Each waypoint highlights real GuideRail entities
- Key messages explain each perspective's role

**Route 2: The Shared Context Contract (4 waypoints)**
- Stays on one topic, switches perspectives
- Demonstrates context preservation across switches

**Route 3: How GuideRail Is Built (5 waypoints)**
- Meta-tour through the actual architecture
- Ends with the actual call sequence for clicking a capability

### Story waypoints
- Each waypoint sets perspectiveId, focusTargets, keyMessage, whyItMatters
- Focus targets reference the self-referential seed entities

### Done when
- All 3 routes play back correctly
- Waypoints switch perspectives and highlight correct entities
- Key messages are accurate and educational
- StoryRouteBar displays correctly for each route
- Routes appear in the Guides section of the left panel

---

## Phase 6: Default Perspective + First-Load Experience

### Goal
Make Orientation the default perspective on first load and polish the first-run experience.

### Steps

**Set Orientation as default perspective:**
- Update `useInitializeContext` to use `persp-orientation` as the default perspective ID
- On first load, user sees the concept deck

**Add "Start Exploring" action on item 8:**
- Button or link that starts the Full Descent route or switches to Landscape

**Orientation auto-advance hint:**
- Subtle hint text below the stepper: "Use arrow keys to advance"

**Polish concept deck styling:**
- Review typography scale, spacing, term list styling
- Ensure content panel scrolls correctly for long content
- Test at different viewport sizes

### Done when
- Opening GuideRail shows Orientation perspective with item 1
- User can step through all 8 items
- Item 8 has a working action to start exploring
- Returning to Orientation preserves last viewed item

---

## Phase 7: Tests + Version Bump

### Tests

**Orientation perspective:**
- OrientationItem schema validates correctly
- Context machine handles orientation stepper events
- activeOrientationIndex resets on perspective switch away from Orientation
- Stepper forward/backward/reset/end work for orientation items

**Seed data integrity:**
- All entities parse through Zod schemas
- Referential integrity: every capabilityId references a real capability, every domainId a real domain
- Cross-perspective linking: each capability appears in at least Landscape + one sequential perspective
- Node/edge IDs are consistent across Architecture and System views

**Existing functionality:**
- Perspective switching preserves shared context
- Left panel scoping works with new seed data
- Search palette finds new entities
- Canvas modes still work on Process perspective
- Stepper works on Journey, Process, Sequence, and Orientation

**Guided routes:**
- All 3 routes play back without errors
- Waypoints switch perspectives correctly
- Focus targets highlight correct entities

### Version bump
- `packages/core/package.json` → 0.7.0
- `apps/web/package.json` → 0.7.0

### Done when
- All tests pass
- `pnpm build && pnpm test && pnpm check` clean (0 warnings)
- Version 0.7.0

---

## Sequencing

```
Phase 1 (Orientation infrastructure) → Phase 2 (Orientation content) → Phase 3 (Corpus: non-sequential) → Phase 4 (Corpus: sequential) → Phase 5 (Guided routes) → Phase 6 (Default + polish) → Phase 7 (Tests + version)
```

---

## Audit Schedule

Pause for audit after phases **2** (Orientation complete), **4** (all seed data), and **7** (final).

### Phase-specific audit prompts

- **After phase 2:** Does the concept deck feel like a real perspective — not a bolted-on intro screen? Are the 8 items sufficient to ground a new user? Do cross-perspective links work?
- **After phase 4:** Does the self-referential corpus feel honest and verifiable? Can you trace one topic (e.g., Context Machine) across Orientation, Landscape, Architecture, System, and Sequence? Is cross-perspective continuity strong?
- **After phase 7:** Is the full first-run experience cohesive — Orientation → Full Descent → free exploration? Does every entity have a verifiable code anchor?

---

## Design Rules

1. **Orientation is a first-class perspective.** It has its own canvas type (concept deck), its own layout engine, and its own entity model. It belongs in the perspective progression because it presents a distinct lens of understanding: semantic grounding.
2. **Every seed entity has a verifiable code anchor.** Every major topic is traceable across code boundary, UI behavior, and runtime sequence. If a user reads an entity and cannot find the corresponding code, the corpus has failed.
3. **The 7-perspective progression is deliberate.** Orientation → Landscape → Journey → Process → Architecture → System → Sequence mirrors how understanding matures — from conceptual grounding to runtime interaction.
4. **The corpus is self-referential, not self-documenting.** It models the actual codebase. Nodes are real modules. Edges are real imports. Processes are real execution flows. Sequences are real call chains.
5. **Schemas don't change; subject matter changes.** The same entity types carry the new corpus. No schema migrations.
6. **Architecture teaches structure; System teaches runtime.** Both connect to the canonical model and the shared context contract. Architecture shows where the contract is defined. System shows where the contract is executed.
7. **Cross-perspective linking is the modeling challenge.** One topic must appear coherently across multiple perspectives. This is what the canonical model enables and what the self-referential corpus demonstrates.
8. **The fintech data lives on.** It moves to nebulus-landscape as a vertical corpus. Nothing is deleted.

---

## Watchpoints

- **Orientation must feel like a real perspective.** It should not feel like a disguised onboarding overlay or a help screen. It should feel like a lens — the same kind of intentional, structured view that Landscape or Architecture provides, applied to concepts instead of structure.
- **Cross-perspective topic continuity.** One concept (e.g., Context Machine) must be traceable cleanly from Orientation (where it's defined as a term) through Landscape (capability), Architecture (module node), System (runtime participant), Process (execution stage), and Sequence (lifeline). If that thread breaks, the canonical model lesson fails.
- **Orientation content rendering.** The concept deck renders HTML/markdown, not React Flow nodes. This is a different rendering paradigm. Test scroll behavior, typography, and viewport sizing.
- **Seed data volume.** The self-referential corpus is smaller than the fintech corpus but more densely cross-linked. Ensure perspectives don't feel empty.
- **Test rewrites.** Every test that references a fintech entity ID breaks. Budget time for this.
- **First-load performance.** Orientation loads on first visit. Ensure it renders instantly.
- **Stepper on Orientation.** The content panel must update synchronously with the agenda highlight — no lag.
