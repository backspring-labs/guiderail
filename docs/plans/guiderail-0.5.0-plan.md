# GuideRail 0.5.0 Implementation Plan

## Context

GuideRail 0.4.0 shipped with 310 tests, the 6-perspective progression (Landscape → Journey → Process → Architecture → System → Sequence), Process canvas modes (Operational/Decision/Controls), the shared context contract, and 6 guided routes. The product proves that perspective switching feels like "same moment, different lens."

However, 0.4.0 revealed that while the perspective infrastructure is sound, several canvas views are undercooked — they render the same terrain node graph with ELK layout rather than purpose-built visualizations for their specific question. Process got BPMN and Sequence got lifeline rendering, but Landscape, Journey, Architecture, and System still share a generic node graph appearance.

GuideRail 0.5.0 is the **canvas fidelity release**. It gives each perspective a rendering that matches its diagram grammar, adds the Architecture Deployment canvas mode, and introduces the first content ingestion path beyond static seed data.

### 0.5.0 proof statement

GuideRail 0.5.0 proves that each perspective renders with a canvas tailored to its specific question — Journey shows a customer path, Architecture shows system boundaries, Landscape shows a capability map — and that content can be loaded from structured files rather than only compiled seed data.

### Reference

- `docs/ideas/Perspective_Progression_Shared_Context_Guided_Tour_Idea.md` — perspective definitions, bounded canvas entry, canvas modes
- `docs/ideas/guiderail-idea-transforming-viewscape.md` — truth acquisition model, evidence mode, author mode, roadmap modeling

---

## What 0.5.0 adds

- **Canvas templates per perspective** — purpose-built rendering for Landscape, Journey, Architecture, and System (Process and Sequence already have custom rendering from 0.4.0)
- **Architecture Deployment canvas mode** — infrastructure/deployment view alongside the existing Logical mode
- **Journey canvas rendering** — step-by-step customer path visualization (screens, actions, progression)
- **Landscape canvas rendering** — capability map with domain groupings, not just a node graph
- **System internal component view** — C4 Level 3 component rendering using `parentNodeId`
- **Content loading from files** — JSON/YAML import for seed-like content without recompiling
- **Bounded canvas entry** — each perspective enters through a summarized state with progressive expansion
- **Expanded seed data** — more journeys, deployment metadata, component relationships
- **Mobile screen preview (stretch)** — right panel shows a mobile screen render when a screen-type node is selected, keeping the customer's experience visible during Process/Sequence navigation. See `docs/ideas/mobile-screen-preview-idea.md`.

### What 0.5.0 explicitly defers

- Backend / persistence API (still file-based, not database-backed)
- Author Mode UI (content authored in files, not in-app)
- Roadmap/Initiative modeling (no entity, no views)
- Guided Tour participant model (presenter + followers)
- Evidence Mode as a dedicated experience
- Truth acquisition automation (derived truth, proposed truth)
- Full mobile screen preview with real mockup assets (0.5.0 stretch establishes mapping, 0.6.0 adds real screen content)
- OpenTelemetry / runtime trace ingestion
- bpmn-js, Tiptap, Playwright, Next.js

---

## Phase 1: Journey Canvas Template

### Goal
Replace the generic ELK node graph on the Journey perspective with a purpose-built customer journey visualization showing step-by-step progression.

### Product intent
Journey answers "what real path is being taken by the user?" It should look like a customer journey map, not a system architecture diagram. The user should see screens, actions, and emotional progression — not services and edges.

### What the Journey canvas should show
- Steps as primary nodes, ordered left-to-right in a horizontal path
- Each step shows: title, actor, expected action, and the screen/node being interacted with
- Directional flow arrows between steps
- Value Stream framing shown as a header/context label
- Capability transitions visible when the journey crosses capability boundaries
- When no journey is active, show available journeys as clickable starting points

### Steps
- Create `apps/web/src/lib/journey-layout.ts` — custom layout: steps as horizontal nodes with fixed spacing
- Create `JourneyStepNode.tsx` — step visualization with actor, action, linked screen
- Create `JourneyStartNode.tsx` — journey selection when no journey is active (shows available journeys)
- Update `use-perspective-provider.ts` — branch for journey perspective, use journey layout
- Add `journey.css` — step path styling, progression indicators, capability boundary markers
- Journey steps link to terrain nodes via `focusTargets` — clicking a step can navigate to the linked node in Architecture/System

