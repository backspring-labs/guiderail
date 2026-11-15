# Repository foundation: closure report

Written for the independent assessment that follows the foundation campaign. It says what the campaign was asked to do, what was done, where the evidence is, and what was not done or not verified.

- **Asked:** the twenty draft issues in the [hygiene action backlog](GuideRail_Hygiene_Action_Backlog_2026-11-14.md), HY-01 to HY-20, written against commit `faac155`.
- **Planned:** the [repository foundation plan](repository-foundation-plan.md), which split some backlog items and added others.
- **Tracked:** issue #25 and the `Repository foundation` milestone. Backlog ids HY-01 to HY-24 are issues #1 to #24.
- **State described here:** `main` at `43a6886`, on 2026-11-15. Released as 0.8.0 from `858f243`. The changes made after that, up to and including this report, are released as 0.8.1; the changelog lists them.

This is the campaign checking itself. It is not the assessment.

## How to check it yourself

From a fresh clone, on Node 26 or 24 with the pnpm version pinned in `package.json`:

```bash
pnpm install --frozen-lockfile
pnpm exec biome ci --error-on-warnings .
pnpm check:boundaries
pnpm build
pnpm check:bundle
pnpm typecheck
pnpm test:coverage
pnpm check:package
pnpm --filter @guiderail/web exec playwright install chromium
pnpm test:e2e
pnpm audit
pnpm audit --prod
```

Result of that run at the commit above, on Node 26.10.0, macOS:

