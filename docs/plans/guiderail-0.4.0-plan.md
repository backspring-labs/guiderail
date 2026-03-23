# GuideRail 0.4.0 Implementation Plan

## Context

GuideRail 0.3.0 shipped with 291 tests, 38 nodes, 42 edges, 9 domains, 16 capabilities, 20 providers, ELK.js auto-layout, Cmd+K search, and 3 guided routes across 4 perspective tabs (Overview, Architecture, Process, Journey). The product proves that navigation, guided routes, and spatial orientation work at meaningful landscape scale.

GuideRail 0.4.0 is the **perspective progression release**. It restructures the product around a deliberate 6-perspective progression from broad terrain to runtime interaction, introduces canvas modes within perspective families, adds the Sequence perspective, adds a System perspective, and establishes the shared context contract that makes perspective switching feel like "show me this same moment through another lens" rather than "take me somewhere else."

### 0.4.0 proof statement

GuideRail 0.4.0 proves that users can move through a deliberate perspective progression from landscape to runtime sequence — with canvas modes for process detail (Operational, Activity/Decision, Risk Controls) — while preserving a shared thread of context across every perspective switch.

### Reference

See `docs/ideas/Perspective_Progression_Shared_Context_Guided_Tour_Idea.md` for the full organizing idea behind this release.

---

## The 6-Perspective Progression

| # | Perspective | Question | Focus | Primary Audience |
|---|---|---|---|---|
| 1 | Landscape | "What world are we in?" | Broad terrain, domains, capabilities, cross-domain relationships | Executives / Business Architects |
| 2 | Journey | "What real path is being taken?" | Ordered steps, user/operator path, framed by Value Stream | UX / Product Managers |
| 3 | Process | "How is the journey operationally executed?" | BPMN flow, stages, handoffs, execution logic | Business Analysts |
| 4 | Architecture | "What technical structure supports this?" | Systems, services, boundaries, technical zones | Solution Architects |
| 5 | System | "What participating parts matter here?" | Scenario-scoped participating systems, interfaces | Solution Architects |
| 6 | Sequence | "How do the parts interact at runtime?" | Lifelines, messages, request/response flow | Software Engineers |

### Primary design principle

> A perspective switch should mean "show me this same moment through another lens," not "take me somewhere else."

### Two levels of switching

1. **Perspective Switcher** — the main conceptual lens (6 tabs)
2. **Canvas Mode Switcher** — diagram grammar within a perspective family (secondary, where relevant)

> Perspective chooses the meaning; canvas mode chooses the diagram.

### Canvas modes by perspective

| Perspective | Canvas Modes | Notes |
|---|---|---|
| Process | **Operational** (BPMN), **Activity / Decision**, **Risk Controls** | Same topology, different emphasis |
| Architecture | **Logical** (shipped), Deployment (deferred 0.5.0+) | Different diagram structures |
| All others | Single mode | No secondary switcher needed |

### Contextual concepts (not perspectives)

- **Value Stream** — framing modifier on Journey ("what larger value-producing flow is this journey part of?"). Value Stream remains contextual framing for Journey and Landscape; it is not a separate navigable perspective or mode in 0.4.0.
- **Provider** — contextual first-class layer across views (badges, detail, comparisons)
- **Activity / Decision** — Process canvas mode, not a separate perspective. Must reveal branching logic and alternate outcomes, not just restyle the same BPMN flow.
- **Risk Controls** — Process canvas mode / overlay, not a separate perspective. Must reveal control significance, severity, and governance meaning, not just place badges on existing process elements.

### Landscape and Domain/Capability in 0.4.0

The larger product model thinks in terms of Landscape → Domain/Capability → Journey → Process → Architecture → System → Sequence. In 0.4.0, Domain and Capability live inside Landscape as the first business-structure descent rather than having their own top-level tab. This is a scale-appropriate decision — the split may be revisited when landscape density demands it.

### Architecture vs System — intent distinction

- **Architecture** answers "what technical structure exists?" — broad, static, all systems and boundaries
- **System** answers "what participating parts matter for this current path/process?" — scenario-scoped, filtered to the cast of characters for the selected context
- **Deployment** remains out of scope for 0.4.0 (deferred Architecture canvas mode)

