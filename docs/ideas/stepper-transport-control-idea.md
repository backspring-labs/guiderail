# IDEA — Stepper Transport Control for Sequential Perspectives

## Context

Journey, Process, and Sequence perspectives all contain ordered sequential content — steps, stages, and messages. Currently the user navigates by clicking individual elements on the canvas. There's no way to step through the sequence linearly using transport controls or keyboard shortcuts.

The guided route bar (StoryRouteBar) already proves the transport control pattern for story routes — prev/next/pause/resume. This idea extends that pattern to free exploration within any sequential perspective.

---

## Concept

A transport control bar appears at the bottom of the canvas when a sequential perspective has active content (active journey, process, or sequence). It provides visual buttons and keyboard shortcuts for stepping through the content.

### Visual Controls

```
┌──────────────────────────────────────────────────┐
│  ⏮   ◀   ▶   ⏭     Step 3 of 8                │
│                       Identity Verification       │
└──────────────────────────────────────────────────┘
```

- **⏮** (Reset) — jump to first item
- **◀** (Back) — previous item
- **▶** (Forward) — next item
- **⏭** (End) — jump to last item
- **Current position** — "Step 3 of 8" or "Message 7 of 14"
- **Current label** — title of the current step/stage/message

### Keyboard Controls

When the canvas is focused (not typing in search or a text field):

| Key | Action |
|---|---|
| **←** Arrow Left | Previous (back one step) |
| **→** Arrow Right | Next (forward one step) |
| **↑** Arrow Up | Reset to start (first item) |
| **↓** Arrow Down | Jump to end (last item) |

These mirror the visual buttons. The keyboard hints could optionally appear below the buttons as a subtle reminder.

---

## What Gets Stepped

| Perspective | What you step through | Entity | Count source |
|---|---|---|---|
| Journey | Steps | Step (ordered by sequenceNumber) | journey.stepIds.length |
| Process | Process stages | ProcessStage (ordered by sequenceNumber) | process.stageIds.length |
| Sequence | Messages | Message (ordered by sequenceNumber) | sequence.messageIds.length |

### What stepping does

Each step:
1. Updates the current index in the kernel (`activeStepIndex`, or new `activeStageIndex` / `activeMessageIndex`)
2. Highlights the current item on the canvas (selection glow, circle badge activation)
3. Updates the detail panel with the current item's content
4. Updates the breadcrumb/context bar with the current position
5. Pans the viewport to keep the current item visible (if off-screen)

---

## Activation Rules

The stepper appears when:
- **Journey perspective** with an active journey (`activeJourneyId` is set)
- **Process perspective** with an active process (`activeProcessId` is set)
- **Sequence perspective** with an active sequence (`activeSequenceId` is set)

The stepper does NOT appear when:
- No sequential content is active (showing a picker)
- On Landscape, Architecture, or System perspectives (no sequential content)
- A guided route (StoryRouteBar) is active — the route bar takes precedence

### Coexistence with StoryRouteBar

The stepper and the StoryRouteBar serve different purposes:
- **StoryRouteBar** — guided route playback (authored narrative, waypoints, perspective switches)
- **Stepper** — free exploration within a single sequential perspective

If a guided route is active, the StoryRouteBar is shown and the stepper is hidden. When the route ends or is paused, the stepper becomes available again for the active perspective.

---

## Kernel Changes Needed

### Journey (mostly exists)
- `STEP_FORWARD` and `STEP_BACKWARD` already exist
- `JUMP_TO_STEP` already exists
- Need: reset to start (JUMP_TO_STEP index 0) and jump to end (JUMP_TO_STEP index last)
- These are UI conveniences, not new kernel events

### Process (new)
- Add `activeStageIndex` to NavigationContext (nullable, default null)
- Add `STEP_PROCESS_FORWARD` / `STEP_PROCESS_BACKWARD` / `JUMP_TO_STAGE` events
- Reconciler: update activeStageIndex, set focus targets to stage's nodeIds
- Or: reuse generic stepping with perspective-aware dispatch

