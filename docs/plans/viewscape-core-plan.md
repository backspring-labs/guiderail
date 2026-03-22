# viewscape-core Implementation Plan

## Context

`viewscape-core` is the canonical headless model for a business architecture navigator. It provides the domain model, state machines, context synchronization logic, and contract definitions that both `viewscape` (terrain discovery UI) and `guiderail` (guided journey traversal UI) will consume as a dependency.

The core supports Domains, Capabilities, Journeys, Perspectives, navigation context, and traversal semantics. It is not a journey-first tool — it is a business architecture navigator that supports journeys as one navigation mode.

The repo is at `/Users/jladd/Code/viewscape-core/` and is currently empty (git init only). The `viewscape` repo at `/Users/jladd/Code/viewscape/` will consume this package via local linking (`file:../viewscape-core`).

The kernel's central promise: **the user must never lose their place** when switching perspectives, stepping through journeys, selecting nodes, navigating domains/capabilities, or changing modes.

This library is pure TypeScript + Zod + XState. No React, no rendering, no UI. It runs in Node.js, Bun, or the browser.

### Conceptual Model

```
Navigation layer:    Domain → Capability → Journey → Step
                                    ↕ (references, not owns)
Terrain layer:       Node ←→ Edge
                                    ↕ (determines visibility/emphasis)
View layer:          Perspective → Layer (rendering rules)
```

**Design principle:** Domain for core structural modeling, Capability for business architecture navigation, Journey for outcome paths, Perspective for view switching, Layer for rendering/layout behavior.

**Key relationship rules:**
- Domain groups Capabilities (Capability references its domainId; Domain does not own an ordered list of capabilities)
- Capability references relevant Nodes, Edges, and Journeys — these are curated navigation/visibility references, not the sole association mechanism. A Node may participate in many Capabilities. Future derived or inferred associations should not require schema changes.
- Journey spans one or more Capabilities. Each Journey has an `entryCapabilityId` that serves as its deterministic home anchor for cold-start selection and UX display.
- Step references a focal Node and/or Edge
- Perspective determines which Nodes/Edges are visible or emphasized and how they are interpreted
- Layer carries rendering, layout, visibility, and organization rules — not business meaning

Capabilities, Journeys, and Perspectives organize the terrain; Nodes and Edges form the terrain.

### Multi-target focus model
A Step is not limited to a single focal node or edge. A Step may activate multiple focus targets that represent the same moment across different representations of the terrain.

Focus target types include: node, edge, scene element, annotation, artifact anchor, sequence element.

**Rule:** The core owns the canonical active focus set for the current step and perspective. Products (Viewscape, GuideRail) decide how to render and synchronize that focus across panes, diagrams, simulators, or walkthrough surfaces.

**Boundary:** The core coordinates *what* is in focus; the product layer coordinates *how* it is shown. Pane choreography, animation, layout synchronization, and rendering behavior belong to consumers, not the kernel.

This future-proofs coordinated experiences (e.g., screen progression on one side + sequence/architecture view on the other) without pushing UI concerns into the core.

### Relationship modeling guidance (v1 pragmatism)
These v1 choices are practical starting points, not permanent laws:
- `Capability.nodeIds` / `edgeIds` — curated reference arrays for now; leave room for derived associations later
- `Node.layoutByPerspective` — v1 convenience for position lookup; may evolve to account for layer variants or generated vs. manual layouts
- `Perspective.defaultLayerId` — default layer reference, not a permanent 1:1 binding; named `defaultLayerId` to signal this

### State machine authority rule
The Context Machine is the single authoritative aggregate of navigation state. Navigation, Journey, Route, and Perspective machines own behavioral transitions, but the Context Machine holds the unified NavigationContext that consumers read. No consumer should read state from child machines directly — always read from the Context Machine's snapshot.

---

## Package Structure

