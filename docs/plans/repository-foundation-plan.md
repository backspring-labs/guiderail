# Repository Foundation Plan

## Context

GuideRail reached 0.7.1 with passing local checks and no repository controls around them: no CI, no branch protection, no security scanning, no contribution or release path, and agent instructions that had drifted from the code. A review of the repository at commit `faac1555226e21411b064021ecf371e0d0c81b41` also found several defects that tests did not catch.

This plan is general repository and project hygiene. It is separate from the feature roadmap and does not change what the product does, except where it fixes a defect.

### Proof statement

When this plan is complete, a change to GuideRail cannot reach `main` without passing required checks, a new contributor or agent can get from a clean checkout to a working app using tracked files only, and the defects listed under Wave B have regression tests.

### Where status lives

This file is the plan. It does not track progress.

- Live status: GitHub issue #25 and the `Repository foundation` milestone.
- Issue numbers match the plan ids: HY-01 is issue #1 through HY-24 is issue #24.
- Each issue holds its own problem, scope, non-goals, acceptance criteria and baseline evidence.

### Scope boundaries

- Not in scope: new perspectives, new canvas features, the 1.0 content package design, a backend content adapter.
- Priorities describe sequencing, not security severity.
- Effort is relative: **S** is one bounded change, **M** is several related changes, **L** is staged work split across several pull requests.

---

## Decisions

| Topic | Decision | Issues |
|---|---|---|
| Node support | 26 is the primary runtime, 24 is kept compatible, 22 is not supported | HY-19 |
| Demo data | Moves to a private workspace package, `packages/demo-content`; core's `./test-fixtures` export is removed | HY-13, HY-07 |
| npm publication | Core is not published in this campaign, but must be correct when packed | HY-07, HY-18 |
| Zod advisory | Tooling upgrades first; the Zod 4 migration follows parser regression tests | HY-05, HY-23 |
| Security contact | GitHub private vulnerability reporting | HY-17, HY-06 |
| Single maintainer | 0 required approvals; milestone and labels instead of a Project board | HY-02, HY-03 |
| Versioning | Core and web version in lockstep | HY-18 |

---

## Wave A: Establish controls

### Goal
Clean CI, an enforced pull request workflow, correct agent instructions, and a first pass over security and dependency debt.

| Id | Work | Priority | Effort | Depends on |
|---|---|---|---|---|
| HY-19 | Declare and enforce the runtime/toolchain support policy | P2, early prerequisite | S | — |
| HY-01 | Establish required repository CI | P1 | M | HY-19 |
| HY-04 | Publish portable, current agent instructions | P1 | S | — |
| HY-03 | Create the issue-to-PR operating workflow | P1 | M | — |
| HY-02 | Protect `main` and define merge ownership | P1 | S | HY-01 merged |
| HY-05 | Triage and remediate dependency advisories (tooling families) | P1 | L | HY-01 |
| HY-06 | Establish security controls and continuing dependency review | P1 | M | HY-01 |

### Done when
- Every pull request and every push to `main` runs lint, build and tests on both supported Node lines.
- `main` requires a pull request and the CI gate, and cannot be force-pushed or deleted.
- `AGENTS.md` describes the code as it is.
- Every high or critical advisory has a remediation or a time-boxed exception.
- Secret scanning, push protection, CodeQL and dependency review are on and read back.

---

## Wave B: Correct current defects

### Goal
Package, initialization, parser and graph contracts behave as documented and have regression tests that would have caught the defect.

| Id | Work | Priority | Effort | Depends on |
|---|---|---|---|---|
| HY-08 | Align app initialization with sequence state | P1 | S/M | — |
| HY-10 | Repair graph traversal and journey scoping | P2 | S/M | — |
| HY-07 | Repair and verify the installed core package | P1 | M | HY-01 |
| HY-11 | Typecheck tests and measure meaningful coverage | P2 | M | HY-01, HY-07 |
| HY-09 | Make partial content loading diagnostically truthful | P1 | M | category decision |
| HY-22 | Define one stepper index contract in the kernel | P2 | M | HY-08 |
| HY-21 | Process canvas ignores the active process | P2 | M | HY-08 |
| HY-23 | Migrate to Zod 4 to clear the production advisory | P1 | M/L | HY-09, HY-11 |

### The defects

| Id | Defect at the baseline |
|---|---|
| HY-08 | The kernel is initialised without `messages` or `interfaces`, so the Sequence stepper cannot advance |
| HY-10 | `bfsTraverse` repeats a node once per parallel edge; `getPathNodes` ignores its journey argument |
| HY-07 | `./test-fixtures` is exported but not built; the packed tarball has no licence |
| HY-09 | `parseContentBundle()` silently skips malformed sections, unknown keys, duplicate ids and dangling references |
| HY-22 | Reconcilers, guards and the web app use three different conventions for "the active item" |
| HY-21 | The Process canvas renders the same BPMN nodes whichever process is active |
| HY-23 | The one production advisory (Zod) is only patched in a new major version |

### Done when
- Each defect above has a fix and a test that fails without it.
- A packed `@guiderail/core` installs outside the workspace and resolves every export with its types.
- A type error in a core test fails CI.
- `pnpm audit --prod` is clean.

---

## Wave C: Improve safe extension

