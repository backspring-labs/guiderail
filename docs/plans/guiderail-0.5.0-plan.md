# GuideRail 0.5.0 Implementation Plan

## Context

GuideRail 0.4.0 shipped with 310 tests, the 6-perspective progression (Landscape → Journey → Process → Architecture → System → Sequence), Process canvas modes (Operational/Decision/Controls), the shared context contract, and 6 guided routes. The product proves that perspective switching feels like "same moment, different lens."

However, 0.4.0 revealed that while the perspective infrastructure is sound, several canvas views are undercooked — they render the same terrain node graph with ELK layout rather than purpose-built visualizations for their specific question. Process got BPMN and Sequence got lifeline rendering, but Landscape, Journey, Architecture, and System still share a generic node graph appearance.

GuideRail 0.5.0 is the **canvas fidelity release**. It is the release where each major perspective begins to earn its own diagram grammar while preserving the shared context contract that keeps the product coherent across perspective switches.

### 0.5.0 proof statement

GuideRail 0.5.0 proves that users can move through richer, perspective-specific canvases and file-loaded content while preserving the same current business thread across Journey, Process, Architecture, System, and Sequence.

### Reference

- `docs/ideas/Perspective_Progression_Shared_Context_Guided_Tour_Idea.md` — perspective definitions, bounded canvas entry, canvas modes
- `docs/ideas/guiderail-idea-transforming-viewscape.md` — truth acquisition model, evidence mode, author mode, roadmap modeling
- `docs/ideas/mobile-screen-preview-idea.md` — mobile screen render in right panel

---

## Design Rules for 0.5.0

### Canvas fidelity must serve interpretability, not visual density

Custom canvas fidelity must improve interpretability and teaching value, not merely increase visual density or polish. Each new canvas earns its rendering by answering its question more clearly than a generic node graph could.

### Routes use perspectives where they teach, not where they show off

Routes should use each perspective only where that perspective teaches something uniquely valuable about the same current moment. No perspective switch for its own sake.

### Bounded canvas entry is per-phase, not polish

Each new canvas introduced in Phases 1–4 must satisfy bounded canvas entry expectations at introduction. Phase 6 does the cross-cutting consistency pass, but no canvas should ship without a coherent summarized entry state.

### Perspective distinctions

- **Journey ≠ Process.** Journey shows the user's experience (screens, actions, emotional progression). Process shows operational execution (BPMN tasks, gateways, swim lanes). Journey canvas must not drift into BPMN-lite or process flowchart behavior.
- **Architecture ≠ System.** Architecture shows broad technical structure and boundaries. System shows participating internal parts for the selected scenario. They must remain visually and conceptually distinct.
- **Landscape abstraction rule.** Landscape may summarize and count underlying nodes, but it should never require the viewer to reason about individual terrain-node topology at entry.

---

## What 0.5.0 adds

- **Canvas templates per perspective** — purpose-built rendering for Landscape, Journey, Architecture, and System (Process and Sequence already have custom rendering from 0.4.0)
- **Architecture Deployment canvas mode** — infrastructure/deployment view alongside the existing Logical mode
- **Journey canvas rendering** — step-by-step customer path visualization (screens, actions, progression)
- **Landscape canvas rendering** — capability map with domain groupings, not just a node graph
- **System internal component view** — C4 Level 3 component rendering using `parentNodeId`
- **Content loading from files** — JSON/YAML import as authored source-of-truth artifacts, not seed dumps in another wrapper
- **Bounded canvas entry** — each perspective enters through a summarized state with progressive expansion (enforced per-phase, not only in polish)
- **Expanded seed data** — more journeys, deployment metadata, component relationships
- **Mobile screen preview (stretch)** — right panel shows a mobile screen render when a screen-type node is selected. The preview shows the last confidently-resolved customer-visible screen state, not every internal transition. See `docs/ideas/mobile-screen-preview-idea.md`.

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

