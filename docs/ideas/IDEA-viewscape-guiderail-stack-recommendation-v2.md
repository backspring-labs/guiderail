# IDEA: Viewscape + GuideRail Stack and Build Recommendation (Revision 2)

## Status
Draft — revised to reflect source-of-truth separation, derivation model, archival strategy, and repo-attached generation constraints

## Purpose
This document recommends a modern open-source foundation for building **Viewscape** and **GuideRail** without re-inventing core infrastructure.

It also adds a stricter architectural constraint that materially affects the build:

- **Viewscape is not the system of record for industry truth**
- **GuideRail is not the system of record for application design truth**
- both products are **navigation, indexing, projection, and traversal systems built over external sources of truth**

That means the custom engineering moat should stay focused on:

- the canonical terrain + journey model
- the derivation and provenance model
- the context synchronization runtime
- multi-layer projection behavior
- route progression and traversal logic
- simulator scene binding
- research, annotation, risk, and evidence overlays
- source adapters and rebuildable indexing

Everything else should lean on proven OSS building blocks.

---

## 1. Executive recommendation

Build **one monorepo**, **one web product shell**, and **one shared kernel** with two source-aware operating modes:

- **Viewscape mode** → traverses a curated industry landscape built from an artifact/research corpus
- **GuideRail mode** → traverses an application or target system by deriving views from a target repo

Use mature OSS for:

- app shell and routing
- graph rendering
- auto-layout
- process-diagram rendering
- state orchestration
- UI state
- server-state fetching
- schema validation
- API framework
- persistence
- rich text / annotation editing
- collaboration later
- component development and testing
- observability
- repo access and indexing pipelines

### Recommended default stack

#### Frontend shell
- **Next.js App Router**
- **TypeScript**
- **React**

#### Core visual runtime
- **React Flow / xyflow** for the interactive graph canvas
- **ELK.js** for directed / layered / orthogonal layout
- **bpmn-js** for BPMN and process-diagram views

#### State and behavior
- **XState v5** for the route/state orchestration engine
- **Zustand** for local UI state
- **TanStack Query** for server-state fetching and cache management

#### Contracts and validation
- **Zod** on the TypeScript side
- **Pydantic v2** on the Python side

#### API and backend services
- **FastAPI** for ingestion, transformation, projection, indexing, repo analysis, and model-serving endpoints

#### Data and indexing layer
- **PostgreSQL** for workspace metadata, index metadata, provenance, jobs, and cache manifests
- **jsonb** for flexible graph / scene / metadata payloads
- **pgvector** only if semantic retrieval becomes a real requirement
- **DuckDB** optional later for local analytics / transformation runs, but not as the system of record

#### Notes and annotation surfaces
- **Tiptap** for rich text editing
- **Yjs + Hocuspocus** later if live collaboration is needed

#### Developer workflow and quality
- **pnpm workspaces**
- **Turborepo**
- **Biome** for formatting/linting in the JS/TS stack
- **Vitest** for package-level tests
- **Storybook** for component and interaction development
- **Playwright** for end-to-end walkthrough tests
- **OpenTelemetry** for traces, metrics, and logs

---

## 2. New governing principle: source of truth stays outside the product

This is the most important revision.

### 2.1 Viewscape

Viewscape should not become a hand-maintained CMS or shadow database of fintech truth.

The enduring truth should live in a **source corpus** such as:
- a docs repo
- markdown research files
- structured YAML/JSON registries
- curated artifact libraries
- linked source documents and notes

Viewscape should maintain a **derived canonical index/model** that is:
- rebuildable
- provenance-aware
- versioned by import/index job
- updateable as vendors, segments, and relationships change

In other words:

**Viewscape is a navigable knowledge graph built from a curated source corpus.**

### 2.2 GuideRail

GuideRail should not become a long-lived shadow architecture repository for the systems it analyzes.

