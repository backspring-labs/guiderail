# Viewscape MVP Implementation Plan

## Context

Viewscape is the terrain discovery UI for a business architecture navigator. It consumes `viewscape-core` (already built, 175 tests passing) as a headless kernel and renders it as an interactive map with domain/capability navigation and perspective switching.

**MVP proof statement:** The MVP proves that a user can navigate Domain → Capability → Journey while switching Perspectives on a live terrain canvas without losing context.

No backend, no API — static seed data from viewscape-core's banking dataset (3 domains, 6 capabilities, 10 nodes, 11 edges, 5 perspectives).

**Canonical MVP perspective list:**
- Overview
- Architecture
- Provider
- Process
- Journey

Repo: `/Users/jladd/Code/viewscape/` (empty, git init only). Consumes viewscape-core from `../viewscape-core` via local link.

---

## MVP Stack

| Concern | Choice |
|---------|--------|
| Shell | Vite + React + TypeScript |
| Canvas | React Flow / @xyflow/react v12 |
| Kernel state | @xstate/react → viewscape-core Context Machine |
| UI state | Zustand |
| Schemas | Zod (via viewscape-core) |
| Component dev | Storybook (Phase 4) |
| Formatting/linting | Biome |
| Testing | Vitest |

---

## Project Structure

```
viewscape/
├── .editorconfig
├── .gitignore
├── biome.json
├── CLAUDE.md
├── index.html
├── lefthook.yml
├── LICENSE
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles/
    │   ├── index.css
    │   ├── variables.css
    │   └── react-flow.css
    ├── hooks/
    │   ├── use-context-machine.ts
    │   └── use-perspective-provider.ts
    ├── store/
    │   ├── ui-store.ts
    │   └── seed-loader.ts
    ├── components/
    │   ├── layout/
    │   │   ├── AppShell.tsx
    │   │   ├── TopBar.tsx
    │   │   ├── LeftPanel.tsx
    │   │   └── RightPanel.tsx
    │   ├── canvas/
    │   │   ├── TerrainCanvas.tsx
    │   │   ├── nodes/
    │   │   │   ├── ActorNode.tsx
    │   │   │   ├── ServiceNode.tsx
    │   │   │   ├── SystemNode.tsx
    │   │   │   ├── ScreenNode.tsx
    │   │   │   └── node-types.ts
    │   │   └── edges/
    │   │       ├── TerrainEdge.tsx
    │   │       └── edge-types.ts
    │   ├── navigation/
    │   │   ├── DomainCapabilityBrowser.tsx
    │   │   ├── DomainItem.tsx
    │   │   ├── CapabilityItem.tsx
    │   │   ├── PerspectiveSwitcher.tsx
    │   │   └── Breadcrumb.tsx
    │   └── detail/
    │       ├── NodeDetailPanel.tsx
    │       ├── CapabilityDetailPanel.tsx
    │       ├── DomainDetailPanel.tsx
    │       ├── EdgeDetailPanel.tsx
    │       └── DetailPanelRouter.tsx
    └── lib/
        ├── projection.ts
        └── react-flow-adapter.ts
```

---

## Phase 1: Project Scaffolding + Canvas

### Goal
Vite + React + TypeScript app renders all 10 banking seed nodes and 11 edges on a React Flow canvas with pan/zoom and distinct visual types for each node kind. No navigation logic yet — just the static map.

### What to build

**Project scaffolding:**
- `package.json` — Vite React+TS, dependencies: `react`, `react-dom`, `@xyflow/react`, `xstate`, `@xstate/react`, `zustand`, `viewscape-core` (via `link:../viewscape-core`). Dev: `@biomejs/biome`, `typescript`, `vitest`, `@vitejs/plugin-react`, `lefthook`, `@types/react`, `@types/react-dom`, `jsdom`
- `tsconfig.json` — strict, `noUncheckedIndexedAccess`, `jsx: react-jsx`, `moduleResolution: Bundler`, `@/*` path alias, `@seed/*` path alias to `../viewscape-core/src/test-fixtures/*`
- `vite.config.ts`, `vitest.config.ts`, `biome.json`, `.editorconfig`, `lefthook.yml`, `.gitignore`
- `CLAUDE.md` — project conventions, commands, design rules
- `LICENSE` — MIT, 2026, Jason Ladd / Backspring Industries
- `index.html` — Vite entry