---

## What 0.4.0 adds

- **6-perspective progression** with deliberate ordering from landscape to sequence
- **Landscape** — renamed from Overview, covers broad terrain, domains, capabilities, and cross-domain relationships with internal drill-down
- **Process canvas modes** — Operational (BPMN), Activity/Decision, Risk Controls
- **System** — new perspective: scenario-scoped filtered architecture view
- **Sequence** — new perspective: lifeline diagram with ordered messages
- **Shared context contract** — perspective switches preserve domain, capability, journey, process, route/waypoint context
- **Bounded canvas entry** — every perspective enters through a summarized state before allowing expansion
- **Canvas mode switcher UI** — secondary switcher within Process perspective
- New kernel entities: ControlPoint, Interface, Message
- **Future ingestion readiness** — optional `parentNodeId` on Node (enables C4/Backstage hierarchy), expanded Source type enum, provenance on all new entities
- BPMN node components (BpmnTaskNode, BpmnGatewayNode, BpmnEventNode) with swim lane layout
- Lifeline rendering with custom sequence layout
- **Search scope expanded** — Cmd+K search indexes interfaces, control points, and BPMN tasks in addition to existing entity types
- 2–3 new guided routes exercising the progression
- Perspective bar: 6 tabs with clean progression ordering

### What 0.4.0 explicitly defers

- Backend / persistence (still static seed data)
- Author Mode
- Roadmap/Initiative modeling
- Architecture: Deployment canvas mode (0.5.0+)
- Internal component modeling for System (0.5.0+ — 0.4.0 uses scenario-scoped filtering of existing Architecture nodes)
- Guided Tour participant model (presenter + detachable followers — future). The shared context contract introduced in 0.4.0 is intended to be the foundation for this future presenter/follower behavior.
- bpmn-js library (BPMN rendering via React Flow, not bpmn-js)
- Tiptap, Playwright, Next.js, TanStack Query
- OpenTelemetry

---

## Phase 1: Perspective Restructure & Shared Context Contract

### Goal
Restructure the perspective bar from 4 flat tabs to 6 ordered perspectives. Rename Overview → Landscape. Reorder Journey and Process. Implement the shared context contract so perspective switches preserve the current thread.

### Product intent
The perspective bar should communicate a progression of understanding, not a flat list of unrelated views. The user should be able to descend deeper into detail, step sideways into another lens, and return — all while the product keeps the current business thread intact. Landscape covers broad terrain, domains, capabilities, and cross-domain relationships in one view with internal drill-down.

### Steps

**Kernel (`packages/core/src/entities/perspective.ts`):**
- Update `PerspectiveTypeSchema` enum to reflect the 6 perspectives: `landscape`, `journey`, `process`, `architecture`, `system`, `sequence`
- Remove `activity`, `provider`, `control`, `overview` from the enum (Activity and Risk Controls become canvas modes; Provider is contextual; Control is a Process canvas mode; Overview becomes Landscape)