The enduring truth should remain in the **target repo**:
- source code
- config
- route definitions
- tests
- docs in repo
- generated design artifacts committed back into the repo

GuideRail may:
- derive flows
- infer relationships
- generate walkthroughs
- build sequence/activity/process/control projections
- cache analysis results
- persist sessions and walkthrough state

But it should **not** maintain a separate persistent truth model that competes with the target repo.

In other words:

**GuideRail is a repo-attached analysis and projection engine.**

### 2.3 Hard rule

Both products may maintain:
- caches
- indexes
- projections
- session state
- annotations
- traversal state
- provenance metadata

But durable truth should live in the external source system:
- content/artifact repo for Viewscape
- target code/doc repo for GuideRail

---

## 3. Design principles for the build

### 3.1 Do not build commodity infrastructure yourself

You should not hand-roll:
- a graph editor/canvas
- a diagram auto-layout engine
- a BPMN renderer
- a rich text editor
- a collaborative sync protocol
- a test harness
- an observability framework
- a Git implementation or custom repo storage model

Those are classic traps that turn a sharp product into a plumbing project.

### 3.2 Keep custom code focused on the shared kernel

The custom system should own:
- canonical domain entities
- source adapter contracts
- derivation/indexing pipeline logic
- provenance model
- layer projection logic
- route/journey progression
- current-location model
- map/panel/simulator synchronization
- step-to-scene mapping
- research/control/evidence linkage
- generated artifact policies

That is the durable asset.

### 3.3 Separate source, index, and rendered experience

A key architectural rule:

- **source repo/corpus** = enduring truth
- **canonical index/model** = derived and rebuildable
- **rendered experience** = interactive navigation and projection

That separation is what prevents rot.

### 3.4 Separate rendering from orchestration

Another key rule:

- **React Flow is the visual canvas**
- **XState is the orchestration engine**
- **Mermaid/D2 are export/projection formats, not the runtime**
- **bpmn-js owns BPMN rendering, not your graph canvas**

That separation will make the system far easier to evolve.

---

## 4. Canonical model and archival strategy

## 4.1 Viewscape archival strategy

Viewscape needs a sound archival and update strategy because the landscape will evolve:
- vendors appear and disappear
- segments split or merge
- providers add capabilities
- industry relationships change
- research artifacts accumulate over time

### Recommended strategy

Maintain a **source corpus repo** with structured content conventions:
- markdown files for narrative research
- YAML/JSON for entity registries and relationship facts
- frontmatter or sidecar metadata for source type, date, confidence, and tags
- optional snapshots of important external references where licensing/usage permits

Then build a **re-index pipeline** that:
- reads the source corpus
- validates content against schemas
- resolves canonical entities
- creates or updates relationships
- records provenance to source file and section
- emits a normalized index for traversal

### Important implication

The Viewscape UI should traverse the **derived index**, but every entity, segment, route, and connection should retain provenance back to source artifacts.

## 4.2 GuideRail derivation and artifact policy

GuideRail has a stricter rule set.

The target repo is the enduring source of truth. The platform may derive:
- call graphs
- route maps
- service relationships
- UI-to-handler traces
- sequence-like flows
- control points
- evidence linkages

It may also generate:
- Mermaid diagrams
- BPMN diagrams
- walkthrough manifests
- evidence summaries
- risk/control overlays

But if those generated artifacts are meant to persist, they should be:

**written back into the target repo**

not stored as an independent long-lived truth set inside GuideRail.

### Allowed persistence inside GuideRail

GuideRail may persist:
- analysis sessions
- cached parse/index results
- traversal state
- annotations tied to repo commit/version context
- job history
- provenance manifests

### Not allowed as product authority

GuideRail should not become:
- a shadow design repository
- a parallel architecture model divorced from the codebase
- a hand-maintained source of truth that drifts from the repo

---

## 5. Recommended architecture shape

## 5.1 Shared operating model

Both products should share a common model:

- **Workspace** → local operating context in the product
- **Source** → external repo/corpus being analyzed
- **Index** → derived canonical model used for traversal
- **Projection** → route/layer/view generated from the index
- **Session** → user traversal state, filters, anchors, annotations

This is a clean mental model and keeps the design consistent.

## 5.2 Frontend recommendation

### Use Next.js App Router as the primary shell

This is the best default because it gives you:
- a modern React application structure
- nested layouts
- route-level code splitting
- clean server/client boundaries
- URL-addressable workspace and journey state
- an ecosystem aligned with current React practices

The shell needs to support:
- a large interactive canvas
- multiple synchronized panels
- source-aware workspaces
- traversal state reflected in the URL
- side-by-side map + details + evidence + simulator surfaces
- future auth, workspace, and team features

Next.js is a strong fit for that.

## 5.3 Interactive canvas recommendation

### Use React Flow / xyflow for the main map canvas

React Flow is the right core primitive for:
- node-edge rendering
- custom nodes and edges
- panning and zooming
- hit testing and selection
- custom handles and overlays
- embedding controls and panels around graph state

This matches the terrain/canvas behavior of both products.

### Important boundary

Do not let React Flow become your truth model.

It should render your canonical graph/index model, not replace it.

## 5.4 Layout recommendation

### Use ELK.js for auto-layout

ELK Layered is especially strong for:
- directional graphs
- layered step flows
- block-diagram style layouts
- orthogonal routing
- port-aware diagrams

### Practical pattern

Keep both:
- persisted layout hints for curated strategic views
- ELK-generated layouts for computed or alternate projections

That hybrid strategy is likely best.

## 5.5 Process / workflow diagram recommendation

### Use bpmn-js for BPMN and business-process views

bpmn-js is the right choice when you want:
- standards-based process diagrams
- embedded browser rendering
- annotation and extension
- future process-model interoperability

This is especially useful in GuideRail where a walkthrough may need process semantics and risk/control overlays.

### Boundary

Do not force all layers into BPMN.

Use bpmn-js only where BPMN is actually the right representation.

## 5.6 Export / projection diagram recommendation

### Use Mermaid and/or D2 for exportable text-based diagram views

These are useful for:
- generated documentation
- export artifacts
- architecture snapshots
- lightweight alternate representations
- shareable text-defined diagrams

### Required boundary

Treat Mermaid and D2 as:
- export formats
- generated documentation views
- light projection targets

Do **not** treat them as the primary interactive runtime.

Mermaid/D2 should remain projection/export surfaces, not the interactive runtime.

---

## 6. State and orchestration recommendation

## 6.1 Use XState v5 for the core behavior engine

This remains one of the most important recommendations in the whole stack.

Viewscape + GuideRail has state complexity that is easy to underestimate:
- current workspace
- attached source corpus or repo
- current source revision / commit / import version
- active terrain
- selected route
- current step
- simulator state
- current layer
- panel visibility
- viewport anchor
- branch handling
- progression rules
- cross-surface synchronization

That is not “just component state.”

### What XState should own

XState should own:
- journey lifecycle
- route progression
- current-step transitions
- simulator synchronization
- layer-switch behavior
- context reconciliation rules
- mode changes between Viewscape and GuideRail
- source attachment lifecycle
- index generation / refresh workflow states

### What it should not own

Do not dump every small UI toggle into XState.

That is where Zustand should help.

## 6.2 Use Zustand for local UI state

Use Zustand for things like:
- panel openness
- hover state
- transient selections
- local control visibility
- UI preferences
- ephemeral widget state

### Recommended split

- **XState** = business/workflow/navigation state
- **Zustand** = ergonomic UI state and local interaction state

## 6.3 Use TanStack Query for server-state

This keeps remote data concerns separate from both XState and Zustand.

Use it for:
- loading terrain datasets
- loading derived index artifacts
- fetching annotations and notes
- fetching repo analysis results
- job polling
- saving mutations
- background refresh

---