### Non-goal
Journey canvas must not drift into BPMN-lite or process flowchart behavior. Journey shows what the user experiences, Process shows how the work operationally executes. These are different questions with different diagram grammars.

### What the Journey canvas should show
- Steps as primary nodes, ordered left-to-right in a horizontal path
- Each step shows: title, actor, expected action, and the screen/node being interacted with
- Directional flow arrows between steps
- Value Stream framing shown as a header/context label
- Capability transitions visible when the journey crosses capability boundaries
- When no journey is active, show available journeys as clickable starting points
- Bounded entry: journey enters with all steps visible at a readable zoom, not exploded

### Shared context preservation rules
- Journey → Architecture: preserves the current step's linked node as `selectedNodeId` focus
- Journey → Process: preserves `activeJourneyId` so Process can show the operationally executing flow for the same journey
- Journey → System: preserves step-linked node focus, System filters to participating systems
- Architecture/Process/System → Journey: returns to the same step index and journey context

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
- Bounded entry: all steps visible at entry zoom level

---

## Phase 2: Landscape Canvas Template

### Goal
Replace the generic ELK node graph on the Landscape perspective with a capability map visualization showing domains as regions with capabilities inside them.

### Product intent
Landscape answers "what world are we in?" It should look like a business capability map — domains as labeled regions, capabilities as tiles within them, cross-domain relationships as connecting lines. Not a flat node graph.

### Abstraction rule
Landscape may summarize and count underlying nodes, but it should never require the viewer to reason about individual terrain-node topology at entry. Landscape is strategic, not technical.

### What the Landscape canvas should show
- Domains as large labeled group regions (boxes or zones)
- Capabilities as tiles/cards within each domain region
- Actors (customers, operators, AI agents) as entry-point nodes on the left edge of the map — the people and systems that interact with the landscape
- Cross-domain relationships as simplified connecting lines between regions (not individual node-to-node edges)
- Provider presence shown subtly (badge count or small indicators per capability)
- Node count per capability visible as a metric
- Drill-down: clicking a capability navigates into it (sets `activeCapabilityId`)
- Bounded entry: all domains visible at entry zoom with capability tiles readable

### What the Landscape canvas must NOT show
- Individual service, system, or screen nodes — these belong to Architecture, System, and Journey
- Individual edges between terrain nodes — these are implementation detail, not strategic structure
- The full terrain graph with ELK layout — that is the 0.3.0/0.4.0 behavior being replaced

### Shared context preservation rules
- Landscape → Journey: preserves `activeDomainId` and `activeCapabilityId`, Journey shows journeys for that capability
- Landscape → Architecture: preserves domain/capability context, Architecture shows relevant systems
- Landscape capability drill-in: preserves the business anchor, not just the click target — `activeDomainId` stays set when a capability within it is selected

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
- Bounded entry: all domains visible at entry zoom

---

## Phase 3: Architecture Canvas Improvements + Deployment Mode

### Goal
Improve the Architecture Logical view with system boundary groupings, and add the Deployment canvas mode showing infrastructure topology.

### Intent distinction
- **Architecture** = broad technical structure and boundaries ("what exists?")
- **System** = participating internal parts for the selected scenario ("who is involved here?")
- **Deployment** = where services physically run ("what infrastructure hosts this?")

### Architecture Logical improvements
- Group nodes by domain or system boundary (using domain context)
- Show clear system boundaries as visual containers
- Improve edge rendering for system-to-system vs intra-system connections
- Bounded entry: system groups visible at entry zoom

### Architecture Deployment canvas mode
- New canvas mode alongside Logical
- Shows infrastructure topology: where services run (cloud regions, clusters, containers)
- **0.5.0 modeling approach:** deployment metadata stored in node `metadata` field (e.g., `metadata.deployment: { region, tier, runtime }`). A separate DeploymentMapping entity is deferred — metadata is sufficient for rendering and avoids premature entity proliferation.
- ELK layout with infrastructure-oriented grouping (grouped by region or tier)

