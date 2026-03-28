# GuideRail 0.6.0 Implementation Plan

## Context

GuideRail 0.5.0 shipped the canvas fidelity release — purpose-built canvas templates for each perspective, file-based content loading, and the Sequence entity completing the Capability triad. Post-0.5.0, the Sequence entity was added with filtered rendering, picker cards, search integration, and context bar breadcrumb.

The left panel remains a flat domain → capability drill-down from 0.3.0. At scale (135-150 capabilities), this won't work. The product needs a context-aware navigation hub that scopes itself to the current primary selection and surfaces Journeys, Processes, Sequences, and Guides alongside Domains and Capabilities.

GuideRail 0.6.0 is the **navigation hub release**. It transforms the left panel into a cascading contextual navigator, adds the stepper transport control for sequential perspectives, and addresses accumulated technical debt.

### 0.6.0 proof statement

GuideRail 0.6.0 proves that users can browse, filter, and traverse the full entity landscape through a context-aware left navigation hub, while stepping through sequential content without losing context.

### What 0.6.0 is

- A navigation and transport release
- Left panel becomes a scoped entity browser
- Stepper adds keyboard-driven sequential traversal

### What 0.6.0 is NOT

- Not a new information architecture for every entity relationship
- Not a redefinition of kernel event semantics
- Not a full content graph redesign
- Not an attempt to solve all entity traversal in one release

### Reference

- `docs/ideas/left-panel-contextual-navigation-idea.md` — full design
- `docs/ideas/stepper-transport-control-idea.md` — transport control design
- `docs/plans/sequence-entity-plan.md` — Sequence entity (shipped post-0.5.0)

---

## Primary Selection Model

The left panel is always scoped off the **current primary selection**, not the current perspective.

### Primary selection precedence (highest to lowest)

```
route > sequence > process > journey > capability > domain
```

At any time, exactly one primary selection level is active. Lower-level selections override higher-level ones for scoping but preserve the higher-level context (e.g., selecting a journey preserves the active domain and capability).

### Canonical scoping rule

> The left panel is always scoped off the current primary selection, not the current perspective.

This means:
- Switching perspectives does not change left panel scoping
- The left panel shows what's available in the current selection context, regardless of which canvas is active
- Only explicit selection events (SELECT_DOMAIN, SELECT_CAPABILITY, etc.) change what the left panel shows

---

## Section Scoping Predicates

Every section defines its inclusion predicate against the active selection. This is the single source of truth for what appears in each section.

| Section | Inclusion predicate | Visibility rule |
|---|---|---|
| Domains | Top-level set (all domains) | Always visible |
| Capabilities | `capability.domainId === activeDomainId` | Visible when domain selected |
| Journeys | `journey.capabilityIds.includes(activeCapabilityId)` or `journey.entryCapabilityId === activeCapabilityId` | Visible when capability selected |
| Processes | `process.capabilityIds.includes(activeCapabilityId)` | Visible when capability selected |
| Sequences | `sequence.capabilityId === activeCapabilityId` or `sequence.processId === activeProcessId` | Visible when capability or process selected |
| Providers | `providerAssociation.targetType === "capability" && providerAssociation.targetId === activeCapabilityId` | Visible when capability selected |
| Systems | Resolved by `resolveSystemScope` from selected entity — direct resolution only, no secondary graph traversal | Visible when process, journey, or capability selected |

### Panel layout (fixed for 0.6.0)

The left panel has three zones:

```
┌──────────────────────┐
│ 🔍 Filter...         │  ← local filter across visible sections
├──────────────────────┤
│ ▼ DOMAINS            │
│ ▼ CAPABILITIES       │
│ ▼ JOURNEYS           │  Entity browsing zone
│ ▼ PROCESSES          │  (scoped to primary selection)
│ ▼ SEQUENCES          │
│ ▼ PROVIDERS          │
│ ▼ SYSTEMS            │
├──────────────────────┤
│ 📚 GUIDES            │  Teaching zone
│   ○ How a Payment    │  (always visible, visually separated)
│     Flows            │
│   ...                │
└──────────────────────┘
```

- **Filter input** at top — filters items across all visible sections contextually
- **Entity browsing zone** — sections scoped to primary selection, ordered as listed
- **Teaching zone** — Guides section separated by divider, always visible regardless of context, visually distinct background tint

