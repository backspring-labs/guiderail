# viewscape-core 0.2.0 Implementation Plan

## Context

viewscape-core 0.1.0 is shipped with 175 tests. It provides the canonical headless model for a business architecture navigator with Domain → Capability → Journey → Step navigation, perspective switching, and context synchronization.

The 0.2.0 update expands the kernel to support provider-aware terrain, process-backed architecture, Story Routes with pause/return, and ValueStreams — as defined in the Viewscape V3 PRD.

**This update is additive, not breaking.** All existing entities, machines, functions, and 175 tests must continue to work unchanged.

### What 0.2.0 adds
- 7 new entities: Provider, ProviderAssociation, ValueStream, Process, ProcessStage, StoryRoute, StoryWaypoint
- Extended FocusTargetType enum (3 new values)
- 4 new graph query functions
- 5 new NavigationContext fields
- 7 new reconciler functions
- 1 new XState machine (StoryRoute)
- Context Machine expansion (12 new events)
- Expanded seed data (payments vertical slice)
- Semver via `npm version` (package.json is single source)

### Concept stack after 0.2.0
```
Domain = broad business area
ValueStream = higher-level value-producing flow (new, lightweight initial structure)
Capability = enduring business ability
Provider = business entity participating in capabilities (new, first-class)
Journey = real user/business path (business model)
Process = operational execution artifact (new, source-backed)
StoryRoute = guided explanatory path through Viewscape (new, teaching model)
```

### Key design rules
- Provider is a first-class entity + association model, not a typed Node
- Process is source-backed, distinct from Journey
- StoryRoute is parallel to Journey, not a replacement
- Journey belongs to the business model; StoryRoute belongs to the Viewscape teaching model
- Pause/return preserves route-owned state; temporary exploration during pause does not mutate the route-owned focus snapshot

---

## Design Tensions / Watchpoints

- **Provider must remain first-class** without collapsing the terrain into a provider map
- **Process must remain source-backed** and distinct from Journey — not a visual reinterpretation of Journey data
- **StoryRoute must stay parallel to Journey**, not absorb it
- **Pause/resume must preserve route-owned state** while allowing temporary exploration — temporary local selections and viewport changes during pause do not mutate the route-owned focus snapshot
- **0.2.0 additions must remain additive** and not force migration of 0.1.0 consumers
- **ValueStream is an initial structural model**, not necessarily the final multi-domain or multi-context truth — do not over-constrain it
- **Provider category should not become a bottleneck** for adding new provider types
- **Seed data is a vertical slice** (payments-oriented) to validate new concepts, not a statement that the core is payments-specific

---

## Versioning

**`package.json` is the single source of version truth.** Use the standard npm semver workflow:

```bash
npm version minor   # 0.1.0 → 0.2.0
```

No VERSION constant is exported. Consumers check the installed version via `package.json` if needed. This is the standard approach for TypeScript libraries in this stack.

---

## Relationship Modeling Guidance (v1 pragmatism)

These 0.2.0 choices are practical starting points, not permanent laws:

- **ValueStream.capabilityIds / journeyIds** — initial structural model for relating value streams to capabilities and journeys. May evolve to support multi-domain or cross-context value streams later.
- **Provider.category** — open string (not closed enum) with recommended vocabulary: orchestration, rail, network, scheme, wallet, infrastructure, specialist. Open string prevents the core from needing revision every time a provider class becomes awkward.
- **ProviderAssociation.role** — open string with recommended vocabulary: participant, orchestrator, rail_provider, scheme_operator, interface_provider, infrastructure_host. Consistent usage is encouraged but not schema-enforced.
- **ProcessStage** — first-class entity. Process references ordered stageIds, not embedded stage objects. Cleaner for provenance, indexing, focus targeting, and normalization.
- **StoryWaypoint.perspectiveId** — explicitly optional. A waypoint may suggest a perspective switch but does not always require one. Routes stay flexible.
- **Process focus default** — v1 simplification: focus defaults to first stage's nodes. Later may support explicit entry stage, resume stage, route-linked stage selection, or control-point-based focus.

