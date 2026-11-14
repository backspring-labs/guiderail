# @guiderail/core

The headless kernel of [GuideRail](https://github.com/backspring-labs/guiderail): the domain model, the navigation state machine, graph queries and content parsing. Pure TypeScript with Zod and XState. No UI and no React.

## Status

Pre-1.0 and **not published to npm**. The API can change between minor versions. Inside the GuideRail monorepo it is consumed as a workspace dependency.

Requires Node.js 24 or 26. ESM only.

## Entry points

| Import | What it holds |
|---|---|
| `@guiderail/core` | Everything below except `content`, re-exported |
| `@guiderail/core/entities` | Zod schemas and types for the domain model |
| `@guiderail/core/graph` | `createGraph` and graph queries (`getNeighbors`, `bfsTraverse`, `getPathNodes`, filters) |
| `@guiderail/core/context` | `contextMachine`, the single authority for navigation state, and its reconcilers |
| `@guiderail/core/machines` | Smaller XState machines used by the kernel |
| `@guiderail/core/perspective` | Perspective provider contracts and layer resolution |
| `@guiderail/core/content` | `parseContentBundle`, `mergeContentBundles` for loading content from JSON |
| `@guiderail/core/adapters` | Source adapter contracts |
| `@guiderail/core/indexing` | Index generation helpers |
| `@guiderail/core/provenance` | Provenance reference schema |

## Example

```ts
import { createActor } from "xstate";
import { contextMachine, createGraph, type Node } from "@guiderail/core";

const nodes: Node[] = [
	{ id: "api", type: "service", label: "API", tags: [], metadata: {}, layoutByPerspective: {} },
];
const graph = createGraph(nodes, []);

const actor = createActor(contextMachine).start();
actor.send({ type: "INITIALIZE", graph, journeys: [], steps: [], capabilities: [] });
actor.send({ type: "SELECT_NODE", nodeId: "api" });

actor.getSnapshot().context.nav.selectedNodeId; // "api"
```

All navigation state is read from `snapshot.context.nav` and changed only by sending events.

## What is not in the package

Test fixtures, the demo corpus and mock adapters live under `src/test-fixtures/`. They are internal: excluded from the build and not exported. Do not import them from outside this package's tests.

## Verifying the package

From the repository root, after `pnpm build`:

```bash
pnpm check:package
```

This packs the package, installs the tarball into a throwaway project outside the workspace, imports every entry point, and typechecks every entry point. CI runs it on every pull request.

## Licence

[MIT](LICENSE)
