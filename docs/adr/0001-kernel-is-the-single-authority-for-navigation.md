# 0001. The kernel is the single authority for navigation state

**Status:** Accepted. **Recorded:** 2026-11-15, from the code and `docs/plans/viewscape-core-plan.md`. The decision predates this log.

## Context
GuideRail shows one system through several views. If each view kept its own idea of what is selected and where the user is, the views would drift apart.

## Decision
All navigation state lives in one XState machine in `@guiderail/core`, the Context Machine. The UI reads `snapshot.context.nav` and changes it only by sending events. Pure reconciler functions compute each new state.

The UI may hold presentation state (a panel is open, something is hovered) in Zustand. It may not hold or recompute navigation state.

## Consequences
- Any view can be added or replaced without touching navigation logic.
- Navigation is testable without a browser.
- A UI convenience that needs new navigation behaviour becomes a kernel event, not UI code. See 0003 for one that was moved.
