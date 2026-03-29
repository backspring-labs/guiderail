# GuideRail 0.7.1 Implementation Plan

## Context

The Process perspective renders BPMN swim lanes, but the current implementation has significant visual and functional gaps. Swim lanes are barely visible, BPMN visual grammar is not followed, metadata field names are inconsistent, and the stepper doesn't highlight the active stage. The canvas reads as a connected node graph rather than a proper process diagram.

GuideRail 0.7.1 is a **process canvas fidelity release** with a limited process-model extension for sub-process drill-in.

### 0.7.1 proof statement

GuideRail 0.7.1 proves that the Process perspective renders a readable, standards-aware BPMN diagram with bounded swim lanes, proper BPMN visual grammar, stepper-driven stage highlighting, and first-level sub-process drill-in.

### Scope

This release has two categories of work:

**Fidelity (Phases 1–3):** Visual grammar, swim lane rendering, and stepper highlighting. These are pure rendering improvements — no model changes, no new events, no schema changes.

**Process model extension (Phase 4):** Sub-process expansion. This introduces `subProcessId` on ProcessStage, drill-in navigation, and breadcrumb nesting. It is a limited model and behavior extension, scoped to one level of nesting.

### Cut line

If fidelity work runs long, **Phase 4 (sub-process expansion) is the first item deferred to 0.7.2.** The core objective is a clean, readable BPMN diagram with stepper highlighting. Sub-processes are valuable but not required for that objective.

### Reference

- BPMN 2.0 visual specification for element shapes and connector styles
- Existing code: `bpmn-layout.ts`, `bpmn.css`, `BpmnTaskNode.tsx`, `BpmnEventNode.tsx`, `BpmnGatewayNode.tsx`, `SwimLaneBackground.tsx`

---

## Known Bugs (Fix First)

### 1. Metadata field name mismatch

Standardize on:
- `eventKind` (not `eventType`) for event nodes
- `gatewayKind` (not `gatewayType`) for gateway nodes

Update seed data in `seed-content.ts` to use `eventKind` and `gatewayKind`. Components already read these names. Update any tests that reference the old names. No translation layer — one name, everywhere.

### 2. Stepper does not highlight active stage

`buildBpmnNodes` sets `highlighted: false` unconditionally and never reads `activeStageIndex`. Fix in Phase 3.

---

## Phase 1: BPMN Visual Grammar

### Goal
Make BPMN elements visually conform to the BPMN 2.0 specification while prioritizing diagram readability.

### Tasks (rounded rectangles)
- Light fill (`--color-bg-panel`) with accent border — not solid green
- Rounded corners (8px)
- Label centered, readable size
- Subtle shadow for depth
- Active state: accent border glow

### Events (circles)
- **Start:** thin green circle, empty interior, label below
- **End:** thick red circle, empty interior, label below
- **Intermediate:** double-line circle
- Label below the circle at readable size (12px)

### Gateways (diamonds)
- Diamond shape rotated 45°
- **Exclusive (XOR):** × marker, amber border
- **Parallel (AND):** + marker, blue border
- **Inclusive (OR):** ○ marker, purple border
- Label below the diamond

### Connectors (edges)
- Solid lines for sequence flow with arrow at target
- Conditional branches: green for yes, red for no
- Edge labels positioned along the line without overlapping nodes

### Done when
- Tasks, events, and gateways are visually distinguishable at a glance
- A user familiar with BPMN would recognize the notation
- Colors follow a coherent BPMN palette, not the terrain node palette

---

## Phase 2: Swim Lane Rendering

### Goal
Swim lanes are clearly bounded containers with readable headers.

### Lane boundaries
- Full bordered rectangle per lane (all four edges)
- Alternating subtle background tint
- Clear visual separation between lanes

### Lane headers
- Header column on the left (140px width, already defined as `LANE_HEADER_WIDTH`)
- Vertical or horizontal label, 14px semi-bold
- Separated from the flow area by a vertical border

### Lane sizing
- Fixed lane height for 0.7.1 (120px, current value)
- Improve padding and vertical centering of nodes within lanes
- Auto-sizing deferred — not in scope for 0.7.1

### Done when
- Each swim lane is a clearly bounded row with a visible header
- Lane labels are readable and consistently positioned
- The diagram reads as a proper swim lane chart

---

## Phase 3: Stepper Stage Highlighting

### Goal
The stepper transport control highlights the current process stage on the canvas.

### Architecture

Stage-to-node matching uses stable identity:
- Each BPMN node carries `metadata.stageId` referencing a ProcessStage ID
- The active stage is resolved by matching `activeStageIndex` against the ordered process stages
- The matching stage's ID is compared against each BPMN node's `metadata.stageId`
- Highlight state is derived from process stage identity, not from rendered node order