### Section order within entity browsing zone (fixed for 0.6.0)

```
Domains → Capabilities → Journeys → Processes → Sequences → Providers → Systems
```

Guides are NOT in the section order — they live in a separate zone below.

This order is locked for 0.6.0. No reordering without a plan amendment.

---

## Selection Reset Rules

- **Selecting a domain** clears capability, journey, process, sequence selection — unless the current capability still belongs to that domain
- **Selecting a capability** clears journey, process, sequence selection — unless the current journey/process/sequence is still valid under that capability
- **Clearing to "All Domains"** resets all scoped sections (capability, journey, process, sequence)
- **Guide playback** does not reset domain/capability selection — guides overlay the current context
- **Selecting a system in the Systems section** changes the right panel detail but does NOT re-anchor all left-nav sections — system selection is informational, not a primary selection change

---

## What 0.6.0 adds

- **Left panel contextual navigation hub** — collapsible sections scoped to primary selection
- **Entity sections:** Domains, Capabilities, Journeys, Processes, Sequences, Providers, Systems (fixed order)
- **Teaching zone:** Guides section visually separated, always visible
- **Local filter** — text input filters within visible sections
- **Cascading filter behavior** — deterministic scoping predicates per section
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
- Cross-section ordering changes
- Secondary graph traversal in Systems section

---

## Phase 1: Seed Split + Section Infrastructure

### Goal
Split the oversized seed file first (enabling work), then refactor the left panel into collapsible sections.

### Seed split

**Split seed-banking.ts (~3000 lines) into:**
- `seed-domains.ts` — domains, capabilities
- `seed-terrain.ts` — nodes, edges, deployment enrichment
- `seed-content.ts` — journeys, steps, perspectives, layers, scenes, annotations, evidence, providers, associations, value streams, processes, stages, control points, BPMN, interfaces, messages, sequences
- `seed-routes.ts` — story waypoints, story routes
- `seed-banking.ts` — barrel re-export from all files (maintains same import API)

### Section infrastructure

**Create `CollapsibleSection.tsx`:**
- Reusable section component with header label, item count badge, collapse/expand toggle
- Auto-hides when item count is 0 — hidden sections do not leave empty vertical gaps
- Collapse state persisted by section key only (not per entity context) for 0.6.0
- Default: Domains expanded, Guides expanded, other sections collapsed until populated

**Create filter input:**
- Text input at top of left panel
- Filters items across all visible sections by label match
- Clears on focus loss or explicit clear button
- Does not change kernel selection — only visual filtering within the panel

**Refactor `LeftPanel.tsx`:**
- Three-zone layout: filter input, entity browsing zone, teaching zone (Guides)
- Replace current `DomainCapabilityBrowser` with section-based layout
- Phase 1 ships with two sections: Domains (always visible) and Capabilities (scoped to active domain)
- Guides section in separated teaching zone below entity sections
- Vertical scroll when sections overflow
- Fixed panel width

**Section interaction pattern:**
- Click an item → fires kernel event
- Exactly one primary active item highlighted per section
- Clear/reset via breadcrumb or "All Domains" click

### Done when
- No single seed file exceeds 1000 lines
- Barrel export maintains same import API — all existing tests pass without changes
- Left panel shows three-zone layout: filter input, entity sections, teaching zone
- Domains and Capabilities sections work with cascading filter
- Guides section visible in teaching zone below entity sections
- Filter input narrows items across visible sections
- Sections auto-hide when empty (no vertical gaps)
- Collapse/expand toggle works per section
- Item count badges visible on section headers

---

## Phase 2: Content Sections — Journeys, Processes, Sequences, Providers

### Goal
Add Journeys, Processes, Sequences, and Providers sections to the entity browsing zone, scoped to the active capability (and for Sequences, also to the active process).

### Steps

**Add JourneysSection:**
- Inclusion: `journey.capabilityIds.includes(activeCapabilityId)` or `journey.entryCapabilityId === activeCapabilityId`
- Click fires `SELECT_JOURNEY`
- Section hides when no capability is active or capability has no journeys

**Add ProcessesSection:**
- Inclusion: `process.capabilityIds.includes(activeCapabilityId)`
- Click fires `SELECT_PROCESS`
- Section hides when empty

