# Viewscape 0.2.0 Implementation Plan

## Context

Viewscape MVP (0.1.0) is shipped with 27 tests. viewscape-core 0.2.0 is built with 252 tests, adding Provider, ValueStream, Process, StoryRoute, and related entities, machines, and reconciler functions.

This plan updates the Viewscape UI to consume viewscape-core 0.2.0 and deliver the V3 PRD features: provider-aware terrain, process-aware understanding, and Story Routes with pause/return.

### V3 proof statement
Viewscape 0.2.0 proves that a user can:
1. Start from provider-aware business architecture terrain
2. Drill into Domain and Capability context
3. Distinguish Journey from Process in the same terrain
4. Follow a Story Route with destination and waypoints
5. Pause for discussion, briefly explore, and return to the route without losing orientation

### Design decisions
- **Providers on canvas**: Badge/chip on existing nodes (no new node type). Badge-on-node is the 0.2.0 default provider visualization; it does not preclude richer provider-specific views in later versions.
- **Story Route controls**: Bottom bar overlay (slides up when active)
- **Navigation tree**: The left navigation tree remains Domain → Capability by design, to preserve navigational clarity. Value Streams, Processes, Providers, and Story Routes are contextual surfaces, not primary tree taxonomy in 0.2.0.

### Kernel vs UI authority rule
The Context Machine remains the single source of truth for route, process, value stream, and navigation state. The UI may derive renderable presentation state from kernel state, but must not recreate or reinterpret kernel navigation semantics. This applies especially to: StoryRouteBar, DetailPanelRouter, projection.ts, and react-flow-adapter.ts.

---

## Phase 1: Seed Data + Initialization Expansion

### Goal
Load all 0.2.0 entities into the Context Machine. Zero visual changes.

### Explicit anti-scope for Phase 1
- No provider badges
- No new right-panel content
- No route bar
- No process/value stream visual behavior
- No routing priority changes

### Files to modify
- `src/store/seed-loader.ts` — add imports/exports for providers, providerAssociations, valueStreams, processes, processStages, storyRoutes, storyWaypoints
- `src/hooks/use-context-machine.ts` — pass new entities to INITIALIZE event

### Done when
- App boots without errors
- `pnpm build && pnpm test` passes
- Context Machine snapshot includes new entity arrays

---

## Phase 2: Provider Badges on Canvas Nodes

### Goal
Nodes with provider associations display small colored badge chips beneath their label.

### Badge rendering rules
- Provider badges visualize contextual participation, not exclusive ownership of a node
- Render at most 2 visible badges by default
- If additional providers exist, show a compact overflow indicator (e.g., "+2")
- Badges must not increase node height indefinitely

### Files to modify
- `src/lib/react-flow-adapter.ts` — add `providerBadges` to TerrainNodeData, look up associations per node
- `src/hooks/use-perspective-provider.ts` — pass providers and associations to adapter
- `src/components/canvas/nodes/*.tsx` — all 4 node types render badge chips from `data.providerBadges`
- `src/styles/react-flow.css` — badge styling (`.terrain-node__badges`, `.terrain-node__badge`, overflow indicator)
- `src/styles/variables.css` — provider category colors (scheme, rail, wallet)

### Design note
Badge rendering is identical across all 4 node types. Inline for now; extract shared `ProviderBadges` component in Phase 5 polish if warranted.

### Done when
- Payment Rail shows "Visa" badge
- Mobile Banking App shows "Apple Pay" badge
- Nodes without associations show no badges
- All existing tests pass

---

## Phase 3: Extended Detail Panels

### Goal
Right panel shows provider, value stream, and process information with updated routing priority.

### Right panel routing priority (with rationale)
1. **Selected node** — direct selection is the strongest user intent
2. **Selected edge** — direct selection
3. **Active process** — focused operational context
4. **Active capability** — focused business context
5. **Active value stream** — broader value context
6. **Active domain** — broadest context default
7. **Empty state**

The right panel is a contextual detail surface, not a second route playback engine. Route playback lives in the bottom bar.

