# 0006. Content loading reports everything it does not use

**Status:** Accepted. **Decided:** 2026-11-14, issue #9.

## Context
The content loader skipped what it did not understand without saying so. A section that was not an array loaded as empty. A misspelled collection name, a duplicate id and a reference to something that did not exist all passed silently. With hand-written data that is tolerable; with content from other sources it hides real errors.

## Decision
Nothing is dropped, overwritten or reinterpreted without a diagnostic. Loading never throws on bad content.

- An omitted collection is valid and empty.
- A malformed section, an invalid entity and a duplicate id are errors. For a duplicate, the first entity wins.
- A dangling reference is an error, and the entity is kept, so one bad id cannot cascade. Consumers tolerate a reference that does not resolve.
- An unknown top-level key and a duplicated sequence number are warnings.

One object, `CONTENT_COLLECTIONS`, defines every loadable collection; the bundle type, parsing, merging and validation derive from it.

## Consequences
- The full rules are in `docs/architecture/data-integrity.md`.
- Running the validator over the demo corpus found one wrong reference, since fixed.
- This is about correctness, not hostile input. Loading untrusted content is a separate decision that has not been made.
