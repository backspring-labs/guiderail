# IDEA: Self-Referential Seed Corpus — GuideRail Teaching Itself

## Status
Draft — supersedes v2.

## Central Idea

> The default corpus should teach GuideRail by modeling GuideRail.

Every entity in the seed data maps to a real construct in the codebase. A user can click "Context Machine" in the Architecture view, switch to the Sequence perspective, and watch the actual event flow that fired when they clicked. The seed data is not documentation *about* GuideRail — it *is* GuideRail, modeled through GuideRail.

---

## Why This Matters

The current seed data models a fictional fintech domain. It proves the perspectives work, but it doesn't teach the product. A new user has to reverse-engineer what perspectives mean, what the shared context contract does, and how the pieces connect.

A self-referential corpus solves three problems at once:

1. **How to use the product** — the guided routes walk you through it
2. **How the product works** — the seed entities are the actual architecture
3. **What a corpus needs to look like** — the seed data is a complete worked example of the canonical model

---

## The Canonical Model

GuideRail depends on an internal canonical model. This model preserves:

- **Identity** — every entity has a stable ID and a declared type
- **Relationships** — foreign keys link entities across perspectives (capabilityId on Sequence, domainId on Capability, journeyId on Step)
- **Provenance** — ProvenanceRef tracks where each entity originated
- **Cross-perspective continuity** — the shared context contract ensures that switching perspectives means "show me this same moment through another lens," not "take me somewhere else"

The canonical model is what makes guided traversal coherent. Without it, perspectives are disconnected diagram types. With it, they are linked views of the same reality.

**Ingestion mapping** is the act of transforming external source artifacts into this canonical model. The quality of the mapping determines the quality of the traversal. The self-referential corpus teaches this implicitly: every seed entity demonstrates what a well-formed canonical entity looks like, how relationships are expressed, and how cross-perspective continuity is achieved.

---

## Orientation Perspective

Orientation is the **7th perspective** — the entry point that grounds the user before they explore. The perspective progression becomes:

**Orientation → Landscape → Journey → Process → Architecture → System → Sequence**

### Purpose
Orientation establishes key concepts, terms, and structural context before the user descends into domain-specific perspectives. It answers: what is this product, what are these perspectives, what is the tour structure, and what concepts do I need to understand before I start navigating.