## 7. Contracts, schema, and validation

## 7.1 Use Zod for canonical TS contracts

The system will be driven by structured objects:
- nodes
- edges
- journeys
- steps
- scenes
- layers
- annotations
- evidence references
- provenance references
- source manifests
- index manifests

These should be runtime-validated, not trusted by convention.

### Zod should validate
- seed datasets
- imported JSON/YAML
- API responses
- form payloads
- route definitions
- scene definitions
- source-corpus manifests
- generated walkthrough manifests

## 7.2 Use Pydantic v2 on the Python side

If you use Python for ingestion, transformation, AI-assisted extraction, repo parsing, or content processing, Pydantic gives you matching contract discipline on the backend.

### Clean contract strategy

- define authoritative JSON shapes
- validate in TS with Zod
- validate in Python with Pydantic
- generate OpenAPI from FastAPI where helpful
- keep conversion adapters explicit

---

## 8. Backend and service recommendation

## 8.1 Use FastAPI for backend services

FastAPI is a good fit if you want Python in the stack for:
- ingestion pipelines
- graph transformation
- AI-assisted structuring
- research enrichment
- export generation
- repo analysis
- route generation experiments
- control/evidence extraction later

### Suggested service boundaries

A practical early backend might include:
- source registry service
- ingestion/index service
- projection service
- repo analysis service
- annotation service
- export service
- semantic retrieval service later

Keep them modular even if they begin in one deployable service.

## 8.2 Source adapters matter more now

Because truth lives outside the product, adapters are a first-class concern.

### Viewscape adapters
- local content repo adapter
- markdown parser
- YAML/JSON registry loader
- artifact link resolver

### GuideRail adapters
- git repo adapter
- code parser/indexer
- docs-in-repo reader
- generated-artifact writer-back-to-repo
- commit/revision context resolver

This adapter layer is part of the real product design, not an afterthought.

---

## 9. Persistence and data storage recommendation

## 9.1 Use PostgreSQL for product-side persistence

This is the right default for:
- workspaces
- source registrations
- import/index jobs
- provenance manifests
- user annotations
- traversal sessions
- cached derived metadata
- export job records

### Important nuance

PostgreSQL is **not** the authority for external truth.

It is the product-side persistence layer for:
- metadata
- derived indexes
- caches
- job history
- user state

## 9.2 Use jsonb intentionally

The product has many semi-structured payloads:
- graph metadata
- layout metadata
- scene payloads
- import/index manifests
- provenance chains
- layer-specific rendering hints
- evidence refs
- adapter payloads

PostgreSQL `jsonb` is a strong fit for this kind of mixed structure.

## 9.3 Use pgvector only when retrieval becomes real

Do not bolt vector search on from day one just because it sounds modern.

Add pgvector if you actually need:
- semantic search across research docs
- similarity search across routes
- retrieval over imported corpus content
- evidence or design snippet recall

## 9.4 DuckDB is optional later

DuckDB can be a useful companion for:
- local analytics
- transformation pipelines
- dataset shaping
- ad hoc research analysis

But it should not replace PostgreSQL as the system of record for product-side state.

---

## 10. Annotation and rich-content recommendation

## 10.1 Use Tiptap for notes and rich annotation

This product will likely need rich content attached to:
- nodes
- journeys
- controls
- evidence
- research items
- derived walkthrough steps

Tiptap is a strong choice because it is:
- headless
- flexible
- extension-driven
- built on ProseMirror
- suitable for embedding structured editing into a serious product UI

## 10.2 Use Yjs + Hocuspocus later for live collaboration

Do not start with real-time collaboration unless it is part of the first wedge.

But if collaboration becomes important, Yjs + Hocuspocus is the right upgrade path.

---

## 11. Testing, telemetry, and developer workflow recommendation

## 11.1 Developer workflow

Use:
- **pnpm workspaces** for dependency management
- **Turborepo** for build/test orchestration across packages
- **Biome** for formatting/linting in JS/TS packages
- **Vitest** for package-level and utility tests

