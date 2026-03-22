# GuideRail 0.3.0 Implementation Plan

## Context

GuideRail 0.2.0 is shipped as a monorepo with 291 tests. The navigation model, provider badges, detail panels, and guided route bar are all working — but with only 10 nodes of banking seed data. The product proves the mechanics but not the scale.

GuideRail 0.3.0 is the first release that proves the product can operate at meaningful industry scale. It should show that the navigation model remains understandable when the terrain expands beyond a tiny seed into a broader fintech landscape, and that users can still orient, search, and follow guided routes across a denser map.

### 0.3.0 proof statement
GuideRail 0.3.0 proves that users can search, navigate, and follow guided routes across a substantially larger fintech landscape while preserving clarity, spatial orientation, and route coherence.

### What 0.3.0 adds
- Docs consolidation (ideas, PRDs, plans into `docs/`)
- Expanded fintech landscape seed data (9 domains, ~15 capabilities, 40-60 nodes, ~20 providers)
- ELK.js auto-layout for computed perspectives
- Search (command-palette style fuzzy matching)
- Richer Process perspective with directional flow layout
- 2-3 guided routes across the expanded landscape

### Perspective bar in 0.3.0
Remove **Provider** from the perspective bar — providers are contextual content (badges, detail panels, associations), not a spatial view mode. Removing Provider from the bar does not demote providers in the model. It clarifies that providers are contextual participants in the terrain, not a primary spatial view mode.

The 0.3.0 bar is: **Overview, Architecture, Process, Journey** — 4 tabs, each with a meaningfully different ELK layout.

### What 0.3.0 explicitly defers
- Backend / persistence (still static seed data)
- Author Mode (content expanded by editing seed files)
- Roadmap/Initiative modeling
- Evidence Mode as a dedicated mode
- bpmn-js, Tiptap, Playwright, Next.js, TanStack Query
- OpenTelemetry

### Targeted for 0.4.0
- **Activity perspective** — flowchart with decision points and branches. Requires activity/decision node data in the kernel.
- **Sequence perspective** — lifelines with messages showing runtime call flow. Requires Interface and Message entities in the kernel.
- **Control perspective** — same terrain with risk/compliance control overlay. Requires control-point-first rendering logic.

---

## Phase 1: Docs Consolidation

### Goal
Move all reference documents into the monorepo under `docs/`.

### Intent
Docs consolidation keeps product thinking, architecture plans, PRDs, and implementation work versioned alongside the code so the repo becomes the operational home of product evolution, not just the code container.

### Steps
- Create `docs/ideas/`, `docs/prds/`, `docs/plans/` in guiderail repo
- Move contents from `/Users/jladd/Code/ideas/` → `docs/ideas/`
- Move contents from `/Users/jladd/Code/docs/` → `docs/prds/`
- Move contents from `/Users/jladd/Code/plans/` → `docs/plans/`
- Update root CLAUDE.md to reference `docs/` location
- Remove the now-empty external directories

### Done when
- All docs versioned in the repo
- External ideas/docs/plans folders removed

---

## Phase 2: Expanded Fintech Landscape Seed Data

### Goal
Expand from 10 nodes to 40-60 nodes covering the full fintech stack. This is a vertical content expansion whose purpose is to pressure-test existing navigation and route mechanics at a more realistic scale.

### Explicit anti-scope for Phase 2
- No new kernel semantics
- No new UI behavior
- No backend/content ingestion changes
- No authoring workflow changes
- No attempt to perfect the entire industry ontology

### Content intent
The expanded seed should not try to represent the whole fintech universe exhaustively. It should provide a representative landscape that exercises the most important navigation tensions:
- customer-to-core progression
- provider participation in context
- multiple rails and schemes
- orchestration and control layers
- cross-domain movement between capability areas

### Content scope (from Fintech Systems Explorer PRD)

**9 Domains:** Customer, Accounts, Payments, Risk & Identity, Orchestration & Control, Channels & Experience, Networks & Schemes, Rails & Money Movement, Data & Rewards

**~15 Capabilities** across new domains (Fraud Detection, Identity Verification, Payment Orchestration, Wallet Management, Network Authorization, Settlement, Rewards Processing, etc.)

**40-60 Nodes** — wallets (Apple Pay, Google Pay, Paze), networks (Visa, Mastercard), rails (RTP, FedNow, ACH, Zelle), orchestration layers, core systems, risk/fraud engines, data platforms, agentic commerce actors

