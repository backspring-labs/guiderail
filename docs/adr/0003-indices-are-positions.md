# 0003. Navigation indices are positions, and perspectives are resolved by type

**Status:** Accepted. **Decided:** 2026-11-14, issues #22 and #35.

## Context
Three conventions were in use for "the active item": reconcilers matched `sequenceNumber` to the index, guards compared the index with a length, and the UI indexed into a sorted array. They agreed only while sequence numbers started at 0 and had no gaps.

Separately, the kernel chose a stepper by checking whether the perspective's id contained the text "journey" or "process", and the UI hardcoded perspective ids such as `persp-journey` to navigate.

## Decision
- An index in `NavigationContext` is a position in a group ordered by `sequenceNumber`. Sequence numbers decide order only; they need not start at 0 or be contiguous. `orderBySequence()` is the one implementation, used by the kernel and the UI.
- The kernel resolves a perspective by its `type`, never by the text of its id. It is given the perspectives at `INITIALIZE`.
- "Select this and show it" is one kernel event, `NAVIGATE_TO`. No perspective id appears in UI code.

## Consequences
- Content can number its steps 10, 20, 30.
- A dataset can name its perspectives anything.
- A caller that does not pass `perspectives` to `INITIALIZE` gets no stepper.
- The left panel, search and the right panel all land in the same place.