### Canvas layout: Concept Deck
Orientation renders a distinct canvas type — a **concept deck**. This is not a graph, diagram, or flow chart. It is a structured presentation surface.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌──────────────────┐   ┌──────────────────────────────────┐ │
│  │                  │   │                                  │ │
│  │  1. Welcome      │   │  Welcome to GuideRail            │ │
│  │  ───────────     │   │                                  │ │
│  │  2. Perspectives │   │  GuideRail is a guided           │ │
│  │                  │   │  architecture navigator that     │ │
│  │  3. Shared       │   │  helps you move from business    │ │
│  │     Context      │   │  understanding to implementation │ │
│  │                  │   │  reality.                        │ │
│  │  4. Domains &    │   │                                  │ │
│  │     Capabilities │   │  ┌────────────────────────────┐  │ │
│  │                  │   │  │   [visual / diagram /      │  │ │
│  │  5. The Full     │   │  │    concept illustration]   │  │ │
│  │     Descent      │   │  └────────────────────────────┘  │ │
│  │                  │   │                                  │ │
│  │  6. Canonical    │   │  Key Terms                      │ │
│  │     Model        │   │  ─────────                      │ │
│  │                  │   │  Perspective — a visual lens     │ │
│  │  7. Guided       │   │  on the same underlying data    │ │
│  │     Routes       │   │                                  │ │
│  │                  │   │  Domain — a grouping of related  │ │
│  │  8. Next Steps   │   │  capabilities                   │ │
│  │                  │   │                                  │ │
│  └──────────────────┘   └──────────────────────────────────┘ │
│                                                              │
│  ⏮ ◀  ▶ ⏭                                                   │
│  Concept 1 of 8                                              │
└──────────────────────────────────────────────────────────────┘
```

**Left column** — sequential agenda items, vertically stacked. Click any item to jump. Active item highlighted. The stepper transport control advances through them linearly.

**Right panel** — rich concept card for the selected item. Supports:
- Large display typography (headlines, not 14px body text)
- Key terms with definitions
- Inline visuals, diagrams, or illustrations (HTML-rendered, not React Flow nodes)
- Structured sections (overview, terms, objectives, "why this matters")
- Optionally links to other perspectives ("see this in Landscape →")

### Orientation items (seed content)

| # | Title | Content |
|---|---|---|
| 1 | Welcome to GuideRail | Product overview. What it is, what it does, who it's for. |
| 2 | The Perspective Model | All 7 perspectives and what each one shows. Visual showing the progression from Orientation through Sequence. |
| 3 | Shared Context Contract | Core design principle: "same moment, different lens." Terms: perspective, context, selection, focus targets. |
| 4 | Domains & Capabilities | How the Landscape organizes subject matter. Terms: domain, capability, capability triad (journey/process/sequence). |
| 5 | The Full Descent | What it means to trace one topic from Landscape to Sequence. Walk through the progression with a preview of each perspective's canvas type. |
| 6 | The Canonical Model | How entities, relationships, provenance, and cross-perspective continuity work. Terms: entity, schema, foreign key, provenance, ingestion mapping. |
| 7 | Guided Routes | How authored tours work. Terms: story route, waypoint, key message, stepper transport. |
| 8 | Start Exploring | Summary of what you've learned. Prominent action to begin: "Start the Full Descent tour" or "Explore the Landscape." |

### Design rules
- Orientation is the **default perspective** on first load. After the user has visited other perspectives, the app remembers their last perspective.
- The stepper works on Orientation the same as on Journey/Process/Sequence — arrow keys advance through concept items.
- The concept deck is a new layout engine (`orientation-layout.ts`) that produces a left-column agenda + right-column content area.
- Content is richer than other perspectives — HTML-rendered text, not just node labels. This may use a dedicated `OrientationCardNode` React Flow node type or render outside React Flow entirely.
- The left panel still shows all 7 entity sections + Guides when on Orientation. Orientation doesn't suppress navigation.

### Implementation
- New perspective type: `orientation` added to the PerspectiveType enum
- New layout engine: `orientation-layout.ts` — produces agenda nodes from Orientation entities
- New node type: `OrientationItemNode` (left column) + `OrientationContentPanel` (right side, possibly outside React Flow)
- New entity type (optional): `OrientationItem` with title, body (markdown or HTML), terms[], visualUrl, links[]
- Stepper integration: `activeOrientationIndex` in NavigationContext, or reuse `activeStepIndex` if Orientation items are modeled as steps

---

## Design Principles

### Verifiability
Every seed entity has a verifiable code anchor. Every major topic is traceable across three dimensions:

1. **Code boundary** — which file or module implements it
2. **UI behavior** — what the user sees when they interact with it
3. **Runtime sequence** — what call flow executes when it activates

If a user reads a seed entity and cannot find the corresponding code, the corpus has failed.

### Architecture teaches structure; System teaches runtime
Architecture shows the structural containers and dependency boundaries — packages, modules, the one-way dependency from `@guiderail/web` to `@guiderail/core`. System shows the live runtime participants that operationalize those structures — the XState actor, the Zustand store, the React Flow instance, the perspective provider.

Both connect to the canonical model: Architecture shows where the model is defined (entities, schemas, reconciler). System shows where the model is consumed at runtime (context machine, perspective provider, detail panel router).

Both connect to the shared context contract: Architecture shows the reconciler functions that enforce it. System shows the XState actor that executes those functions on every event.

---

# Seed Corpus

Every entity maps to an actual file, module, component, or execution path.

## Domains

| Domain | Description | Code boundary |
|---|---|---|
| **Core Kernel** | Headless state management | `packages/core/src/context/` |
| **Entity Model** | Canonical domain schemas | `packages/core/src/entities/` |
| **Graph** | Terrain graph and queries | `packages/core/src/graph/` |
| **Content Pipeline** | Loading, validation, provenance | `packages/core/src/content/` |
| **Canvas Rendering** | Perspective-specific visualization | `apps/web/src/hooks/` + `apps/web/src/lib/` |
| **Navigation** | User navigation and discovery | `apps/web/src/components/navigation/` + `layout/` |
| **Guided Routes** | Authored walkthrough experiences | `apps/web/src/components/route/` + stepper |

## Capabilities

### Core Kernel
| Capability | Description | Key file |
|---|---|---|
| Context Machine | XState state machine — single authority for all nav state, 35 events | `context.machine.ts` |
| State Reconciliation | 19 pure functions that enforce the shared context contract | `reconciler.ts` |
| Navigation Context | Zod-validated nav state schema, 18 fields | `navigation-context.ts` |

### Entity Model
| Capability | Description | Key file |
|---|---|---|
| Schema Validation | Every entity validated at parse time via Zod — Domain, Node, Step, Sequence, etc. | `entities/*.ts` (20+ schemas) |
| Entity Relationships | Foreign keys linking entities across perspectives — capabilityId, domainId, journeyId | Cross-entity schemas |
| Provenance Tracking | ProvenanceRef on entities tracks source origin | `provenance.ts` |

### Canvas Rendering
| Capability | Description | Key file |
|---|---|---|
| Perspective Provider | Routes kernel state to perspective-specific layout engines | `use-perspective-provider.ts` |
| BPMN Layout | Swim lane positioning with topological ordering | `bpmn-layout.ts` |
| Journey Layout | Step flow with branching (screen/modal/error/decision) | `journey-layout.ts` |
| Landscape Layout | 3-column domain grid with capability tiles and actor entry points | `landscape-layout.ts` |
| Sequence Layout | Lifeline diagram with interface headers and message arrows | `sequence-layout.ts` |
| Canvas Mode Switching | Same topology, different emphasis — Operational/Decision/Controls | `ContextBar.tsx` |

### Navigation
| Capability | Description | Key file |
|---|---|---|
| Contextual Left Panel | 7 collapsible sections scoped to primary selection with cascading filter | `LeftPanel.tsx` |
| Breadcrumb Trail | Context path with domain > capability > journey and clear actions | `ContextBar.tsx` |
| Search Palette | Cmd+K fuzzy search across all entity types | `SearchPalette.tsx` |
| Perspective Switching | 7 tabs — switch means "same moment, different lens" | `PerspectiveSwitcher.tsx` |
| Detail Panel | Entity detail with cross-navigation actions | `RightPanel.tsx` |

### Guided Routes
| Capability | Description | Key file |
|---|---|---|
| Route Playback | Waypoint progression with pause/resume and narrative overlay | `StoryRouteBar.tsx` |
| Stepper Transport | ⏮◀▶⏭ controls + arrow keys for sequential content | `StepperControl.tsx` |
| Waypoint Progression | Each waypoint sets perspective, focus targets, and key message | `reconcileWaypointChange` |

## Journeys

Each step maps to a real UI interaction.

### Journey: The Full Descent
One topic traced through every perspective.

| Step | Type | Action |
|---|---|---|
| 1 | screen | See all domains on the Landscape |
| 2 | screen | Select a domain to scope capabilities |
| 3 | screen | Select a capability to scope downstream |
| 4 | screen | Switch to Journey — shared context preserves capability |
| 5 | screen | Step through the journey with stepper or arrow keys |
| 6 | screen | Switch to Process — see BPMN swim lanes |
| 7 | screen | Toggle canvas modes — Decision, Controls |
| 8 | screen | Switch to Architecture — structural view |
| 9 | screen | Switch to System — scoped participants |
| 10 | screen | Switch to Sequence — runtime interaction |

### Journey: Left Panel Navigation
| Step | Type | Action |
|---|---|---|
| 1 | screen | Type in filter box to search across all sections |
| 2 | screen | Click a journey — auto-switches to Journey perspective |
| 3 | screen | Click a process — auto-switches to Process perspective |
| 4 | screen | Click a sequence — auto-switches to Sequence perspective |
| 5 | screen | Detail appears in right panel for each selection |

### Journey: Guided Route Playback
| Step | Type | Action |
|---|---|---|
| 1 | screen | Click a guide in the Guides section |
| 2 | screen | StoryRouteBar appears with first waypoint |
| 3 | screen | Click Next — perspective switches, canvas re-centers, key message updates |
| 4 | screen | Pause the route — explore freely |
| 5 | screen | Resume — returns to paused position |
| 6 | screen | End route — back to explorer mode |

## Processes

Each stage maps to real function calls.

### Process: Perspective Switch with Shared Context

| Stage | Execution | Source |
|---|---|---|
| 1. Event dispatch | `send({ type: "SWITCH_PERSPECTIVE", perspectiveId })` | AppShell.tsx |
| 2. Guard check | Context machine validates event in `ready` state | context.machine.ts |
| 3. Reconciliation | `reconcilePerspectiveSwitch` — clears selection, resets canvas mode, preserves domain/capability/journey/process | reconciler.ts |
| 4. State commit | XState `assign` writes new NavigationContext | context.machine.ts |
| 5. Layout routing | `usePerspectiveProvider` routes to correct layout engine | use-perspective-provider.ts |
| 6. Layout computation | BPMN/Journey/Landscape/Sequence engine runs | lib/*.ts |
| 7. Canvas render | React Flow receives new nodes/edges | AppShell.tsx |
| 8. Viewport position | `fitViewTopLeft` computes zoom and 40px top-left offset | use-canvas-events.ts |

### Process: Entity Selection Cascade

| Stage | Execution | Source |
|---|---|---|
| 1. User click | Left panel fires `onSelectCapability(id)` | LeftPanel.tsx |
| 2. Dual dispatch | AppShell sends `SELECT_CAPABILITY` then `SWITCH_PERSPECTIVE` | AppShell.tsx |
| 3. Selection reconciliation | `reconcileCapabilitySwitch` — clears stale children, preserves domain | reconciler.ts |
| 4. Left panel re-scope | Journeys, Processes, Sequences, Providers filter to active capability | LeftPanel.tsx |
| 5. Right panel update | Detail panel router shows capability detail | DetailPanelRouter.tsx |
| 6. Perspective switch | `reconcilePerspectiveSwitch` runs for auto-switch | reconciler.ts |
| 7. Canvas re-render | Perspective provider assembles new canvas data | use-perspective-provider.ts |

### Process: Stepper Forward

| Stage | Execution | Source |
|---|---|---|
| 1. Input | StepperControl onClick or keyboard ArrowRight | StepperControl.tsx |
| 2. Event dispatch | `send({ type: "STEPPER_FORWARD" })` | AppShell.tsx |
| 3. Guard | `canStepperForward` checks perspective and bounds | context.machine.ts |
| 4. Target resolution | `resolveStepperTarget` returns "journey", "process", or "sequence" | context.machine.ts |
| 5. Reconciliation | Routes to `reconcileStepChange`, `reconcileStageChange`, or `reconcileMessageChange` | reconciler.ts |
| 6. Focus update | Sets activeFocusTargets, selectedNodeId, viewport anchor | reconciler.ts |
| 7. Canvas highlight | Perspective provider sets `isActive` on current node | use-perspective-provider.ts |

## Architecture

The actual module dependency graph.

### @guiderail/core (headless, no React)
| Module | Role |
|---|---|
| `context.machine.ts` | XState state machine — 35 events, all navigation authority |
| `reconciler.ts` | 19 pure functions that transform NavigationContext |
| `navigation-context.ts` | Zod schema — 18 fields, the shared context contract |
| `entities/*.ts` | 20+ Zod schemas defining the canonical model |
| `graph.ts` | TerrainGraph with nodes/edges maps |
| `file-loader.ts` | parseContentBundle — Zod validation, error collection |

### @guiderail/web (React UI)
| Module | Role |
|---|---|
| `AppShell.tsx` | Orchestration hub — wires kernel to UI |
| `use-context-machine.ts` | KernelContext provider, useNavigation hook |
| `use-perspective-provider.ts` | Routes kernel state to layout engines |
| `LeftPanel.tsx` | 7-section contextual navigator |
| `ContextBar.tsx` | Breadcrumb trail + canvas mode switcher |
| `StoryRouteBar.tsx` | Guided route playback |
| `StepperControl.tsx` | Transport controls |
| `SearchPalette.tsx` | Cmd+K search |
| `bpmn-layout.ts` | Process canvas layout |
| `journey-layout.ts` | Journey canvas layout |
| `landscape-layout.ts` | Landscape canvas layout |
| `sequence-layout.ts` | Sequence canvas layout |
| `ui-store.ts` | Zustand store — UI-only state |

### Dependency graph
- `@guiderail/web` → `@guiderail/core` (never the reverse)
- `AppShell` → `useNavigation` → `KernelContext` → `contextMachine`
- `AppShell` → `usePerspectiveProvider` → layout engines
- `contextMachine` → `reconciler` → `NavigationContext`
- `usePerspectiveProvider` → seed data + layout engines → React Flow nodes/edges

### Canvas modes
- **Logical** — module dependency graph
- **Deployment** — monorepo structure: `packages/core/` + `apps/web/`, pnpm workspaces, Turborepo, Vite

## System

Live runtime participants. Architecture shows where things are defined; System shows where they run.

| Participant | Role | Runtime identity |
|---|---|---|
| XState Actor | Single authority for nav state — processes all 35 events | `KernelContext` via `createActorContext(contextMachine)` |
| Zustand Store | UI-only state — panel visibility, toggle state | `useUIStore` in ui-store.ts |
| React Flow Instance | Canvas renderer — nodes, edges, viewport, zoom, pan | `<ReactFlow>` in AppShell.tsx |
| Perspective Provider | Assembles rfNodes/rfEdges per perspective on every state change | `usePerspectiveProvider` hook |
| Seed Loader | Imports seed data from core via Vite path alias | `seed-loader.ts` with `@seed` alias |
| Vite Dev Server | HMR, module bundling, path resolution | vite.config.ts |
| Biome | Linting + formatting — 91 files in 11ms, complexity max 15 | biome.json |

The canonical model is defined in Architecture (entities, schemas, reconciler) and consumed in System (XState actor executes reconciler functions, perspective provider reads NavigationContext, detail panel resolves entity relationships). The shared context contract is enforced at the boundary between them: reconciler functions are pure transforms defined in core; the XState actor in the web runtime calls them on every event.

## Sequences

Actual call flows with real function names.

### Sequence: Capability Selection from Landscape Canvas

| # | From | To | Message | Type |
|---|---|---|---|---|
| 1 | User | LandscapeCapabilityNode | click | event |
| 2 | LandscapeCapabilityNode | NODE_CLICK_HANDLERS | matches `landscape-cap-` prefix | request |
| 3 | NODE_CLICK_HANDLERS | XState Actor | `SELECT_CAPABILITY` | request |
| 4 | XState Actor | reconcileCapabilitySwitch | transform nav state | request |
| 5 | reconcileCapabilitySwitch | XState Actor | new NavigationContext | response |
| 6 | XState Actor | Perspective Provider | state change triggers re-render | event |
| 7 | Perspective Provider | landscape-layout | computeLandscapeLayout | request |
| 8 | landscape-layout | Perspective Provider | nodes[] + edges[] | response |
| 9 | Perspective Provider | React Flow Instance | setNodes, setEdges | request |
| 10 | XState Actor | LeftPanel | nav state update — sections re-scope | event |
| 11 | XState Actor | RightPanel | selectedNodeId update — detail renders | event |

### Sequence: Perspective Switch with Shared Context

| # | From | To | Message | Type |
|---|---|---|---|---|
| 1 | User | PerspectiveSwitcher | click tab | event |
| 2 | PerspectiveSwitcher | XState Actor | `SWITCH_PERSPECTIVE` | request |
| 3 | XState Actor | reconcilePerspectiveSwitch | clear selection, reset canvas mode, preserve context | request |
| 4 | reconcilePerspectiveSwitch | XState Actor | new NavigationContext | response |
| 5 | XState Actor | Perspective Provider | perspective type changed — routes to new layout engine | event |
| 6 | Perspective Provider | React Flow Instance | new nodes/edges for new perspective | request |
| 7 | Perspective Provider | fitViewTopLeft | compute zoom + top-left position | request |
| 8 | fitViewTopLeft | React Flow Instance | setViewport | request |

---

## Guided Routes

### Route: The Full Descent
One topic carried through every perspective.

| Waypoint | Perspective | Key Message |
|---|---|---|
| 1 | Landscape | "This is the terrain — domains group capabilities. Click one to scope everything downstream." |
| 2 | Landscape | "Capabilities are the anchor point. Journeys, processes, and sequences all hang off capabilities." |
| 3 | Journey | "Same capability, different lens. Now you see the user-facing flow." |
| 4 | Journey | "Use the stepper to walk through steps. Each step has a type — screen, modal, decision, error." |
| 5 | Process | "Same moment, operational view. BPMN swim lanes show how work executes." |
| 6 | Process | "Toggle canvas modes. Same topology, different emphasis — Decision shows gateways, Controls shows risk." |
| 7 | Architecture | "The structural view. Packages, modules, and their dependencies." |
| 8 | System | "Scoped to participants. Only the systems involved in the current context." |
| 9 | Sequence | "Runtime interaction. The actual call sequence between services — every request and response." |

### Route: The Shared Context Contract
Makes the core design principle visible.

| Waypoint | Perspective | Key Message |
|---|---|---|
| 1 | Landscape | "Select a capability. The left panel scopes to show only related journeys, processes, and sequences." |
| 2 | Journey | "Switch perspective. The capability selection survived — same capability's journey." |
| 3 | Process | "Switch again. Still the same capability. The breadcrumb trail shows your context thread." |
| 4 | Architecture | "One more switch. Domain, capability, process — all preserved. This is the shared context contract." |

### Route: How GuideRail Is Built
A meta-tour through the actual architecture.

| Waypoint | Perspective | Key Message |
|---|---|---|
| 1 | Landscape | "GuideRail has 7 domains. Core Kernel owns all state. Canvas Rendering owns all visualization. They never import from each other." |
| 2 | Architecture | "Two packages: @guiderail/core (headless) and @guiderail/web (React). Dependency flows one direction only." |
| 3 | Architecture | "The Context Machine is an XState actor with 35 events. Every navigation action flows through it." |
| 4 | Process | "When you switch perspectives, reconcilePerspectiveSwitch runs. It clears selection, resets canvas mode, but preserves your context." |
| 5 | Sequence | "Here's the actual call flow when you click a capability — 11 steps from click to rendered detail." |

---

## Corpus Transition

- The fintech seed data moves to **nebulus-landscape** as a vertical corpus
- The base GuideRail project ships with a self-referential product-native corpus
- Entity schemas remain identical — only the subject matter changes
- Onboarding value improves: users learn the product by exploring the product
- Modeling value improves: the seed data is a complete reference implementation of the canonical model

---

## Downstream Payoff

This corpus is not only a better onboarding experience. It is a **reference implementation** that teaches adopters what their own application or corpus must provide to support canonical-model ingestion and meaningful guided traversal.

A user who completes the Orientation route and explores the self-referential corpus will understand:
- what entities their corpus needs (domains, capabilities, journeys, processes, nodes, edges, sequences)
- how relationships link those entities across perspectives (foreign keys, cross-references)
- how provenance tracks source origin
- how the shared context contract preserves continuity across perspective switches
- what a well-formed canonical model looks like in practice

That understanding is what makes GuideRail adoptable. The product teaches its own requirements by demonstrating them.
