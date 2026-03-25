# IDEA — Switchboard Plugin Model for GuideRail

## Context

GuideRail's architecture already has informal extension seams — `onNodeClick` dispatches by prefix, `DetailPanelRouter` dispatches by resolver chain, `ContextBar` canvas modes are data-driven, `use-perspective-provider` branches by perspective type. These seams work but are hardcoded in the application.

Switchboard (`/Users/jladd/Code/switchboard/`) is a Python-first plugin runtime library that formalizes exactly this pattern: host-owned extension points (Slots and Hooks) with deterministic resolution, lifecycle management, and failure isolation. The architecture is language-agnostic — the concepts port cleanly to TypeScript.

This idea proposes enhancing Switchboard with a TypeScript runtime implementation and using it as GuideRail's plugin system, enabling open core + commercial extension architecture.

---

## Why This Matters

### For GuideRail
- **Open core model:** MIT kernel + commercial plugins (presenter, connectors, author mode)
- **Community extensions:** Third parties can contribute perspectives, canvas modes, detail panels, content loaders
- **Clean boundaries:** Pro features are plugins, not forks — they consume the same kernel contracts
- **Formal extension API:** Instead of hardcoded prefix checks and resolver chains, plugins register through a declared contract

### For Switchboard
- **Polyglot runtime:** Python + TypeScript implementations of the same spec
- **Broader adoption:** JavaScript/TypeScript is the larger ecosystem
- **Validation:** A real product (GuideRail) consuming the plugin model proves the architecture

---

## Switchboard Concepts That Map to GuideRail

| Switchboard | GuideRail Equivalent | Current Implementation |
|---|---|---|
| **Slots** (named UI anchor points) | Perspective registration, canvas mode registration, detail panel slots, node type registration | Hardcoded in `node-types.ts`, `ContextBar.tsx`, `DetailPanelRouter.tsx` |
| **Hooks** (event interception) | Context Machine events, `guiderail:expand` custom events | Hardcoded in `AppShell.tsx` event listeners |
| **PatchPanel** (registry + resolver) | Plugin registry | Does not exist yet |
| **Manifest** (YAML descriptor) | Plugin package descriptor | Does not exist yet |
| **Priority ordering** | Canvas mode ordering, resolver priority | Hardcoded order in code |
| **Lifecycle** (READY → ACTIVE → FAILED) | Plugin activation with failure isolation | Does not exist yet |

---

## Proposed Architecture

### Switchboard becomes polyglot

```
switchboard/
  packages/
    switchboard-python/         ← existing Python implementation
    switchboard-typescript/     ← new TypeScript implementation (@switchboard/core)
    switchboard-spec/           ← shared manifest format, YAML schemas
```

### GuideRail consumes Switchboard-TypeScript

```
@switchboard/core               ← TypeScript PatchPanel, lifecycle, manifest (MIT)
@guiderail/core                 ← domain kernel (MIT)
@guiderail/web                  ← base app (MIT, imports @switchboard/core)
@guiderail/plugin-*             ← individual plugins (MIT or commercial)
```

---

## GuideRail Slot Definitions

Host-defined slots that plugins can contribute to:

```typescript
// Perspective system
"perspective.register"          // contribute new perspectives to the progression
"canvas-mode.register"          // contribute canvas modes to a perspective
"node-type.register"            // contribute React Flow node component types

// Detail panels
"detail-panel.resolver"         // contribute detail panel renderers (by node ID pattern or entity type)

// Context bar
"context-bar.action"            // contribute context bar actions or indicators

// Content
"content.loader"                // contribute content loading adapters (OpenAPI, Backstage, BPMN, etc.)
"content.transformer"           // contribute content transformation pipelines

// Canvas
"canvas.background"             // contribute canvas background layers (swim lanes, grids, etc.)
"canvas.overlay"                // contribute canvas overlay elements
```

## GuideRail Hook Definitions

Host-defined hooks that plugins can listen to:

```typescript
// Navigation events
"perspective.switched"          // fired on perspective change
"canvas-mode.switched"          // fired on canvas mode change
"context.changed"               // fired on any nav state change
"selection.changed"             // fired on node/edge selection

// Route events
"route.started"                 // fired when a guided route begins
"route.waypoint.entered"        // fired on route waypoint progression
"route.paused"                  // fired on route pause
"route.ended"                   // fired on route completion

// Content events
"content.loaded"                // fired when content bundle is loaded
"content.error"                 // fired when content validation fails

// Lifecycle events
"app.initialized"               // fired after kernel initialization
"app.ready"                     // fired when app is ready for interaction
```

---

## Plugin Examples

