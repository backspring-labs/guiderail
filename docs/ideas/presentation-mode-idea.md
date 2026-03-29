# IDEA — Presentation Mode for Guided Routes

## Context

GuideRail's guided route system (StoryRouteBar) already carries the full narrative structure: waypoints with perspectives, focus targets, key messages, and "why it matters" explanations. But routes play back inside the full explorer UI — left panel, right panel, context bar, and canvas controls are all visible. This is ideal for analyst-mode exploration but overwhelming for stakeholder presentations.

The product needs a way to shift from "analyst workbench" to "keynote companion" using the same route data.

---

## Concept

Presentation mode is a **full-screen overlay renderer** for guided routes. It uses the same `StoryRoute` and `StoryWaypoint` data but renders each waypoint as a focused slide with the canvas as a backdrop.

### Two activation levels

1. **Overlay mode** — modal slides over the explorer UI. The canvas still renders behind a semi-transparent backdrop. The narrative card is front and center. Explorer is paused but preserved.

2. **Full-screen mode** — uses the browser Fullscreen API (`document.documentElement.requestFullscreen()`). Browser chrome disappears. Pure presentation surface. ESC exits naturally (browser handles this).

### Flow

```
Explorer → Start Route → [Present] → Overlay Mode → [Full Screen] → Presentation Mode
                                                                           ↓
Explorer ← Resume Route ← [ESC] ← Overlay Mode ← [ESC] ← Presentation Mode
```

- Route state is preserved throughout. Exiting presentation mode returns to the explorer at the current waypoint.
- The route does not need to be restarted.

---

## Slide Layout

Each waypoint renders as a slide with three regions:

```
┌─────────────────────────────────────────────┐
│                                             │
│              Canvas Region                  │
│     (perspective + focus targets            │
│      from waypoint, zoomed to fit,          │
│      dimmed non-focus elements)             │
│                                             │
├─────────────────────────────────────────────┤
│  Key Message                                │
│  Why it matters...                          │
│                                             │
│  ◀  3 / 12  ▶           [Exit] [Fullscreen] │
└─────────────────────────────────────────────┘
```

- **Canvas region** — the actual React Flow canvas, rendered at the waypoint's perspective with focus targets highlighted and non-focus elements dimmed. Zoomed to fit the focus area with generous padding.
- **Narrative card** — the waypoint's `keyMessage` as a headline, `whyItMatters` as supporting text. Large, readable typography.
- **Navigation** — arrow buttons + position counter. Minimal controls.
- **Utility** — Exit (returns to explorer overlay or exits fullscreen), Fullscreen toggle.

### First waypoint (intro slide)

The route's `title` and `destinationObjective` render as a title slide before the first waypoint's canvas content.

### Transitions

Slide transitions should be subtle — a quick fade or crossfade between waypoints. The canvas perspective switch already animates via fitView, so the transition is mainly on the narrative card.

---

## Data Model

No new entities needed. Presentation mode is a **renderer**, not a data structure. It reads from:

- `StoryRoute.title` — presentation title
- `StoryRoute.destinationObjective` — subtitle / intro
- `StoryWaypoint.keyMessage` — slide headline
- `StoryWaypoint.whyItMatters` — slide body
- `StoryWaypoint.perspectiveId` — which canvas to show
- `StoryWaypoint.focusTargets` — what to highlight
- `StoryWaypoint.sequenceNumber` — slide order

### Potential future additions (not 0.7.0)

- `StoryWaypoint.presenterNotes` — notes visible only to presenter (not on slide)
- `StoryWaypoint.transitionType` — fade, slide, zoom
- `StoryRoute.theme` — color scheme for presentation
- Speaker timer / auto-advance

---

## Activation

### From StoryRouteBar

When a route is active, the StoryRouteBar gains a "Present" button:

```
┌──────────────────────────────────────────────────────────┐
│ How a Payment Flows  2/5  │ Previous │ Next │ Pause │ Present │ End │
└──────────────────────────────────────────────────────────┘
```

### Keyboard shortcut

`F5` or `Cmd+Enter` starts presentation mode from the current waypoint (mirrors PowerPoint/Keynote convention).

### From route selection

Double-clicking a route in the Guides section could start it directly in presentation mode.

---

## Browser Fullscreen API

```typescript
// Enter fullscreen
document.documentElement.requestFullscreen();

// Exit fullscreen
document.exitFullscreen();

// Listen for fullscreen changes
document.addEventListener("fullscreenchange", () => {
  const isFullscreen = document.fullscreenElement != null;
});
```

- ESC automatically exits fullscreen (browser-native behavior)
- The overlay can remain active after exiting fullscreen (drops back to overlay mode)
- Safari requires `webkitRequestFullscreen` — use a small wrapper

---

## Coexistence Rules

1. **Presentation mode owns the viewport.** No left panel, right panel, context bar, or stepper visible.
2. **Route state is shared.** Advancing a slide in presentation mode advances the route in the kernel. Exiting presentation mode returns to explorer at the same waypoint.
3. **Stepper is hidden** during presentation mode (same rule as StoryRouteBar).
4. **Canvas interactions are disabled** in presentation mode — no clicking nodes, no panning, no zooming. The canvas is a backdrop, not interactive.
5. **Search is disabled** during presentation mode.

---

## Styling

- Dark backdrop with high contrast narrative text
- Large typography for readability at distance (conference room / screen share)
- Subtle slide counter, not a progress bar
- Minimal controls — the slide content is the star
- Smooth transitions between waypoints (300-500ms fade)
- Canvas region uses the existing perspective rendering but with increased dimming on non-focus elements

---

## Design Rules

1. **Same data, different renderer.** Presentation mode does not introduce a parallel content model. If the route works in explorer mode, it works in presentation mode.
2. **No editing in presentation mode.** This is a playback surface, not an authoring tool.
3. **Graceful degradation.** If a waypoint has no `whyItMatters`, the narrative card just shows the key message. If there are no focus targets, the full canvas is shown.
4. **Exit is always available.** ESC always works — in fullscreen it exits fullscreen first, then a second ESC exits presentation mode entirely.

---

## Relationship to Other Features

- **Guided routes** — presentation mode is a renderer for routes, not a replacement
- **Stepper transport** — hidden during presentation, same navigation concept
- **Mobile screen preview** — could appear as a floating element on presentation slides for journey waypoints
- **Switchboard plugins** — presentation themes could be a plugin slot (`presentation.theme`)

---

## Scope

This is a 0.7.0 candidate. Implementation:
- `PresentationOverlay.tsx` — full-viewport overlay component
- `PresentationSlide.tsx` — per-waypoint slide layout
- CSS for presentation typography and transitions
- Fullscreen API wrapper
- "Present" button on StoryRouteBar
- Keyboard shortcut (F5)

Low dependency on other planned features. Self-contained.
