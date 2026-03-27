# Sequence Entity + Filtered Sequence Perspective Plan

## Context

The Sequence perspective currently renders ALL interfaces and ALL messages as one flat diagram — `computeSequenceLayout(seedInterfaces, seedMessages)` with no filtering. This worked at 8 lifelines and 14 messages but won't scale to multiple sequence flows.

Interfaces and Messages exist in the kernel but have no upward link to Capability, Process, Journey, or any business context. They're orphaned at the bottom of the entity graph.

This plan adds `Sequence` as a first-class runtime interaction slice anchored to exactly one Capability and optionally one Journey and/or one Process. It is not an arbitrary UI filter and not merely a rendering convenience. It completes the Capability triad (Journey / Process / Sequence).

### Anti-goal

Sequence is not intended to represent every possible runtime flow, every exception branch, or exhaustive coverage of all capability behavior. A Sequence should exist only when it teaches a meaningful runtime pattern, boundary crossing, provider integration, trust transition, or escalation path.

---

## What this adds

- `Sequence` entity in `@guiderail/core`
- `SELECT_SEQUENCE` / `CLEAR_SEQUENCE` events in Context Machine
- `activeSequenceId` in NavigationContext
- Semantic validation rules for Sequence referential integrity
- Seed data: small curated set of instructional sequences
- Sequence perspective filters to active sequence
- Left panel Sequences section (scoped to active capability)
- Search palette indexes sequences

## What this does NOT add

- No new perspectives or canvas modes
- No kernel entity changes to Interface or Message (they stay as-is)
- No changes to other perspectives
- No requirement that every capability have a Sequence
- No requirement that every interface/message belong to exactly one Sequence
- No change to Journey or Process semantics
- No immediate support for alt/opt/loop branching fragments in Phase 1

### Overlap rule

Sequences may overlap. Shared interfaces and messages across multiple Sequences are allowed when the runtime interaction slice is intentionally reused across business contexts.

### Future note

Future iterations may support richer sequence semantics such as alternate paths, grouped interaction fragments, and conditional branches once the base entity model is stable.

---

## Phase 1: Kernel — Sequence Entity

### Schema

```typescript
SequenceSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  capabilityId: z.string(),                // required business context anchor
  journeyId: z.string().optional(),        // optional business-scenario anchor
  processId: z.string().optional(),        // optional execution anchor
  interfaceIds: z.array(z.string()),       // participating lifelines
  messageIds: z.array(z.string()),         // ordered messages in this slice
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.unknown()).default({}),
  provenance: ProvenanceRefSchema.optional(),
});
```

### Semantic validation rules

These invariants must hold:

1. Every Sequence must belong to exactly one capability (`capabilityId` required)
2. If `journeyId` is present, that journey must be compatible with the same capability
3. If `processId` is present, that process must be compatible with the same capability
4. Every `interfaceId` must reference a valid Interface entity
5. Every `messageId` must reference a valid Message entity
6. Every message in a Sequence must have both source and target interfaces represented in `interfaceIds` — if a message references an interface not in the list, validation must fail or auto-include the missing interface deterministically
7. Duplicate IDs in `interfaceIds` or `messageIds` are invalid
8. Overlap across Sequences is explicitly allowed

### Steps

**Create `packages/core/src/entities/sequence.ts`**

**Export from `entities/index.ts`**

**Add to Context Machine:**
- `Sequence[]` in `ContextMachineContext`
- `sequences?: Sequence[]` in INITIALIZE event (optional, backward-compat)
- `sequences: []` in initial context
- `sequences: event.sequences ?? []` in INITIALIZE handler

**Add navigation events:**
- `SELECT_SEQUENCE`: `{ type: "SELECT_SEQUENCE"; sequenceId: string }`
- `CLEAR_SEQUENCE`: `{ type: "CLEAR_SEQUENCE" }`

**Add to NavigationContext:**
- `activeSequenceId: z.string().nullable().default(null)`

**Add reconciler function — `reconcileSequenceSwitch(ctx, sequenceId, sequence)`:**

