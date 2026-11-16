# Decision records

The decisions that shape GuideRail, each with the reason for it. A record is short: what was decided, why, and what follows from it.

Records 0001 and 0002 describe decisions made before this log existed and are written from the code and the plans. Records 0003 to 0007 were made during the repository foundation work in November 2026 and record what was decided then. Later records follow from the independent assessment of that work.

| # | Decision | Status |
|---|---|---|
| [0001](0001-kernel-is-the-single-authority-for-navigation.md) | The kernel is the single authority for navigation state | Accepted |
| [0002](0002-perspectives-share-one-context.md) | Perspectives share one context | Accepted |
| [0003](0003-indices-are-positions.md) | Navigation indices are positions, and perspectives are resolved by type | Accepted |
| [0004](0004-one-dataset-boundary.md) | The web app has one data boundary | Accepted |
| [0005](0005-demo-corpus-stays-in-core.md) | The demo corpus is a built entry point of the kernel | Accepted, to be revisited |
| [0006](0006-content-loading-reports-everything.md) | Content loading reports everything it does not use | Accepted |
| [0007](0007-one-required-ci-gate.md) | One required CI check | Accepted |
| [0008](0008-agents-propose-the-maintainer-merges.md) | Agents propose; the maintainer decides and merges | Accepted |

## Adding a record

Number it next in sequence, keep it to a page, and link the issue or pull request where the decision was made. If a later decision replaces an earlier one, write a new record and mark the old one "Superseded by NNNN"; do not rewrite history.
