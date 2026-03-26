# Sequence Entity + Filtered Sequence Perspective Plan

## Context

The Sequence perspective currently renders ALL interfaces and ALL messages as one flat diagram — `computeSequenceLayout(seedInterfaces, seedMessages)` with no filtering. This worked at 8 lifelines and 14 messages but won't scale to multiple sequence flows.

Interfaces and Messages exist in the kernel but have no upward link to Capability, Process, or any business context. They're orphaned at the bottom of the entity graph.

This plan adds `Sequence` as a first-class kernel entity that groups interfaces and messages into named, selectable flows anchored to capabilities — completing the Capability triad (Journey / Process / Sequence).

## What this adds

- `Sequence` entity in `@guiderail/core`
- `SELECT_SEQUENCE` / `CLEAR_SEQUENCE` events in Context Machine
- `activeSequenceId` in NavigationContext
- Seed data: named sequences with scoped interfaces/messages
- Sequence perspective filters to active sequence
- Left panel Sequences section (scoped to active capability)
- Search palette indexes sequences

## What this does NOT add

- No new perspectives or canvas modes
- No kernel entity changes to Interface or Message (they stay as-is)
- No changes to other perspectives

---

## Phase 1: Kernel — Sequence Entity

### Steps

**Create `packages/core/src/entities/sequence.ts`:**
```typescript
SequenceSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  capabilityId: z.string(),
  processId: z.string().optional(),
  interfaceIds: z.array(z.string()),
  messageIds: z.array(z.string()),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.unknown()).default({}),
  provenance: ProvenanceRefSchema.optional(),
});
```

**Export from `entities/index.ts`**

**Add to Context Machine:**
- `Sequence[]` in `ContextMachineContext`
- `sequences?: Sequence[]` in INITIALIZE event (optional, backward-compat)
- `sequences: []` in initial context
- `sequences: event.sequences ?? []` in INITIALIZE handler

**Add navigation events:**
- `SELECT_SEQUENCE` event: `{ type: "SELECT_SEQUENCE"; sequenceId: string }`
- `CLEAR_SEQUENCE` event: `{ type: "CLEAR_SEQUENCE" }`

**Add to NavigationContext:**
- `activeSequenceId: z.string().nullable().default(null)`

**Add reconciler function:**
- `reconcileSequenceSwitch(ctx, sequenceId)` — sets activeSequenceId, preserves domain/capability/process context

### Done when
- `SequenceSchema` exists and validates
- Context Machine accepts sequences in INITIALIZE
- SELECT_SEQUENCE / CLEAR_SEQUENCE events work
- activeSequenceId in NavigationContext
- All existing tests pass

---

## Phase 2: Seed Data — Named Sequences

### Steps

**Add sequences to seed-banking.ts:**

```typescript
export const sequences: Sequence[] = [
  {
    id: "seq-payment-auth",
    label: "Payment Authorization",
    description: "Full request/response sequence for authorizing a payment",
    capabilityId: "cap-payment-processing",
    processId: "proc-payment-auth",
    interfaceIds: ["iface-mobile", "iface-gateway", "iface-orch", "iface-fraud",
                   "iface-aml", "iface-policy", "iface-network", "iface-ledger"],
    messageIds: ["msg-1", "msg-2", "msg-3", "msg-4", "msg-5", "msg-6", "msg-7",
                 "msg-8", "msg-9", "msg-10", "msg-11", "msg-12", "msg-13", "msg-14"],
    tags: ["payments", "authorization"],
  },
].map((d) => SequenceSchema.parse(d));
```

**Export from test-fixtures/index.ts**

**Add to seed-loader.ts:**
- Import and export `seedSequences`

### Done when
- Seed data includes at least one named sequence
- All interface/message IDs in the sequence reference valid entities
- Schema validation passes

---

## Phase 3: Sequence Perspective — Filtered Rendering

### Steps

**Update `use-perspective-provider.ts`:**

Current:
```typescript
const sequenceLayout = useMemo(() => {
  if (!isSequencePerspective) return null;
  return computeSequenceLayout(seedInterfaces, seedMessages);
}, [isSequencePerspective]);
```

Updated:
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
  // No active sequence — show picker (like Journey when no journey is active)
  return computeSequencePickerLayout(seedSequences);
}, [isSequencePerspective, nav.activeSequenceId]);
```

**Create `computeSequencePickerLayout()`:**
- Similar to `computeJourneyPickerLayout()` — shows available sequences as clickable cards
- Each card shows: label, description, interface count, message count
- `+` expand affordance fires SELECT_SEQUENCE

**Create `SequencePickerNode.tsx`:**
- Card component for sequence selection
- Dispatches `guiderail:expand` with `{ type: "sequence", id: sequenceId }`

**Register `sequence_picker` in node-types.ts**

**Update AppShell.tsx:**
- Handle `guiderail:expand` for `type: "sequence"` — fire `SELECT_SEQUENCE`

### Done when
- Sequence perspective shows picker when no sequence is active
- Clicking a sequence card → detail in right panel
- Expanding a sequence → renders filtered lifeline diagram
- Only the selected sequence's interfaces and messages are shown

---

## Phase 4: Left Panel + Search + Detail

### Steps

**Left panel Sequences section:**
- Add Sequences section to LeftPanel (scoped to active capability)
- Lists sequences where `capabilityId` matches `activeCapabilityId`
- Click fires SELECT_SEQUENCE
- Section hides when no capability is selected or capability has no sequences

**Search palette:**
- Add sequences to SearchPalette searchable items
- Type: "sequence", action fires SELECT_SEQUENCE

**Detail panel:**
- Add sequence detail resolver to DetailPanelRouter
- Shows: label, description, capability link, process link, interface count, message count
- "Open Sequence" action button (like Journey picker)

**Context bar:**
- Show active sequence name in breadcrumb trail when activeSequenceId is set

### Done when
- Sequences appear in left panel scoped to capability
- Cmd+K search finds sequences
- Clicking a sequence in left panel or search navigates to it
- Active sequence shown in context bar breadcrumb

---

## Phase 5: Tests

### Tests
- Sequence schema validation (valid + invalid)
- Context machine: SELECT_SEQUENCE / CLEAR_SEQUENCE events
- Reconciler: reconcileSequenceSwitch preserves context
- Seed data: sequence interfaceIds/messageIds reference valid entities
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
        └── Sequence   → how the systems interact at runtime (Interfaces, Messages)
```

The Capability triad is complete. Each arm of the triad has:
- A grouping entity (Journey, Process, Sequence)
- Child entities (Steps, ProcessStages, Interfaces+Messages)
- A dedicated perspective with filtered rendering
- A selection event (SELECT_JOURNEY, SELECT_PROCESS, SELECT_SEQUENCE)
- Left panel navigation scoped to the active capability
