# 0002. Perspectives share one context

**Status:** Accepted. **Recorded:** 2026-11-15. Decided in 0.4.0 (`docs/plans/guiderail-0.4.0-plan.md`); the exact field list was confirmed by the maintainer on 2026-11-14 (issue #12).

## Context
A perspective switch could mean "take me somewhere else" or "show me this same moment through another lens". The product is built on the second meaning.

## Decision
Switching perspective keeps the user's context: domain, capability, journey, process, sequence, value stream, route, every stepper position, focus targets, scene and mode.

It clears the selected node and edge, because each canvas has its own nodes, and resets the canvas mode, because a mode means nothing in another perspective. Canvas mode is not remembered per perspective.

The viewport anchor is outside the contract: the kernel computes it and the UI does not read it.

## Consequences
- The full table is in `AGENTS.md` under "Navigation contract", and `navigation-contract.test.ts` asserts it field by field.
- That test's table is typed over every field of `NavigationContext`, so a new field must be classified before the tests compile.
- Returning to Process after visiting another perspective loses a non-default canvas mode. Remembering it would be a new decision.
