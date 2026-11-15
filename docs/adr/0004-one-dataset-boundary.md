# 0004. The web app has one data boundary

**Status:** Accepted. **Decided:** 2026-11-14, issue #13.

## Context
Twenty files in the web app imported the demo corpus's arrays directly, and the kernel was initialised from a separate import of the same arrays. Nothing guaranteed the kernel and the views read the same data: the Sequence stepper once failed because the kernel had not been given the messages the view was counting (#8). The app could not show anything but the demo.

## Decision
The app takes its content as a `Dataset`, a content bundle plus the graph built from it, through `<App dataset={…}>`. The kernel is initialised from it and every view reads it with `useDataset()`. Pure helpers take the dataset, or the slice they need, as a parameter.

Exactly one module, `apps/web/src/data/demo-dataset.ts`, imports content. `useDataset()` throws outside a provider instead of falling back to a default.

## Consequences
- Other content is shown by passing a different dataset; no component changes.
- The app must render a partial dataset. `App.test.tsx` mounts it with one.
- `pnpm check:boundaries` fails if any other module imports content.