**Add SequencesSection:**
- Inclusion: `sequence.capabilityId === activeCapabilityId` or `sequence.processId === activeProcessId`
- Click fires `SELECT_SEQUENCE`
- Section hides when empty
- Shows sequences for both the active capability AND the active process (dual access path)

**Add ProvidersSection:**
- Inclusion: providers linked to the active capability via `providerAssociation.targetType === "capability" && providerAssociation.targetId === activeCapabilityId`
- Click fires `SELECT_NODE` with the provider ID (shows provider detail in right panel)
- Section hides when no capability is active or capability has no providers

### Done when
- Journeys, Processes, Sequences, Providers sections appear when a capability is selected
- Sequences also appear when a process is selected (even without a capability)
- Each section correctly follows its inclusion predicate
- Clicking an item fires the correct kernel event
- Sections auto-hide when empty (no vertical gaps)
- Exactly one primary active item highlighted per section

---

## Phase 3: Systems Section

### Goal
Add a Systems section that shows participating systems for the current context.

### Design rules
- Systems section is **read-only discovery**, not a second terrain navigator
- It shows only systems directly resolved by the selected entity — no secondary graph traversal in 0.6.0
- Clicking a system changes the right panel detail but does NOT re-anchor all left-nav sections

### Steps

**Add SystemsSection:**
- Inclusion: terrain nodes resolved by `resolveSystemScope` from the current process, journey, or capability
- Click fires `SELECT_NODE` — right panel shows detail, left panel does not re-scope
- Section hides when there's insufficient context to scope
- Systems shown are deterministic for a given selection

### Done when
- Systems section shows context-scoped participating systems
- Clicking a system shows its detail in the right panel without re-anchoring left nav
- Section hides when no meaningful scope exists
- Systems shown are deterministic and reproducible

---

## Phase 4: Stepper Transport Control

### Goal
Add compact transport controls in the lower left of the canvas for stepping through sequential content.

### Stepper state semantics

The stepper is **perspective transport**, not general navigation:
- Stepper changes position within the currently selected sequential artifact
- Stepper does NOT change the left panel's primary selection model
- Stepper updates local sequential indices only (`activeStepIndex`, `activeStageIndex`, `activeMessageIndex`)
- Selecting a different entity resets incompatible step indices

### Reset rules
- Selecting a new journey sets `activeStepIndex = 0`
- Selecting a new process sets `activeStageIndex = null` until first stepper interaction
- Selecting a new sequence sets `activeMessageIndex = null` until first stepper interaction
- Changing perspective away from sequential content hides the stepper but preserves the index for return-in-session behavior
- Stepper indices do not leak between entity types

### Steps

**Create `StepperControl.tsx`:**
- Compact control cluster positioned above React Flow zoom controls (lower left)
- Buttons: ⏮ (reset) ◀ (back) ▶ (forward) ⏭ (end)
- Position counter: "3 of 14"
- Only visible when a sequential perspective has active content

**Add generic stepper events to Context Machine:**
- `STEPPER_FORWARD` / `STEPPER_BACKWARD` / `STEPPER_RESET` / `STEPPER_END`
- Reconciler dispatches based on active perspective

**Add `activeStageIndex` and `activeMessageIndex` to NavigationContext:**
- Both nullable, default null

**Add keyboard handler in AppShell:**
- Arrow Left/Right = back/forward
- Arrow Up = reset to start
- Arrow Down = jump to end
- Only active when stepper is visible and canvas is focused (not input fields)

**Coexistence rule:**
- Story route playback owns transport priority — stepper hidden when StoryRouteBar is active
- Guide playback and stepper never render simultaneously

### Done when
- Stepper control visible in lower left when stepping through Journey/Process/Sequence
- Visual buttons and keyboard arrows both work
- Current position highlighted on canvas
- Stepper hidden when StoryRouteBar is active — story route playback owns transport priority
- Arrow keys don't conflict with text input
- Selecting a new entity resets incompatible indices

---

## Phase 5: Complexity Refactors

### Goal
Resolve the two remaining complexity warnings.

### Steps

**Refactor BreadcrumbTrail (complexity 16 → ≤15):**
- Extract entity lookup into a helper function
- Or extract render segments into sub-components