| Step | Result |
|---|---|
| Frozen install, lint, boundaries, build, bundle budget, typecheck, package check | Pass |
| Unit and component tests with coverage floors | Pass: core 469 tests, web 152 tests |
| Browser suite against the built app and Storybook | Pass: 38 tests |
| `pnpm audit` | 3 moderate, all under Storybook 8, accepted until 2027-02-12 (#46) |
| `pnpm audit --prod` | No known vulnerabilities |

Node 24 was not run locally. CI runs lint, boundaries, build, bundle budget, typecheck, tests and the package check on Node 24 and 26 for every pull request and every push to `main`; the browser suite runs once, on Node 26.

Repository settings, read back through the GitHub API on 2026-11-15:

| Setting | Value |
|---|---|
| Ruleset `Protect main` | Active, no bypass. Pull request required, required check `CI gate`, branch must be up to date, conversations resolved, squash only, no force-push, no deletion |
| Ruleset `Immutable release tags` | Active on `v*` |
| Secret scanning and push protection | Enabled |
| Dependabot alerts and security updates | Enabled |
| CodeQL default setup | Configured |
| Private vulnerability reporting | Enabled |
| Workflow token | Read-only; workflows cannot approve pull requests |
| Open alerts | Code scanning 0, secret scanning 0, Dependabot 3 medium (the accepted Storybook dependencies) |

## Reconciliation against the backlog

"Met" means every acceptance criterion in the backlog item has evidence. "Met, with gaps" means the item is closed and the gaps listed were stated when it closed. Evidence is the closing comment on the issue or the description of the pull request.

| Id | Outcome asked for | Result | Evidence | Gaps |
|---|---|---|---|---|
| HY-01 | Required CI on pull requests and `main`; a failing check fails the gate; cancelled jobs cannot pass | Met | #1, #26. Disposable #34 proved a failing and a cancelled run both fail `CI gate` | None |
| HY-02 | `main` protected; merge method and ownership defined | Met, with gaps | #2, #36, #43. Readback above. `.github/CODEOWNERS`; `CONTRIBUTING.md`, "Who decides" | The SquadOps clause is deferred. No rule is specific to automated contributors; the general rules (no bypass, read-only token, no workflow approvals) apply to them |
| HY-03 | Issue forms, pull request template, labels, milestone, roadmap; one task through the whole loop | Met | #3, #43. The loop was shown with #32 → #54 | No GitHub Project is used; status lives in issues and the milestone |
| HY-04 | Portable agent instructions that match the code | Met, with gaps | #4, #27. `AGENTS.md`; `CLAUDE.md` only points to it | "SquadOps explicitly loads the guide" is deferred with the rest of SquadOps |
| HY-05 | Every high or critical advisory fixed or excepted | Met | #5, #47, #48, #56, #68. 48 advisories at the start, 3 moderate now, none in production dependencies | The 3 moderate advisories need Storybook 10 (#46) |
| HY-06 | Security settings on and read back; scans run; dependency review and secret blocking demonstrated | Met | #6, #36, `docs/security/controls.md`. Disposable #37 failed dependency review; a push with a fake token was rejected; `gitleaks` over the full history found nothing | None |
| HY-07 | The packed core package resolves for a consumer | Met | #7, #50. `pnpm check:package` packs core, installs it outside the workspace and imports and typechecks every export, in CI | The `./test-fixtures` export was removed, not built |
| HY-08 | The app initialises the kernel with messages and interfaces; sequence stepping works | Met | #8, #28, #53 | None |
| HY-09 | Content loading reports everything it cannot use | Met | #9, #55, `docs/architecture/data-integrity.md` | None |
| HY-10 | Unique traversal; journey-scoped path nodes | Met | #10, #29, and #54 for directed edges | None |
| HY-11 | Tests are typechecked; coverage is measured with floors | Met | #11, #52 | Floors are the measured values, not targets: core 88/78/89/92, web 66/57/58/67 (statements/branches/functions/lines) |
| HY-12 | App mount, navigation, keyboard and focus tests; a browser suite on built output; Storybook and accessibility checks | Met, with gaps | #12, #24, #31; #53, #65, #67, #76. CI keeps traces and screenshots of failures; retries are off, so a flaky test fails | No screenshot-comparison tests. No screen reader. Chromium only |
| HY-13 | One typed data boundary; no web import of core source | Met, with a changed decision | #13, #63, #64. `<App dataset>`, `useDataset()`, `pnpm check:boundaries` | The demo corpus is a built entry point of core, not a separate package. See "Departures" |
| HY-14 | Idempotent initialisation; stale layouts cannot win; visible retry on failure | Met | #14, #60 | None |
| HY-15 | A clean checkout reaches a working app from the README alone | Met, with gaps | #15, #69 | Followed by the campaign's author on a fresh clone, not by a second person. The dev server was not tried on Node 24 or on Windows |
| HY-16 | Docs indexed with status; history reconciled with the code; the 1.0 spec identified as its own baseline | Met, with gaps | #16, #73, #75. `docs/README.md`, `docs/adr/` | Features that older plans called shipped but that are not in the code are listed in #72 and not yet triaged one by one |
| HY-17 | Contribution, security and conduct paths that lead somewhere real | Met | #17, #36, #43 | The security response time and the conduct contact are the author's wording, for the maintainer to confirm |
| HY-18 | Versioning, compatibility policy and a checked release | Met, with gaps | #18, #71, #74. `docs/releasing.md`; `pnpm check:release`; release 0.8.0 and its `Release check` run | Core is not published to npm, so provenance, checksums and trusted publishing are not set up. The tag ruleset reads back as active but was not tested by trying to move a release tag |
| HY-19 | A declared, enforced runtime policy | Met | #19, #26. Node 26 and 24 in `engines`, `.node-version`, CI and the README | None |
| HY-20 | Initial payload measured and reduced; growth flagged in CI | Met, with gaps | #20, #70, `docs/performance.md`. Initial JavaScript 664 kB → 213 kB gzip; `pnpm check:bundle` | No large-graph benchmark: the demo has 24 nodes. Timings are local, with no network latency |

## Work the backlog did not list

| Id | Issue | What and why | State |
|---|---|---|---|
| HY-21 | #21 | The Process canvas ignored the selected process. Found by reading the code | Closed, #59 |
| HY-22 | #22 | One index contract for every stepper: positions, chosen by perspective type | Closed, #57, #58 |
| HY-23 | #23 | Zod 3 → 4, split from HY-05 so it could wait for parser regression tests | Closed, #56 |
| HY-24 | #24 | The browser suite, Storybook and accessibility half of HY-12 | Closed, #67 |
| HY-25 | #31 | A smoke test against the production build, added after an outside review of the plan | Closed, #53 |
| HY-26 | #32 | Decide and test what `directed: false` means in graph queries | Closed, #54 |
| HY-27 | #33 | The campaign's own end-to-end check: this report | Closed with this report |
| HY-28 | #35 | Select-and-show as one kernel event, so every entry point navigates the same way | Closed, #61 |
| HY-31 | #66 | Colour contrast, the one accessibility rule the suite had skipped | Closed, #76 |
| HY-29 | #46 | Storybook 10 and TypeScript 7 | Open, deferred |
| HY-30 | #62 | Kernel tests get their own fixtures so the demo corpus can leave core | Open, deferred |

## Departures from the backlog

- **Demo data stays in core (HY-13).** The plan was a separate `packages/demo-content`. The kernel's tests use the demo corpus as their fixture, and a package that core's tests depend on is a dependency cycle that Turborepo rejects. The corpus is instead a built entry point, `@guiderail/core/demo`, and a boundary check stops kernel source importing it. ADR 0005 records this; #62 is the way out.
- **The fixture export was removed, not built (HY-07).** Nothing outside the repository used it.
- **Core is not published (HY-07, HY-18).** Release hardening for npm waits for a decision to publish.
- **Review requirement is zero approvals (HY-02).** There is one maintainer. The required check is the control.
- **SquadOps is deferred (HY-02, HY-04).** No control or instruction specific to automated contributors was added.

## One process failure

A script guessed a pull request number and merged Dependabot's #38, a runtime dependency update, under another change's commit subject (`3655cac`). CI had passed on it, so the gate did what it is for, but nobody had reviewed it. It was reverted in #45 and re-landed after review in #68. The script used to merge, which is not part of the repository, now finds a pull request by its branch and refuses one its user did not open.

## Not verified

- The dev server on Node 24. Any command on Windows.
- A second person following the README.
- A screen reader. Any browser other than Chromium.
- Contrast of text that the automated scan cannot judge and that is dimmed on purpose to show focus.
- The Decision and Controls canvas modes on a process diagram derived from stages.
- Behaviour with a large graph, and timings over a real network.
- That the tag ruleset blocks moving or deleting a release tag.

## Open

| Item | Disposition |
|---|---|
| #46 Storybook 10, TypeScript 7 | Deferred. The exception for the three moderate advisories is owned by the maintainer and expires 2027-02-12 |
| #62 Demo corpus out of core | Deferred. Do it before any decision to publish core |
| #72 Gaps between older plans and the code | Waiting for triage against the 1.0 specification |
| SquadOps controls | Deferred; no issue yet |
| Seven empty demo collections | Not a defect in the code. Landscape → Providers and Process → Controls show nothing with the demo data |

## Where an assessor might look first

These are the places the campaign is least sure of.

- **Web test depth.** Web coverage is about two thirds of statements. The browser suite covers every perspective, but with one small dataset.
- **Accessibility.** Automated checks only.
- **The data-integrity contract against real content.** The loader is tested against constructed cases and the demo corpus, not against content written by someone else.
- **Evidence written by the author.** Every closing comment and this report were written by the agent that did the work, with a single maintainer and no second reviewer. The checks are reproducible; the judgement in "Met" is not independent.
