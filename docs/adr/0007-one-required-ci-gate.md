# 0007. One required CI check

**Status:** Accepted. **Decided:** 2026-11-14, issues #1 and #2.

## Context
Branch protection requires checks by name. Requiring each job by name means editing repository settings whenever a job is added, renamed or split, and a job that is skipped or cancelled can leave a required check that never reports, or reports nothing.

## Decision
Branch protection requires exactly one check, `CI gate`. That job runs always and fails unless every job it depends on succeeded. New checks are added inside the workflow and to the gate's dependencies; the repository ruleset does not change.

The gate allows one skip: dependency review on a push to `main`, where there is no base to compare against.

Lint warnings fail the gate as well as errors.

The ruleset on `main` has no bypass, for the maintainer too. No approval count is required while there is one maintainer.

## Consequences
- Adding a check is a pull request, reviewed like any other.
- A cancelled or skipped job cannot read as a pass. This was demonstrated by cancelling a run.
- Checks that are not in the gate, such as CodeQL's own check, do not block a merge on their own. A failed one should still be treated as a stop.