**~20 Providers** with associations

**2-3 Value Streams**, **2-3 Processes** with stages

### Implementation
- Expand `seed-banking.ts` into `seed-fintech.ts` (or significantly grow it)
- No `layoutByPerspective` positions for new nodes — ELK.js handles layout (Phase 3)
- Keep existing banking entities, add around them
- All data parsed through Zod schemas
- Static seed content should be shaped like future real content, not just demo scaffolding

### Done when
- Seed data loads with 40-60 nodes
- All existing 291 tests pass
- Schema validation passes for all new entities

---

## Phase 3: ELK.js Auto-Layout

### Goal
Replace hand-authored positions with computed ELK.js layouts that improve readability and orientation at scale, not just automate coordinates.

### What clean auto-layout means
- Primary directional readability per perspective
- Visually stable clusters by domain/capability where appropriate
- Low edge chaos for the default viewport
- Perspective changes that feel like meaningful re-interpretation, not random rearrangement

### Layout stability rule
Perspective-specific ELK layouts should preserve as much mental continuity as practical. Re-layout should feel like a new structured interpretation of the same terrain, not a completely different world.

### Implementation
- `pnpm add elkjs` in apps/web
- Create `apps/web/src/lib/elk-layout.ts` — async function: nodes + edges + direction → positioned nodes
- Layout per perspective: Overview (hierarchical top-to-bottom), Architecture (layered LR), Process (directional LR), Journey (linear step flow)
- Provider perspective removed from the bar — providers visible via badges and detail panels
- Update `use-perspective-provider.ts` — use `layoutByPerspective` if present, else compute via ELK
- Loading state while layout computes (ELK is async)

### Design rules
- `layoutByPerspective` = curated override
- ELK.js = fallback for nodes without positions
- ELK.js = primary engine for Process perspective

### Done when
- 40-60 nodes render with clean auto-layout (readability, not just non-overlap)
- Perspective switching re-computes layout with stable mental continuity
- Process perspective shows directional flow

---

## Phase 4: Search

### Goal
Search is the recovery and direct-access mechanism for landscape scale. It helps users recover from map density, jump directly to known entities, and move into the terrain without forcing manual pan-and-zoom discovery.

### Design rules
- Search is a navigation accelerator, not a separate exploration mode
- Search navigates via kernel events — it does not create its own navigation state
- Search results prefer exact matches, then strong partial matches, and favor currently visible or context-relevant entities when scores are similar

### Implementation
- Create `apps/web/src/components/navigation/SearchPalette.tsx` — Cmd+K / Ctrl+K trigger
- Search indexes: domains, capabilities, nodes, providers, journeys, processes, guided routes
- Simple fuzzy matching (substring scoring, no external library needed at 60 entities)
- Results grouped by type with badges, ordered by match quality
- Click sends kernel event (SELECT_DOMAIN, SELECT_NODE, START_ROUTE, etc.)
- Escape closes
- `apps/web/src/styles/search.css`

### Done when
- Cmd+K opens palette
- Typing filters across all types with quality-ordered results
- Click navigates
- Escape dismisses

---

## Phase 5: Richer Process Perspective

### Goal
The purpose of the richer Process perspective is to help the user distinguish operational execution flow from broader architecture and journey views. It should make process meaning visually obvious, not merely provide another layout variant.

### Design rule
Process Perspective should answer "how the work operationally moves," not just "what nodes are involved." Structured flow, not full BPMN. ELK layered layout, not bpmn-js.

### Implementation
- Process perspective ELK config: `layered` algorithm, left-to-right
- When `activeProcessId` set, scope visible nodes to process stage nodes
- Stage labels visible, control points shown as annotations

### Done when
- Process renders stages in clean left-to-right flow
- Process is visually distinct from Architecture and Journey
- Switching to Architecture re-layouts to architecture view

---

## Phase 6: Guided Routes for Expanded Landscape

### Goal
Expanded routes prove that guided traversal still works when the terrain spans multiple domains, providers, and control boundaries. A good 0.3.0 route should help the user cross meaningful conceptual distance without losing the thread.

### Route design expectations
Each 0.3.0 route should have:
- A clear destination objective
- 5-7 waypoints maximum
- At least one meaningful perspective change where appropriate
- At least one example of provider context appearing in the route flow
- A coherent beginning, middle, and end