**Kernel — Canvas Mode:**
- Add `CanvasModeSchema` to entities: `{ perspectiveType, mode }` — e.g., `{ perspectiveType: "process", mode: "operational" | "activity" | "risk_controls" }`
- Add `activeCanvasMode` to `NavigationContext` (optional, default null — null means the perspective's default mode)
- Add `SWITCH_CANVAS_MODE` event to Context Machine

**Kernel — Future ingestion readiness:**
- Add optional `parentNodeId?: string | null` to `NodeSchema` — enables future C4 hierarchy (system → container → component), Backstage system membership, and BPMN sub-process nesting. Not used by 0.4.0 seed data, but prevents the entity model from blocking future importers. **0.4.0 rule:** `parentNodeId` is structural readiness only; it does not yet imply hierarchical rendering, tree navigation, or inherited semantics in the web app.
- Expand `SourceTypeSchema` enum from `["content_repo", "code_repo"]` to include `"api_registry"`, `"service_catalog"`, `"bpmn_source"`, `"control_framework"`, `"infra_config"`. These source types indicate intended provenance categories and future ingestion paths, but do not commit 0.4.0 or 0.5.0 to any specific connector implementation sequence.
- Ensure `provenance?` field is included on all new entity schemas (ControlPoint, Interface, Message). Provenance on these entities is required so future imported control models, interface catalogs, and runtime interaction artifacts can be traced back to their source systems and reconciled confidently — not just for schema consistency, but for future trust and import integrity.

**Shared context contract (`packages/core/src/context/reconciler.ts`):**
- Ensure `reconcilePerspectiveSwitch` preserves: `activeDomainId`, `activeCapabilityId`, `activeJourneyId`, `activeProcessId`, `activeStoryRouteId`, `activeWaypointIndex`, `routeState`
- Only clear `selectedNodeId` and `selectedEdgeId` on perspective switch (selection is view-specific, context is not)
- `SWITCH_CANVAS_MODE` preserves everything including selection (same topology, different emphasis)
- **Failure behavior rule:** if a perspective cannot represent the current thread completely, preserve the highest valid anchor rather than dropping the user into a generic empty state. For example, if the user switches to Process but no process is active for the current capability, show the capability context in Process rather than an empty view.

**Seed data:**
- Rename `persp-overview` → `persp-landscape` (type: `landscape`)
- Add `persp-system` (type: `system`)
- Reorder perspective definitions to match the progression
- Journey perspective unchanged but repositioned in order

**Web — TopBar / PerspectiveSwitcher:**
- Update tab labels and ordering to match the 6-perspective progression
- Add canvas mode secondary switcher UI within Process tab (sub-tabs or dropdown below the main bar)

**Web — Bounded canvas entry:**
- Each perspective enters through a summarized state: major groups, representative elements, simplified relationships
- This is primarily a rendering concern for `use-perspective-provider.ts` — initial zoom level and node visibility
- **Acceptance rule:** on first switch into any perspective, the user should see a coherent summarized view of the current thread without node explosion or line chaos

### Done when
- 6 perspective tabs visible in correct order: Landscape, Journey, Process, Architecture, System, Sequence
- Switching perspectives preserves domain, capability, journey, process, and route context
- Canvas mode switcher visible on Process perspective (Operational mode only — other modes added in later phases)
- `SWITCH_CANVAS_MODE` event works in Context Machine
- All existing tests pass
- `pnpm build && pnpm test && pnpm check` clean

---

## Phase 2: Process Canvas Modes — BPMN Operational + Activity/Decision + Risk Controls

### Goal
Evolve the Process perspective to support three canvas modes: Operational (BPMN), Activity/Decision, and Risk Controls. All three show the same process topology with different emphasis.

### Product intent
Process is the execution bridge between the business path and the technical layers. It answers "how is the journey operationally executed?" Canvas modes let the user switch between:
- **Operational** — BPMN: how work flows across participants (swim lanes, tasks, gateways, events)
- **Activity / Decision** — same flow, emphasis on branching logic, decision outcomes, and alternate paths
- **Risk Controls** — same flow, emphasis on control points, severity, and compliance status

> Changing canvas mode should feel even lighter than changing perspective. Same moment, same topology, different emphasis.

### Steps

**ControlPoint entity (`packages/core/src/entities/control-point.ts`):**
- `id`, `label`, `processStageId`, `severity` (info/warning/critical), `controlType` (preventive/detective/corrective), `status` (active/pending/not_implemented), `description?`, `regulatoryRef?`, `metadata`
- Entity boundary rule: ControlPoint is first-class; ProcessStage stores ordered references only
- Add `ControlPoint[]` to `ContextMachineContext` and `INITIALIZE` event (optional, backward-compat)

**Seed data:**
- Add BPMN nodes (~15–20): `bpmn_task`, `bpmn_event` (start/end), `bpmn_gateway` (exclusive/parallel) with `swimLane` metadata
- Add BPMN edges (~18–22): `bpmn_flow`, `yes_branch`, `no_branch`
- Add 8–12 ControlPoint entities covering existing process stages
- Add 4–6 more `control_note` and `risk_note` annotations
- Add 2–3 `control_evidence` EvidenceRef entries
- BPMN nodes link back to terrain nodes via shared `nodeIds`

**Layout (`apps/web/src/lib/bpmn-layout.ts`):**
- Custom `computeBpmnLayout()` — groups nodes into swim lanes, left-to-right flow within lanes
- Used by all three canvas modes (same positions, different visual treatment)

**New React Flow node components:**
- `BpmnTaskNode.tsx` — rounded rectangle, task label, optional provider badge, conditional control point indicator
- `BpmnEventNode.tsx` — circle (start=green, end=red, intermediate=double border)
- `BpmnGatewayNode.tsx` — diamond (exclusive=X, parallel=+), decision question label
- `SwimLaneBackground.tsx` — horizontal lane bands with headers
- `ControlPointIndicator.tsx` — severity badge (critical=red, warning=amber, info=green) on BPMN tasks

**Canvas mode rendering (`use-perspective-provider.ts`):**
- All three modes use `computeBpmnLayout()` — same positions
- **Operational**: standard BPMN rendering
- **Activity/Decision**: same nodes, gateway decisions visually emphasized (larger labels, highlighted branches, dimmed non-decision paths)
- **Risk Controls**: same nodes, control point indicators visible, severity coloring on tasks, non-controlled tasks dimmed

**Canvas mode switcher UI:**
- Secondary sub-tabs below Process tab: "Operational", "Decision", "Controls"
- Switching mode preserves all context including node selection

**Detail panels:**
- `ControlDetailPanel.tsx` — shows control points with severity, status, regulatory refs when in Risk Controls mode

**Styles:**
- `bpmn.css` — BPMN shapes, swim lanes, gateway diamonds, event circles, branch colors
- `control.css` — severity colors, control indicator badges, task background tints

### Done when
- Process perspective shows BPMN flow with swim lanes in Operational mode
- Canvas mode switcher toggles between Operational, Activity/Decision, and Risk Controls
- Activity/Decision mode emphasizes gateway branching and decision outcomes
- Risk Controls mode shows control point severity indicators on BPMN tasks
- All three modes share the same layout — switching feels instant, not like a re-render
- Selecting a task in Risk Controls mode shows control detail panel
- `pnpm build && pnpm test && pnpm check` clean

---

## Phase 3: System Perspective

### Goal
Add the System perspective as a scenario-scoped filtered view of Architecture — showing only the participating technical parts for the current business context.

### Product intent
System answers "what participating technical parts matter for this selected context?" It bridges Architecture (broad static structure) and Sequence (runtime interaction). Without it, the jump from "here's the whole system map" to "here's the runtime call flow" is too abrupt.

In 0.4.0, System is implemented as a **scenario-scoped filter on existing Architecture nodes** — the same nodes, filtered to only the participants in the current process/journey. Internal component modeling (C4 Level 3) is deferred to 0.5.0+.

### Steps

**Seed data:**
- Add `persp-system` perspective (type: `system`)
- Add `layer-system` layer (same eligible types as Architecture layer, but rendering hints indicate scenario-scoping)

**Projection (`projection.ts`):**
- Add `resolveSystemScope()`: when System perspective is active, filter to nodes that participate in the current active process's stages OR the current active journey's steps
- If no process or journey is active, show all architecture nodes (same as Architecture — graceful degradation)

**Layout:**
- System uses ELK with the same `architecture` direction (layered left-to-right)
- Fewer nodes → cleaner layout automatically

**Shared context contract:**
- When switching from Process → System, the current process context is preserved, and System shows only the systems involved in that process
- When switching from Architecture → System, the current capability/domain context scopes the view

**Detail panel:**
- Reuses existing `NodeDetailPanel` — same node entities, just filtered

### Done when
- System tab shows only the systems/services participating in the current process or journey
- Switching from Process to System preserves context and shows a focused technical view
- Switching from Architecture to System narrows to the relevant systems
- If no process/journey is active, System shows all architecture nodes (graceful degradation)
- `pnpm build && pnpm test && pnpm check` clean

---

## Phase 4: Sequence Perspective — Kernel Entities & Seed Data

### Goal
Add Interface and Message entities to the kernel and create seed data modeling a runtime call sequence.

### Design rationale
Interface and Message are semantic entities, not rendering constructs. Without Interface, there's no way to represent "this service exposes this API boundary." Without Message as an ordered entity, sequence cannot be sorted or navigated.

### Architectural guardrail
Sequence is a special runtime-interaction rendering mode for ordered interfaces and messages tied to the same business context. It is not a generic fallback visualization system for arbitrary future diagram types. Each future diagram grammar must justify its own rendering mode independently.

### Steps

**Kernel (`packages/core/src/entities/`):**
- Create `interface.ts`:
  - `id`, `nodeId`, `label`, `protocol?` (rest/grpc/event/internal), `description?`, `metadata`
- Create `message.ts`:
  - `id`, `sequenceNumber`, `sourceInterfaceId`, `targetInterfaceId`, `type` (request/response/event/callback), `label`, `description?`, `payloadSummary?`, `metadata`
- Export both from entities index
- Add `Interface[]` and `Message[]` to `ContextMachineContext` and `INITIALIZE` event (optional)
- Add `interface` and `message` to `FocusTargetTypeSchema`

**Seed data:**
- Add `persp-sequence` perspective (type: `sequence`)
- Add `layer-sequence` layer
- Define 6–8 Interfaces for the payment authorization flow
- Define 12–16 Messages modeling the full request/response sequence

### Done when
- `InterfaceSchema` and `MessageSchema` exist and validate
- Seed data includes 6–8 interfaces and 12–16 messages
- Referential integrity: interface nodeIds resolve, message interfaceIds resolve
- All existing tests pass

---

## Phase 5: Sequence Perspective — Rendering

### Goal
Render the Sequence perspective as a lifeline diagram: vertical lifelines per participant, horizontal message arrows, ordered top-to-bottom.

### Shared context contract
Sequence should never feel like "we left the story and entered a different technical tool." It should feel like the same current moment, rendered as runtime interaction. The active process, journey, capability, and domain context are all preserved.

### Steps

**Layout (`apps/web/src/lib/sequence-layout.ts`):**
- `computeSequenceLayout(interfaces, messages, nodes)` → lifeline nodes + message edges
- Lifeline x-spacing: fixed interval (~250px)
- Message y-spacing: fixed interval (~60px per sequence step)

**React Flow components:**
- `LifelineNode.tsx` — header with service name, vertical dashed line extending downward
- `SequenceMessageEdge.tsx` — horizontal arrow at correct y-offset, solid for request, dashed for response

**Node/edge type registries:**
- Add `lifeline` to node-types, `sequence_message` to edge-types

**Perspective provider (`use-perspective-provider.ts`):**
- When perspective type is `sequence`, call `computeSequenceLayout()` instead of ELK
- Return lifeline nodes and message edges directly

**Detail panel:**
- Create `SequenceDetailPanel.tsx` — interface details when lifeline selected, message details when message selected

**Styles:**
- Add `sequence.css` for lifeline dashed lines, message arrows, request vs response distinction

### Done when
- Sequence tab shows lifeline diagram with vertical lifelines and horizontal message arrows
- Messages ordered top-to-bottom by sequence number
- Request vs response arrows visually distinct
- Clicking lifeline or message shows detail panel
- Payment authorization sequence readable end-to-end
- Shared context preserved — switching back to Process or Architecture shows the same business moment

---

## Phase 6: Shared Context Verification

### Goal
Verify that the shared context contract works across all 6 perspectives.

### Steps

**Shared context end-to-end verification:**
- Select a domain and capability in Landscape (drill down within Landscape)
- Switch to Journey → journey for that capability is shown
- Switch to Process → process for that capability's journey is shown
- Switch to System → only participating systems visible
- Switch to Sequence → lifelines for participating interfaces
- Switch back to Landscape → current domain highlighted in the broader terrain
- Throughout: domain, capability, journey, process context preserved in breadcrumb and nav state

**Bounded canvas entry:**
- Verify each perspective enters through a summarized state
- No visual shock or line explosion on perspective switch

### Done when
- Shared context verified across all 6 perspective transitions
- Bounded canvas entry works for all perspectives
- `pnpm build && pnpm test && pnpm check` clean

---

## Phase 7: Cross-Perspective Guided Routes

### Goal
Add guided routes that demonstrate the perspective progression and prove cross-perspective traversal with shared context preservation.

### Route design expectations
Each new route must have:
- A clear destination objective
- 4–6 waypoints maximum
- At least one perspective switch where the alternate lens reveals something the current lens cannot
- A coherent beginning, middle, and end

### Routes

**Route 4: "From Landscape to Sequence — The Full Descent"**
- 6 waypoints descending through the progression
- Landscape → Journey → Process → Architecture → System → Sequence
- Each waypoint shows the same payment authorization moment through the next lens
- Demonstrates the shared context contract end-to-end

**Route 5: "The Runtime Call Sequence"** (Sequence-focused)
- 5–6 waypoints walking the lifeline diagram
- At least one waypoint switches to Architecture or System to show "where this service lives"
- Full round-trip from mobile app request to authorization response

**Route 6 (stretch): "Process Modes — Three Views of One Flow"**
- 4–5 waypoints staying on Process perspective
- Switches canvas modes: Operational → Activity/Decision → Risk Controls
- Shows the same process flow through each emphasis lens

### Done when
- Routes 4 and 5 playable end-to-end
- Route 6 playable if implemented
- Perspective and canvas mode switches mid-route preserve shared context
- Routes teach meaningful insight through the progression
- 6 tabs remain scannable and low-friction

---

## Phase 8: Tests, Polish & Version Bump

### Tests

**Kernel entity tests:**
- ControlPoint, Interface, Message schema validation (valid + invalid cases) — including provenance field
- CanvasMode schema validation
- PerspectiveTypeSchema accepts the 6 new type values
- NodeSchema accepts optional `parentNodeId`
- SourceTypeSchema accepts expanded type enum

**Context machine tests:**
- INITIALIZE accepts new optional fields without breaking existing behavior
- SWITCH_PERSPECTIVE preserves shared context (domain, capability, journey, process, route)
- SWITCH_CANVAS_MODE preserves everything including selection
- All perspective types switchable

**Seed validation:**
- All new seed data parses through Zod, referential integrity holds
- BPMN nodes link to valid terrain nodes
- Interfaces link to valid nodes, messages link to valid interfaces

**Layout tests:**
- BPMN layout: nodes positioned in swim lanes, left-to-right flow order
- Sequence layout: lifelines positioned, messages at correct y-offsets

**Integration tests:**
- New story route walkthrough tests for routes 4 and 5
- Shared context preservation across all 6 perspective transitions

**Web tests:**
- react-flow-adapter: BPMN and lifeline node types map correctly
- projection: System scenario scoping works
- Canvas mode switcher renders and toggles

### Polish
- Version bump to 0.4.0 (both packages)
- Update CLAUDE.md with 6-perspective progression documentation
- MiniMap colors for new node types
- Clean up PerspectiveTypeSchema enum (remove unused types)

### Done when
- All tests pass (existing + new)
- `pnpm build && pnpm test && pnpm check` clean
- Version 0.4.0

---

## Sequencing

```
Phase 1 (Restructure + Shared Context) → Phase 2 (Process Modes) → Phase 3 (System) → Phase 4 (Sequence data) → Phase 5 (Sequence render) → Phase 6 (Context Verification) → Phase 7 (Routes) → Phase 8 (Tests)
```

Phase 1 is foundational — everything else depends on the 6-perspective structure and shared context contract. Phase 2 (Process modes) is the largest rendering effort. Phase 3 (System) is a projection filter, relatively lightweight. Phases 4-5 (Sequence) are independent of 2-3. Phase 6 is cross-cutting verification.

---

## Watchpoints

- **Shared context is the make-or-break feature.** If perspective switching drops the user's context, the whole 6-perspective model fails. The Context Machine already preserves nav state — the challenge is making the UI honor that continuity visually.
- **Canvas mode switching must feel instant.** Same topology, same positions, different emphasis. If mode switching triggers a re-layout, it will feel like a perspective switch, not a lens change.
- **System must justify its tab.** At 38 nodes, a filtered Architecture view might feel thin. It earns itself when the filter meaningfully reduces noise. If the current process only involves 6 of 38 nodes, System is valuable. If it shows 35 of 38, it's not.
- **Landscape drill-down must feel cohesive.** Landscape covers broad terrain, domains, and capabilities in one view. The internal drill-down from ecosystem overview to domain/capability detail needs to feel natural and not require a separate perspective.
- **BPMN swim lane layout is custom.** No ELK. Keep `computeBpmnLayout()` focused and deterministic.
- **Seed file size.** With BPMN nodes, interfaces, and messages, the seed file will grow significantly. Split if it exceeds ~2000 lines.
- **Backward compatibility.** All new ContextMachineContext fields optional with defaults.
- **"Same moment, different lens" integrity.** Perspective and canvas-mode switches must preserve the current business thread strongly enough that the user feels they are inspecting the same moment through a different lens, not jumping to a fresh unrelated diagram. This is the release thesis in operational form — if it fails, the progression is decorative rather than structural.
- **Future-ingestion readiness must stay additive.** The `parentNodeId`, expanded Source types, and provenance fields introduced in 0.4.0 are schema/provenance guardrails, not behavioral commitments. They must not accidentally create implied rendering, filtering, or navigation semantics in the current release. Future imported hierarchy and provenance metadata should enrich navigation and traceability, but must not override the shared-context contract or force the UI into source-system-first navigation.

---

## Hero Path Walkthroughs

### Proof 1: The Full Descent (perspective progression + context preservation)

This proof validates two obligations:
- **Progression obligation:** each perspective in the descent shows a meaningfully different view of the same business moment
- **Context-preservation obligation:** the shared thread (domain, capability, journey, process) is never lost across any perspective or canvas mode switch

**Walkthrough:**

1. App loads → 6 perspective tabs visible in progression order
2. **Landscape** → broad terrain, all domains visible as major regions
3. Drill into "Payments" domain within Landscape → capabilities listed: Money Movement, Payment Processing
4. Select "Payment Processing" → navigate to **Journey** → "Send ACH Transfer" journey shown, framed by "Retail Payments" value stream
5. Switch to **Process** → BPMN flow with swim lanes showing how the payment is operationally executed
6. Toggle Process canvas mode to **Activity/Decision** → same flow, gateway decisions emphasized
7. Toggle to **Risk Controls** → same flow, control point severity indicators visible
8. Switch to **System** → only the 6 systems participating in this payment process shown
9. Switch to **Sequence** → lifeline diagram for the payment authorization call flow
10. **Context check:** domain "Payments", capability "Payment Processing", process context preserved in breadcrumb throughout steps 4–9
11. Switch back to **Landscape** → "Payments" domain still highlighted
12. Cmd+K → search "fraud" → results include nodes, interfaces, control points

### Proof 2: Guided Route Continuity (cross-perspective traversal)

1. Start route "From Landscape to Sequence — The Full Descent"
2. 6 waypoints descending through the progression
3. Each waypoint shows the same payment moment through the next lens
4. Shared context preserved at every transition — no "where am I?" moments
5. Complete route → Start "The Runtime Call Sequence"
6. Sequence perspective, mid-route switch to System
7. Pause mid-route → switch to Process Risk Controls mode → explore controls → resume route → exact waypoint restored
8. Complete route → domain/capability context preserved

Both proofs must succeed for the 0.4.0 proof statement to be satisfied.

---

## Verification

1. `pnpm build` — both packages build
2. `pnpm test` — all tests pass
3. `pnpm check` — Biome clean
4. `pnpm dev` — 6 perspective tabs in progression order, all switchable
5. Shared context preserved across all perspective switches
6. Process canvas modes toggle instantly between Operational, Activity/Decision, Risk Controls
7. System shows scenario-scoped participating systems
8. Sequence shows lifeline diagram with ordered messages
9. Bounded canvas entry — no visual shock on perspective switch
10. 2–3 new guided routes playable end-to-end
11. Cmd+K search returns results across interfaces, control points, and BPMN tasks
12. Both hero path proofs succeed
13. Version 0.4.0

---

## Critical Files

| File | Changes |
|------|---------|
| `packages/core/src/entities/perspective.ts` | New 6-type enum: landscape, journey, process, architecture, system, sequence |
| `packages/core/src/entities/node.ts` | Add optional `parentNodeId` field |
| `packages/core/src/entities/source.ts` | Expand Source type enum with ingestion path types |
| `packages/core/src/entities/control-point.ts` | New entity |
| `packages/core/src/entities/interface.ts` | New entity |
| `packages/core/src/entities/message.ts` | New entity |
| `packages/core/src/entities/canvas-mode.ts` | New: CanvasModeSchema |
| `packages/core/src/entities/index.ts` | Export new entities |
| `packages/core/src/context/navigation-context.ts` | Add `activeCanvasMode` |
| `packages/core/src/context/context.machine.ts` | Add SWITCH_CANVAS_MODE event, optional fields to INITIALIZE |
| `packages/core/src/context/reconciler.ts` | Shared context preservation rules for perspective/mode switches |
| `packages/core/src/test-fixtures/seed-banking.ts` | BPMN nodes, control points, interfaces, messages, 6 perspectives, routes |
| `apps/web/src/lib/bpmn-layout.ts` | New: custom swim lane layout |
| `apps/web/src/lib/sequence-layout.ts` | New: custom lifeline layout |
| `apps/web/src/hooks/use-perspective-provider.ts` | Branch for BPMN, System scoping, Sequence custom layout |
| `apps/web/src/lib/react-flow-adapter.ts` | New node types, control indicators, canvas mode rendering |
| `apps/web/src/lib/projection.ts` | System scenario scoping |
| `apps/web/src/components/canvas/nodes/node-types.ts` | Register BPMN + lifeline node components |
| `apps/web/src/components/canvas/nodes/BpmnTaskNode.tsx` | New component |
| `apps/web/src/components/canvas/nodes/BpmnGatewayNode.tsx` | New component |
| `apps/web/src/components/canvas/nodes/BpmnEventNode.tsx` | New component |
| `apps/web/src/components/canvas/nodes/SwimLaneBackground.tsx` | New component |
| `apps/web/src/components/canvas/nodes/ControlPointIndicator.tsx` | New component |
| `apps/web/src/components/canvas/nodes/LifelineNode.tsx` | New component |
| `apps/web/src/components/canvas/edges/SequenceMessageEdge.tsx` | New component |
| `apps/web/src/components/layout/TopBar.tsx` | 6-tab perspective switcher + canvas mode sub-switcher |
| `apps/web/src/components/detail/ControlDetailPanel.tsx` | New component |
| `apps/web/src/components/detail/SequenceDetailPanel.tsx` | New component |
| `apps/web/src/styles/bpmn.css` | New stylesheet |
| `apps/web/src/styles/control.css` | New stylesheet |
| `apps/web/src/styles/sequence.css` | New stylesheet |

---

## Audit Schedule

Pause for audit after phases **2** (Process modes complete), **5** (Sequence render complete), and **8** (final).

### Audit checkpoint definition

Audit checkpoints are explicit validation gates. They confirm that each phase achieved its stated objective, that the implementation still supports the product and architectural intent of the release, and that no expedient shortcuts, placeholder logic, mocks, stubs, or low-integrity implementation compromises were introduced in place of production-worthy design.

Each audit confirms four things:
1. The work completed actually satisfies the phase objective stated in the plan
2. The implementation still preserves product clarity, architectural coherence, and release intent
3. No shortcuts were taken for expediency that undermine the integrity of the release
4. Best practices were followed and no mocks, stubs, temporary hacks, or placeholder implementations were inserted where real implementation was expected

### Phase-specific audit prompts

- **After phase 2 (Process modes):** Do the three canvas modes feel like "same moment, different emphasis"? Is mode switching instant? Does BPMN rendering clearly improve on 0.3.0's staged layout? Were swim lanes and control indicators implemented as real product behavior?
- **After phase 5 (Sequence):** Does the shared context contract hold across all 6 perspectives? Does Sequence feel like "the same moment rendered as runtime interaction" rather than a separate tool? Is System earning its tab?
- **After phase 8 (Final):** Does the full 6-perspective progression feel like one coherent product? Can a guided route descend from Landscape to Sequence while preserving context? Are canvas modes a natural part of the Process experience, not a hidden feature?