```
viewscape-core/
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── biome.json
├── vitest.config.ts
├── CLAUDE.md
├── src/
│   ├── index.ts                          # barrel export
│   ├── entities/                         # canonical domain model
│   │   ├── index.ts
│   │   ├── domain.ts                     # business domain (broad area)
│   │   ├── capability.ts                 # business capability within a domain
│   │   ├── node.ts                       # terrain primitive
│   │   ├── edge.ts                       # terrain primitive
│   │   ├── journey.ts                    # outcome path through capabilities
│   │   ├── step.ts                       # traversable step in a journey
│   │   ├── perspective.ts                # view lens (architecture, provider, process, etc.)
│   │   ├── layer.ts                      # rendering/layout rules for a perspective
│   │   ├── scene.ts                      # simulator/detail content for a step
│   │   ├── annotation.ts                 # attached context
│   │   ├── evidence-ref.ts               # links to supporting artifacts
│   │   ├── workspace.ts                  # local operating context
│   │   ├── source.ts                     # external repo/corpus reference
│   │   ├── terrain-index.ts              # derived index model
│   │   └── session.ts                    # user navigation state
│   ├── provenance/                       # provenance tracking
│   │   ├── index.ts
│   │   └── provenance.ts
│   ├── graph/                            # in-memory graph container + queries
│   │   ├── index.ts
│   │   ├── graph.ts
│   │   ├── traversal.ts
│   │   └── filter.ts
│   ├── machines/                         # XState v5 state machines
│   │   ├── index.ts
│   │   ├── navigation.machine.ts         # domain/capability drill-down
│   │   ├── journey.machine.ts            # journey lifecycle
│   │   ├── route.machine.ts              # step progression
│   │   ├── perspective.machine.ts        # perspective switching
│   │   ├── source.machine.ts             # source attachment
│   │   └── index-generation.machine.ts   # index build workflow
│   ├── context/                          # context synchronization
│   │   ├── index.ts
│   │   ├── navigation-context.ts
│   │   ├── reconciler.ts
│   │   └── context.machine.ts            # THE authoritative aggregate state
│   ├── perspective/                      # perspective contracts
│   │   ├── index.ts
│   │   ├── contracts.ts
│   │   └── layer-resolver.ts
│   ├── adapters/                         # source adapter contracts (interfaces only)
│   │   ├── index.ts
│   │   ├── source-adapter.ts
│   │   ├── content-repo-adapter.ts
│   │   └── code-repo-adapter.ts
│   ├── indexing/                         # indexing contracts (interfaces only)
│   │   ├── index.ts
│   │   ├── indexer.ts
│   │   ├── normalizer.ts
│   │   └── rebuild.ts
│   └── test-fixtures/                    # seed data + factory helpers
│       ├── index.ts
│       ├── seed-banking.ts              # banking domain seed (test/demo only)
│       └── helpers.ts
└── tests/
    ├── entities/
    │   └── schemas.test.ts
    ├── graph/
    │   └── graph.test.ts
    ├── machines/
    │   ├── navigation.test.ts
    │   ├── journey.test.ts
    │   ├── route.test.ts
    │   └── perspective.test.ts
    ├── context/
    │   ├── reconciler.test.ts
    │   └── context-machine.test.ts
    └── integration/
        └── walkthrough.test.ts
```

---

## Phase 1: Foundation (entities, graph, seed data)

### What to build
- Project scaffolding: `package.json`, `tsconfig.json`, `biome.json`, `vitest.config.ts`, `CLAUDE.md`
- All 15 entity schemas as Zod schemas with inferred TypeScript types
- Provenance model (optional field attachable to any entity)
- Graph container with query/traversal/filter functions
- Banking domain seed dataset (test/demo data only — no fintech concepts baked into core types)
- Test fixture factory helpers (`makeNode()`, `makeDomain()`, `makeCapability()`, etc.)

### Key entities (Zod schemas → inferred types)

**Navigation layer:**
- **Domain**: id, label, description, tags, metadata — the broad business area (e.g., Payments, Identity & Access, Accounts, Risk & Fraud). Does NOT contain an ordered capabilityIds list; Capabilities reference their Domain via domainId.
- **Capability**: id, domainId, label, description, nodeIds (curated navigation references), edgeIds (curated navigation references), journeyIds (curated references), tags, metadata — the enduring business ability (e.g., Account Opening, Money Movement, Fraud Detection). nodeIds/edgeIds are references for navigation and visibility, not the only possible association mechanism.
- **Journey**: id, label, description, entryCapabilityId (deterministic home anchor for cold-start), capabilityIds (all capabilities this journey spans), stepIds (ordered), tags, entryConditions, exitConditions
- **Step**: id, journeyId, sequenceNumber, focusTargets (array of `{ type: node|edge|scene_element|annotation|artifact_anchor|sequence_element, targetId }` — the canonical active focus set for this step), capabilityId (which capability this step is within), title, narrative, actor, expectedAction, nextStepIds, sceneId (optional), evidenceRefIds, metadata

