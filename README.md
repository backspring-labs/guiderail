# GuideRail

Guided architecture navigation from business understanding to code reality.

GuideRail shows one system through seven linked perspectives, from "what is this for" down to "which call happens next", and keeps your place as you move between them. Pick a journey in one view, switch to another, and you are looking at the same moment through a different lens.

It is pre-1.0 and maintained by one person. This README describes what works today.

## What you get today

A web app that runs locally and shows a demo dataset: GuideRail described in its own model.

| Perspective | What it shows |
|---|---|
| Orientation | A short concept deck that explains the model |
| Landscape | Domains and their capabilities |
| Journey | A user's steps through a flow, with branches |
| Process | A process as swim lanes, or as a flow of its stages |
| Architecture | The system's nodes and how they connect |
| System | The same nodes, scoped to the active journey or process |
| Sequence | Calls between interfaces, message by message |

You can step through journeys, processes and sequences with on-screen controls or the arrow keys, search with ⌘K or Ctrl+K, and follow guided routes.

What it does not do yet:

- **It has no backend and no editor.** Content is supplied in code, as a dataset.
- **It ships only the demo dataset.** You can pass in your own (see [Use your own content](#use-your-own-content)), but there is no file picker or import screen.
- **Some demo collections are empty**, so two modes have nothing to show: Landscape → Providers and Process → Controls.

## Requirements

- **Node.js 26** (primary) or **24** (kept compatible). `.node-version` pins the development runtime; other lines are not supported.
- **pnpm**, at the exact version in the root `package.json` `packageManager` field.
- **git**, for the pre-commit hook.

CI runs every check on both Node lines.

## Quick start

```bash
git clone https://github.com/backspring-labs/guiderail.git
cd guiderail
pnpm install
pnpm dev
```

Then open **http://localhost:5173**. You should see the Orientation deck, with a row of perspective tabs across the top.

`pnpm install` also installs the git pre-commit hook. `pnpm dev` builds the kernel first, then runs the kernel in watch mode alongside the web dev server, so edits to either package show up without a restart.

## Commands

Run from the repository root.

| Command | What it does |
|---|---|
| `pnpm dev` | Build the kernel, then run the kernel in watch mode and the web dev server |
| `pnpm build` | Build both packages for production |
| `pnpm check` | Lint and format check (Biome) in each package |
| `pnpm check:fix` | Apply Biome's fixes |
| `pnpm typecheck` | Typecheck tests, fixtures and config files |
| `pnpm test` | Run unit and component tests |
| `pnpm test:coverage` | The same, with coverage and the recorded floors |
| `pnpm test:e2e` | Build the app and Storybook and run the browser suite against both |
| `pnpm check:package` | Pack the kernel and verify it as an outside consumer would |
| `pnpm check:boundaries` | Verify the import rules between packages |
| `pnpm check:bundle` | After a build, compare the web bundle's size with its budget |

The browser suite needs a browser installed once:

```bash
pnpm --filter @guiderail/web exec playwright install chromium
```

Before opening a pull request, run what CI runs:

```bash
pnpm exec biome ci --error-on-warnings .
pnpm check:boundaries
pnpm build
pnpm check:bundle
pnpm typecheck
pnpm test:coverage
pnpm check:package
pnpm test:e2e
```

## How it is put together

| Package | Path | Role |
|---|---|---|
| `@guiderail/core` | `packages/core/` | The headless kernel: domain model, navigation state machine, graph queries, content loading. TypeScript, Zod and XState. No UI |
| `@guiderail/web` | `apps/web/` | The React app: canvases, panels, steppers, search |

The web app depends on the kernel, never the other way round. All navigation state lives in one state machine in the kernel; the UI sends it events and renders what it says.

[AGENTS.md](AGENTS.md) is the full working guide: design rules, the navigation contract, the data boundary and known limitations.

## Use your own content

The app takes its content as a dataset. The kernel is initialised from it and every view reads it, so nothing else needs to change.

Content is a JSON object whose keys are collections. [docs/examples/minimal-content.json](docs/examples/minimal-content.json) is a complete small example: one domain, one capability, two nodes, three perspectives and a two-step journey. Any collection you leave out is simply empty.

To show it, validate it and hand it to the app in `apps/web/src/main.tsx`:

```tsx
import { parseContentBundle } from "@guiderail/core/content";
import content from "../../../docs/examples/minimal-content.json";
import { App } from "./App.js";
import { createDataset } from "./data/dataset.js";

const { bundle, errors } = parseContentBundle(content, "minimal-content.json");
if (errors.length > 0) throw new Error(JSON.stringify(errors, null, 2));

// then render <App dataset={createDataset(bundle)} /> in place of <App />
```

With that example the app shows three tabs: Landscape, Journey and Architecture. Filter the left panel for "Check out", choose it, and the stepper reads "Step 1 of 2". A test loads this file and mounts the app with it, so the example stays true.

`parseContentBundle` never throws on bad content. It reports what it could not use: an entity that fails its schema, a duplicate id, a reference to something that does not exist, a misspelled collection name. The rules are in the [data-integrity contract](docs/architecture/data-integrity.md).

Only load content you trust. See [SECURITY.md](SECURITY.md).

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| `Failed to resolve import "@guiderail/core/…"` | The kernel has not been built. `pnpm dev` and `pnpm build` both build it; if you started Vite some other way, run `pnpm build` first |
| A warning that the Node version does not satisfy `engines` | You are on an unsupported Node line. Use 26 or 24 |
| pnpm reports a `packageManager` version mismatch | Your pnpm differs from the pinned version. Install the version named in `packageManager` |
| A commit is rejected by the pre-commit hook | `pnpm check` failed. Run `pnpm check:fix`, review the changes, and commit again |
| The pre-commit hook does not run | Run `pnpm exec lefthook install`. `pnpm install` does this for you, except in CI and outside a git checkout |
| `pnpm test:e2e` says the browser executable is missing | Run the `playwright install chromium` command above |
| Port 5173 is in use | Vite picks the next free port and prints it |

## Project

- [AGENTS.md](AGENTS.md): how the codebase is organised and how to work in it
- [CONTRIBUTING.md](CONTRIBUTING.md): how to propose and land a change
- [ROADMAP.md](ROADMAP.md): what is being worked on
- [CHANGELOG.md](CHANGELOG.md): what changed, by version
- [docs/releasing.md](docs/releasing.md): versioning, compatibility and how a release is cut
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [docs/architecture/data-integrity.md](docs/architecture/data-integrity.md): what content is accepted, rejected and reported
- [docs/performance.md](docs/performance.md): bundle size, start-up time and the size budget
- [docs/README.md](docs/README.md): every document under `docs/`, and whether it is current, shipped, superseded or only an idea
- [docs/architecture/README.md](docs/architecture/README.md): how the system is put together, in one page
- [docs/adr/](docs/adr/README.md): decisions and the reasons for them

## Security

To report a vulnerability, see [SECURITY.md](SECURITY.md). Please do not open a public issue.

## License

[MIT](LICENSE)