**Data bridge:**
- `vite.config.ts` adds a `@seed` path alias pointing to `../viewscape-core/src/test-fixtures` — this lets seed imports resolve directly from the viewscape-core source tree without requiring test-fixtures to be in the published build output
- `src/store/seed-loader.ts` — imports seed data via `@seed/seed-banking.js`, calls `createGraph` once, exports all seed data as module-level constants. **This is a temporary development data bridge.** It imports directly from viewscape-core source because test-fixtures are excluded from viewscape-core's build output (intentionally — they are test/demo data, not part of the published package). When a real ContentRepoAdapter is built, seed-loader.ts is replaced entirely and the `@seed` alias is removed.
- `src/lib/react-flow-adapter.ts` — two pure functions:
  - `toReactFlowNodes(nodes, perspectiveId, visibleNodeIds?, selectedNodeId?)` — maps kernel Nodes to React Flow nodes using `layoutByPerspective` positions, sets `type` field to match custom node component
  - `toReactFlowEdges(edges, visibleEdgeIds?, selectedEdgeId?)` — maps kernel Edges to React Flow edges

**Canvas components:**
- `src/components/canvas/TerrainCanvas.tsx` — React Flow canvas with pan/zoom, registers custom node/edge types
- Custom nodes: `ActorNode.tsx` (rounded/person), `ServiceNode.tsx` (rounded rect/gear), `SystemNode.tsx` (rect/database), `ScreenNode.tsx` (rounded rect/monitor) — each with distinct color from CSS variables
- Custom edge: `TerrainEdge.tsx` — bezier path, label from data, style varies by type (dashed for dependency, solid for service_call)
- `node-types.ts`, `edge-types.ts` — type registration objects

**Styles:**
- `src/styles/index.css` — global reset, full-height, React Flow base CSS import
- `src/styles/variables.css` — CSS custom properties for node type colors, selection/highlight/dimmed states

**App entry:**
- `src/main.tsx` — renders App into #root
- `src/App.tsx` — simple wrapper rendering TerrainCanvas with seed data (becomes AppShell in Phase 2)

### Explicit anti-scope for Phase 1
- No Context Machine wiring
- No domain/capability filtering
- No detail panels
- No journey activation
- No panel state (Zustand)
- No breadcrumb logic
- No perspective switching

### Done when
- `pnpm dev` shows all 10 nodes positioned per `persp-overview` layout with 11 labeled edges
- Each node type has distinct shape and color
- Pan and zoom work
- `pnpm build` and `pnpm check` pass clean

---

## Phase 2: Navigation Integration

### Goal
Wire the Context Machine as single navigation authority. Left panel shows domain/capability tree. Clicking filters the canvas. Perspective switcher re-positions nodes. Node clicks update selection state.

### What to build

**Core hooks:**
- `src/hooks/use-context-machine.ts` — wraps `useActorRef` from `@xstate/react` with viewscape-core's `contextMachine`. Sends `INITIALIZE` on mount with seed data. Provides actor ref via React context. Single instantiation point.
- `src/hooks/use-perspective-provider.ts` — implements `PerspectiveProvider` contract. Takes nav + graph, returns `PerspectiveView`. Filters nodes by domain/capability, sets visibility/highlight/selection states. Uses `useMemo`.

**Projection logic:**
- `src/lib/projection.ts` — pure functions:
  - `getVisibleNodeIds(nav, graph, domains, capabilities)` — determines visible nodes from domain/capability selection
  - `getVisibleEdgeIds(graph, visibleNodeIds)` — edges where both endpoints visible
  - `projectNodes(graph, nav, visibleNodeIds)` — builds ProjectedNode array
  - `projectEdges(graph, nav, visibleEdgeIds)` — builds ProjectedEdge array

**UI state:**
- `src/store/ui-store.ts` — Zustand store: `leftPanelOpen`, `rightPanelOpen`, panel widths, toggle actions

