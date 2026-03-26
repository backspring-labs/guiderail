# IDEA — Left Panel as Contextual Navigation Hub

## Context

The left panel currently shows a flat list of domains expanding to capabilities. At current scale (9 domains, 16 capabilities) this is adequate. At target scale (9+ domains, 15-17 capabilities per domain = 135-150 capabilities), a flat drill-down won't work.

The left panel should become a **context-aware navigation hub** with collapsible sections that scope themselves to the current selection context.

---

## Current State

```
┌──────────────────────┐
│ All Domains           │
│   ▶ Customer          │
│   ▶ Accounts          │
│   ▶ Payments          │
│   ...                 │
└──────────────────────┘
```

Static domain list → capability drill-down. No journeys, processes, guides, sequences, or systems in the panel.

---

## Proposed Design

```
┌──────────────────────┐
│ 🔍 Search            │  quick filter across all sections
├──────────────────────┤
│ ▼ DOMAINS            │  always visible, collapsible
│   ● Customer         │
│   ● Accounts         │
│   ▶ Payments ────────│─→ selected domain
│   ● Risk & Identity  │
│   ● Orchestration    │
│   ● Channels         │
│   ● Networks         │
│   ● Rails            │
│   ● Data & Rewards   │
├──────────────────────┤
│ ▼ CAPABILITIES       │  scoped to selected domain
│   ○ Money Movement   │
│   ● Payment Proc ────│─→ selected capability
│   ○ Network Auth     │
│   ○ Settlement       │
├──────────────────────┤
│ ▼ JOURNEYS           │  scoped to selected capability
│   ○ Open Savings Acct│
├──────────────────────┤
│ ▼ PROCESSES          │  scoped to selected capability
│   ○ Payment Auth     │
│   ○ Card Auth        │
├──────────────────────┤
│ ▼ SEQUENCES          │  scoped to selected capability
│   ○ Payment Auth Flow│
├──────────────────────┤
│ ▼ GUIDES             │  always visible (cross-cutting)
│   ○ How a Payment    │
│     Flows            │
│   ○ Full Descent     │
│   ○ Process Modes    │
├──────────────────────┤
│ ▶ SYSTEMS            │  scoped to current context
└──────────────────────┘
```

---

## Cascading Filter Behavior

The left panel follows the shared context contract. Each section scopes itself based on the current selection:

| Selection | Domains | Capabilities | Journeys | Processes | Sequences | Guides | Systems |
|---|---|---|---|---|---|---|---|
| Nothing selected | All | Hidden | Hidden | Hidden | Hidden | All | Hidden |
| Domain selected | All (highlight active) | Domain's capabilities | Domain's journeys | Domain's processes | Domain's sequences | All | Domain's systems |
| Capability selected | All (highlight active) | Domain's capabilities (highlight active) | Capability's journeys | Capability's processes | Capability's sequences | All | Capability's systems |
| Journey active | All | All | Highlight active | Related processes | Related sequences | All | Participating systems |

