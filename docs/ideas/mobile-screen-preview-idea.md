# IDEA — Mobile Screen Preview in Detail Panel

## Context

The right panel currently shows contextual detail for the selected entity (node detail, control points, sequence messages, etc.). When the selected entity is a screen-type node or when the current navigation context maps to a customer-facing screen, the panel could render a mobile screen preview instead of — or alongside — technical detail.

This keeps the customer's experience visible while navigating through Process, Sequence, or Journey perspectives, grounding technical abstractions in the user's reality.

## Concept

- The right panel already has open/close infrastructure tied to `selectedNodeId` and navigation context
- When a `screen` type node is selected (e.g., `n-mobile-app`, `n-web-app`), the panel renders a mobile screen mockup instead of the standard node detail
- When navigating through Process (BPMN) or Sequence (lifeline) perspectives, if the current focus maps to a journey step that involves a screen transition, the panel can show that screen
- The mapping is many-to-one: multiple process tasks or sequence messages may occur before the next screen transition — the preview shows the last relevant screen state

## Why this works

- Reuses existing panel slide-out behavior — no new UI chrome needed
- The shared context contract already tracks `activeJourneyId`, `activeStepIndex`, and `activeFocusTargets`
- Journey steps already reference screen nodes via `focusTargets`
- The panel just needs to detect "is this a screen-relevant selection?" and render differently

## What it needs

- **Screen assets or mockup references** on screen-type nodes — currently these are just labels. Would need an image URL, SVG component reference, or structured screen layout description in metadata.
- **Step-to-screen mapping** — a way to resolve which screen the customer sees at a given process/sequence moment. Could use the existing journey step → focusTarget → screen node chain.
- **Mobile frame component** — a React component that renders a phone-frame container around the screen content.

## Implementation approach

1. Add `screenAsset` or `mockupUrl` to screen node metadata
2. Create `ScreenPreviewPanel.tsx` — renders in the right panel when a screen node is selected
3. Update `DetailPanelRouter.tsx` — route to screen preview when selected node type is `screen`
4. For Process/Sequence sync: resolve current focus → nearest journey step → screen node → show preview

## Scope

- **0.5.0 stretch:** Establish the screen-to-step mapping in the Journey canvas template. Add `ScreenPreviewPanel` with placeholder rendering.
- **0.6.0:** Full screen preview with real mockup assets or structured screen descriptions.

## Design rule

The screen preview is contextual detail, not a separate mode. It lives in the right panel and follows the same open/close behavior as all other detail content. It should feel like "I selected something and the panel showed me what the customer sees" — not like switching to a different application.
