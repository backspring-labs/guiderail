# GuideRail

Guided architecture navigation from business understanding to code reality. A pnpm + Turborepo monorepo.

## Commands (from root)

```bash
pnpm install        # install all workspace dependencies
pnpm dev            # start web dev server (turbo)
pnpm build          # build all packages (turbo, core first)
pnpm test           # run all tests (turbo)
pnpm check          # biome check all packages (turbo)
pnpm check:fix      # biome auto-fix all packages (turbo)
```

## Packages

| Package | Path | Description |
|---------|------|-------------|
| `@guiderail/core` | `packages/core/` | Headless kernel — domain model, state machines, context sync, graph queries |
| `@guiderail/web` | `apps/web/` | React UI — terrain canvas, detail panels, guided route bar |

## Architecture

- **@guiderail/core** owns all domain logic, navigation state, and graph operations. No UI, no React. Pure TypeScript + Zod + XState.
- **@guiderail/web** owns rendering, layout, and UX. Consumes core via workspace dependency.
- Dependency direction: `web → core` only. Core never imports from web.

## Key Design Rules

1. **Context Machine is single authority.** All nav state reads from `snapshot.context.nav`. All mutations via `send(event)`.

2. **Kernel vs UI authority.** The Context Machine remains the single source of truth for route, process, value stream, and navigation state. The UI derives renderable presentation state but must not recreate kernel semantics.

3. **Zustand owns UI-only state.** Panel visibility, animation flags, hover state. Never canonical navigation state.

4. **React Flow is render-only.** Node and edge types are delivery structures for rendering, not semantic truth.

5. **No domain-model renaming from package renames.** The `mode: "viewscape" | "guiderail"` enum values are domain concepts, not package names.

6. **`@seed` is a temporary convenience.** The web app imports seed data from core's test-fixtures via a path alias. This is a development bridge, not a permanent content contract.

7. **6-perspective progression.** Landscape → Journey → Process → Architecture → System → Sequence. Each answers a different question about the same terrain. Perspective switches preserve the shared context thread.

8. **Canvas modes are perspective-internal.** Process: Operational/Decision/Controls. Landscape: Capability/Providers. Architecture: Logical/Deployment. Same topology, different emphasis.

9. **Shared context contract.** A perspective switch means "show me this same moment through another lens," not "take me somewhere else." Domain, capability, journey, process, and route context survive perspective switches.

10. **Content loading.** `@guiderail/core/content` provides `parseContentBundle()` for loading JSON content with Zod validation. Seed data remains the fallback.

## Perspective System (0.5.0)

The product organizes around a 6-perspective progression, each with its own canvas template:

| Perspective | Canvas Template | Canvas Modes |
|---|---|---|
| Landscape | Capability map (domain regions, capability tiles, actor entry points) | Capability, Providers |
| Journey | Screen flow (step types: screen/modal/error/info/decision/confirmation, branching transitions) | — |
| Process | BPMN swim lanes (tasks, gateways, events) | Operational, Decision, Controls |
| Architecture | Terrain node graph (ELK layered layout) | Logical, Deployment |
| System | Scenario-scoped filtered architecture (parentNodeId component hierarchy) | — |
| Sequence | Lifeline diagram (interfaces, messages, request/response) | — |

### Key entities added in 0.4.0–0.5.0
- `ControlPoint` — severity, controlType, status, regulatoryRef
- `Interface` — nodeId, protocol, for Sequence lifelines
- `Message` — sequenceNumber, sourceInterfaceId, targetInterfaceId, for Sequence arrows
- `StepType` — screen, modal, error, info, decision, confirmation
- `StepTransition` — replaces nextStepIds with targetStepId, label, condition
- `CanvasMode` — perspectiveType + mode for canvas mode switching
- `parentNodeId` on Node — enables C4 Level 3 component hierarchy

### Interaction patterns
- **Click = detail** — clicking any canvas element shows its detail in the right panel
- **Expand affordance** — `+` button or "Open" action in detail panel drills into the element (e.g., journey picker → step flow)
- **`guiderail:expand` custom event** — dispatched from canvas nodes, listened by AppShell
- **Data-driven selection** — custom canvas perspectives use `isActive` data flags, not React Flow's internal selection state
- **fitView on perspective/mode switch** — 300ms animated transition with 0.15 padding

### Content loading
`@guiderail/core/content` exports `parseContentBundle()` which validates raw JSON through Zod schemas, collecting errors non-fatally. Returns `ContentBundle` + `ContentError[]` + `ContentProvenance`. `mergeContentBundles()` combines multiple bundles.

## TypeScript Ownership

- TypeScript tool is a root-level shared devDependency.
- tsconfig ownership is package-local. Each package has its own tsconfig.json.
- Package build scripts invoke their own local tsconfig paths.

## Workspace Structure

```
guiderail/
├── packages/
│   └── core/     ← @guiderail/core (headless kernel)
├── apps/
│   └── web/      ← @guiderail/web (React UI)
├── docs/
│   ├── ideas/    ← product ideas and concept docs
│   ├── prds/     ← product requirements documents
│   └── plans/    ← implementation plans by version
├── pnpm-workspace.yaml
├── turbo.json
└── package.json  ← root workspace
```

## Documentation

All product thinking, PRDs, and implementation plans live in `docs/` and are versioned with the code. This is the operational home of product evolution.