---

## Phase 1: New Entities + FocusTargetType Extension + Version Bump

### Goal
Define all 7 new Zod schemas, extend FocusTargetType, bump version to 0.2.0. Zero behavioral changes.

### Files to create
- `src/entities/provider.ts` — Provider with id, label, description, category (open string with recommended vocabulary), tags, metadata, provenance
- `src/entities/provider-association.ts` — ProviderAssociation with id, providerId, targetType (enum: domain|capability|value_stream|journey|process|node), targetId, role (open string with recommended vocabulary), metadata
- `src/entities/value-stream.ts` — ValueStream with id, domainId, label, description, capabilityIds, journeyIds, tags, metadata, provenance. **Note:** initial structural model, not final multi-domain truth.
- `src/entities/process.ts` — Process with id, label, description, capabilityIds, valueStreamId (optional), sourceDocRef (ProvenanceRef, optional), stageIds (ordered array of stage IDs), tags, metadata, provenance. **Process does not embed stages** — it references ProcessStage IDs.
- `src/entities/process-stage.ts` — ProcessStage with id, processId, sequenceNumber, label, description, nodeIds, edgeIds, controlPoints, metadata. First-class entity, independently referenceable.
- `src/entities/story-route.ts` — StoryRoute with id, title, destinationObjective, audienceTag (optional), overview, waypointIds (ordered), tags, metadata
- `src/entities/story-waypoint.ts` — StoryWaypoint with id, storyRouteId, sequenceNumber, title, keyMessage, whyItMatters (optional), focusTargets (FocusTarget[]), perspectiveId (**optional** — waypoint may suggest a perspective but does not require one), evidenceRefIds, metadata

### Files to modify
- `src/entities/focus-target.ts` — extend enum with "provider", "process_stage", "value_stream"
- `src/entities/index.ts` — add exports for all 7 new entities
- `package.json` — bump to "0.2.0" via `npm version minor`

### Done when
- `pnpm build` succeeds
- All 175 existing tests pass unchanged
- New schemas parse valid objects and reject invalid ones

---

## Phase 2: Graph Additions + Seed Data Expansion

### Goal
Add 4 new graph query functions. Extend seed data with providers, value streams, process, and a story route.

**Seed data framing:** This is a payments-oriented vertical slice to validate the new concepts. It is not a statement that the core is payments-specific. The model should work equally well for any domain.

### Graph functions (in `src/graph/graph.ts`)
- `getProvidersForCapability(capabilityId, associations)` → provider IDs
- `getProvidersForValueStream(valueStreamId, associations)` → provider IDs
- `getValueStreamsForDomain(domainId, valueStreams)` → ValueStream[]
- `getProcessesForCapability(capabilityId, processes)` → Process[]

### Seed data additions (in `src/test-fixtures/seed-banking.ts`)
- **5 Providers**: Visa (scheme), Mastercard (scheme), RTP (rail), FedNow (rail), Apple Pay (wallet)
- **6-8 ProviderAssociations**: linking providers to capabilities and nodes
- **1-2 ValueStreams**: "Retail Payments" in dom-payments, optionally "Account Origination" in dom-accounts
- **1 Process**: "Payment Authorization" with capabilityIds → cap-payment-processing
- **3-4 ProcessStages**: Transaction Receipt, Risk Screening, Network Authorization, Posting (first-class entities referenced by Process.stageIds)
- **1 StoryRoute**: "How a Payment Flows" with 5-6 waypoints
- **5-6 StoryWaypoints**: stops walking through the payment terrain with focusTargets and keyMessages

### Factory helpers (in `src/test-fixtures/helpers.ts`)
- makeProvider, makeProviderAssociation, makeValueStream, makeProcess, makeProcessStage, makeStoryRoute, makeStoryWaypoint