### Community Plugin (MIT)
```yaml
manifest_version: "1"
plugin_id: com.community.dark-theme
plugin_version: "1.0.0"
requires_switchboard: ">=1.0.0"
entrypoint: "@community/guiderail-dark-theme"
contributions:
  hooks:
    - contribution_id: apply-theme
      hook_key: app.initialized
```

### Pro Plugin (Commercial)
```yaml
manifest_id: "1"
plugin_id: com.backspring.presenter
plugin_version: "1.0.0"
requires_switchboard: ">=1.0.0"
entrypoint: "@guiderail/plugin-presenter"
contributions:
  slots:
    - contribution_id: presenter.controls
      slot_key: canvas.overlay
      priority: 100
    - contribution_id: presenter.panel
      slot_key: detail-panel.resolver
      priority: 200
  hooks:
    - contribution_id: presenter.sync
      hook_key: perspective.switched
    - contribution_id: presenter.waypoint
      hook_key: route.waypoint.entered
```

### Content Connector Plugin (Pro)
```yaml
manifest_version: "1"
plugin_id: com.backspring.openapi-sync
plugin_version: "1.0.0"
requires_switchboard: ">=1.0.0"
entrypoint: "@guiderail/plugin-openapi"
contributions:
  slots:
    - contribution_id: openapi.loader
      slot_key: content.loader
      priority: 50
  hooks:
    - contribution_id: openapi.loaded
      hook_key: content.loaded
```

---

## Open Core Licensing Model

| Layer | License | What's included |
|---|---|---|
| `@switchboard/core` | MIT | TypeScript PatchPanel, lifecycle, manifest parsing |
| `@guiderail/core` | MIT | Kernel, entities, state machine, graph queries, content loading |
| `@guiderail/web` | MIT | Base app with 6 perspectives, canvas templates, guided routes |
| `@guiderail/plugin-presenter` | Commercial | Real-time presenter/follower model |
| `@guiderail/plugin-openapi` | Commercial | OpenAPI spec import and sync |
| `@guiderail/plugin-author` | Commercial | In-app content authoring UI |
| `@guiderail/plugin-evidence` | Commercial | Evidence mode with source-connected truth |
| `@guiderail/plugin-backstage` | Commercial | Backstage catalog sync |

---

## Implementation Approach

### Phase 1: Switchboard TypeScript Port
- Port `PatchPanel`, `SlotDefinition`, `HookDefinition`, `PluginManifest`, `PluginLifecycle` to TypeScript
- Same contracts as Python version, TypeScript-idiomatic implementation
- Publish as `@switchboard/core` (MIT)

### Phase 2: GuideRail Slot/Hook Definitions
- Define the slot and hook contracts listed above
- Refactor existing hardcoded seams to use Switchboard registration
- `DetailPanelRouter` → slot-based resolver
- `ContextBar` canvas modes → slot contributions
- `node-types.ts` → slot-registered node types

### Phase 3: Plugin SDK
- Create `@guiderail/sdk` with helpers for building plugins
- Plugin development documentation
- Example community plugin

### Phase 4: First Commercial Plugin
- Build `@guiderail/plugin-presenter` as the first pro feature
- Validates the full plugin lifecycle from manifest to activation

---

## Key Design Principles (from Switchboard)

1. **Host-owned seams.** Only declared extension points exist. Plugins cannot inject arbitrary hooks or modify host internals.
2. **Deterministic ordering.** Priority (desc) → plugin_id (asc) → contribution_id (asc). Stable and reproducible.
3. **Failure isolation.** One plugin failure does not block others. FAILED state is quarantined.
4. **No import side-effects.** Plugin code only executes during activation, not on registration.
5. **Lifecycle management.** READY → STARTING → ACTIVE → STOPPING → READY (+ FAILED). Safe activation/deactivation.

---

## Timeline Estimate

- Switchboard TypeScript port: 1-2 weeks
- GuideRail slot/hook definitions + seam refactoring: 1-2 weeks
- Plugin SDK + documentation: 1 week
- First commercial plugin: 2-3 weeks

This is likely a 0.7.0 or 0.8.0 feature — not urgent, but architecturally significant for the open core business model.

---

## Relationship to Other Ideas

- **Mobile screen preview** (`docs/ideas/mobile-screen-preview-idea.md`) — could be a plugin contributing to `detail-panel.resolver`
- **Perspective progression** (`docs/ideas/Perspective_Progression_Shared_Context_Guided_Tour_Idea.md`) — guided tour participant model is a natural pro plugin
- **Transforming Viewscape** (`docs/ideas/guiderail-idea-transforming-viewscape.md`) — truth acquisition layers map to content loader plugins (Zone 2: source-connected, Zone 3: inferred)