### Routes
1. **"How a Card Payment Flows"** — Customer → Wallet → Orchestration → Risk → Network → Rail → Core → Rewards
2. **"Real-Time Payment: RTP vs FedNow"** — Compare two rails through same orchestration
3. **"Where Bank Control Changes Hands"** (stretch) — Strategic route on control boundaries

### Implementation
- Add StoryRoute + StoryWaypoint entries to expanded seed data
- 5-7 waypoints each with focusTargets, keyMessages, perspective suggestions
- Guided Route bar already works — just needs content

### Done when
- All routes playable end-to-end
- Waypoints navigate across broader landscape with perspective switches
- Routes teach across scale, not merely demonstrate more nodes

---

## Phase 7: Tests + Polish + Version Bump

### Goal
Phase 7 proves that landscape scale, ELK layout, and search were added without breaking the core navigation model or the guided route behavior that earlier releases already proved.

### Tests
- Schema validation for expanded seed data
- ELK layout tests (nodes positioned, readable layout)
- Search palette tests (renders, filters, navigates, quality ordering)
- Existing 291 tests still pass

### Polish
- Version bump to 0.3.0 (both packages)
- CLAUDE.md updated
- Storybook stories for SearchPalette if time permits

### Done when
- All tests pass
- `pnpm build && pnpm test && pnpm check` clean
- Version 0.3.0

---

## Sequencing

```
Phase 1 (docs) → Phase 2 (content) → Phase 3 (ELK) → Phase 4 (search) → Phase 5 (process) → Phase 6 (routes) → Phase 7 (tests)
```

Phase 1 is independent. Phase 3 needs Phase 2. Phase 5 needs Phase 3. Phase 4 is independent of 3/5. Phase 6 needs Phase 2.

---

## Design Tensions / Watchpoints

- **Bigger terrain must not turn the product into an unreadable provider map** — navigation filtering, dimming, and detail routing must remain clear at 40-60 nodes
- **Auto-layout must improve interpretability, not just remove overlap** — directional readability, stable clusters, low edge chaos
- **Layout stability across perspective switches** — re-layout should feel like re-interpretation, not random rearrangement
- **Search must accelerate navigation without becoming a second primary UI** — sends kernel events, doesn't manage state
- **Process must remain visually and conceptually distinct from Architecture and Journey** — it answers "how work moves," not just "what's involved"
- **Expanded routes must teach across scale, not merely demonstrate more nodes** — routes cross meaningful conceptual distance
- **Static seed content must be shaped like future real content, not just demo scaffolding** — entity structure, relationship quality, and naming should model what real fintech architecture looks like
- **Provider removal from perspective bar does not demote providers** — they remain first-class contextual content via badges, detail panels, and associations
- **ELK.js is async** — loading states needed for perspective switches
- **Seed data is still the content source** — no backend yet
- **Docs in repo are reference, not generated** — they inform product decisions and are versioned alongside code

---

## Hero Path Walkthrough

**"Fintech Landscape — Full 0.3.0 Proof"**

1. App loads → 40-60 nodes visible, auto-laid out, provider badges on relevant nodes
2. Cmd+K → search for "Visa" → click result → navigates to Visa provider context
3. Select domain "Networks & Schemes" → non-matching nodes dim
4. Select capability "Network Authorization" → further scoping
5. Switch to Process perspective → directional flow layout, visually distinct from Architecture
6. Switch back to Architecture → stable re-layout
7. Start guided route "How a Card Payment Flows" → route bar appears
8. Traverse 5-7 waypoints across Customer → Wallet → Orchestration → Risk → Network → Rail → Core
9. At least one perspective switch mid-route
10. Pause → explore freely → resume → exact waypoint restored
11. Complete route → bar dismisses, domain/capability preserved

If this walkthrough succeeds, the 0.3.0 proof statement is satisfied.

---

## Verification

After all phases:
1. `pnpm build` — both packages build
2. `pnpm test` — all tests pass
3. `pnpm check` — Biome clean
4. `pnpm dev` — 40-60 nodes, auto-laid out, searchable
5. Cmd+K search works across all entity types with quality-ordered results
6. Process perspective shows directional flow, visually distinct from other perspectives
7. 2-3 guided routes playable end-to-end across the expanded landscape
8. All docs under `docs/` in the repo
9. Hero path walkthrough succeeds