**Refactor SearchPalette allItems (complexity 16 → ≤15):**
- Extract item builder functions per entity type

### Done when
- BreadcrumbTrail and SearchPalette complexity ≤ 15
- `pnpm check` has 0 warnings

---

## Phase 6: Tests + Version Bump

### Tests

**Section rendering:**
- Sections render correctly for each scoping predicate
- Sections auto-hide when empty (no vertical gaps)
- Exactly one primary active item highlighted per section

**Cascading filter:**
- Domain selection → capability section scopes correctly
- Capability selection → journeys/processes/sequences scope correctly
- Sequences show for both active capability AND active process

**Selection integrity:**
- Selecting an entity invalidates stale child selections cleanly
- Hidden sections reappear correctly when scope becomes valid again
- Switching perspectives does not corrupt left-nav active state
- System selection does not re-anchor left-nav sections

**Stepper:**
- Forward/backward/reset/end for each perspective type
- Keyboard handler dispatches correct events
- Stepper indices do not leak between entity types
- Guide playback and stepper never render simultaneously

**Seed file split:**
- All entities still parse through Zod schemas
- Referential integrity holds across split files
- Barrel export maintains same import API

**Existing tests:**
- All existing 333 tests still pass

### Done when
- All tests pass
- `pnpm build && pnpm test && pnpm check` clean (0 warnings)
- Version 0.6.0

---

## Sequencing

```
Phase 1 (Seed split + sections + filter + guides) → Phase 2 (Content sections + providers) → Phase 3 (Systems) → Phase 4 (Stepper) → Phase 5 (Complexity refactors) → Phase 6 (Tests + version)
```

Seed split and Guides moved to Phase 1 as foundational work. Providers added to Phase 2 alongside other content sections.

---

## Audit Schedule

Pause for audit after phases **2** (all content sections), **4** (stepper complete), and **6** (final).

### Phase-specific audit prompts

- **After phase 2:** Does the left panel feel like a contextual navigation hub? Do all 7 entity sections + Guides teaching zone work correctly? Do sections scope deterministically per the predicate table? Is the filter input narrowing items across sections? Are Providers scoped to capability?
- **After phase 4:** Does the stepper feel natural? Do keyboard controls work without conflict? Does it coexist correctly with StoryRouteBar? Do stepper indices reset cleanly on entity change?
- **After phase 6:** Are all complexity warnings at 0? Does the full left panel + stepper + canvas integration feel cohesive? Do selection integrity tests pass?

---

## Design Rules

1. **The left panel is scoped off primary selection, not perspective.** Switching perspectives does not change left panel content.
2. **Every section defines its inclusion predicate.** No ad-hoc scoping logic.
3. **Sections hide when irrelevant.** No empty lists, no vertical gaps.
4. **Guides live in a separated teaching zone.** Always visible, visually distinct from entity browsing. Guide playback does not reset other selections.
5. **Providers are contextual participants.** Scoped to capability, shown alongside journeys/processes/sequences.
6. **Systems are read-only discovery.** System clicks show detail but don't re-anchor nav.
7. **The stepper is perspective transport.** It updates sequential indices only, not primary selection.
8. **Story route playback owns transport priority.** Stepper and StoryRouteBar never render simultaneously.
9. **Section order is fixed for 0.6.0.** Entity zone: Domains → Capabilities → Journeys → Processes → Sequences → Providers → Systems. Teaching zone: Guides.
10. **Exactly one primary active item per section.** No multi-select, no ambiguous highlighting.
11. **Filter input is visual only.** It narrows what's displayed in the panel but does not change kernel selection state.

---

## Watchpoints

- **Left panel width at scale.** 7 sections with 150 capabilities needs enough width for readable labels without crowding the canvas.
- **Collapse state persistence.** Persisted by section key only in 0.6.0, not per entity context. Default: Domains and Guides expanded, others collapsed until populated.
- **Stepper vs React Flow arrow keys.** `panOnScroll` mode avoids conflict — verify no edge cases.
- **Performance with many sections.** Consider virtualization if scrolling becomes sluggish at scale.
- **Systems section scope creep.** Systems is read-only discovery — do not let it become a second terrain navigator.