### Done when
- Journey perspective shows a horizontal step-by-step path, not a node graph
- Steps show actor, action, and linked screen context
- Value Stream framing visible
- Clicking a step shows step detail in right panel
- Switching to Architecture preserves the current step's node context

---

## Phase 2: Landscape Canvas Template

### Goal
Replace the generic ELK node graph on the Landscape perspective with a capability map visualization showing domains as regions with capabilities inside them.

### Product intent
Landscape answers "what world are we in?" It should look like a business capability map — domains as labeled regions, capabilities as tiles within them, cross-domain relationships as connecting lines. Not a flat node graph.

### What the Landscape canvas should show
- Domains as large labeled group regions (boxes or zones)
- Capabilities as tiles/cards within each domain region
- Cross-domain edges shown as simplified connecting lines between regions
- Provider presence shown subtly (badge count or small indicators)
- Node count per capability visible as a metric
- Drill-down: clicking a capability navigates into it (sets `activeCapabilityId`)

### Steps
- Create `apps/web/src/lib/landscape-layout.ts` — custom layout: domain groups with capability tiles arranged inside
- Create `DomainGroupNode.tsx` — domain region with label, containing capability tiles
- Create `CapabilityTileNode.tsx` — capability card with label, node count, provider count
- Update `use-perspective-provider.ts` — branch for landscape perspective
- Add `landscape.css` — domain regions, capability tiles, group styling
- Landscape does not show individual terrain nodes — it shows domains and capabilities as the primary elements

### Done when
- Landscape perspective shows a capability map, not a node graph
- Domains appear as labeled regions containing capabilities
- Clicking a capability navigates into it
- The view feels like a strategic business map, not a technical diagram

---

## Phase 3: Architecture Canvas Improvements + Deployment Mode

### Goal
Improve the Architecture Logical view with system boundary groupings, and add the Deployment canvas mode showing infrastructure topology.

### Architecture Logical improvements
- Group nodes by domain or system boundary (using domain context)
- Show clear system boundaries as visual containers
- Improve edge rendering for system-to-system vs intra-system connections

### Architecture Deployment canvas mode
- New canvas mode alongside Logical
- Shows infrastructure topology: where services run (cloud regions, clusters, containers)
- Requires deployment metadata on nodes (new `deployment` field in node metadata or a new DeploymentMapping entity)
- ELK layout with infrastructure-oriented grouping

### Steps
- Add deployment metadata to seed nodes (cloud region, service type, infrastructure tier)
- Create `DeploymentNode.tsx` — infrastructure-oriented node rendering
- Add `deployment` to Architecture canvas modes in CanvasModeSchema
- Create deployment layout logic (grouped by infrastructure tier or region)
- Update `use-perspective-provider.ts` — Architecture mode branching
- Canvas mode switcher appears on Architecture tab: "Logical" | "Deployment"

### Done when
- Architecture Logical view shows clearer system boundaries
- Architecture Deployment mode shows infrastructure topology
- Canvas mode switcher toggles between Logical and Deployment
- Both modes preserve shared context contract

---

## Phase 4: System Perspective — Component View with parentNodeId

### Goal
Evolve the System perspective from a simple filter to a component-level view using `parentNodeId` for hierarchy.

### Product intent
System answers "what participating parts matter here?" In 0.4.0 it filters Architecture nodes. In 0.5.0 it should show internal components of the participating systems — the first use of `parentNodeId`.

### Steps
- Add component-level nodes to seed data with `parentNodeId` referencing their parent system node
- Create `ComponentNode.tsx` — smaller node rendered inside or below its parent system
- Update `resolveSystemScope()` to include child components of participating systems
- Layout: ELK with parent-child grouping (ELK supports hierarchical layout)
- When a system is selected, expand to show its internal components

### Done when
- System perspective shows participating systems with their internal components
- `parentNodeId` hierarchy is rendered visually
- Clicking a component shows its detail
- C4 Level 3 component view is functional

---

## Phase 5: Content Loading from Files

### Goal
Allow content to be loaded from JSON/YAML files rather than only from compiled seed data. This is the first step toward decoupling content from code.

### Product intent
The seed data pattern proved the presentation model. Now content should be loadable from structured files so that non-developers can author and update landscape content without touching TypeScript.