**Terrain layer:**
- **Node**: id, type (open string), label, description, tags, metadata, layoutByPerspective (keyed by perspective ID, with x/y positions — v1 convenience, may evolve)
- **Edge**: id, sourceNodeId, targetNodeId, type, label, directed (default true), metadata

**View layer:**
- **Perspective**: id, type (overview|architecture|provider|process|journey|sequence|control), label, description, highlightRules, visibilityRules, defaultLayerId (default rendering config — not a permanent 1:1 binding)
- **Layer**: id, label, eligibleNodeTypes, eligibleEdgeTypes, layoutStrategy (auto|manual|hybrid), renderingHints, metadata — purely rendering/layout concern

**Supporting entities:**
- **Scene**: id, stepId, uiStateRef, focusTargets, instructionalCopy, annotations — optional detail framing for guided traversal; not required for all Viewscape interactions
- **Annotation**: id, targetType (domain|capability|node|edge|step|journey), targetId, type (research_note|risk_note|control_note|etc.), content, author, createdAt
- **EvidenceRef**: id, title, type, sourceUrl, summary, accessClassification, relatedEntityIds
- **Workspace**: id, name, sourceIds, indexId, createdAt
- **Source**: id, type (content_repo|code_repo), uri, label, metadata
- **TerrainIndex**: id, sourceId, version, builtAt, status (building|ready|stale|error), nodeCount, edgeCount
- **Session**: id, workspaceId, activeDomainId, activeCapabilityId, activeJourneyId, activeStepId, activePerspectiveId, selectedNodeId, selectedEdgeId, viewportAnchor, filters

### Graph container functions
- `createGraph(nodes, edges)` → TerrainGraph
- `getNode / getEdge` → lookup by ID
- `getNeighbors(nodeId, direction)` → connected nodes
- `getEdgesForNode(nodeId, direction)` → connected edges
- `filterNodes(predicate)` → filtered set
- `getNodesForCapability(capability)` → nodes referenced by a capability
- `getCapabilitiesForDomain(domainId, capabilities)` → capabilities belonging to a domain
- `getNodesForPerspective(perspective, layer)` → nodes visible in a perspective
- `getPathNodes(journey, steps)` → ordered nodes along a journey

### Seed dataset: Banking Domain (test/demo only)

**3 Domains:** Customer, Accounts, Payments

**6 Capabilities:**
- Customer → Customer Onboarding, Authentication
- Accounts → Account Opening, Account Servicing
- Payments → Money Movement, Payment Processing

**10 Nodes:** Customer (actor), Mobile App (screen), API Gateway (system), Identity Service (service), Risk Service (service), Account Service (service), Core Ledger (system), Notification Service (service), Payment Orchestrator (service), Payment Rail (system)

**11 Edges** connecting the nodes

**1 Journey:** "Open Savings Account" with entryCapabilityId pointing to Customer Onboarding, spanning Customer Onboarding + Account Opening capabilities, with 6 steps

**5 Perspectives:** Overview, Architecture, Provider, Process, Journey — Provider included explicitly to validate it as a first-class perspective

**6 Scenes:** One per step (optional guided traversal detail, not required for domain/capability browsing)

**Sample annotations and evidence refs**

This seed validates the full Domain → Capability → Journey → Perspective hierarchy without baking fintech concepts into the core types.

### Tests
- Schema validation: accept valid seed data, reject malformed data
- Graph queries: neighbors, filtering, capability-scoped queries, domain-scoped queries, path extraction
- Domain/Capability hierarchy: capabilities reference correct domain, journey spans correct capabilities, entryCapabilityId is valid

### Done when
- `pnpm install && pnpm check && pnpm test && pnpm build` all pass
- Seed dataset validates against all schemas
- Graph queries return correct results
- Domain → Capability → Journey → Step hierarchy is navigable

---

## Phase 2: State Machines (XState v5)

### What to build
6 headless XState v5 machines:

**Navigation Machine** (domain/capability drill-down)
- States: `browsing` with substates: `atRoot`, `atDomainLevel`, `atCapabilityLevel`
- Events: SELECT_DOMAIN, SELECT_CAPABILITY, CLEAR_CAPABILITY, CLEAR_DOMAIN
- Context: activeDomainId, activeCapabilityId
- Key behavior: selecting a domain shows its capabilities; selecting a capability shows its referenced nodes/edges and available journeys; clearing cascades downward (clear domain → clears capability and journey)