### Tests
- Schema validation for all new entities (extend `tests/entities/schemas.test.ts`)
- Referential integrity (associations reference valid providers, value streams reference valid domains, process stageIds reference valid process stages, etc.)
- FocusTargetType accepts new values
- Graph query tests (extend `tests/graph/graph.test.ts`)

### Done when
- Seed data parses through schemas
- Graph queries return correct results
- All original tests still pass

---

## Phase 3: NavigationContext Expansion + Reconciler Additions

### Goal
Extend NavigationContext with 5 new fields (backward-compatible defaults). Add 7 new reconciler functions.

### NavigationContext additions (all with `.default(null)` or `.default("inactive")`)
- `activeValueStreamId: string | null`
- `activeProcessId: string | null`
- `activeStoryRouteId: string | null`
- `activeWaypointIndex: number | null`
- `routeState: "inactive" | "active" | "paused"`

### New reconciler functions

1. **reconcileValueStreamSwitch** — set value stream, clear process. Preserve activeCapabilityId only if the capability belongs to the selected value stream's capabilityIds; otherwise clear it. Preserve domain and perspective.

2. **reconcileProcessSwitch** — set process, update focus to first stage's nodes (v1 simplification — later may support explicit entry stage), update viewport. Preserve domain/capability/perspective.

3. **reconcileStoryRouteStart** — set route, load first waypoint focus/perspective, set routeState active. Does NOT clear domain/capability — route is an overlay on the terrain.

4. **reconcileWaypointChange** — update focus targets from new waypoint. Apply waypoint's perspectiveId if present (optional — not all waypoints require a perspective switch). Update viewport.

5. **reconcileRoutePause** — set routeState to paused. Snapshot is saved by Context Machine, not reconciler. Temporary local selections and viewport changes during pause are allowed but do not mutate the route-owned focus snapshot.

6. **reconcileRouteResume** — restore focus/perspective/viewport from saved snapshot, set routeState active, discard temporary exploration state from canonical route state.

7. **reconcileRouteEnd** — clear route state, preserve domain/capability/perspective.

### Backward compatibility
- New NavigationContext fields use `.default()` so existing Zod parsing still works
- Existing reconciler functions use `{ ...ctx }` spread — new fields pass through untouched
- `createInitialNavigationContext()` updated to include new defaults

### Tests
- 7 new reconciler scenario tests (extend `tests/context/reconciler.test.ts`)
- ValueStream switch capability preservation/clearing rule tested explicitly
- Verify existing reconciler tests still pass with expanded NavigationContext

### Done when
- NavigationContext includes new fields
- 7 new reconciler functions tested
- ValueStream ambiguity rule verified
- All original tests still pass

---

## Phase 4: StoryRoute Machine + Context Machine Expansion

### Goal
Add StoryRoute XState machine. Expand Context Machine with 12 new events and pause/resume snapshot support.

### StoryRoute Machine (`src/machines/story-route.machine.ts`)
- States: `inactive` → `active` → `paused` → `active` (resume) → `completed`
- Events: START_ROUTE, NEXT_WAYPOINT, PREVIOUS_WAYPOINT, JUMP_TO_WAYPOINT, PAUSE_ROUTE, RESUME_ROUTE, END_ROUTE
- Guards: canAdvance, canGoBack, isValidWaypointIndex

### Context Machine expansion (`src/context/context.machine.ts`)

**ContextMachineContext gains:**
- providers, providerAssociations, valueStreams, processes, processStages, storyRoutes, storyWaypoints (all defaulting to [])
- pausedRouteSnapshot: NavigationContext | null (for pause/resume)

**ContextMachineEvent gains (all optional in INITIALIZE for backward compat):**
- SELECT_VALUE_STREAM, CLEAR_VALUE_STREAM
- SELECT_PROCESS, CLEAR_PROCESS
- START_ROUTE, NEXT_WAYPOINT, PREVIOUS_WAYPOINT, JUMP_TO_WAYPOINT
- PAUSE_ROUTE, RESUME_ROUTE, END_ROUTE

