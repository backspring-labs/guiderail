# GuideRail — agent and contributor guide

Guided architecture navigation from business understanding to code reality. A pnpm + Turborepo monorepo, currently at 0.7.1.

This file is the single source of working instructions for any coding agent or contributor. Tool-specific files (`CLAUDE.md`) only point here.

## Commands

Run from the repository root.

```bash
pnpm install        # install all workspace dependencies
pnpm build          # build all packages (core first, then web)
pnpm dev            # start the web dev server
pnpm test           # run all tests (builds core first)
pnpm check          # Biome lint + format check in each workspace
pnpm check:fix      # Biome auto-fix
pnpm typecheck      # tsc over tests, fixtures and config files, no emit
pnpm test:coverage  # tests with coverage and the per-package thresholds (what CI runs)
pnpm check:package  # pack core, install it outside the workspace, import and typecheck every export
pnpm check:boundaries  # web imports core only via built entry points; the kernel imports no UI or demo data
pnpm test:e2e       # build, then run the browser smoke test against the production build
```

What each command proves:

| Command | Proves | Does not prove |
|---|---|---|
| `check` | Formatting and lint rules (Biome) | Anything about types or behaviour |
| `build` | Shipped source compiles; the web bundle builds | That tests compile |
| `typecheck` | Tests, fixtures and config files compile | Behaviour |
| `test` | Behaviour covered by tests | That the tests compile: Vitest strips types without checking them |
| `test:coverage` | The same, plus coverage has not dropped below the recorded floor | That covered code is correct |
| `check:package` | The packed core resolves for a consumer | Anything about the web app |
| `check:boundaries` | Import rules between web, kernel, demo corpus and fixtures hold | That the code behind an allowed import is correct |
| `test:e2e` | The built app opens in a real browser and the Sequence stepper works end to end | Any other perspective or flow (#24) |

Coverage floors are measured, not aspirational, and only move up: raise them in the pull request that raises coverage. Core sits in the mid-80s. The web app is at about 9%, so a green run says little about the UI.

Things the command names do not tell you:

- **Build before `pnpm dev` on a fresh checkout.** The web app resolves `@guiderail/core` from `packages/core/dist`.
- **`check` is Biome only.** Type errors surface in `pnpm build` and `pnpm typecheck`, not in `check`.
- **`src/test-fixtures/` in core is internal.** It holds mocks and entity factories, and is excluded from the build and not exported.
- **The demo corpus lives in `packages/core/src/demo/`** and is built as the `@guiderail/core/demo` entry point. It is in core because the kernel's tests use it as their fixture, and a separate package that core's tests depended on would be a dependency cycle. It is data, not kernel API: kernel source must not import it.
- **`test:e2e` needs a browser installed once:** `pnpm --filter @guiderail/web exec playwright install chromium`.
- **Git hooks may not be installed on a fresh clone.** pnpm does not run lefthook's install script. Run `pnpm exec lefthook install` once; the pre-commit hook then runs `pnpm check`.

Supported runtimes are Node 26 (primary) and Node 24. The pnpm version is pinned in the root `package.json`.

## Before you open a pull request

Run all three and record the results in the PR description:

```bash
pnpm exec biome ci --error-on-warnings .
pnpm build
pnpm typecheck
pnpm test:coverage
```

## Packages

| Package | Path | Role |
|---|---|---|
| `@guiderail/core` | `packages/core/` | Headless kernel: domain model, state machines, context sync, graph queries, content parsing. Pure TypeScript + Zod + XState. No UI, no React. |
| `@guiderail/web` | `apps/web/` | React UI: canvases, panels, stepper, guided route bar. React 19, React Flow, ELK, Zustand. |

Dependency direction is `web → core` only. Core never imports from web.

```
guiderail/
├── packages/core/    ← @guiderail/core
├── apps/web/         ← @guiderail/web
├── docs/
│   ├── ideas/        ← product ideas (reference only)
│   ├── prds/         ← product requirements
│   └── plans/        ← implementation plans by version
├── turbo.json
└── package.json
```

TypeScript is a root-level shared devDependency. Each package owns its own `tsconfig.json`.

## Design rules

1. **The Context Machine is the single authority.** All navigation state reads from `snapshot.context.nav`. All mutations go through `send(event)`. It lives in `packages/core/src/context/context.machine.ts`; the pure reconciler functions beside it compute each new state.
2. **Kernel vs UI authority.** The kernel owns route, process, value stream and navigation semantics. The UI derives renderable presentation state and must not recreate kernel semantics.
3. **Zustand owns UI-only state.** Panel visibility, animation flags, hover. Never canonical navigation state.
4. **React Flow is render-only.** Node and edge types are delivery structures, not semantic truth.
5. **No domain-model renaming from package renames.** The project was previously called Viewscape. `mode: "viewscape" | "guiderail"` is a domain enum (free exploration vs guided traversal), not a package name. Leave it alone.
6. **The demo corpus is one dataset, not the content contract.** It is built as `@guiderail/core/demo`. The web app must never import core's source.
7. **Seven-perspective progression.** Each perspective answers a different question about the same terrain.
8. **Canvas modes are perspective-internal.** Same topology, different emphasis.
9. **Shared context contract.** A perspective switch means "show me this same moment through another lens". See "Navigation contract" below for exactly what persists and what resets.
10. **Content loading.** `@guiderail/core/content` exports `parseContentBundle()`, `validateContentBundle()` and `mergeContentBundles()`. They follow the [data-integrity contract](docs/architecture/data-integrity.md): nothing is dropped, overwritten or reinterpreted without a diagnostic. `orderBySequence()` is the one definition of navigation order. The web app does not load content through them yet.

## Perspectives

| # | Perspective | Canvas | Canvas mode ids |
|---|---|---|---|
| 1 | Orientation | Concept deck (`OrientationDeck`, not React Flow) | — |
| 2 | Landscape | Capability map: domain regions, capability tiles, actors | `capability`, `providers` |
| 3 | Journey | Screen flow with typed steps and branching transitions | — |
| 4 | Process | BPMN swim lanes: tasks, gateways, events | `operational`, `activity`, `risk_controls` |
| 5 | Architecture | Terrain node graph (ELK layered layout) | `logical`, `deployment` |
| 6 | System | Scenario-scoped architecture with `parentNodeId` component hierarchy | — |
| 7 | Sequence | Lifeline diagram: interfaces and messages | — |

The Process mode ids differ from their UI labels: `activity` is shown as "Decision" and `risk_controls` as "Controls".

Orientation is the entry perspective on first load.

### Navigation contract

Confirmed by the maintainer on 2026-11-14. Tests assert this table; behaviour that contradicts it is a defect.

On `SWITCH_PERSPECTIVE`:

| State | Behaviour |
|---|---|
| Domain, capability | Persists |
| Journey and step index | Persists |
| Process and stage index | Persists |
| Sequence and message index | Persists |
| Value stream, orientation index | Persists |
| Story route, waypoint index, route state | Persists |
| Focus targets, scene, `mode` | Persists |
| Selected node, selected edge | Cleared. Each canvas has its own node ids, so a selection does not carry over |
| Canvas mode | Reset to the new perspective's default. A mode id means nothing in another perspective |
| Viewport anchor | Not part of the contract. The kernel computes it; the web app does not read it |

Select-and-show:

- Selecting a domain, capability, journey, process or sequence from the left panel, search or the right panel sends one kernel event, `NAVIGATE_TO`. The kernel selects the entity and switches to a perspective of the type that shows it (Landscape for domains and capabilities).
- The perspective is resolved from its **type**. No perspective id is hardcoded in the UI.
- Already on a perspective of the right type: the kernel stays there and keeps the canvas mode.
- After landing, no terrain node or edge is selected.
- Clicks on a canvas that is already showing the entity (a landscape tile, a picker card, a `+` marker) use the plain `SELECT_*` events, which do not switch.

### Process canvas

The Process canvas shows exactly one process: the active one, or, when none is selected, the first process that has an authored diagram.

- A BPMN node belongs to a process through `metadata.processId`. Nodes of other processes are never mixed in.
- A process with no BPMN nodes of its own is shown as a flow **derived from its stages**: one task per stage in navigation order, in a single lane named after the process. Nothing is invented beyond what the stages say.
- A process with neither shows an empty state.
- A stage with a `subProcessId` gets a `+` marker that drills into that process. The breadcrumb then shows the parent process as a button that leads back.

The logic is `resolveProcessDiagram()` in `apps/web/src/lib/process-diagram.ts`.

### Steppers

Orientation, Journey, Process and Sequence each have a stepper driven by the generic `STEPPER_FORWARD`, `STEPPER_BACKWARD`, `STEPPER_RESET` and `STEPPER_END` events. The kernel picks the target from the active perspective's **type** (so it must be given the perspectives at `INITIALIZE`), never from the text of its id. Guided story routes use their own waypoint events and hide the stepper while active.

**An index is a position, never a sequence number.** `activeStepIndex`, `activeStageIndex`, `activeMessageIndex`, `activeWaypointIndex` and `activeOrientationIndex` are positions in a group ordered by `sequenceNumber`. Sequence numbers only decide order; they need not start at 0 or be contiguous. Use `orderBySequence()` from `@guiderail/core/content` (the web app wraps it in `lib/ordered-groups.ts`) and compare with `position`, as the canvases do. Full rules: [data-integrity contract](docs/architecture/data-integrity.md), section 5.

### Interaction patterns

- **Click = detail.** Clicking a canvas element shows its detail in the right panel.
- **Expand affordance.** A `+` button or "Open" action drills in. Canvas nodes dispatch a `guiderail:expand` window event with a `type` of `journey`, `sequence` or `subprocess`.
- **Data-driven selection.** Custom canvases use `isActive` data flags, not React Flow's internal selection.
- **Fit view** on perspective or canvas-mode switch.

## Known limitations

These are tracked defects and bridges, not design intent. Check the issue before relying on or working around the behaviour.

| Limitation | Issue |
|---|---|
| Components read the demo corpus's `seed*` arrays directly instead of one dataset shared with the kernel, so other content cannot be supplied | #13 |

Remove a row in the same PR that fixes it.

## How work is authorised

- Work starts from a GitHub issue. The hygiene campaign is tracked in #25; issue numbers #1–#24 match backlog ids HY-01–HY-24, and HY-25–HY-27 are #31–#33, and HY-28 is #35.
- CI is enforced first: nothing else in the campaign merges until the CI gate is proven and `main` is protected (#1, #2).
- An issue is Ready when it states problem, scope, non-goals, acceptance and dependencies.
- Branch from `main`. Do not push to `main` directly.
- One concern per PR. An issue may take several PRs; it closes only when every acceptance item has evidence.
- `docs/ideas/` is reference material. Do not edit idea documents unless asked. Ideas and historical plans are not approved work.

### Hot files

Serialise changes to these; do not open parallel PRs against the same one.

- `packages/core/src/context/context.machine.ts` and `reconciler.ts`
- `packages/core/src/content/file-loader.ts`
- `apps/web/src/hooks/use-perspective-provider.ts`
- `apps/web/src/components/layout/AppShell.tsx`

### Pull request contents

- Link the issue.
- Explain the resulting behaviour, not just the diff.
- Record the exact checks run and their results.
- Show visible UI changes.
- Name compatibility, security and release effects.

### Handoff

If you stop before the acceptance criteria are met, say what is done, what is verified, and what remains. File remaining work as a linked issue with an explicit disposition.

## Conventions

Biome enforces these (`biome.json`):

- Tabs, 100-column lines, double quotes, semicolons, trailing commas.
- No default exports (config files, `main.tsx` and stories are exempt).
- No `any`, no non-null assertions, no `console.log` outside tests.
- `import type` / `export type` for type-only imports and exports.
- Relative imports in core use the `.js` extension (NodeNext resolution).