**Journey Machine** (lifecycle)
- States: `idle` → `selecting` → `active` → `completed`
- Events: SELECT_JOURNEY, JOURNEY_LOADED, DESELECT_JOURNEY, COMPLETE_JOURNEY
- Owns "is a journey active?", not step progression

**Route Machine** (step progression)
- States: `idle` → `navigating.atStep`
- Events: STEP_FORWARD, STEP_BACKWARD, JUMP_TO_STEP, RESET
- Guards: canStepForward, canStepBackward, isValidStepIndex
- Context: currentStepIndex, totalSteps, canGoForward, canGoBack

**Perspective Machine** (perspective switching)
- Always active (there's always an active perspective)
- Events: SWITCH_PERSPECTIVE, PERSPECTIVES_LOADED
- Context: activePerspectiveId, previousPerspectiveId, availablePerspectiveIds
- Key behavior: switching perspective does NOT disrupt domain/capability/journey state

**Source Machine** (source attachment)
- States: `detached` → `attaching` → `attached` → `detaching`
- Events: ATTACH_SOURCE, SOURCE_ATTACHED, ATTACH_FAILED, DETACH_SOURCE

**Index Generation Machine**
- States: `idle` → `generating` → `ready` | `error`
- Events: START_INDEX, INDEX_PROGRESS, INDEX_COMPLETE, INDEX_FAILED, REBUILD_INDEX

### Tests
- Each machine tested headlessly with `createActor` + `actor.send()` + snapshot assertions
- Guards tested (invalid transitions blocked)
- Context mutations verified
- Navigation machine: cascade behavior (clear domain → clears capability)
- Perspective machine: switching preserves all other state

### Done when
- All machine tests pass
- Machines are pure (no I/O, no side effects)
- Each exports setup function + type definitions for context and events

---

## Phase 3: Context Synchronization & Perspective

### What to build

**NavigationContext** — the unified state record:
- activeDomainId, activeCapabilityId, activeJourneyId, activeStepIndex, activePerspectiveId, activeFocusTargets (array of `{ type, targetId }` — the canonical focus set for the current step/perspective), selectedNodeId, selectedEdgeId, viewportAnchor (x, y, zoom), activeSceneId, mode (viewscape|guiderail)

**Reconciler** — pure functions implementing the core promise:
- `reconcileDomainSwitch()` — set domain, clear capability/journey/step, preserve perspective
- `reconcileCapabilitySwitch()` — set capability within current domain, clear journey/step, filter visible nodes to capability's references, preserve perspective
- `reconcilePerspectiveSwitch()` — preserve domain/capability/journey/step, update viewport to current focal node's position in new perspective layout
- `reconcileStepChange()` — update selected node, scene, viewport when stepping; update activeCapabilityId if step crosses into a different capability
- `reconcileNodeSelection()` — handle node click; if node is on active journey path, optionally snap to that step; otherwise just select
- `reconcileJourneySelection()` — set journey, infer domain/capability from journey's entryCapabilityId if not already set (entry capability wins for deterministic cold-start), load steps
- `reconcileJourneyDeselection()` — clear journey/step/scene but preserve domain/capability/perspective
- `reconcileModeSwitch()` — switch between viewscape and guiderail modes, preserve context

**Context Machine** — the single authoritative aggregate of navigation state. References navigation/journey/route/perspective machines for behavioral transitions, invokes reconciler on events, maintains the unified NavigationContext. Consumers read state exclusively from the Context Machine's snapshot, never from child machines directly.

**Perspective contracts** — interfaces:
- `PerspectiveProvider.project(context, graph, perspective, layer)` → `PerspectiveView`
- `PerspectiveView`: nodes with positions/visibility/highlight state, edges, highlightedPath, focusNodeId, activeCapabilityBoundary
- `LayerResolver`: resolve node positions per perspective, find equivalent nodes across perspectives

### The reconciliation rules (the heart of the kernel)

1. **Domain switch**: set activeDomainId, clear activeCapabilityId/activeJourneyId/activeStepIndex, preserve activePerspectiveId, update viewport to show domain overview
2. **Capability switch**: set activeCapabilityId within current domain, clear activeJourneyId/activeStepIndex, filter visible terrain to capability's referenced nodes/edges, preserve perspective
3. **Perspective switch**: preserve domain/capability/journey/step entirely, update visibility/emphasis rules, update viewport to focal node's position in new perspective layout
4. **Journey selection**: set journey; if activeDomainId/activeCapabilityId not already set, infer from journey's `entryCapabilityId` (entry capability wins — this is the explicit ambiguity rule); load steps
5. **Journey deselection**: clear journey/step/scene, preserve domain/capability/perspective
6. **Step change**: update activeFocusTargets to the step's focus target set, update activeSceneId, update activeCapabilityId if step crosses into a different capability, center viewport on the primary node target
7. **Node selection**: if node is on active journey path → optionally snap to step; otherwise select without disrupting navigation state
8. **Mode switch**: preserve all context, adjust viewport scope

### The recommended product flow
1. Start at Domain level (e.g., "Accounts")
2. Drill into Capability (e.g., "Account Opening")
3. Inspect via different Perspectives (Architecture, **Provider**, Process, Journey, Control)
4. Optionally select a Journey (e.g., "Open Savings Account")
5. At any point, the user's domain/capability/journey context is preserved

Provider is called out explicitly here — provider comparison is a major practical use case and should feel like a first-class perspective, not an afterthought.

### Tests
- Reconciler: pure function tests for all 8 scenarios
- Journey inference: verify entryCapabilityId rule is applied deterministically
- Context machine: full walkthrough with seed data
- **Integration walkthrough test** (most important test in the repo):
  1. Load seed data → create graph
  2. Select domain "Accounts" → verify capability list available
  3. Select capability "Account Opening" → verify visible nodes scoped correctly
  4. Switch perspective to "Process" → verify domain/capability preserved, nodes re-laid out
  5. Switch perspective to "Provider" → verify domain/capability still preserved
  6. Select journey "Open Savings Account" → verify step 0 state, verify entryCapabilityId inference
  7. Step forward → verify node/scene updates
  8. Switch perspective to "Architecture" → verify step preserved, viewport updated
  9. Step through remaining steps → verify canGoForward=false at end
  10. Step backward → verify correct
  11. Switch perspective back → verify full coherence
  12. Select off-path node → verify journey not disrupted
  13. Deselect journey → verify domain/capability preserved, journey/step/scene cleared
  14. Clear capability → verify domain preserved, capability cleared
  15. Clear domain → verify clean empty state

### Done when
- Headless walkthrough test passes end to end
- Context never loses domain/capability/journey/step/perspective coherence through any event sequence
- Journey inference uses entryCapabilityId deterministically
- Perspective contracts are defined with a default implementation

---

## Phase 4: Source Adapter & Indexing Contracts

### What to build

**SourceAdapter interface**: connect, disconnect, listArtifacts, readArtifact, getRevision

**ContentRepoAdapter** (extends SourceAdapter for Viewscape): listDomains, listCapabilities, listEntities, listResearch, resolveLinks

**CodeRepoAdapter** (extends SourceAdapter for GuideRail): listRoutes, listServices, readDiagramArtifacts, getCommitContext

**Indexer interface**: buildIndex, validateIndex, getIndexStats

**Normalizer interface**: normalizeDomains, normalizeCapabilities, normalizeNodes, normalizeEdges, normalizeJourneys, resolveProvenance

Zod schemas for all wire-format types (ArtifactManifest, SourceConnection, IndexBuildResult, etc.)

A mock ContentRepoAdapter in test-fixtures that returns seed data.

### Tests
- Schema validation for wire-format types
- Mock adapter satisfies the contract
- End-to-end: mock adapter → normalizer → graph → domain/capability/journey → context sync

### Done when
- All interfaces exported
- Mock adapter works
- Full chain validated in tests

---

## Tech Stack

| Concern | Choice |
|---------|--------|
| Language | TypeScript (strict, ESM) |
| Schemas | Zod |
| State machines | XState v5 |
| Testing | Vitest |
| Package manager | pnpm |
| Formatting/linting | Biome |
| Build | tsc (emit to `dist/`) |

---

## Sequencing & Dependencies

```
Phase 1 ──────────────┬──→ Phase 3 ──→ Phase 4
Phase 2 (machines) ───┘
```

- Phases 1 and 2 can be partially parallelized (machines depend on entity types but not on graph module)
- Phase 3 depends on both Phase 1 and Phase 2
- Phase 4 depends on Phase 1 only (can overlap with Phase 3)

---

## Verification

After all phases:
1. `pnpm install` — dependencies resolve
2. `pnpm check` — Biome passes
3. `pnpm build` — tsc emits clean ESM to `dist/`
4. `pnpm test` — all tests pass, including the integration walkthrough
5. From `viewscape` repo: `pnpm add ../viewscape-core` and verify imports work