### Process highlighting rule (v1 simplification)
When a process is active, highlight nodes associated with the process's stages and dim unrelated nodes while preserving spatial context. Do not attempt full stage-by-stage animation or execution playback in 0.2.0.

### Breadcrumb rule
Breadcrumb exposes current context and light route state, but does not become the primary interaction surface for route playback or detail inspection.

### Files to create
- `src/components/detail/ProcessDetailPanel.tsx` — process label, description, stages in sequence with nodes and control points
- `src/components/detail/ValueStreamDetailPanel.tsx` — value stream label, description, linked capabilities, associated providers

### Files to modify
- `src/components/detail/CapabilityDetailPanel.tsx` — add Providers, Value Streams, Processes, Story Routes sections
- `src/components/detail/NodeDetailPanel.tsx` — add Providers section
- `src/components/detail/DetailPanelRouter.tsx` — updated priority cascade (see above)
- `src/components/layout/RightPanel.tsx` — pass new callbacks
- `src/components/layout/AppShell.tsx` — wire SELECT_VALUE_STREAM, CLEAR_VALUE_STREAM, SELECT_PROCESS, CLEAR_PROCESS, START_ROUTE events; extend auto-open useEffect for activeProcessId and activeValueStreamId
- `src/components/navigation/Breadcrumb.tsx` — add value stream, process, and story route segments
- `src/lib/projection.ts` — add process stage node highlighting (v1: highlight all stage nodes, not stage-by-stage)
- `src/styles/detail.css` — badge styles for provider/value-stream/process types, stage cards, control point pills

### Done when
- Capability detail shows Providers, Value Streams, Processes sections
- Clicking a process opens ProcessDetailPanel with 4 stages and highlights stage nodes
- Clicking a value stream opens ValueStreamDetailPanel
- Node detail shows provider associations
- Breadcrumb shows value stream and process when active
- Right panel routing cascade works with updated priority

---

## Phase 4: Story Route Bar + Route Controls

### Goal
Bottom overlay bar for Story Route playback: start, navigate waypoints, pause, resume, end.

### Explicit anti-scope for Phase 4
- No route authoring
- No route branching
- No nested detours
- No multi-route queue
- No audience-mode switching
- No presenter notes system

### Story Route Bar role
StoryRouteBar is the transport and route context surface. It presents the current waypoint message, but does not replace the detail panel as the home for deeper evidence, provider, or process detail.

### Waypoint 0 behavior
Waypoint 0 is a route-intro state that emphasizes destination objective and route framing before normal waypoint progression begins. It is intentionally treated as a special introduction, not merely "first normal waypoint."

### Pause/resume rule
Paused exploration may change temporary selection and viewport, but must not alter canonical route progress or waypoint ownership. The kernel manages the snapshot; the UI reflects the state.

### Files to create
- `src/components/route/StoryRouteBar.tsx` — bottom overlay with route title, waypoint progress, key message, whyItMatters, transport controls (prev/next/pause/resume/end)
- `src/styles/story-route.css` — bar styling, transport buttons, paused state, slide-up animation

### Files to modify
- `src/components/layout/AppShell.tsx` — render StoryRouteBar, derive current route/waypoint from nav state, wire route events
- `src/components/detail/CapabilityDetailPanel.tsx` — wire "Start Route" button to send START_ROUTE
- `src/components/navigation/Breadcrumb.tsx` — add route state indicator (active green dot, paused amber dot)
- `src/styles/variables.css` — route colors (active green, paused amber), bar height
- `src/styles/layout.css` — breadcrumb route segment styling
- `src/styles/index.css` — import story-route.css

### Story Route Bar states
- **Inactive**: renders nothing
- **Active**: route title, "Waypoint N/M", keyMessage, whyItMatters, Previous/Next/Pause/End controls
- **Paused**: "Paused" badge, route title, "Return to Route" button, End Route
- **Waypoint 0**: Previous disabled, destination objective shown prominently (route-intro state)
- **Last waypoint**: Next disabled
- Perspective switches happen automatically via kernel when waypoints specify `perspectiveId`

