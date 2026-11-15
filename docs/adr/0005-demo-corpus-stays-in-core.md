# 0005. The demo corpus is a built entry point of the kernel

**Status:** Accepted, to be revisited. **Decided:** 2026-11-14, issue #13. Replaces the plan's first decision, a separate `packages/demo-content` package.

## Context
The demo corpus was reached from the web app through an alias into the kernel's source. The plan was to move it to its own private package.

That cannot be done cleanly today. Fourteen of the kernel's test files use the corpus as their fixture, and a corpus package needs the kernel for types and schemas. If the kernel's tests depend on the corpus package, the two form a cycle, and turbo refuses to run. This was tried with a throwaway package, not assumed.

The ways round the cycle were rejected: test-only path aliases into a sibling package's source are the kind of hack being removed, and converting the corpus to a JSON dump contradicts the 0.5.0 plan, which says content files must be authored artifacts, "not seed dumps split into JSON files".

## Decision
The corpus lives in `packages/core/src/demo/` and is built and exported as `@guiderail/core/demo`. It is data, not kernel API: kernel source may not import it, and it is outside the compatibility promise.

## Consequences
- The web app consumes a built package and never the kernel's source.
- A published `@guiderail/core` would carry about 224 kB of sample data. It is not published.
- Issue #62 gives the kernel tests their own fixtures so the corpus can move out. That should happen before any decision to publish.