### Rules:
- **Domains** are always visible (9 items, manageable)
- **Capabilities** appear only when a domain is selected (15-17 items, manageable)
- **Journeys, Processes, Sequences** appear only when scoped by domain or capability (typically 1-5 items each)
- **Guides** are always visible regardless of context (they're cross-cutting teaching content)
- **Systems** appear when there's enough context to scope them meaningfully
- **Sections collapse when empty** — if a capability has no journeys, the Journeys section hides

---

## Interaction Patterns

### Click behavior
- **Click a domain** → sets `activeDomainId`, scopes all downstream sections, updates canvas
- **Click a capability** → sets `activeCapabilityId`, scopes downstream sections
- **Click a journey** → fires `SELECT_JOURNEY`, activates journey context, switches to Journey perspective if not already there
- **Click a process** → fires `SELECT_PROCESS`, activates process context
- **Click a sequence** → navigates to Sequence perspective with the relevant interface/message context
- **Click a guide** → fires `START_ROUTE`, begins guided route playback
- **Click a system** → fires `SELECT_NODE`, shows system detail

### Expand affordance
Each section uses the same `+` expand / click = detail pattern established in 0.5.0:
- Click a section item → sets context, shows detail in right panel
- `+` or explicit action → drills deeper (e.g., opens journey step flow)

### Clear / breadcrumb reset
- Clicking "All Domains" in the breadcrumb or context bar clears domain selection → all downstream sections reset
- Each section header could have a clear/reset affordance

---

## Sequences in the Left Panel

Sequences are currently only accessible via the Sequence perspective tab. Adding them to the left panel enables direct navigation to specific call flows:

### What a "sequence" represents in the panel
A sequence is a named collection of interfaces and messages that form a coherent runtime call flow. Currently the seed data has one implicit sequence (payment authorization). At scale, there would be multiple:
- Payment Authorization Flow
- Account Opening Flow
- Transfer Execution Flow
- Fraud Review Escalation Flow

### What selecting a sequence does
1. Sets context to the relevant interfaces/messages
2. Switches to Sequence perspective (or scopes the current Sequence view)
3. Right panel shows sequence metadata (description, participating interfaces, message count)

### What this might need in the kernel
Currently there's no explicit "Sequence" entity — interfaces and messages exist but aren't grouped into named sequences. Options:
- **Option A:** Add a `SequenceFlow` entity (id, label, description, interfaceIds, messageIds) — explicit grouping
- **Option B:** Derive sequences from processes — each process maps to a sequence of interface calls
- **Option C:** Use StoryRoutes that happen to use Sequence perspective — existing mechanism, no new entity

Option A is cleanest for the left panel — it gives sequences a name and description that can be displayed.

---

## Panel Sizing at Scale

At target scale with all sections visible:
- Domains: ~9 items (always visible)
- Capabilities: ~15-17 items (when domain selected)
- Journeys: ~1-5 items (when capability selected)
- Processes: ~1-3 items
- Sequences: ~1-3 items
- Guides: ~6-10 items (always visible)
- Systems: ~3-10 items

Total visible items when fully expanded: ~40-55 items. This fits in a scrollable panel. Most sections will be collapsed most of the time, so the typical visible count is ~15-25 items.

### Overflow strategy
- Sections are independently scrollable if they exceed their allocated space
- Collapsed sections show only the header with item count badge
- The panel itself scrolls vertically

---

## Relationship to Canvas

The left panel and canvas are synchronized through the shared context contract:
- Selecting a domain in the left panel → Landscape canvas highlights that domain
- Selecting a capability → canvas scopes to that capability's nodes
- Selecting a journey → Journey canvas shows the step flow
- Selecting a process → Process canvas shows the BPMN flow

The left panel is the **navigation control surface**. The canvas is the **visualization surface**. The right panel is the **detail surface**. Each has a clear role.

---

## Relationship to Search

The search palette (Cmd+K) searches across all entity types globally. The left panel's search filters within the visible sections contextually. They complement each other:
- **Cmd+K** = "I know what I'm looking for" (global jump)
- **Left panel filter** = "Show me what's available in this context" (scoped browse)

---

## Implementation Approach

### Phase 1: Section infrastructure
- Refactor LeftPanel into collapsible sections with headers and item counts
- Add cascading filter logic based on nav context
- Sections: Domains, Capabilities

### Phase 2: Content sections
- Add Journeys, Processes, Guides sections
- Wire click handlers to fire kernel events
- Scope each section to the current domain/capability context

### Phase 3: Sequences and Systems
- Add Sequences section (requires SequenceFlow entity or derived grouping)
- Add Systems section (scoped to participating systems)

### Phase 4: Polish
- Section collapse/expand animation
- Item count badges on collapsed headers
- Local search/filter within panel
- Empty section auto-hide

---

## Design Rules

1. **The left panel follows the shared context contract.** Section scoping is driven by `activeDomainId`, `activeCapabilityId`, and other nav state — not by panel-local state.

2. **Sections hide when irrelevant.** If a capability has no journeys, the Journeys section doesn't show an empty list — it hides entirely.

3. **Guides are always visible.** They're the teaching/onboarding entry point and should never be hidden by context scoping.

4. **The panel is for navigation, not detail.** Click an item to navigate. See its detail in the right panel. The left panel should not try to show entity metadata beyond label and count.

5. **Scale-appropriate disclosure.** At 9 domains, show all. At 150 capabilities, show only the scoped subset. The cascading filter ensures the panel never overwhelms.