### Done when
- Start route from capability detail → bottom bar appears
- Next/Previous navigate waypoints with canvas focus changes
- Pause/Resume cycle works correctly — resume restores exact prior waypoint
- End Route dismisses bar, preserves domain/capability
- Full PRD proof statement walkthrough succeeds

---

## Phase 5: Tests + Polish

### Goal
Test coverage for new functionality, version bump, cleanup.

### Tests to add
- `src/lib/react-flow-adapter.test.ts` — provider badges: populated for associated nodes, empty for unassociated, backward compat without providers, overflow capped at 2
- `src/lib/projection.test.ts` — process stage highlighting returns correct node IDs
- `src/components/route/StoryRouteBar.test.tsx` — inactive/active/paused renders, button handlers, prev/next disabled at boundaries

### Named proof checks
- Provider badges render on associated nodes only
- Selecting a process opens ProcessDetailPanel and highlights process-linked nodes
- Starting a route creates visible route state in the bar and breadcrumb
- Pausing and resuming restores the exact prior waypoint
- Completing the route preserves domain/capability context and dismisses route UI

### Polish
- `package.json` — bump to 0.2.0
- `CLAUDE.md` — update routing rule, document StoryRouteBar, provider badges, kernel-vs-UI authority
- Optional: extract shared `ProviderBadges` component
- `pnpm check:fix`

### Done when
- All tests pass (35+)
- `pnpm check && pnpm build && pnpm test` clean
- Version is 0.2.0
- All 5 named proof checks verified

---

## Design Tensions / Watchpoints

- **Provider badges must not overwhelm nodes** — max 2 visible + overflow indicator; badges visualize participation, not ownership
- **Story Route bar must not steal canvas space** — overlay positioning, not layout displacement
- **Route pause/resume is kernel logic** — UI reflects state; paused exploration must not alter canonical route progress
- **Right panel is a contextual detail surface, not a second route playback engine** — route control lives in the bottom bar
- **Detail panel routing priority must feel intentional** — node/edge (direct selection) > process/capability (focused context) > value stream/domain (broad context)
- **Perspective switches during route** — waypoints sw-1, sw-2, sw-4 specify perspectiveId; verify canvas re-renders correctly
- **Right panel auto-open** — extend useEffect for activeProcessId and activeValueStreamId
- **Left panel stays simple by design** — Domain → Capability only; value streams, processes, providers are contextual surfaces, not tree taxonomy
- **Breadcrumb is orientation, not control** — expose context and light route state, not dense interaction
- **StoryRouteBar presents messages, does not replace detail panel** — deeper evidence/provider/process detail stays in the right panel
- **Badge-on-node is the 0.2.0 default** — does not preclude richer provider views later

---

## Hero Path Walkthrough

**"Payment Flow — Full V3 Proof"**

1. App loads → all nodes visible with provider badges on relevant nodes
2. Select domain "Payments" → nodes dim appropriately
3. Select capability "Payment Processing" → right panel shows Providers (Visa, Mastercard), Processes, Story Routes
4. Click "Payment Authorization" process → ProcessDetailPanel shows 4 stages, stage nodes highlight
5. Go back to capability, click "Start Route" on "How a Payment Flows"
6. Bottom bar appears → waypoint 0 route-intro with destination objective
7. Next → waypoint 1, perspective switches to Architecture
8. Next → waypoint 2, provider focus target (Visa) highlighted
9. Pause → bar shows paused state, explore freely (click nodes, switch perspective)
10. Resume → restores to waypoint 2 exactly
11. Complete route → bar dismisses, domain/capability preserved

---

## Sequencing

```
Phase 1 (seed data) → Phase 2 (badges) → Phase 3 (panels) → Phase 4 (route bar) → Phase 5 (tests)
```

Phase 2 and Phase 3 are mostly independent but Phase 3 must precede Phase 4 (route launcher in CapabilityDetailPanel).

---

## Verification

After all phases:
1. `pnpm check` — Biome passes
2. `pnpm build` — production build succeeds
3. `pnpm test` — all tests pass (35+)
4. All 5 named proof checks verified
5. Hero path walkthrough succeeds
6. All 5 V3 proof statement points satisfied
