# Performance baseline

How big the web app is, how long it takes to become usable, and how those numbers are kept from drifting. Measured on 2026-11-14.

## Where the size was

At the baseline the production build was one JavaScript file of 2.22 MB (664 kB gzip). Measured per package, before minification:

| Package | Share |
|---|---|
| elkjs (automatic graph layout) | 48% |
| react-dom | 19% |
| zod | 7% |
| App source | 5% |
| `@xyflow/react` and `@xyflow/system` (React Flow) | 8% |
| xstate | 4% |
| Demo corpus | 3% |
| Everything else | 6% |

Nearly half the app was one library, ELK, that only two of the seven perspectives use: it lays out the Architecture and System canvases.

## What changed

ELK is loaded the first time a layout is asked for, instead of at start-up (`apps/web/src/lib/elk-layout.ts`). If the load fails, the layout request fails, the canvas shows its grid fallback with a Retry button, and a retry loads it again.

| | Before | After |
|---|---|---|
| Initial JavaScript, minified | 2,224 kB | 731 kB |
| Initial JavaScript, gzip | 664 kB | 213 kB |
| Loaded on demand (ELK), gzip | — | 446 kB |
| Time to usable, full speed | 230 ms | 106 ms |
| Time to usable, CPU slowed 4× | 471 ms | 269 ms |

"Time to usable" is the median of 15 cold loads, from navigation start until the active perspective tab is on screen.

Someone who opens Architecture or System pays for ELK then, once. Someone who does not never downloads it.

## What was considered and not done

- **Loading React Flow on demand.** The landing view, Orientation, does not use the canvas, and React Flow is about 15% of what remains. Deferring it would save an estimated 30 kB gzip at start-up (its share of the file; not measured by building it), at the cost of a loading state the first time any canvas opens, which is almost every session. Not worth it today.
- **Splitting vendor code into its own file.** It helps repeat visits after a deploy, not first load, and there are no deploys yet.
- **Raising Vite's chunk-size warning limit.** The build still warns that two files exceed 500 kB. Both warnings are true: ELK cannot be split further, and the initial file is 731 kB. The budget below is the control; the warning is left as it is.

What is left in the initial file is mostly react-dom (37%) and zod (14%).

## Environment

These numbers are for comparison between builds on one machine. They are not a claim about users' devices.

- Apple silicon Mac, macOS, Node 26.10.0.
- Chromium 159 (Playwright), headless, fresh browser context per run.
- The production build served locally by `vite preview`: no network latency and no compression in transit, which is why gzip sizes are computed from the files.
- Dataset: the demo corpus (24 nodes, 25 edges, 3 journeys, 4 processes, 2 sequences).
- "CPU slowed 4×" is Chromium's CPU throttling, to stand in for a slower machine.

There is no large-graph benchmark. The demo has 24 nodes; behaviour with hundreds is not measured.

## Reproduce

```bash
pnpm build
pnpm check:bundle                                   # sizes against the budget
cd apps/web && node scripts/measure-start.mjs 15    # time to usable
```

## Budget

`pnpm check:bundle` runs in CI after the build and fails if any of these is exceeded. The sizes are also written to the workflow run's summary.

| | Measured (gzip) | Budget (gzip) |
|---|---|---|
| Initial JavaScript | 212.8 kB | 225 kB |
| On-demand JavaScript | 445.9 kB | 470 kB |
| CSS | 9.1 kB | 11 kB |

The budgets are the measured sizes plus about 5%, in `apps/web/bundle-budget.json`.

- If a change goes over, first see whether it can be loaded on demand.
- If the growth is justified, raise the budget in the same pull request and say what the bytes buy.
- When a change makes the app smaller, lower the budget to match.
