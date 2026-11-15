# Changelog

Notable changes to GuideRail. `@guiderail/core` and `@guiderail/web` share one version and are released together.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). GuideRail is pre-1.0: a minor version may contain breaking changes, and they are listed under **Changed** or **Removed**. See [docs/releasing.md](docs/releasing.md).

## [Unreleased]

## [0.8.0] - 2026-11-15

The repository foundation release. Everything below was done by the foundation campaign (issue #25) after 0.7.1. It is the first version cut from a commit that passed required checks, and the first to be tagged.

### Added
- **Kernel:** `NAVIGATE_TO` event, which selects a domain, capability, journey, process or sequence and switches to the perspective that shows it. The left panel, search and the right panel all use it.
- **Kernel:** content loading reports what it could not use. `parseContentBundle` now diagnoses non-array sections, unknown keys, duplicate ids, dangling references and duplicate sequence numbers; `validateContentBundle` checks a complete bundle; `orderBySequence` is the one definition of navigation order.
- **Kernel:** `scenes`, `orientationItems`, `bpmnNodes` and `bpmnEdges` are loadable content collections.
- **Kernel:** `@guiderail/core/demo`, the demo corpus as a built entry point, with a `demoContent` bundle.
- **Web:** the app takes its content as a `dataset` prop. The kernel and every view read the same dataset, so other content can be shown without changing a component.
- **Web:** a parent-process link in the breadcrumb, to go back from a sub-process.
- **Web:** a notice with a Retry button when automatic layout fails; nodes are shown in a grid meanwhile.
- **Web:** page landmarks, a level-one heading, and a labelled search dialog that returns focus when it closes.
- **Docs:** `AGENTS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `ROADMAP.md`, a data-integrity contract, a performance baseline, and a rewritten README.
- **Tooling:** required CI on Node 24 and 26 with one gate: lint, dependency boundaries, build, bundle budget, test typechecking, tests with coverage floors, a packed-package check, a browser suite covering every perspective, and dependency review.

### Changed
- **Kernel:** every navigation index (step, stage, message, waypoint, orientation) is a position in a group ordered by `sequenceNumber`. Sequence numbers no longer have to start at 0 or be contiguous.
- **Kernel:** the stepper is chosen by the active perspective's type, not by text in its id. `INITIALIZE` takes `perspectives`; without them no perspective has a stepper.
- **Kernel:** `mergeContentBundles` returns `{ bundle, errors }` and keeps the first entity when ids collide.
- **Kernel:** `bfsTraverse` returns each node once, ignores edge endpoints that are not nodes, and returns nothing for an unknown start. `getPathNodes` returns only the given journey's nodes. Undirected edges are walkable from either end.
- **Kernel:** Zod 3 → 4.
- **Web:** search results and right-panel links now navigate to the entity's perspective. They used to select it and leave you where you were.
- **Web:** the layout library (ELK) loads on demand. Initial JavaScript went from 664 kB to 213 kB gzip.
- **Web:** `pnpm dev` builds the kernel first and watches it; `pnpm install` installs the git hooks.
- **Runtime support:** Node 26 (primary) and 24. Node 20 and 22 are no longer supported.
- **Dependencies:** React 19.3, XState 5.33, React Flow 12.12, elkjs 0.12, Vite 6.4.6, Vitest 4, Storybook 8.6.19.

### Fixed
- The Sequence stepper could not advance: the kernel was never given the messages.
- The Process canvas showed the same diagram whichever process was selected.
- All Storybook stories crashed at runtime.
- A slow earlier layout could overwrite a later one; a failed layout was swallowed.
- Keys typed straight after the search shortcut could be lost.
- A demo story waypoint referred to a BPMN node id where a process stage id was meant.

### Removed
- **Kernel:** the `./test-fixtures` export, which pointed at files the build never produced.
- **Web:** the `@seed` alias into the kernel's source.

### Security
- Cleared every high and critical dependency advisory (48 advisories at the start; 3 moderate remain, in Storybook 8's own dependencies, tracked in #46). No production advisory is open.
- Enabled secret scanning, push protection, Dependabot alerts and updates, CodeQL and private vulnerability reporting.

## Earlier versions

Versions up to 0.7.1 were never tagged or released, and predate the checks above. They are recorded here from the commit history and are not represented as having passed those checks.

| Version | What it delivered |
|---|---|
| 0.7.1 | Process canvas fidelity and stepper fixes |
| 0.6.0–0.7.0 | Navigation hub, stepper transport, Orientation perspective, self-referential demo corpus |
| 0.5.0 | Canvas fidelity and file-based content loading |
| 0.4.0 | Perspective system |
| 0.3.0 | Monorepo: `@guiderail/core` and `@guiderail/web` |
