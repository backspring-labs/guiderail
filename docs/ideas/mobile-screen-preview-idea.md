# IDEA — Mobile Screen Preview

## Context

The product navigates through technical perspectives (Process, Sequence, Architecture) where the customer's actual experience becomes invisible. When you're deep in a BPMN swim lane or a sequence diagram, there's no visual anchor showing "this is what the customer sees right now."

A screen node's best contextual detail is the screen itself — showing metadata about a screen (label, tags, edges) is telling someone about a painting instead of showing it to them.

---

## Two Rendering Approaches

### Approach A: Right Panel (selection-triggered)

When a screen-type node is selected, the right panel renders a mobile screen mockup instead of standard node detail.

**Pros:**
- Reuses existing panel slide-out behavior — no new UI chrome
- Consistent with "click = detail" interaction pattern
- Simple implementation

**Cons:**
- Competes with node/message detail for panel space
- Only visible when explicitly selected
- Disappears when you select something else

### Approach B: Floating Overlay (context-persistent)

A small phone-frame overlay pinned to the bottom-right corner of the canvas, staying visible and in sync as you navigate through Journey, Process, or Sequence.

```
┌──────────────────────────────────────────┐
│                                          │
│    React Flow Canvas                     │
│                                          │
│                           ┌────────────┐ │
│                           │  Phone     │ │
│                           │  Frame     │ │
│                           │            │ │
│                           │  Screen    │ │
│                           │  Render    │ │
│                           │            │ │
│                           └────────────┘ │
│                                          │
├──────────────────────────────────────────┤
│ StoryRouteBar                            │
└──────────────────────────────────────────┘
```

**Pros:**
- Always visible — customer experience stays grounded across perspectives
- Doesn't compete with detail panel
- Updates automatically as navigation context changes
- Works during guided route playback without manual selection

**Cons:**
- Takes canvas space (needs toggle to hide)
- New UI component, not reusing existing infrastructure

### Recommended: Approach B (floating overlay)

The floating overlay is the stronger product choice because it keeps the customer's experience persistently visible while the user explores technical perspectives. The detail panel remains available for technical detail. Both can coexist.

---

## How the Overlay Stays in Sync

The overlay lives in `AppShell.tsx` at the same level as `StoryRouteBar` — it's a sibling of the canvas, not inside it. It reads from the shared navigation state:

### Mapping chain:
```
Current nav state
  → activeJourneyId + activeStepIndex
  → step.focusTargets
  → find node where type === "screen"
  → resolve screen asset/mockup
  → render in floating frame
```

### Why it persists across perspectives:

The shared context contract preserves `activeJourneyId` and `activeStepIndex` across perspective switches. So when you move from Journey → Process → Sequence, the overlay knows which step you're on and which screen the customer sees at that moment.

### What triggers updates:
- Clicking a journey step (JUMP_TO_STEP)
- Clicking a BPMN task that maps to a journey step
- Advancing a sequence message that maps to a step transition
- Guided route waypoint progression

### Many-to-one mapping:
Multiple process tasks or sequence messages may occur before the next screen transition. The overlay shows the **last confidently-resolved customer-visible screen state** — it does not pretend to animate every internal transition into a screen change.

---

## What It Needs

### Screen assets or mockup references
Screen-type nodes currently have only labels. They need visual content:
- `metadata.screenAsset`: image URL (simplest — screenshot or Figma export)
- `metadata.screenLayout`: structured screen description (richer — rendered components)
- `metadata.mockupUrl`: external URL to a hosted mockup image

### Mobile frame component
`ScreenOverlay.tsx` — renders a phone-frame container with:
- The current screen image/content inside the frame
- The screen node label as a caption
- A show/hide toggle button
- Smooth transition when the screen changes

### Step-to-screen resolver
A utility that resolves the current navigation context to the appropriate screen:
```typescript
function resolveCurrentScreen(nav: NavigationContext, steps: Step[], nodes: Node[]): Node | null {
  // Find the active step
  // Look through its focusTargets for a screen-type node
  // Return that node (or null if no screen is relevant)
}
```

---

## Design Rules

1. **The preview is a contextual aid, not a parallel navigation surface.** It subordinates to the current GuideRail context. It is not a second application mode.

2. **Show only confidently-resolved state.** The preview should not pretend to animate every internal transition into a screen. It shows what the customer actually sees at this moment.

3. **Toggle, don't force.** The overlay should have a clear show/hide toggle. Some users won't want it taking canvas space. Default: visible on Journey, hidden on other perspectives until toggled.

4. **Screen node detail = screen render.** When a screen node is selected (click = detail), the right panel should show the screen render, not metadata about the screen. The render IS the detail.

---

## Scope

- **0.6.0:** Establish screen-to-step mapping. Add `ScreenOverlay.tsx` with placeholder rendering (screen label in a phone frame). Toggle button. Sync with navigation state.
- **0.7.0:** Real screen assets — mockup images or structured screen descriptions. Figma export pipeline or screenshot ingestion.

---

## Relationship to Plugin Model

With the Switchboard plugin model (`docs/ideas/switchboard-plugin-model-idea.md`), the screen overlay could be implemented as a plugin:
- Contributes to `canvas.overlay` slot
- Listens to `context.changed` and `route.waypoint.entered` hooks
- Pro version could include Figma sync for live mockup updates