**Layout:**
- `src/components/layout/AppShell.tsx` — CSS Grid layout: top bar, left panel (collapsible), center canvas (flex), right panel (collapsible). Instantiates Context Machine.
- `TopBar.tsx` — app title, PerspectiveSwitcher, mode indicator
- `LeftPanel.tsx` — collapsible, contains DomainCapabilityBrowser
- `RightPanel.tsx` — collapsible, placeholder for Phase 3

**Navigation components:**
- `PerspectiveSwitcher.tsx` — horizontal tabs for 5 perspectives. Click sends `SWITCH_PERSPECTIVE`.
- `DomainCapabilityBrowser.tsx` — collapsible tree showing domains with nested capabilities. Active items highlighted. Click sends `SELECT_DOMAIN` / `SELECT_CAPABILITY`. Clear button sends `CLEAR_DOMAIN`.
- `DomainItem.tsx` — domain row with expand/collapse
- `CapabilityItem.tsx` — capability row with node count badge
- `Breadcrumb.tsx` — "All Domains > Accounts > Account Opening", each segment clickable

**Canvas updates:**
- TerrainCanvas now consumes projected data from `use-perspective-provider`
- `onNodeClick` sends `SELECT_NODE`, `onEdgeClick` sends `SELECT_EDGE`
- Non-matching nodes dimmed (20% opacity) rather than hidden — preserves spatial context
- Node positions animate on perspective switch via React Flow transitions

### Done when
- Left panel shows 3 domains → 6 capabilities tree
- Clicking "Accounts" dims non-Accounts nodes, emphasizes Accounts nodes
- Clicking "Account Opening" further filters to its 4 nodes
- Clear button restores all nodes
- Perspective tabs re-position nodes (Overview → Architecture → Provider → Process → Journey)
- Clicking a node highlights it (selected state)
- Breadcrumb shows current Domain > Capability path
- Perspective switch preserves domain/capability selection (kernel guarantee)

---

## Phase 3: Detail Panels + Polish

### Goal
Right panel shows context-sensitive detail for selected entities. Journey selection works. Visual polish with minimap, controls, background grid.

### What to build

**Detail panels:**
- `DetailPanelRouter.tsx` — reads nav state, renders appropriate panel. Priority: selected node > selected edge > active capability > active domain > empty
- `NodeDetailPanel.tsx` — label, type, description, tags, connected edges/neighbors (clickable), annotations, evidence refs, which capabilities reference this node
- `EdgeDetailPanel.tsx` — label, type, source/target names (clickable), direction
- `CapabilityDetailPanel.tsx` — label, description, tags, referenced nodes (clickable), available journeys (clickable → sends `SELECT_JOURNEY`)
- `DomainDetailPanel.tsx` — label, description, capabilities list (clickable)

**Navigation updates:**
- Breadcrumb adds journey segment: "Accounts > Account Opening > Open Savings Account (Step 3/6)"
- Journey selection: clicking journey in capability detail sends `SELECT_JOURNEY`, highlights focus targets on canvas

**Canvas polish:**
- Add `<MiniMap />`, `<Controls />`, `<Background />` from @xyflow/react
- Animated dash styling on edges in active journey path
- Node tooltips on hover showing description
- Refined node dimensions (min 160px wide, 60px tall), subtle shadows, type icons

**Stretch: Journey step controls**
- Back/forward buttons sending `STEP_BACKWARD`/`STEP_FORWARD`
- Step title and narrative display in right panel

### Done when
- Clicking a node shows detail in right panel (description, tags, connections, annotations)
- Clicking an edge shows edge detail
- Selecting a capability shows its detail with available journeys
- Clicking "Open Savings Account" activates journey, highlights step 1 focus targets
- Minimap, controls, background grid visible
- Consistent spacing, typography, smooth transitions

---

## Phase 4: Storybook + Testing

### Goal
Component isolation via Storybook, unit tests for critical adapters and hooks.

### What to build

