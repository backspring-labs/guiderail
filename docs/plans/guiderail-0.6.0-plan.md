# GuideRail 0.6.0 Implementation Plan

## Context

GuideRail 0.5.0 shipped the canvas fidelity release — purpose-built canvas templates for each perspective, file-based content loading, and the Sequence entity completing the Capability triad. Post-0.5.0, the Sequence entity was added with filtered rendering, picker cards, search integration, and context bar breadcrumb.

The left panel remains a flat domain → capability drill-down from 0.3.0. At scale (135-150 capabilities), this won't work. The product needs a context-aware navigation hub that scopes itself to the current selection and surfaces Journeys, Processes, Sequences, and Guides alongside Domains and Capabilities.

GuideRail 0.6.0 is the **navigation hub release**. It transforms the left panel into a cascading contextual navigator, adds the stepper transport control for sequential perspectives, and addresses accumulated technical debt.

### 0.6.0 proof statement

GuideRail 0.6.0 proves that users can browse and navigate the full entity landscape — domains, capabilities, journeys, processes, sequences, and guides — through a context-aware left panel that scopes itself to the current selection, with transport controls for stepping through sequential content.

### Reference

- `docs/ideas/left-panel-contextual-navigation-idea.md` — full design
- `docs/ideas/stepper-transport-control-idea.md` — transport control design
- `docs/plans/sequence-entity-plan.md` — Sequence entity (shipped post-0.5.0)

---

## What 0.6.0 adds

- **Left panel contextual navigation hub** — collapsible sections that scope to current context
- **Sections:** Domains, Capabilities, Journeys, Processes, Sequences, Guides, Systems
- **Cascading filter behavior** — selecting a domain scopes capabilities, selecting a capability scopes journeys/processes/sequences
- **Stepper transport control** — compact lower-left controls for stepping through sequential content with keyboard arrows
- **Seed data file split** — break seed-banking.ts (3000+ lines) into domain-specific files
- **Complexity refactors** — resolve BreadcrumbTrail and SearchPalette complexity warnings

### What 0.6.0 explicitly defers

- Mobile screen preview (floating overlay — 0.7.0)
- Switchboard plugin model (TypeScript port — 0.7.0+)
- Author Mode UI
- Evidence Mode
- Guided Tour participant model
- Backend / persistence API

---

## Phase 1: Left Panel Section Infrastructure

### Goal
Refactor the left panel from a monolithic domain/capability browser into collapsible sections with headers, item counts, and auto-hide behavior.

### Steps

**Create `CollapsibleSection.tsx`:**
- Reusable section component with header label, item count badge, collapse/expand toggle
- Auto-hides when item count is 0
- Remembers collapse state per section

**Refactor `LeftPanel.tsx`:**
- Replace current `DomainCapabilityBrowser` with section-based layout
- Phase 1 ships with two sections: Domains (always visible) and Capabilities (scoped to active domain)
- Vertical scroll when sections overflow
- Fixed panel width

**Section interaction pattern:**
- Click an item → fires kernel event (SELECT_DOMAIN, SELECT_CAPABILITY, etc.)
- Active item highlighted in the section
- Clear/reset via breadcrumb or "All Domains" click

### Done when
- Left panel shows collapsible Domains and Capabilities sections
- Selecting a domain scopes Capabilities section
- Sections auto-hide when empty
- Collapse/expand toggle works per section
- Item count badges visible on section headers

---

## Phase 2: Content Sections — Journeys, Processes, Sequences

### Goal
Add Journeys, Processes, and Sequences sections to the left panel, scoped to the active capability.

### Cascading filter rules
- **Domains** — always visible (9 items)
- **Capabilities** — visible when a domain is selected, scoped to that domain
- **Journeys** — visible when a capability is selected, shows journeys where `entryCapabilityId` or `capabilityIds` includes the active capability
- **Processes** — visible when a capability is selected, shows processes where `capabilityIds` includes the active capability
- **Sequences** — visible when a capability is selected, shows sequences where `capabilityId` matches

### Steps

**Add JourneysSection:**
- Lists journeys for the active capability
- Click fires `SELECT_JOURNEY`
- Section hides when no capability is active or capability has no journeys

**Add ProcessesSection:**
- Lists processes for the active capability
- Click fires `SELECT_PROCESS`
- Section hides when empty

**Add SequencesSection:**
- Lists sequences for the active capability
- Click fires `SELECT_SEQUENCE`
- Section hides when empty

### Done when
- Journeys, Processes, Sequences sections appear when a capability is selected
- Each section correctly scopes to the active capability
- Clicking an item in any section fires the correct kernel event
- Sections auto-hide when empty
- Active items highlighted

---

## Phase 3: Guides Section

### Goal
Add a Guides section that is always visible regardless of context, showing available guided routes.

### Design rule
Guides are cross-cutting teaching content — they should never be hidden by context scoping. They are the onboarding entry point.

### Steps

**Add GuidesSection:**
- Always visible, always expanded by default
- Lists all story routes
- Click fires `START_ROUTE`
- Shows route title and tag/audience badge
- Active route highlighted when a guided route is playing

### Done when
- Guides section always visible in the left panel
- All story routes listed
- Clicking a guide starts the route
- Active guide highlighted during playback

---

## Phase 4: Systems Section

### Goal
Add a Systems section that shows participating systems for the current context.

### Steps

**Add SystemsSection:**
- Shows terrain nodes (type: service, system) that participate in the current process, journey, or capability
- Uses the same scoping logic as the System perspective (`resolveSystemScope`)
- Click fires `SELECT_NODE`
- Section hides when there's insufficient context to scope meaningfully