### Shared context preservation rules
- Architecture Logical → Deployment: same systems, different rendering emphasis. Canvas mode switch preserves everything including selection.
- Architecture → System: preserves domain/capability context, System filters to participating systems
- Process → Architecture: preserves `activeProcessId`, Architecture shows systems involved in that process

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
- Bounded entry: system groups visible at entry zoom

---

## Phase 4: System Perspective — Component View with parentNodeId

### Goal
Evolve the System perspective from a simple filter to a component-level view using `parentNodeId` for hierarchy.

### Product intent
System answers "what participating parts matter here?" In 0.4.0 it filters Architecture nodes. In 0.5.0 it should show internal components of the participating systems — the first use of `parentNodeId`.

### Shared context preservation rules
- Process → System: preserves `activeProcessId`, System shows components of participating systems
- System → Sequence: preserves interface context, Sequence shows runtime calls between the participating components
- System → Architecture: broadens back to full system view with domain/capability preserved

### Steps
- Add component-level nodes to seed data with `parentNodeId` referencing their parent system node
- Create `ComponentNode.tsx` — smaller node rendered inside or below its parent system
- Update `resolveSystemScope()` to include child components of participating systems
- Layout: ELK with parent-child grouping (ELK supports hierarchical layout)
- When a system is selected, expand to show its internal components
- Bounded entry: participating systems visible at entry zoom, components visible on drill-in

### Done when
- System perspective shows participating systems with their internal components
- `parentNodeId` hierarchy is rendered visually
- Clicking a component shows its detail
- C4 Level 3 component view is functional
- Bounded entry: clean entry state with expansion affordance

---

## Phase 5: Content Loading from Files

### Goal
Allow content to be loaded from JSON/YAML files rather than only from compiled seed data. This is the first step toward decoupling content from code.

### Product intent
The seed data pattern proved the presentation model. Now content should be loadable from structured files so that non-developers can author and update landscape content without touching TypeScript.

### Content file design rule
Content files should be shaped as authored source-of-truth artifacts, not as seed dumps split into JSON files. They should look like future real content — structured, validated, and provenance-tracked — so the transition to Author Mode or backend ingestion is natural.

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

## Phase 6: Bounded Canvas Entry Consistency Pass & Polish

### Goal
Cross-cutting consistency pass for bounded canvas entry across all perspectives. Each canvas introduced in Phases 1–4 should already satisfy bounded entry at introduction — this phase ensures consistency and handles edge cases.

### Steps
- Verify each perspective starts at a zoom level that shows the full canvas without scrolling
- Verify complex perspectives (Process BPMN, Sequence) start with representative elements visible
- fitView on perspective switch with appropriate padding
- Progressive expansion: user zooms or clicks to see more detail
- Smooth transitions between perspective switches
- Mobile screen preview stretch: establish step-to-screen mapping using journey focusTargets, add `ScreenPreviewPanel` with placeholder rendering. The preview shows the last confidently-resolved customer-visible screen state. Mobile screen preview is a contextual aid to keep customer-facing reality visible during deeper views; it is not a parallel navigation surface or a second application mode.

### Also
- Update CLAUDE.md with 0.5.0 documentation
- Version bump to 0.5.0
- Seed data split if file exceeds 2000 lines

### Done when
- Every perspective enters at a readable zoom level
- No visual shock or node explosion on perspective switch
- Smooth fitView transitions
- Screen preview mapping established (stretch)

---

## Phase 7: Tests & Version Bump

### Tests
- Journey layout: steps positioned left-to-right, correct ordering
- Landscape layout: domains contain correct capabilities
- Architecture Deployment mode: canvas mode switching works
- System component hierarchy: parentNodeId resolved correctly
- Content file loader: valid files parse, invalid files produce errors
- Bounded canvas entry: fitView called on perspective switch
- Shared context preservation across all perspective switches with new canvas templates
- All existing 310 tests still pass