### Rendering
- `buildBpmnNodes` reads `nav.activeStageIndex` and resolves the active stage ID
- The matching BPMN node gets `highlighted: true` (accent glow)
- Non-matching nodes get subtle dimming when a stage is active (spotlight effect)

### Viewport panning
- When the stepper advances to a node that is off-screen, pan the viewport to bring it into view
- Target the highlighted node by its ID and resolved position, not by guessed coordinates
- Use React Flow's `setCenter` or `fitBounds` with the node's position from the layout

### Done when
- Clicking ▶ or pressing → highlights the next stage's BPMN node
- Previous nodes dim slightly, current node glows
- Canvas pans to keep the active node visible
- Stepper counter shows "Stage 3 of 8"

---

## Phase 4: Sub-Process Expansion

> **Risk note:** This is the riskiest phase because it touches process model assumptions, navigation behavior, breadcrumb semantics, and stepper/process selection interactions. It is the first phase deferred if fidelity work runs long.

### Goal
Add expandable sub-process nodes that can be drilled into for more detail.

### Scope boundaries for this phase
- Adds optional `subProcessId` field to ProcessStage schema
- Adds sub-process BPMN node rendering with `+` indicator
- Adds drill-in navigation (SELECT_PROCESS with child process ID)
- Adds back-navigation to parent process
- One level of nesting only — deeper nesting deferred

### Sub-process node appearance
- Same rounded rectangle as a task but with a `+` icon at the bottom edge
- Slightly larger than a regular task
- Thicker border to distinguish from simple tasks

### Navigation
- Clicking `+` dispatches `SELECT_PROCESS` with the child process ID
- Breadcrumb trail shows: Process > Parent Process > Sub-Process
- A back affordance (breadcrumb click or explicit button) returns to the parent
- Shared context contract preserves the parent process context

### Seed data
- Add at least one sub-process to the self-referential corpus
- Candidate: "Reconciliation" stage in the Perspective Switch process expands into sub-process showing individual reconciler steps

### Done when
- Sub-process nodes render with a `+` indicator
- Clicking `+` drills into the sub-process BPMN flow
- Back navigation returns to the parent
- Breadcrumb reflects nesting
- At least one working sub-process in the seed data

---

## Phase 5: Polish + Tests

### Visual polish
- Edge routing: ensure edges don't overlap nodes or lane headers
- Node spacing: verify adequate horizontal and vertical spacing
- Gateway branches: ensure yes/no labels on branching edges are readable
- Canvas positioning: `fitViewTopLeft` works correctly for BPMN diagrams

### Tests
- Metadata naming: `eventKind` and `gatewayKind` consistent at parse/render boundary
- Stage ID to BPMN node ID matching: correct stage resolves to correct node
- Highlight update on stepper forward/backward: node highlight follows stage index
- Viewport recenter: active node is brought into view when it moves off-screen
- Sub-process expansion: navigates correctly, back-nav preserves parent context (if Phase 4 shipped)

### Version bump
- Both packages → 0.7.1

### Done when
- `pnpm build && pnpm test && pnpm check` clean
- Version 0.7.1

---

## Sequencing

```
Bug fixes (metadata naming) → Phase 1 (Visual grammar) → Phase 2 (Swim lanes) → Phase 3 (Stepper highlighting) → Phase 4 (Sub-processes, cuttable) → Phase 5 (Polish + tests)
```

---

## Audit Schedule

Pause for audit after phases **2** (visual quality) and **5** (final).

---

## Design Rules

1. **Follow BPMN visual conventions strongly, but prioritize diagram readability and guided exploration over exhaustive notation completeness.** GuideRail is a teaching product, not a certified BPMN tool.
2. **Swim lanes are bounded containers, not background hints.** Each lane is a visible row with borders, a header, and clear separation.
3. **The stepper drives the spotlight.** Active stage is highlighted by stable stage identity. Non-active stages dim. Canvas pans to follow.
4. **Sub-processes are expandable, not inline.** Clicking `+` navigates to the child process view. Parent is not rendered simultaneously.
5. **Metadata field names are consistent everywhere.** `eventKind` in the component means `eventKind` in the seed data. One name, no translation.
6. **Lane height is fixed for 0.7.1.** Auto-sizing based on content is a valid future improvement but is not in scope.

---

## Watchpoints

- **Edge routing across lanes.** Sequence flows crossing swim lanes must route cleanly without overlapping headers or nodes.
- **Sub-process depth.** 0.7.1 supports one level of nesting only. Deeper nesting is deferred.
- **Performance with many BPMN nodes.** The Perspective Switch process has 10 nodes. Processes with sub-processes could reach 30+. Verify React Flow handles this.
- **Sub-process interaction with stepper.** When drilling into a sub-process, the stepper should reset to step through the child process stages. Drilling back should restore the parent stepper position.