## 11.2 UI and integration testing

Use:
- **Storybook** for map panels, step panels, simulator scenes, and reusable widgets
- **Playwright** for guided-route, source-attachment, and cross-panel traversal tests

For this product, end-to-end route integrity matters a lot. Playwright should come in early.

## 11.3 Telemetry

Add **OpenTelemetry** baseline instrumentation early enough that you can observe:
- source attach/detach events
- index/rebuild jobs
- traversal state transitions
- layer switches
- route completion
- export generation
- repo analysis runs

This is worth doing earlier than teams usually think.

---

## 12. Recommended repository / package shape

A practical structure:

- `apps/web` → Next.js shell
- `apps/api` → FastAPI service entrypoint and API deployment wrapper
- `packages/kernel` → canonical entities, provenance model, projection contracts
- `packages/source-adapters` → corpus and repo adapter contracts and implementations
- `packages/indexing` → derivation, normalization, rebuild logic
- `packages/graph-ui` → React Flow nodes/edges, ELK integration
- `packages/route-engine` → XState machines
- `packages/process-view` → bpmn-js adapters
- `packages/diagram-export` → Mermaid/D2 projection/export
- `packages/annotations` → Tiptap integration
- `packages/contracts` → shared Zod schemas and generated contract helpers
- `packages/telemetry` → tracing hooks, event naming, instrumentation helpers
- `packages/test-utils` → scenario fixtures, traversal mocks, helpers

You could rename `apps/api` to `services/api` if you prefer a service-oriented convention. The important thing is consistency.

---

## 13. Sequencing recommendation

The new requirements change sequencing.

You should not start with only a pretty canvas.

## 13.1 Foundation / MVP kernel

Build first:
- Next.js
- React Flow
- ELK
- XState
- Zustand
- TanStack Query
- Zod
- FastAPI
- PostgreSQL/jsonb
- source adapter contracts
- provenance model
- index/rebuild pipeline skeleton

This is the real foundation.

## 13.2 Early engineering discipline

Add very early:
- Storybook
- Playwright
- OpenTelemetry baseline
- Vitest

These are not “nice to have later” if you want the system to stay coherent.

## 13.3 Second wave

Add next:
- bpmn-js
- Tiptap
- Mermaid/D2 export generation
- richer repo analysis capabilities
- richer corpus ingestion and linking

## 13.4 Later wave

Add later if earned:
- Yjs/Hocuspocus
- pgvector
- semantic retrieval
- advanced collaboration
- ML-assisted enrichment and recommendation layers

---

## 14. Anti-patterns to avoid

Avoid these traps:

- building a custom graph runtime from scratch
- treating React Flow as the domain model
- using Mermaid as the main runtime surface
- forcing every projection into BPMN
- stuffing orchestration and UI state into one mega-store
- turning Viewscape into a manual CMS
- turning GuideRail into a shadow design repository
- storing durable GuideRail design artifacts only inside GuideRail instead of writing them back to the target repo
- losing provenance between source artifact and rendered traversal
- building a visually impressive shell before the source/index/rebuild model exists

---

## 15. Bottom-line recommendation

The strongest build stance is now this:

### Viewscape
Build it as:

**a navigable landscape built from curated source artifacts through a rebuildable canonical index**

### GuideRail
Build it as:

**a repo-attached walkthrough and projection engine that derives design views from code and writes durable artifacts back to the source repo**

### Shared architecture stance

Both should share:
- one product shell
- one derivation/provenance kernel
- one traversal/orchestration model
- one projection model
- multiple source adapters

That keeps the custom code where it belongs and avoids the bubble-gum-and-duct-tape trap.

The firmest architectural warning remains:

- **Mermaid is not your app runtime**
- **React Flow is not your workflow engine**
- **the product is not the enduring source of truth**

That separation is what will keep this build clean, modern, and credible.