### Goal
Contributor documentation and app, data and lifecycle tests make a change easy to hand off.

| Id | Work | Priority | Effort | Depends on |
|---|---|---|---|---|
| HY-15 | Verify and document clean-checkout onboarding | P2 | M | HY-04, HY-19 |
| HY-17 | Complete the FOSS contribution and support paths | P2 | S/M | — |
| HY-16 | Index and reconcile historical design documents | P2 | M/L | HY-03 |
| HY-12 | Add app mount, navigation and keyboard regression tests | P2 | M | HY-08, HY-01 |
| HY-14 | Harden initialization and async layout lifecycle | P2 | M | HY-08 |
| HY-13 | Establish one typed data boundary for the current demo | P2 | L | HY-08, HY-09 |
| HY-24 | Add a built-app browser suite and Storybook checks | P2 | M/L | HY-12, HY-01 |

### Done when
- A contributor reaches a working app from a clean checkout using tracked instructions only.
- CONTRIBUTING, SECURITY and CODE_OF_CONDUCT exist and point at real, monitored destinations.
- Every historical plan has a disposition; ideas stay visibly speculative.
- The kernel and the views read the same dataset, and no web import reaches into core source.
- The production build is exercised in a real browser in CI.

---

## Wave D: Release and measure

### Goal
Repeatable versioning, and a measured app payload.

| Id | Work | Priority | Effort | Depends on |
|---|---|---|---|---|
| HY-18 | Define distribution, versioning and checked releases | P2 | M | HY-02, HY-07, HY-17, HY-05 |
| HY-20 | Measure and reduce the initial app payload | P3 | M | HY-24, HY-13 |

### Done when
- One release ties a version to an exact checked commit and its notes.
- The initial JS payload (2,099.67 kB, 627.15 kB gzip at the baseline) has a before/after measurement and a CI budget.

---

## Sequencing

```
Wave A:  HY-19 → HY-01 → HY-02
         HY-04, HY-03 (beside)
         HY-05, HY-06 (after HY-01)

Wave B:  HY-08 → HY-22
         HY-08 → HY-21
         HY-10 (independent)
         HY-07 → HY-11
         HY-09 → HY-23

Wave C:  HY-21 → HY-14 → HY-13
         HY-12 → HY-24
         HY-15, HY-16, HY-17 (beside)

Wave D:  HY-18, HY-20
```

Documentation work can run beside code work. Waves overlap where dependencies allow; the order within a chain does not.

### Hot files

These files are edited by several issues. Changes to each are serialised: one open pull request at a time.

| File | Order |
|---|---|
| `packages/core/src/context/context.machine.ts`, `reconciler.ts` | HY-08 → HY-22 |
| `apps/web/src/hooks/use-perspective-provider.ts`, `AppShell.tsx` | HY-08 → HY-21 → HY-14 → HY-13 |
| `packages/core/src/content/file-loader.ts`, entity schemas | HY-09 → HY-23 |

---

## Design rules

1. **An issue closes on evidence, not on a merged pull request.** It may take several pull requests; every acceptance item needs a recorded result.
2. **A regression test must fail without its fix.** The pull request says how that was confirmed.
3. **Required checks do not depend on local hooks.** CI is the gate; lefthook is a convenience.
4. **Advisory counts are not exploits.** Each record gets a remediation or a narrow exception with paths, rationale, owner and expiry.
5. **Status lives in one place.** GitHub issues and the milestone carry progress; this plan and the docs do not repeat it.
6. **Ideas are not approved work.** Nothing under `docs/ideas/` becomes an issue without triage.
7. **Controls fit a single maintainer.** No rule requires the sole author to approve their own pull request.

### Evidence contract

Every pull request:

- links its issue,
- explains the resulting behaviour,
- records the exact checks run and their results,
- shows visible UI changes,
- names compatibility, security and release effects.

Reviews address semantic behaviour as well as green CI. Work left over becomes a linked issue with an explicit disposition.

---

## Watchpoints

- **Zod 4 touches every schema.** HY-23 waits for the parser regression tests in HY-09 so behaviour changes are visible. Until then the advisory carries an exception: content is bundled seed data and no untrusted input reaches the parser.
- **HY-13 is the largest change.** It moves the demo corpus and rewires every view's data access. It goes last on the perspective-provider chain, after the defects it would otherwise mask are fixed and tested.
- **HY-21 was found by reading code.** Its first task is to reproduce the behaviour in the running app.
- **Clean-checkout traps.** pnpm skips lefthook's install script, so hooks are not installed on a fresh clone. The web app resolves core from `dist`, so `pnpm dev` before a build is expected to fail. HY-15 confirms and fixes both.
- **Narrowing `engines`.** Node 20 and 22 stop being declared as supported. pnpm warns on a mismatch; it does not block install.

---

## Deferred and unresolved

- **Automated contributors (SquadOps).** Repository controls and agent instructions specific to SquadOps are deferred to a later issue.
- **The source assessment.** The backlog this plan came from cites completion criteria in an assessment that is not in the repository. Until it is, the campaign is complete when every issue is closed with evidence.
- **The 1.0 spec.** HY-16 identifies it as its own product baseline once it is in the repository.
- **Release hardening.** npm trusted publishing, provenance attestations and artifact checksums wait for a decision to publish.