### Hero path: file-loaded content proof
- Load a route and its associated perspective data from content files (not seed)
- Navigate through Journey, Architecture, System, and Sequence
- Confirm shared context survives perspective switching
- Confirm the same route works without code-embedded seed assumptions

### Done when
- All tests pass
- `pnpm build && pnpm test && pnpm check` clean
- File-loaded content hero path succeeds
- Version 0.5.0

---

## Sequencing

```
Phase 1 (Journey canvas) → Phase 2 (Landscape canvas) → Phase 3 (Architecture + Deployment) → Phase 4 (System components) → Phase 5 (File loading) → Phase 6 (Bounded entry + polish) → Phase 7 (Tests)
```

Phases 1-4 are canvas template work (the main theme). Phase 5 is infrastructure. Phase 6 is cross-cutting polish + screen preview stretch. Each phase is independently valuable. Bounded canvas entry expectations apply at each phase, not only Phase 6.

---

## Watchpoints

- **Journey rendering must feel like a customer journey map, not a flowchart.** The distinction from Process is critical — Journey shows the user's experience, Process shows operational execution. If Journey starts looking like BPMN-lite, it has drifted.
- **Landscape must feel like a capability map, not a zoomed-out Architecture.** Domains and capabilities are the primary visual elements, not individual nodes. Landscape should never require reasoning about terrain-node topology at entry.
- **Deployment mode is materially different from Logical.** They should not be forced to share the same layout or node types. Different diagram structures, not light emphasis changes.
- **Architecture vs System must stay distinct.** Architecture = broad structure. System = participating parts for the current scenario. If they look the same, one isn't earning its tab.
- **parentNodeId hierarchy must work with ELK.** ELK supports compound graphs — verify that parent-child grouping produces readable layouts.
- **File loading must not break existing seed data path.** Seed data remains the fallback. File loading is additive.
- **Canvas templates must preserve the shared context contract.** Custom layouts cannot break perspective switching or context preservation. Each phase specifies its own context preservation rules.
- **Custom canvas fidelity must improve interpretability, not visual density.** Richer canvases must serve teaching value, not just increase polish.
- **Mobile screen preview must show only confidently-resolved state.** The preview should not pretend to animate every internal transition into a screen. It shows what the customer actually sees at this moment.

---

## What 0.5.0 sets up for future releases

- **0.6.0+: Author Mode** — with file-based content loading in place, Author Mode becomes "edit the files through a UI" rather than "build an entire content system"
- **0.6.0+: Evidence Mode** — with provenance on all entities and file-based loading, evidence can be attached to entities through structured references
- **0.6.0+: Full mobile screen preview** — with step-to-screen mapping established, add real mockup assets or structured screen descriptions
- **0.7.0+: Guided Tour participant model** — shared context contract + route system provides the foundation; multi-user requires WebSocket or similar
- **Future: Roadmap/Initiative modeling** — requires new kernel entities (Initiative, Change) but the perspective infrastructure and canvas mode system can accommodate new views
- **Future: Truth acquisition** — file loading is Zone 1 (authored). Future releases add Zone 2 (source-connected: API specs, code repos) and Zone 3 (inferred)

---

## Audit Schedule

Pause for audit after phases **2** (Journey + Landscape canvases), **4** (Architecture + System), and **7** (final).

### Phase-specific audit prompts

- **After phase 2 (Journey + Landscape):** Does Journey feel like a customer journey map, not a flowchart? Does Landscape feel like a strategic capability map, not a zoomed-out node graph? Do both satisfy bounded canvas entry? Is the shared context contract preserved when switching between these canvases and Process/Sequence?
- **After phase 4 (Architecture + System):** Is Architecture visually distinct from System? Does Deployment mode feel materially different from Logical? Does parentNodeId hierarchy render cleanly? Do context preservation rules hold across all 6 perspectives?
- **After phase 7 (Final):** Does file-loaded content work identically to seed data across all perspectives? Does the hero path succeed end-to-end? Do all canvases serve interpretability over visual density?