Selection behavior:
- Set `activeSequenceId`
- Preserve `activeDomainId`
- Preserve `activeCapabilityId` if it matches the selected sequence's `capabilityId`
- Auto-set `activeDomainId` and `activeCapabilityId` from the selected sequence if they are missing or inconsistent
- Preserve `activeProcessId` only if it matches `sequence.processId`
- Preserve `activeJourneyId` only if it matches `sequence.journeyId`
- Clear unrelated journey/process selection if inconsistent
- Does NOT force a perspective switch by itself

Separate rule: selecting a Sequence from left nav, search, or picker may set `activePerspectiveId` to the sequence perspective when that action is explicit (UI-layer decision, not reconciler responsibility).

**Add reconciler function — `reconcileSequenceClear(ctx)`:**
- Clear `activeSequenceId`
- Preserve all other context

### Indexing

Add indexed lookup structures for efficient rendering:
- `sequenceById`: Map<string, Sequence>
- `sequencesByCapabilityId`: Map<string, Sequence[]>

These can be computed once at INITIALIZE and stored in the Context Machine context or derived in the UI layer.

### Done when
- `SequenceSchema` exists and validates
- Semantic validation rules enforced in tests
- Context Machine accepts sequences in INITIALIZE
- SELECT_SEQUENCE / CLEAR_SEQUENCE events work with correct reconciliation
- activeSequenceId in NavigationContext
- All existing tests pass

---

## Phase 2: Seed Data — Named Sequences

### Curation rule

Seed only a small curated set of instructional sequences. Do not create one sequence per capability. A Sequence should exist only when it teaches a meaningful runtime pattern, boundary crossing, provider integration, trust transition, or escalation path.

### Steps

**Add sequences to seed-banking.ts:**

```typescript
export const sequences: Sequence[] = [
  {
    id: "seq-payment-auth",
    label: "Payment Authorization",
    description: "Full request/response sequence for authorizing a card payment — from customer device through gateway, orchestration, fraud screening, network authorization, and ledger posting",
    capabilityId: "cap-payment-processing",
    processId: "proc-payment-auth",
    interfaceIds: ["iface-mobile", "iface-gateway", "iface-orch", "iface-fraud",
                   "iface-aml", "iface-policy", "iface-network", "iface-ledger"],
    messageIds: ["msg-1", "msg-2", "msg-3", "msg-4", "msg-5", "msg-6", "msg-7",
                 "msg-8", "msg-9", "msg-10", "msg-11", "msg-12", "msg-13", "msg-14"],
    tags: ["payments", "authorization", "instructional"],
  },
].map((d) => SequenceSchema.parse(d));
```

**Export from test-fixtures/index.ts**

**Add to seed-loader.ts:**
- Import and export `seedSequences`

**Add to content/file-loader.ts:**
- Add `sequences` to ENTITY_SCHEMAS and ContentBundle

### Done when
- Seed data includes curated instructional sequences (not exhaustive per-capability)
- All interface/message IDs in the sequence reference valid entities
- All messages have both source and target interfaces in the sequence's interfaceIds
- Schema validation passes

---

## Phase 3: Sequence Perspective — Filtered Rendering

### Steps

**Update `use-perspective-provider.ts`:**

```typescript
const sequenceLayout = useMemo(() => {
  if (!isSequencePerspective) return null;
  const activeSequence = nav.activeSequenceId
    ? seedSequences.find((s) => s.id === nav.activeSequenceId)
    : null;
  if (activeSequence) {
    const filteredInterfaces = seedInterfaces.filter((i) =>
      activeSequence.interfaceIds.includes(i.id));
    const filteredMessages = seedMessages.filter((m) =>
      activeSequence.messageIds.includes(m.id));
    return computeSequenceLayout(filteredInterfaces, filteredMessages);
  }
  return computeSequencePickerLayout(seedSequences, nav.activeCapabilityId);
}, [isSequencePerspective, nav.activeSequenceId, nav.activeCapabilityId]);
```