### Done when
- Systems section shows context-scoped participating systems
- Clicking a system shows its detail in the right panel
- Section hides when no meaningful scope exists

---

## Phase 5: Stepper Transport Control

### Goal
Add compact transport controls in the lower left of the canvas for stepping through sequential content (Journey steps, Process stages, Sequence messages).

### Steps

**Create `StepperControl.tsx`:**
- Compact control cluster positioned above React Flow zoom controls
- Buttons: ⏮ (reset) ◀ (back) ▶ (forward) ⏭ (end)
- Position counter: "3 of 14"
- Only visible when a sequential perspective has active content

**Add generic stepper events to Context Machine:**
- `STEPPER_FORWARD` / `STEPPER_BACKWARD` / `STEPPER_RESET` / `STEPPER_END`
- Reconciler dispatches based on active perspective:
  - Journey → update `activeStepIndex`
  - Process → update `activeStageIndex` (new field)
  - Sequence → update `activeMessageIndex` (new field)

**Add `activeStageIndex` and `activeMessageIndex` to NavigationContext:**
- Both nullable, default null
- Set when stepping through process stages or sequence messages

**Add keyboard handler in AppShell:**
- Arrow Left/Right = back/forward
- Arrow Up = reset to start
- Arrow Down = jump to end
- Only active when stepper is visible and canvas is focused (not input fields)
- Does not conflict with React Flow pan (panOnScroll mode avoids arrow key panning)

**Coexistence rule:**
- If StoryRouteBar is active, stepper is hidden
- Only one transport control at a time

### Done when
- Stepper control visible in lower left when stepping through Journey/Process/Sequence
- Visual buttons and keyboard arrows both work
- Current position highlighted on canvas
- Stepper hidden when StoryRouteBar is active
- Arrow keys don't conflict with text input

---

## Phase 6: Technical Debt — Seed Split + Complexity Refactors

### Goal
Address accumulated technical debt: split the oversized seed file and resolve complexity warnings.

### Steps

**Split seed-banking.ts (~3000 lines) into:**
- `seed-domains.ts` — domains, capabilities
- `seed-terrain.ts` — nodes, edges, deployment enrichment
- `seed-content.ts` — journeys, steps, perspectives, layers, scenes, annotations, evidence, providers, associations, value streams, processes, stages, control points, BPMN, interfaces, messages, sequences
- `seed-routes.ts` — story waypoints, story routes
- `seed-banking.ts` — barrel re-export from all files

**Refactor BreadcrumbTrail (complexity 16 → ≤15):**
- Extract entity lookup into a helper function
- Or extract render segments into sub-components

**Refactor SearchPalette allItems (complexity 16 → ≤15):**
- Extract item builder functions per entity type

### Done when
- No single seed file exceeds 1000 lines
- Barrel export maintains same import API
- All existing tests pass without changes
- BreadcrumbTrail and SearchPalette complexity ≤ 15
- `pnpm check` has 0 warnings

---

## Phase 7: Tests + Version Bump

### Tests
- Left panel sections: render correctly, scope to active context, auto-hide when empty
- Cascading filter: domain → capability → journeys/processes/sequences
- Stepper: forward/backward/reset/end for each perspective
- Keyboard handler: arrow keys dispatch correct events
- Seed file split: all entities still parse, referential integrity holds
- All existing 333 tests still pass

### Done when
- All tests pass
- `pnpm build && pnpm test && pnpm check` clean (0 warnings)
- Version 0.6.0

---

## Sequencing

```
Phase 1 (Section infrastructure) → Phase 2 (Content sections) → Phase 3 (Guides) → Phase 4 (Systems) → Phase 5 (Stepper) → Phase 6 (Tech debt) → Phase 7 (Tests + version)
```

Phases 1-4 are the left panel rework. Phase 5 is the stepper control. Phase 6 is technical debt. Each phase is independently valuable.

---

## Audit Schedule

Pause for audit after phases **2** (Domains + Capabilities + content sections), **5** (Stepper complete), and **7** (final).

### Phase-specific audit prompts

- **After phase 2:** Does the left panel feel like a contextual navigation hub? Do sections scope correctly? Does the cascading filter work?
- **After phase 5:** Does the stepper feel natural? Do keyboard controls work without conflict? Does it coexist with StoryRouteBar?
- **After phase 7:** Is the seed file split clean? Are all complexity warnings resolved? Does the full left panel + stepper + canvas integration feel cohesive?

---

## Design Rules

1. **The left panel follows the shared context contract.** Section scoping is driven by kernel nav state, not panel-local state.
2. **Sections hide when irrelevant.** Empty sections don't show an empty list — they hide entirely.
3. **Guides are always visible.** They're the teaching/onboarding entry point and should never be hidden by context scoping.
4. **The left panel is for navigation, not detail.** Click an item to navigate. See its detail in the right panel.
5. **The stepper is a canvas tool, not a narrative bar.** Positioned with zoom controls, not as a full-width overlay.
6. **One transport control at a time.** StoryRouteBar takes precedence over stepper.

---

## Watchpoints

- **Left panel width at scale.** With 7 sections, the panel needs enough width for readable labels but not so much that it crowds the canvas. Consider a resizable panel border.
- **Section collapse state persistence.** Users who collapse a section shouldn't have it re-open on every context change.
- **Stepper vs React Flow arrow keys.** React Flow uses arrow keys for panning when `panOnScroll` is false. Since we use `panOnScroll`, arrow keys are free — but verify no conflict.
- **Performance with many sections.** At scale (150 capabilities), the left panel renders many items. Consider virtualization if scrolling becomes sluggish.