**INITIALIZE backward compatibility:**
- New fields are optional (`providers?: Provider[]`)
- Handler uses `event.providers ?? []` pattern
- All existing INITIALIZE calls work without changes

**Pause/resume design:**
- PAUSE_ROUTE snapshots `context.nav` into `pausedRouteSnapshot`, then calls `reconcileRoutePause`
- RESUME_ROUTE calls `reconcileRouteResume` with saved snapshot, then clears `pausedRouteSnapshot`
- Reconciler stays pure — snapshot storage is Context Machine's concern
- One active paused route at a time. No nested detours or route branching.

### Tests
- StoryRoute machine tests (`tests/machines/story-route.test.ts`)
- Context Machine expansion tests (extend `tests/context/context-machine.test.ts`)
- INITIALIZE backward compat verified by existing tests passing
- Pause/resume cycle verified
- Emphasis: all original 175 tests continue passing, each new concept gets direct coverage

### Done when
- StoryRoute machine tests pass
- Context Machine handles all new events
- INITIALIZE backward compat confirmed
- All original tests still pass

---

## Phase 5: Integration Tests

### Goal
End-to-end scenarios exercising multiple systems together. Focus on behavioral coverage, not test count.

### Story Route Walkthrough (`tests/integration/story-route-walkthrough.test.ts`)
1. Initialize with all data including providers, story routes, waypoints
2. START_ROUTE "How a Payment Flows"
3. Walk through all waypoints with NEXT_WAYPOINT — verify focus targets, perspective, viewport at each
4. PAUSE_ROUTE mid-route
5. Freely explore (SELECT_DOMAIN, SELECT_NODE, SWITCH_PERSPECTIVE)
6. Verify: temporary exploration does not mutate route-owned focus snapshot
7. RESUME_ROUTE — verify original waypoint state restored exactly
8. Walk to end, verify END_ROUTE returns to clean state
9. Verify domain/capability context preserved after route ends

### Provider in Context (`tests/integration/provider-in-context.test.ts`)
1. Initialize with providers and associations
2. Select domain "Payments" → capability "Payment Processing"
3. Verify `getProvidersForCapability` returns Visa and Mastercard
4. Select value stream "Retail Payments"
5. Verify `getProvidersForValueStream` returns correct providers
6. Verify `getProcessesForCapability` returns the payment authorization process
7. Switch perspective — associations persist (data, not view-dependent)

### Done when
- Both integration tests pass
- Full test suite passes (all original 175 + all new tests)
- `pnpm build && pnpm check && pnpm test` all clean

---

## Sequencing

```
Phase 1 (entities, VERSION) → Phase 2 (graph, seed data) → Phase 3 (nav context, reconciler) → Phase 4 (machines) → Phase 5 (integration)
```

Each phase is independently buildable and testable. Verify with `pnpm build && pnpm test` after each.

---

## Backward Compatibility Checklist

| Area | Strategy | Risk |
|------|----------|------|
| NavigationContext | New fields with `.default()` | Low — Zod fills defaults |
| INITIALIZE event | New fields optional, `?? []` fallback | Low — existing calls unchanged |
| FocusTargetType | Enum extended additively | None — existing values valid |
| Reconciler functions | New functions added, existing unchanged | None — `{...ctx}` spread preserves new fields |
| Graph functions | New functions added alongside existing | None — additive |
| Seed data | Extended, not replaced | Low — new arrays added after existing |
| Tests | All 175 must pass unchanged | Verified per phase |

---

## Verification

After all phases:
1. `pnpm install` — dependencies resolve
2. `pnpm check` — Biome passes
3. `pnpm build` — tsc emits clean ESM
4. `pnpm test` — all tests pass (original 175 + new)
5. All 175 original tests pass without modification
7. Each new concept has direct behavioral coverage
8. Integration tests prove additive behavior (story route lifecycle, provider visibility)