### What this is NOT
- Not a backend API
- Not a database
- Not a CMS
- Not Author Mode (no in-app editing UI)

### What this IS
- A file-based content loader that reads JSON/YAML and produces the same entity shapes as seed data
- A development bridge between "everything is seed data" and "content comes from a backend"

### Steps
- Create `packages/core/src/content/file-loader.ts` — reads JSON files, validates through Zod schemas, returns entity arrays
- Define a content file format (one file per entity type, or one file per domain)
- Add a `content/` directory in the repo with example JSON files mirroring seed data
- Update `seed-loader.ts` to support loading from files (with seed data as fallback)
- Provenance metadata populated automatically (source type, file path, import timestamp)

### Done when
- Content can be loaded from JSON files without recompiling
- Zod validation catches malformed content with clear error messages
- Provenance tracks which file each entity came from
- Seed data still works as fallback when no content files are present

---

## Phase 6: Bounded Canvas Entry & Polish

### Goal
Implement the bounded canvas entry principle: every perspective enters through a summarized state with progressive expansion.

### Steps
- Each perspective starts at a zoom level that shows the full canvas without scrolling
- Complex perspectives (Process BPMN, Sequence) start with representative elements visible
- fitView on perspective switch with appropriate padding
- Progressive expansion: user zooms or clicks to see more detail
- Smooth transitions between perspective switches

### Also
- Update CLAUDE.md with 0.5.0 documentation
- Version bump to 0.5.0
- Seed data split if file exceeds 2000 lines

### Done when
- Every perspective enters at a readable zoom level
- No visual shock or node explosion on perspective switch
- Smooth fitView transitions

---

## Phase 7: Tests & Version Bump

### Tests
- Journey layout: steps positioned left-to-right, correct ordering
- Landscape layout: domains contain correct capabilities
- Architecture Deployment mode: canvas mode switching works
- System component hierarchy: parentNodeId resolved correctly
- Content file loader: valid files parse, invalid files produce errors
- Bounded canvas entry: fitView called on perspective switch
- All existing 310 tests still pass

### Done when
- All tests pass
- `pnpm build && pnpm test && pnpm check` clean
- Version 0.5.0

---

## Sequencing

```
Phase 1 (Journey canvas) → Phase 2 (Landscape canvas) → Phase 3 (Architecture + Deployment) → Phase 4 (System components) → Phase 5 (File loading) → Phase 6 (Bounded entry + polish) → Phase 7 (Tests)
```

Phases 1-4 are canvas template work (the main theme). Phase 5 is infrastructure. Phase 6 is cross-cutting polish. Each phase is independently valuable.

---

## Watchpoints

- **Journey rendering must feel like a customer journey map, not a flowchart.** The distinction from Process is critical — Journey shows the user's experience, Process shows operational execution.
- **Landscape must feel like a capability map, not a zoomed-out Architecture.** Domains and capabilities are the primary visual elements, not individual nodes.
- **Deployment mode is materially different from Logical.** They should not be forced to share the same layout or node types.
- **parentNodeId hierarchy must work with ELK.** ELK supports compound graphs — verify that parent-child grouping produces readable layouts.
- **File loading must not break existing seed data path.** Seed data remains the fallback. File loading is additive.
- **Canvas templates must preserve the shared context contract.** Custom layouts cannot break perspective switching or context preservation.

---

## What 0.5.0 sets up for future releases

- **0.6.0+: Author Mode** — with file-based content loading in place, Author Mode becomes "edit the files through a UI" rather than "build an entire content system"
- **0.6.0+: Evidence Mode** — with provenance on all entities and file-based loading, evidence can be attached to entities through structured references
- **0.7.0+: Guided Tour participant model** — shared context contract + route system provides the foundation; multi-user requires WebSocket or similar
- **Future: Roadmap/Initiative modeling** — requires new kernel entities (Initiative, Change) but the perspective infrastructure and canvas mode system can accommodate new views
- **Future: Truth acquisition** — file loading is Zone 1 (authored). Future releases add Zone 2 (source-connected: API specs, code repos) and Zone 3 (inferred)

---

## Audit Schedule

Pause for audit after phases **2** (Journey + Landscape canvases), **4** (Architecture + System), and **7** (final).