**Create `computeSequencePickerLayout(sequences, activeCapabilityId)`:**
- Shows available sequences as clickable cards
- Scoped to active capability when capability is active
- Otherwise grouped by capability
- Each card shows: label, description, interface count, message count
- `+` expand affordance fires SELECT_SEQUENCE

**Picker interaction semantics:**
- Click a card = select sequence and synchronize context (via reconcileSequenceSwitch)
- Explicit expand action (`+` button) = open/render in Sequence perspective
- Picker scoped to active capability when capability is active

**Create `SequencePickerNode.tsx`:**
- Card component for sequence selection
- Dispatches `guiderail:expand` with `{ type: "sequence", id: sequenceId }`

**Register `sequence_picker` in node-types.ts**

**Update AppShell.tsx:**
- Handle `guiderail:expand` for `type: "sequence"` — fire `SELECT_SEQUENCE`

### Done when
- Sequence perspective shows picker when no sequence is active
- Picker scoped to active capability when applicable
- Clicking a sequence card → detail in right panel with context synchronized
- Expanding a sequence → renders filtered lifeline diagram
- Only the selected sequence's interfaces and messages are shown

---

## Phase 4: Left Panel + Search + Detail

### Steps

**Left panel Sequences section:**
- Add Sequences section to LeftPanel
- Shows sequences where `sequence.capabilityId` equals `activeCapabilityId`
- If no capability is active, the section hides
- Click fires SELECT_SEQUENCE (does not require user to already be in Sequence perspective)
- Section hides when empty

**Search palette:**
- Add sequences to SearchPalette searchable items
- Type: "sequence", action fires SELECT_SEQUENCE
- If a Sequence is selected from global search, the app automatically activates its domain and capability context, optionally activates its journey/process if linked, and then selects the sequence

**Detail panel:**
- Add sequence detail resolver to DetailPanelRouter
- Shows: label, description, capability link, process link (if linked), journey link (if linked), interface count, message count
- "Open Sequence" action button

**Context bar:**
- Show active sequence name in breadcrumb trail when activeSequenceId is set

### Done when
- Sequences appear in left panel scoped to capability
- Cmd+K search finds sequences and synchronizes full context
- Clicking a sequence in left panel or search navigates to it
- Active sequence shown in context bar breadcrumb

---

## Phase 5: Tests

### Tests
- Sequence schema validation (valid + invalid)
- Semantic validation: interfaceIds/messageIds referential integrity
- Semantic validation: message interfaces must be in interfaceIds
- Semantic validation: no duplicate IDs
- Context machine: SELECT_SEQUENCE / CLEAR_SEQUENCE events
- Reconciler: reconcileSequenceSwitch preserves compatible context, clears incompatible
- Reconciler: auto-sets domain/capability from sequence when missing
- Seed data: all sequences pass semantic validation
- Sequence perspective: filtered layout renders correct subset
- All existing 318 tests still pass

### Done when
- All tests pass
- `pnpm build && pnpm test && pnpm check` clean

---

## Sequencing

```
Phase 1 (Kernel entity) → Phase 2 (Seed data) → Phase 3 (Filtered rendering) → Phase 4 (Left panel + search) → Phase 5 (Tests)
```

Phases 1-3 are the core work. Phase 4 is UI integration. Phase 5 is verification.

---

## Entity Lineage After This Work

```
Domain
  └── Capability
        ├── Journey    → what the user experiences (Steps)
        ├── Process    → how the work executes (ProcessStages)
        └── Sequence   → how systems interact at runtime for a named instructional scenario slice
```

The Capability triad is complete. Each arm of the triad has:
- A grouping entity (Journey, Process, Sequence)
- Child entities (Steps, ProcessStages, Interfaces+Messages)
- A dedicated perspective with filtered rendering
- A selection event (SELECT_JOURNEY, SELECT_PROCESS, SELECT_SEQUENCE)
- Left panel navigation scoped to the active capability
- Reconciliation that synchronizes context from the entity's anchors

### Future metadata (reserved, not implemented)

These fields may be added to Sequence metadata in future iterations when needed:
- Scenario type (happy path, error path, edge case)
- Sync/async hints
- Trust boundary markers
- External provider involvement flags
- Control-point flags