**Storybook:**
- `.storybook/main.ts` + `preview.ts` — Storybook 8 with `@storybook/react-vite`
- Stories for: ActorNode, ServiceNode, SystemNode, ScreenNode (4 states each: default, selected, highlighted, dimmed)
- Stories for: TerrainEdge, PerspectiveSwitcher, DomainCapabilityBrowser, NodeDetailPanel

**Tests:**
- `src/lib/react-flow-adapter.test.ts` — maps positions from layoutByPerspective, sets correct node types, handles missing positions
- `src/lib/projection.test.ts` — visibility filtering by domain/capability, edge endpoint filtering, selection/highlight state
- `src/hooks/use-context-machine.test.ts` — machine lifecycle, domain/capability/perspective events
- `src/store/ui-store.test.ts` — panel toggle, initial state

### Done when
- `pnpm storybook` shows all stories with visual states
- `pnpm test` passes all unit tests
- 80%+ coverage on `lib/` directory

---

## Key Architectural Decisions

1. **Context Machine as single authority** — instantiated once in `use-context-machine.ts`. All nav state reads from `snapshot.context.nav`. All mutations via `send(event)`. No local React state duplicates navigation.

2. **Zustand for UI-only state** — panel widths, collapse states, animation flags. No kernel significance.

3. **Two-step projection pipeline:**
   - `projection.ts` speaks kernel types (Node, Edge, NavigationContext) → `PerspectiveView`
   - `react-flow-adapter.ts` speaks React Flow types (ReactFlowNode, ReactFlowEdge)
   - Clean separation: kernel concerns vs. rendering concerns

4. **Seed data loaded statically via source import** — `seed-loader.ts` imports from viewscape-core's source tree via a `@seed` path alias (resolves to `../viewscape-core/src/test-fixtures`). This works because the repos sit side-by-side and Vite can bundle from source. Test-fixtures are intentionally excluded from viewscape-core's published build output — they are test/demo data, not a published API. `createGraph` is called once; all data is module-level constants. No async. **Note:** `seed-loader.ts` is a temporary development data bridge and must not become the long-term content loading contract. When a real ContentRepoAdapter is built, seed-loader.ts is replaced and the `@seed` alias is removed.

5. **Dimming vs hiding** — non-matching nodes dimmed (20% opacity) rather than hidden. Dimming preserves spatial context while still expressing domain/capability focus.

6. **Projection must not become a second kernel** — Viewscape may derive renderable visibility and highlight state from kernel state, but must not redefine navigation semantics already owned by viewscape-core. The projection layer answers "what should be rendered and how?" — never "what is the user's current navigation state?"

7. **Zustand must not store navigation state** — Zustand must not store or derive canonical navigation state such as active domain, active capability, active journey, active perspective, selected node, or selected edge. Those belong exclusively to the Context Machine.

8. **React Flow is render-only** — React Flow node and edge types are delivery structures for rendering only and must not become the source of truth for terrain semantics.

9. **Viewscape is not GuideRail** — Viewscape MVP supports journey activation and contextual highlighting, but not full guided traversal as a primary interaction mode. Journey selection shows focus targets and highlights the path; it does not drive a turn-by-turn narration experience.

---

## Right Panel Routing Rule

The right panel displays context-sensitive detail based on navigation state. This is an intentional interaction rule, not just implementation detail:

1. Selected node → NodeDetailPanel
2. Selected edge → EdgeDetailPanel
3. Active capability (no selection) → CapabilityDetailPanel
4. Active domain (no capability) → DomainDetailPanel
5. Nothing selected/active → empty state

This priority order is binding. The panel always shows the most specific available context.

---

## Design Tensions / Watchpoints

These are the architectural risks to monitor during implementation:

- **Do not duplicate navigation truth** between Context Machine and Zustand. If you find yourself storing `activeDomainId` in Zustand "for convenience," stop.
- **Do not let projection.ts become a second kernel.** It derives renderable state. It does not decide navigation semantics.
- **Do not let journey support turn Viewscape into GuideRail.** Journey activation shows focus targets and path highlights. It does not drive step-by-step narration.
- **Do not overfit the UI to the banking seed dataset.** Component names, layout logic, and panel content should work with any domain/capability/node dataset, not just the 10-node banking seed.
- **Keep React Flow adaptation render-only.** The adapter translates kernel projections into React Flow's data format. It never computes navigation state.
- **Keep detail panels presentational, not state-owning.** Detail panels read from the Context Machine and display. They do not maintain independent state about what is selected or active.

