# Architecture

How GuideRail is put together, in one page. The working rules are in [AGENTS.md](../../AGENTS.md); the reasons behind the main decisions are in [docs/adr/](../adr/README.md).

## Two packages, one direction

```
apps/web  (@guiderail/web)   React UI: canvases, panels, steppers, search
    │  depends on
    ▼
packages/core  (@guiderail/core)   headless kernel: model, state machine, graph, content
```

The kernel imports no UI and nothing from the web app. The web app imports the kernel only through its built entry points. `pnpm check:boundaries` enforces both.

## The kernel

| Part | Path | Does |
|---|---|---|
| Entities | `src/entities/` | Zod schemas and types for the model: domains, capabilities, nodes, edges, journeys, steps, processes, stages, sequences, messages, routes and more |
| Context machine | `src/context/` | One XState machine holding all navigation state. Events go in; pure reconciler functions compute the next state |
| Graph | `src/graph/` | The terrain graph and queries over it |
| Content | `src/content/` | Loading a dataset from plain data, with diagnostics, and the one definition of navigation order |
| Demo | `src/demo/` | The demo dataset. Sample data, not kernel API |

Navigation state is a single object, `NavigationContext`: the active perspective, what is selected, and a position in each thing that can be stepped through. Nothing else holds navigation state.

## The web app

| Part | Path | Does |
|---|---|---|
| Data boundary | `src/data/` | `Dataset`: a content bundle plus its graph. Provided once, read everywhere |
| Kernel bridge | `src/hooks/use-context-machine.ts` | Creates the machine, initialises it from the dataset, exposes `nav` and `send` |
| Perspective provider | `src/hooks/use-perspective-provider.ts` | Turns navigation state and the dataset into canvas nodes and edges, with a layout per perspective |
| Layouts | `src/lib/` | Journey, landscape, sequence, BPMN and orientation layouts are synchronous; Architecture and System use ELK, loaded on demand |
| Shell | `src/components/layout/AppShell.tsx` | Top bar, context bar, the two panels, the canvas and the stepper |

Data flows one way: the dataset initialises the kernel; the UI sends events; the kernel's state, with the same dataset, decides what is drawn. Zustand holds only UI state such as whether a panel is open.

## Seven perspectives

Orientation, Landscape, Journey, Process, Architecture, System, Sequence. Each is a different view of the same dataset and the same navigation state. Switching perspective keeps your context and clears only what belongs to the canvas you left; the exact rules are the navigation contract in AGENTS.md.

## Contracts

| Contract | Where |
|---|---|
| What a perspective switch keeps and resets | AGENTS.md, "Navigation contract"; `navigation-contract.test.ts` |
| What content is accepted, rejected and reported | [data-integrity.md](data-integrity.md) |
| What counts as the public surface | [../releasing.md](../releasing.md) |
| Bundle size | [../performance.md](../performance.md) |

## What it is not

There is no backend, no persistence and no authentication. Content is supplied in code as a dataset. Loading content from files or a service is not built.