### Sequence (new)
- Add `activeMessageIndex` to NavigationContext (nullable, default null)
- Add `STEP_SEQUENCE_FORWARD` / `STEP_SEQUENCE_BACKWARD` / `JUMP_TO_MESSAGE` events
- Reconciler: update activeMessageIndex, highlight the current message node
- Or: reuse generic stepping with perspective-aware dispatch

### Alternative: Generic Stepper Events

Instead of perspective-specific events, add generic stepper events that the reconciler dispatches based on the active perspective:

```typescript
| { type: "STEPPER_FORWARD" }
| { type: "STEPPER_BACKWARD" }
| { type: "STEPPER_RESET" }
| { type: "STEPPER_END" }
```

The reconciler checks which perspective is active and delegates:
- Journey → increment activeStepIndex
- Process → increment activeStageIndex
- Sequence → increment activeMessageIndex

This keeps the event surface small and the keyboard handler simple — it always fires the same events regardless of which perspective is active.

---

## UI Component

### StepperBar.tsx

Positioned at the bottom of the canvas, same location as StoryRouteBar. Only one shows at a time.

```typescript
interface StepperBarProps {
  currentIndex: number;
  totalItems: number;
  currentLabel: string;
  perspectiveLabel: string;  // "Step", "Stage", "Message"
  onBack: () => void;
  onForward: () => void;
  onReset: () => void;
  onEnd: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}
```

### Keyboard Handler

Registered in AppShell when stepper is visible:

```typescript
useEffect(() => {
  if (!stepperActive) return;
  const handleKeyDown = (e: KeyboardEvent) => {
    // Don't capture when typing in inputs
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        send({ type: "STEPPER_BACKWARD" });
        break;
      case "ArrowRight":
        e.preventDefault();
        send({ type: "STEPPER_FORWARD" });
        break;
      case "ArrowUp":
        e.preventDefault();
        send({ type: "STEPPER_RESET" });
        break;
      case "ArrowDown":
        e.preventDefault();
        send({ type: "STEPPER_END" });
        break;
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [stepperActive, send]);
```

---

## Styling

The stepper bar should match the StoryRouteBar aesthetic — dark background, centered controls, subtle border. The transport buttons use the same icon style.

```css
.stepper-bar {
  /* Same positioning and sizing as .story-route-bar */
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  /* Transport button styling */
  /* Current position label */
  /* Keyboard hint text */
}
```

---

## Interaction with Canvas Highlighting

When stepping:
- The current item gets the selected/highlighted treatment (blue glow)
- On Journey: the current step card highlights, others dim slightly
- On Process: the current BPMN task highlights
- On Sequence: the current message's circle badge activates (solid blue), its lifeline highlights

This creates a "spotlight" effect — the user's attention follows the stepper through the sequential content.

---

## Design Rules

1. **The stepper is for free exploration, not guided narration.** It doesn't carry a narrative, key message, or perspective switch. It just moves through the items in order.

2. **Keyboard controls must not conflict with React Flow's defaults.** React Flow uses arrow keys for viewport panning. The stepper should only capture arrow keys when the stepper is active and the canvas is focused (not an input field). React Flow's pan-on-scroll mode avoids this conflict.

3. **The stepper follows the shared context contract.** Stepping updates kernel state, which means switching perspectives mid-step preserves the position.

4. **One transport control at a time.** If a guided route is active, the StoryRouteBar shows. Otherwise, the stepper shows for sequential perspectives.

---

## Scope

This could be implemented as:
- Part of 0.6.0 (alongside left panel rework)
- A standalone feature (low dependency, self-contained)
- A Switchboard plugin (contributes to `canvas.overlay` slot, listens to `context.changed` hook)

Estimated implementation: 2-3 days for the generic stepper events, UI component, keyboard handler, and highlighting integration.

---

## Relationship to Other Features

- **StoryRouteBar** — same transport metaphor, coexists (one at a time)
- **Mobile screen preview** — stepping through a journey would update the screen preview overlay
- **Left panel navigation** — selecting an item in the left panel could set the stepper position
- **Guided routes** — a route could "hand off" to the stepper when it reaches a perspective and lets the user explore freely before resuming