---

## Hero Path Walkthrough

The named test walkthrough for MVP validation:

**"Banking Account Opening — Full Navigation"**

1. App loads → all 10 nodes visible on Overview perspective
2. Select domain "Accounts" → non-Accounts nodes dim
3. Select capability "Account Opening" → further filtering to Account Opening nodes
4. Switch to Architecture perspective → nodes re-position, domain/capability preserved
5. Select node "Account Service" → node highlights, detail panel shows description/connections
6. Inspect detail → verify annotations, connected edges, capabilities listed
7. Activate journey "Open Savings Account" from capability detail → focus targets highlight on canvas
8. Switch to Process perspective → journey context preserved, nodes re-positioned
9. Confirm context preserved → domain still "Accounts", capability still "Account Opening", journey still active

If this walkthrough works end-to-end, the MVP proof statement is satisfied.

---

## Post-MVP Deferrals

| Feature | Rationale | When to add |
|---------|-----------|-------------|
| **Next.js App Router** | No backend in MVP. Vite is lighter for static client-side. | When FastAPI backend is added and SSR/API routes are needed |
| **ELK.js auto-layout** | MVP uses pre-computed `layoutByPerspective` positions. | When loading arbitrary datasets without hand-authored positions |
| **TanStack Query** | No server state to manage. | When FastAPI endpoints exist |
| **bpmn-js** | BPMN process diagrams need Process perspective data in BPMN format. | When process-diagram views are built out |
| **Tiptap** | Rich text annotations need an editing mode. MVP is read-only. | When annotation authoring is added |
| **Playwright e2e** | Vitest + Storybook provide sufficient MVP coverage. | When multi-step user flows need regression testing |
| **FastAPI backend** | MVP is static. | When persistence, multi-user, and external data ingestion are needed |
| **PostgreSQL** | No persistence in MVP. | With backend |
| **Full fintech landscape** | MVP uses simpler banking seed (10 nodes). | After navigation model is proven at small scale |
| **GuideRail mode** | Mode switcher exists in kernel but guided traversal UX (street-view, step narration) is deferred. | Separate product surface, possibly separate repo |
| **Search** | Top bar placeholder only. | Post-MVP, fuzzy matching over nodes/capabilities/journeys |
| **Keyboard shortcuts** | Arrow key navigation, Escape to deselect. | After core mouse interactions are solid |
| **OpenTelemetry** | Instrumentation for observability. | When there are real users and a backend to observe |

---

## Sequencing

```
Phase 1 (scaffolding + canvas) → Phase 2 (navigation) → Phase 3 (detail + polish)
                                                              ↑
                                          Phase 4 (storybook + tests) can overlap
```

- Phase 1 is fully independent
- Phase 2 depends on Phase 1
- Phase 3 depends on Phase 2
- Phase 4 can begin in parallel with Phase 3

---

## Verification

After all phases:
1. `pnpm dev` — app loads, canvas renders banking terrain
2. `pnpm build` — production build succeeds
3. `pnpm check` — Biome passes
4. `pnpm test` — all tests pass
5. `pnpm storybook` — stories render
6. Manual walkthrough: select domain → capability → switch perspective → select node → view detail → select journey → verify context preservation at every step

---

## Critical viewscape-core integration points

- `/Users/jladd/Code/viewscape-core/src/context/context.machine.ts` — Context Machine events and state shape
- `/Users/jladd/Code/viewscape-core/src/perspective/contracts.ts` — PerspectiveProvider/ProjectedNode/ProjectedEdge contracts
- `/Users/jladd/Code/viewscape-core/src/test-fixtures/seed-banking.ts` — seed dataset with layoutByPerspective positions
- `/Users/jladd/Code/viewscape-core/src/graph/graph.ts` — TerrainGraph interface and query functions
- `/Users/jladd/Code/viewscape-core/src/context/reconciler.ts` — reconciliation rules the projection layer must mirror for visibility
