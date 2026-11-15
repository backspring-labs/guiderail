# GuideRail repository-foundation action backlog

**Baseline:** [faac1555226e21411b064021ecf371e0d0c81b41](https://github.com/backspring-labs/guiderail/tree/faac1555226e21411b064021ecf371e0d0c81b41) · **Prepared:** November 14, 2026  
**Purpose:** General repository and project hygiene, separate from the GuideRail 1.0 feature roadmap. These are proposed issue drafts; no GitHub issues or settings have been created/changed.

Use IDs to connect the assessment, issues and PRs. Priorities describe sequencing, not security severity. Effort is relative: **S** = one bounded change; **M** = several related changes; **L** = staged work that should be split into multiple PRs. Assign owners during triage; unresolved distribution/support decisions must be resolved before the dependent task is Ready.

## Campaign order

| Wave | Outcome | Work |
|---|---|---|
| **A — Establish controls** | Clean CI, enforced PR workflow, correct agent instructions, security/dependency triage | HY-01–HY-06; decide HY-19 runtime baseline |
| **B — Correct current defects** | Package, initialization, parser and graph contracts have meaningful regression checks | HY-07–HY-10; HY-11 typing/coverage baseline |
| **C — Improve safe extension** | Contributor docs and app/data/lifecycle tests make changes easier to hand off | HY-12–HY-17 |
| **D — Release and measure** | Repeatable distribution/versioning and measured size/performance | HY-18–HY-20 |

Documentation can run beside code tasks. Serialise overlapping edits to the context machine, reconciler, loader and perspective provider. Each issue may use several linked PRs but closes only after all acceptance criteria are evidenced.

## Draft issues

### HY-01 — Establish required repository CI

**Priority:** P1 · **Area:** tooling · **Effort:** M · **Depends on:** supported runtime choice in HY-19; otherwise can start immediately.

**Problem:** Local checks pass, but GitHub has no workflows or run history.

**Scope:** Add a PR/main GitHub Actions workflow for frozen installation, root/workspace lint, existing tests and production build. Add a stable gate summary, timeouts, concurrency and failure reports. Pin actions and minimize token permissions. Integrate further type/package checks as HY-07/HY-11 land.

**Acceptance:** A real PR and main run exercise the declared commands; an intentionally failing check in a disposable PR fails the gate; cancelled/missing required jobs cannot appear successful. Fork PR tests have no release credentials or elevated token. Cold-run logs record runtime/pnpm and package test counts. Keep the current passing baseline visible.

### HY-02 — Protect main and define merge ownership

**Priority:** P1 · **Area:** repository controls · **Effort:** S · **Depends on:** HY-01 running with stable check names.

**Scope:** Require PRs, required CI, resolved conversations and protection from force-push/deletion. Record any maintainer bypass and its purpose. Adopt a consistent merge method; enable merged-branch cleanup if appropriate. Add real CODEOWNERS entries for core/web/tooling and workflow policy.

**Acceptance:** Readback confirms the rules apply to main; a disposable failing PR is blocked. SquadOps cannot change policy to merge its own failure. Review requirements fit the available maintainers: independent approval where a separate eligible reviewer exists, without requiring the sole author to approve their own PR. Record merge/release authority in CONTRIBUTING.

### HY-03 — Create the issue-to-PR operating workflow

**Priority:** P1 · **Area:** project management · **Effort:** M · **Depends on:** maintainer triage decisions; HY-04 can proceed in parallel.

**Scope:** Add bug/enhancement/maintenance forms, PR template, small label taxonomy, repository-foundation milestone and current ROADMAP. Inspect/reuse any existing Project before creating a new one. Record Ready/Done rules and issue dependencies. Reconcile this backlog before creating issues.

**Acceptance:** At least one bounded task completes issue → owned branch → linked PR → checks/review → accepted closure with evidence. Every Ready task has problem, scope, non-goals, acceptance, dependencies and owner. Project status is not duplicated inconsistently in labels/docs. Historical ideas are not automatically imported as approved work.

### HY-04 — Publish portable, current agent instructions

**Priority:** P1 · **Area:** agent readiness/docs · **Effort:** S · **Depends on:** none.

**Scope:** Root AGENTS.md, tool-specific pointers, accurate seven-perspective architecture, kernel/UI authority, validated commands, issue/PR/handoff requirements and acknowledged demo-data limitations. Replace active machine-specific paths.

**Acceptance:** A fresh agent can identify current commands, architecture boundaries, authorized work and validation obligations from tracked files. SquadOps explicitly loads the guide. CLAUDE and ideas guidance agree with it. Historical names and intentional domain enums remain correctly explained.

### HY-05 — Triage and remediate dependency advisories

**Priority:** P1 · **Area:** dependency security · **Effort:** L · **Depends on:** HY-01 for merge evidence; triage starts immediately.

**Scope:** Capture current full/prod audits; prioritize Storybook/Vitest/tooling and production Zod findings by actual conditions. Upgrade coherent dependency families in separate PRs. Review all advisories for candidate versions; validate major migrations separately.

**Acceptance:** Every high/critical record has verified remediation or a narrow maintainer-approved exception with affected paths, exposure rationale, owner and expiry. Full and prod audits are rerun; current lint/tests/build/Storybook/package checks pass. Changes preserve parser/state behavior and lockfile reproducibility. Overrides have a removal plan. Advisory counts are not presented as proven runtime exploits.

### HY-06 — Establish security controls and continuing dependency review

**Priority:** P1 · **Area:** security/tooling · **Effort:** M · **Depends on:** HY-01; security reporting text from HY-17 may be brought forward.

**Scope:** Verify/enable repo secret scanning and push protection, security updates, CodeQL JS/TS, dependency review and weekly grouped updates. Assign alert ownership and a private reporting route. Review Actions policy, action pins, fork handling and release boundaries. Perform a controlled history secret scan.

**Acceptance:** Settings are read back and documented; initial scans complete; a safe test case demonstrates dependency-review/denied-secret behavior without publishing credentials. Existing alert debt has dispositions. Read-only workflow token and disabled automatic PR approval remain enforced. The report distinguishes repository protections from user/provider protections. Weekly audit/update findings have an owner.

### HY-07 — Repair and verify the installed core package

**Priority:** P1 · **Area:** core/package · **Effort:** M · **Depends on:** explicit fixture-export/distribution decision; HY-01 for CI integration.

**Problem:** `./test-fixtures` is advertised but excluded from built output.

**Scope:** Build the intended export or remove it with a compatibility decision. Add packed-consumer import/type smoke checks, export validation and package repository/support/README metadata. Preserve license inclusion.

**Acceptance:** A clean pack installed outside the workspace resolves every public export and its types without source aliases. The chosen fixture policy is documented. Packed files contain intended content, MIT license and usable consumer guidance. The package CI check would detect the current missing-entrypoint defect.

### HY-08 — Align app initialization with sequence state

**Priority:** P1 · **Area:** web/core integration · **Effort:** S/M · **Depends on:** none; coordinate with HY-13/HY-14.

**Scope:** Initialize messages/interfaces together with sequences through a typed initializer; verify valid and empty-sequence stepping.

**Acceptance:** An app/provider integration test selects a sequence and advances to a valid end; UI count and kernel collection agree. Empty sequences cannot produce an invalid active index. The regression uses the real app initialization boundary rather than a separately completed test payload.

### HY-09 — Make partial content loading diagnostically truthful

**Priority:** P1/P2 · **Area:** core/content · **Effort:** M · **Depends on:** explicit supported-category decision; coordinate Zod work in HY-05.

**Scope:** Handle/diagnose OrientationItem and Scene, present non-array sections, unknown keys, duplicate IDs and dangling references. Make registry/default/merge coverage exhaustive enough to detect category drift.

**Acceptance:** Omitted collections remain valid partial input; malformed collections emit actionable diagnostics. Existing categories load or report explicit unsupported status. Invalid/colliding references cannot silently overwrite or disappear. Minimal deterministic regression cases cover each outcome. This issue does not require the future 1.0 package design.

### HY-10 — Repair graph traversal and journey scoping

**Priority:** P2 · **Area:** core/graph · **Effort:** S/M · **Depends on:** none.

**Scope:** Enforce `getPathNodes` journey contract and unique BFS traversal. Define duplicate/dangling identifier behavior.

**Acceptance:** Parallel a→b edges return a and b once; j1 excludes j2-only steps. Tests cover cycles, shared nodes, disconnected nodes and depth bounds with explicit expected sets/order. Existing graph callers are reconciled with the documented contract.

### HY-11 — Typecheck tests and measure meaningful coverage

**Priority:** P2 · **Area:** tooling/tests · **Effort:** M · **Depends on:** HY-01; coordinate fixture policy with HY-07.

**Scope:** Dedicated no-emit test/fixture/config typechecks, coverage provider/report and per-package baseline. Document that `check` means Biome and build/test/typecheck have distinct purposes.

**Acceptance:** A type error in a core test or included fixture fails CI. Coverage is actually collected and reports untested important paths; thresholds are based on measured initial state and ratchet policy. Required CI includes these checks. Do not claim an arbitrary global percentage establishes architectural correctness.

### HY-12 — Add app/browser/accessibility regression coverage

**Priority:** P2 · **Area:** web/tests · **Effort:** L · **Depends on:** HY-08; stable HY-01 pipeline.

**Scope:** Actual App/StrictMode mount; navigation/context preservation; stepper and search keyboard/focus tests; small built-app browser suite. Add Storybook build and selected interaction/a11y/visual checks.

**Acceptance:** A fresh built app opens, selected context survives relevant perspective changes, sequence/journey controls work, and search works from the keyboard with sensible focus. Important loading/error paths are covered. CI retains failure traces/screenshots and tests are deterministic on repeated runs. Browser checks exercise the artifact users run.

### HY-13 — Establish one typed data boundary for the current demo

**Priority:** P2 · **Area:** web/core boundary · **Effort:** L · **Depends on:** HY-08/HY-09 decisions and regression tests.

**Scope:** Route current seed data through one typed provider/initializer; move demo assets behind an intentional interface; remove direct web imports of core source fixtures. Add dependency-boundary checks.

**Acceptance:** Existing demo behavior is retained; kernel and views obtain the same dataset; an alternate tiny test dataset can be supplied without changing component source. Core cannot import web/React. UI consumption no longer relies on unbuilt private source paths. Generic repository discovery remains outside this issue.

### HY-14 — Harden initialization and async layout lifecycle

**Priority:** P2 · **Area:** web · **Effort:** M · **Depends on:** HY-08; coordinate with HY-13.

**Scope:** Idempotent initialization outside render, async request-generation/cleanup guard, cancellable timers, meaningful layout cache identity and visible retry/fallback.

**Acceptance:** StrictMode/render replays do not duplicate initialization semantics. A superseded layout promise cannot replace the current result; unmount clears pending timers; layout rejection has visible recoverable state. Deferred-promise tests establish these behaviors.

### HY-15 — Verify and document clean-checkout onboarding

**Priority:** P1/P2 · **Area:** contributor docs/tooling · **Effort:** M · **Depends on:** HY-04/HY-19 decisions.

**Scope:** Truthful current capabilities/demo, supported prerequisites, bootstrap/build/watch steps, URL/port, checks, content example, troubleshooting and explicit local-hook setup.

**Acceptance:** Another contributor follows tracked instructions from a clean checkout with no prebuilt core or maintainer-specific path and reaches a working app. Commands/versions are verified. Hook activation is proven/documented; required CI does not depend on local hooks. README links architecture, contribution, roadmap and security information.

### HY-16 — Index and reconcile historical design documents

**Priority:** P1/P2 · **Area:** docs/project management · **Effort:** M/L · **Depends on:** HY-03; can proceed beside code fixes.

**Scope:** docs index, status/owner/supersession metadata, current architecture/ADRs, and disposition table for historical plans. Identify implemented, deferred, rejected and unresolved items from code/evidence.

**Acceptance:** Every active plan points to executable issues; shipped work links a commit/PR or records missing historical evidence honestly. Deferred work has a triaged issue or explicit disposition. Ideas remain preserved and visibly speculative. The new 1.0 spec is identified as its own product baseline.

### HY-17 — Complete the FOSS contribution and support paths

**Priority:** P2 · **Area:** community/security/docs · **Effort:** S/M · **Depends on:** real maintainer/contact decisions; reporting route needed by HY-06.

**Scope:** CONTRIBUTING, SECURITY, CODE_OF_CONDUCT and concise maintainer/support/governance guidance; fill repository description/topics/homepage where meaningful. Keep MIT attribution. Define contribution terms appropriate to the project without automatically adding a CLA.

**Acceptance:** A user can find how to report a bug privately/publicly as appropriate, propose a change, obtain support and identify decision authority. Destinations are real and monitored. Conduct enforcement and supported-version/security policy are explicit. Templates link those policies.

### HY-18 — Define distribution, versioning and checked releases

**Priority:** P2 · **Area:** release/package · **Effort:** M · **Depends on:** HY-02/HY-07/HY-17; HY-05 disposition.

**Scope:** Decide core publication and lockstep/independent versioning; mark web private unless its publication is intentional. Add compatibility policy, changelog/release checklist, checked immutable tags and artifact provenance/checksums. Add protected release automation only where useful.

**Acceptance:** A selected release ties version → exact checked commit → notes → verified artifacts/license/consumer checks. Release permission belongs to the intended maintainer workflow. npm publishing, if adopted, uses configured trusted publishing and appropriate provenance. Earlier releases are not retroactively represented as having passed new checks.

### HY-19 — Declare and enforce the runtime/toolchain support policy

**Priority:** P2, early prerequisite · **Area:** tooling · **Effort:** S · **Depends on:** maintainer support decision.

**Scope:** Replace the open-ended Node 20 minimum with an intentional supported set; pin the local development runtime, preserve deliberate pnpm pinning, align Node types, and define a lean CI matrix. Suggested starting point: Node 26 primary and Node 24 compatibility; Node 22 only if intentionally supported.

**Acceptance:** README, engines, runtime-version file, type declarations and CI agree. Fresh setup and checks run on each claimed supported line. Toolchain upgrades have a repeatable PR/check process. Node 20 is no longer implied to be a currently supported security baseline.

### HY-20 — Measure and reduce the initial app payload

**Priority:** P3 · **Area:** web/performance · **Effort:** M · **Depends on:** HY-12 measurements; coordinate HY-13 data changes.

**Scope:** Analyze the observed 2.10 MB minified / 627 kB gzip initial JS chunk. Identify actual contributions and split/lazily load expensive code/data where justified. Add artifact-size reporting and a practical performance baseline.

**Acceptance:** Report before/after initial transfer and usable-start measurements on a declared environment/dataset; preserve interaction correctness. CI flags growth beyond a documented budget. Any large-graph benchmark is representative and repeatable. Raising the warning limit alone does not close this issue.

## Reusable issue and PR evidence contract

Every resulting issue should record problem/outcome, scope/non-goals, dependencies, owner, acceptance and evidence. A PR should link it, explain resulting behavior, record exact checks/results, show visible UI changes, and identify compatibility/security/release effects. Reviews must address semantic behavior as well as green CI. Remaining work becomes a linked issue with an explicit disposition.

The campaign is complete when the completion criteria in the assessment are demonstrated. Feature implementation and independent 1.0 certification remain separately tracked product work.
