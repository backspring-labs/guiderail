# IDEA: Viewscape + GuideRail

## Status
Draft — locked naming and initial segmentation

## Working decision
The product family is now segmented as:

- **Viewscape** — the terrain discovery, systems mapping, and layered representation product
- **GuideRail** — the guided journey, turn-by-turn traversal, and UI walkthrough product

These are not two totally separate inventions. They are two surfaces built on top of a **shared kernel**.

That shared kernel is the actual strategic asset.

---

## 1. Core product thesis

Complex ecosystems, systems, and workflows are hard to understand because people are forced to jump between disconnected representations:

- placemat or landscape maps
- architecture diagrams
- process diagrams
- sequence diagrams
- user journeys
- application screens
- notes and research docs
- controls and evidence references

Most tools show one representation at a time. The user loses their place every time they switch context.

The opportunity here is to create a shared navigation runtime that preserves the user’s current location while allowing them to shift representations without losing context.

In simple terms:

- **Viewscape** helps the user understand the terrain.
- **GuideRail** helps the user follow a route through that terrain.

The user should be able to:

- zoom in and out on a system map
- select a route or journey
- see turn-by-turn progression through the steps
- switch layers without losing current position
- drop into a street-view style UI simulator for the active step
- inspect related research, annotations, risks, and controls

That continuity is the heart of the idea.

---

## 2. Product segmentation

## 2.1 Viewscape

### Purpose
Viewscape is the discovery and orientation product.

It is used to explore a domain, ecosystem, system, product landscape, or architecture terrain.

### Primary user jobs
- understand a space quickly
- see major components and categories
- inspect relationships between actors, systems, vendors, capabilities, or controls
- compare alternate views of the same terrain
- research how a journey traverses the landscape
- educate internal teams, customers, prospects, or stakeholders

### Typical starting point
The user begins broad.

Examples:
- show me the major players in this ecosystem
- map the payment flow landscape
- show how a banking account opening journey crosses systems
- let me explore this product architecture by domain or capability
- show me how these components relate before we choose a path

### Core experience
- map-first experience
- layered visual representations
- progressive zoom and detail reveal
- research and annotation surfaces
- path highlighting once a journey is selected
- persistent “you are here” state as the user changes representation

### What makes Viewscape distinct
Viewscape is not just a static map. It is a dynamic terrain explorer that can preserve route and context as the user moves between different lenses.

---

## 2.2 GuideRail

### Purpose
GuideRail is the journey traversal and walkthrough product.

It is used once the user wants to move through a defined path step by step.

### Primary user jobs
- walk through a process or journey in order
- understand what happens at each step
- know where they are now, what just happened, and what comes next
- see the application screen or simulated interface for the active step
- inspect alternate diagram representations of the same step
- eventually review risks, controls, and evidence associated with the path

### Typical starting point
The user begins with a journey or route.

Examples:
- walk me through account opening
- show the turn-by-turn path for a card dispute
- trace a user through this onboarding flow
- show what the operator should do on each screen
- walk through this control process and show where the checks occur

### Core experience
- turn-by-turn directions panel
- route highlighting on the main map
- current step state
- street-view style UI simulator for the active step
- previous/current/next step framing
- layer switching that preserves the active location in the journey

### What makes GuideRail distinct
GuideRail is not just a process diagram viewer. It is a guided navigation experience that keeps the user oriented while translating abstract flows into concrete interaction and understanding.

---

## 2.3 Relationship between the two

The cleanest positioning is:

- **Viewscape** = discover the terrain
- **GuideRail** = navigate the journey

Viewscape is the broader orientation surface.
GuideRail is the guided traversal surface.

Early on, these could be delivered as:

### Option A — one product, two modes
- Viewscape is the overall product shell
- GuideRail is a focused guided journey mode inside it

### Option B — one platform, two products
- Viewscape and GuideRail are separate branded surfaces on the same kernel

### Recommendation
Start with **one codebase and one platform shell**, even if the concepts are productized separately later.

The shared kernel and shared state model matter far more than separate chrome or separate repositories at the beginning.

---

## 3. Shared kernel thesis

The shared kernel is the part worth designing first.

It is the engine that allows the same underlying terrain and route to be experienced through multiple synchronized views.

This kernel can be thought of as:

**a contextual navigation runtime for complex systems**

### It must support:
- a canonical graph of the terrain
- journeys as ordered paths through that terrain
- view layers that project the terrain differently
- a current-location model
- route progression state
- scene rendering for the active step
- synchronized updates across all surfaces

### In plain language
The kernel must answer:

- where is the user right now?
- what route are they following?
- what is the current step?
- what should be highlighted on the map?
- what should be shown in the directions panel?
- what should be rendered in the UI simulator?
- what does this same point look like in another diagram layer?

That is the actual system underneath both products.

---

## 4. Shared interaction model

The core interaction model has four major surfaces.

## 4.1 Main canvas = the map
The map is the primary spatial canvas.

It should support:
- pan and zoom
- persistent current location marker
- selected route highlighting
- node and edge selection
- progressive detail as the user zooms
- different layer representations without losing route state

This is the “terrain” surface.

## 4.2 Directions panel = turn-by-turn navigation
The directions panel is the explicit journey guide.

For each step it should show:
- step number and label
- current system, actor, or node
- what happens at this step
- why the step matters
- the expected user or system action
- previous and next step context
- optional control, evidence, or research metadata

This is the “route” surface.

## 4.3 Street view = UI simulator
The street-view metaphor is one of the strongest parts of the concept.

For the active step, the system should show:
- the relevant app or screen state
- a highlighted interaction area
- what the user should do here
- what the system does in response
- a caption or annotation that grounds the step

This is what makes the walkthrough tangible.

It translates:
- from abstract path
- into concrete interaction

## 4.4 Layer switcher = alternate representations
The user should be able to switch representation without losing place.

Possible layers include:
- landscape / ecosystem map
- capability map
- architecture map
- business process flow
- user journey flow
- sequence diagram
- activity diagram
- control / risk overlay
- evidence / research overlay

The key behavior is:

**show me this same location from a different lens**

That is more powerful than simply showing a different static diagram.

---

## 5. Non-negotiable design principle

### The user must never lose their place.

No matter whether the user:
- zooms
- pans
- switches layers
- opens a side panel
- enters the UI simulator
- inspects a provider or component
- moves to the next step
- jumps backward in the journey

…the system must preserve and reconcile:
- current route
- current step
- current selected node or edge
- current viewport anchor
- current active layer
- current simulator scene

This continuity is probably the most important behavioral requirement in the whole concept.

Without it, the product collapses back into a set of disconnected viewers.

---

## 6. Canonical domain model

The shared kernel should start from a canonical model that is flexible enough to support both discovery and walkthrough.

## 6.1 Core entities

### Node
Represents a thing on the map.
Examples:
- vendor
- system
- service
- capability
- actor
- control point
- data object
- screen
- process step

Suggested base fields:
- id
- type
- label
- description
- tags
- domain/category
- metadata
- coordinates or layout refs by layer

### Edge
Represents a relationship or transition.
Examples:
- integration
- dependency
- message flow
- sequence transition
- user progression
- control linkage
- research linkage

Suggested base fields:
- id
- from_node_id
- to_node_id
- type
- label
- directionality
- metadata

### Journey
Represents an ordered path through the graph.
Examples:
- account opening
- card activation
- fraud review
- pay/no-pay review
- onboarding
- service request flow

Suggested base fields:
- id
- label
- description
- ordered step refs
- entry conditions
- exit conditions
- tags

### Step
Represents a specific traversable step in a journey.
Suggested base fields:
- id
- journey_id
- sequence_number
- node_ref
- edge_ref
- title
- narrative
- actor/system
- expected action
- next_step_refs
- evidence refs
- control refs
- simulator scene ref

### Layer
Represents an alternate projection of the same terrain.
Suggested base fields:
- id
- type
- label
- rendering rules
- eligible node/edge types
- layout strategy
- visibility rules

### Scene
Represents what should be shown in the simulator or detail panel for a step.
Suggested base fields:
- id
- step_id
- ui_state_ref
- focus_targets
- instructional copy
- transitions
- annotations

### Annotation
Represents human or generated context attached to a node, edge, step, or journey.
Examples:
- research note
- commentary
- vendor observation
- risk note
- control note
- design rationale
- implementation note

### EvidenceRef
Represents links to supporting artifacts.
Examples:
- document snippet
- screenshot
- design spec
- source code ref
- control evidence ref
- API spec
- external research source

---

## 7. Shared kernel services

These are the first conceptual services worth defining.

## 7.1 Graph service
Responsible for:
- loading and querying nodes and edges
- filtering by layer, type, or domain
- returning neighborhood context
- supporting zoom-level detail retrieval

## 7.2 Journey service
Responsible for:
- loading journeys
- calculating step order
- resolving branches or alternate paths
- tracking current step and progression state
- supporting reroute when the user jumps context

## 7.3 View projection service
Responsible for:
- translating canonical graph state into a specific layer representation
- mapping a selected step or node into coordinates and highlights in each layer
- preserving active context while changing representation

## 7.4 Scene service
Responsible for:
- resolving the active UI simulator scene for the current step
- returning focus targets and instruction overlays
- synchronizing simulator state with route progression

## 7.5 Context synchronization service
Responsible for:
- maintaining the user’s active location across all views
- reconciling route state, map state, panel state, and scene state
- preventing context loss during layer switches or viewport changes

## 7.6 Annotation and evidence service
Responsible for:
- attaching notes, research, risks, and controls to map elements and steps
- supporting overlays and side panels
- preserving traceability into future deeper capabilities

---

## 8. UX shell proposal

A strong initial shell could look like this:

### Top bar
- workspace / dataset selector
- product mode toggle: Viewscape / GuideRail
- layer selector
- search
- filters

### Main center canvas
- map view
- persistent route highlighting
- zoom/pan
- selected object emphasis

### Left panel
- terrain explorer / search / category filters / object library
- optionally collapsible

### Right panel
Dynamic based on mode:

#### In Viewscape mode
- object details
- related components
- research notes
- linked journeys

#### In GuideRail mode
- turn-by-turn directions
- previous / current / next step
- route controls
- progress status

### Bottom panel or modal
- simulator / street view
- or tabbed simulator panel

This lets the map remain primary while supporting detail without losing orientation.

---

## 9. MVP strategy

Do not start by building a generic mega-platform.

That would be the elegant way to waste months.

Start with a constrained wedge that proves the kernel.

## 9.1 MVP goal
Prove that a user can:
- load a terrain
- select a journey
- see the route on the map
- step through turn-by-turn guidance
- switch layers without losing location
- view a simulator scene for each step

If those behaviors work, the kernel is real.

## 9.2 Narrow initial domain
Pick one domain with enough richness to be interesting but small enough to control.

Good candidates:
- fintech account opening
- card dispute flow
- payment authorization flow
- a SaaS onboarding flow
- a developer platform signup and API key issuance flow

The actual domain matters less than having:
- a meaningful map
- a defined route
- a handful of alternate layers
- 5–12 coherent simulator scenes

## 9.3 Initial layers for MVP
Do not implement every representation at first.
Start with 3.

Recommended first 3:
- ecosystem / architecture map
- journey / process layer
- sequence / interaction layer

That is enough to prove the switching behavior.

## 9.4 Initial simulator scope
Keep the simulator lightweight at first.

MVP simulator can be:
- static mocked screens with hotspot highlights
- step-specific overlays
- simple state transitions

It does not need to be a full live app simulation on day one.

---

## 10. How to begin building Viewscape and GuideRail

## 10.1 Phase 0 — product framing and model definition
Before serious coding, define:
- canonical entity model
- journey schema
- layer schema
- scene schema
- context synchronization rules
- UX shell flows

Deliverables:
- architecture sketch
- data model spec
- interaction flow doc
- a sample dataset in JSON/YAML

This is the minimum design work needed to avoid building disconnected UI pieces.

## 10.2 Phase 1 — shared kernel prototype
Build the minimum shared runtime.

Scope:
- graph loader
- map canvas
- node/edge rendering
- journey selection
- route highlighting
- step progression
- persistent current-location state
- basic layer switching

Goal:
Prove the state model, not polish the visuals.

## 10.3 Phase 2 — GuideRail prototype
Add the journey walkthrough behaviors.

Scope:
- directions panel
- previous/current/next framing
- route progression controls
- current step emphasis on map
- simple simulator scene panel

Goal:
Prove turn-by-turn guidance and map/simulator synchronization.

## 10.4 Phase 3 — Viewscape enrichment
Add the richer discovery behaviors.

Scope:
- search and filtering
- category views
- object detail panels
- research annotations
- linked journeys
- alternate domain lenses

Goal:
Prove that the same underlying terrain can support exploratory use and not just guided traversal.

## 10.5 Phase 4 — representation expansion
Add more layers.

Potential next layers:
- activity diagram view
- capability view
- control overlay
- evidence overlay
- research heatmap
- implementation traceability view

Goal:
Increase value without breaking kernel simplicity.

---

## 11. Build approach recommendation

### Recommendation: one repo, one platform shell, modular surfaces

Do not split into separate product repos first.

Recommended structure:
- shared kernel package
- shared data model package
- map renderer package
- simulator package
- Viewscape surface
- GuideRail surface

This can live in:
- one monorepo
- or one app repo with modular packages

Why this is better initially:
- context sync logic stays centralized
- the canonical model evolves once
- the route/map/scene coupling stays coherent
- the layer projection logic is not duplicated
- product decisions remain reversible longer

Only split later if usage or commercial packaging truly requires it.

---

## 12. Technical starter architecture

This does not need to be fancy at first.

A practical first build could use:
- React or Svelte front-end shell
- a graph/canvas library for rendering the map
- JSON/YAML dataset definitions for terrain, journeys, and scenes
- a lightweight local state store for context sync
- mocked UI scenes for street-view simulation

Suggested technical concerns to isolate early:
- rendering engine
- state management
- schema validation
- layer projection mapping
- route progression logic
- simulator scene definitions

If done well, the first version can be data-driven long before it is AI-driven.

That is good.

AI can be added later for:
- route generation
- annotation generation
- research synthesis
- dynamic journey explanations
- future code-to-process traceability

But the first real moat is the kernel and interaction model, not AI magic dust.

---

## 13. Strategic sequencing choices

There are three viable sequencing strategies.

## Option 1 — GuideRail first
Best when you want to prove the strongest differentiated behavior fast.

Advantages:
- most tangible demo
- clearest “wow” moment from map + directions + UI simulator
- strongest wedge for walkthrough, training, and process review

Risk:
- discovery and research value may lag behind early on

## Option 2 — Viewscape first
Best when you want broad terrain discovery and strategic storytelling first.

Advantages:
- easier to seed with landscape maps and research
- broader category appeal early
- useful before full route/simulator maturity

Risk:
- can drift into “pretty placemat map” territory if the route kernel is delayed

## Option 3 — kernel first, then GuideRail wedge, then Viewscape enrichment
This is the best balanced option.

Recommended order:
1. define the kernel
2. build minimal map + route + state sync
3. add GuideRail turn-by-turn walkthrough
4. enrich into fuller Viewscape discovery experience

This gives you:
- a real platform foundation
- a strong demo wedge
- a clear path into the broader terrain product

---

## 14. How the two products converge over time

Longer term, the relationship can become very strong.

### Viewscape feeds GuideRail
- the user explores the terrain
- selects a domain or route
- launches guided traversal

### GuideRail feeds Viewscape
- the user is walking a route
- zooms out to inspect the larger terrain
- switches lenses to understand surrounding systems and alternatives

That bidirectional movement is powerful.

The products should feel like two ways of entering the same world.

---

## 15. Future expansion directions

Once the kernel is working, the next major expansion paths could include:

### Research-linked terrains
Attach notes, sources, competitor analysis, or domain research to nodes and paths.

### Controls and evidence overlays
Very strong future direction.
This allows the same route to highlight:
- control points
- decision thresholds
- monitoring responsibilities
- evidence references
- risk/control narratives

### Code-to-process traceability
Longer-term advanced capability.
Could link:
- route steps
- UI states
- process stages
- service interactions
- code modules
- test evidence

### Training and enablement mode
Use GuideRail as an onboarding/training system.

### Demo mode
Use the route + simulator metaphor as a polished product or solution storytelling experience.

### Design and architecture review mode
Use alternate layers to inspect system design from multiple lenses while preserving continuity.

---

## 16. Biggest risks

## Risk 1 — over-generalizing too early
Trying to build a universal graph/meta-platform before proving the core behavior.

### Mitigation
Pick one domain, one route set, three layers, and mocked scenes.

## Risk 2 — beautiful maps, weak guidance
A good-looking terrain explorer that lacks a real route experience.

### Mitigation
Prioritize step progression and context preservation early.

## Risk 3 — disconnected representations
Layers exist, but switching between them loses state or meaning.

### Mitigation
Treat context synchronization as a first-class kernel concern.

## Risk 4 — simulator scope explosion
Trying to build a full app simulator too soon.

### Mitigation
Use static or lightly stateful scene mocks first.

## Risk 5 — unclear commercial wedge
Trying to pitch both products at once before one wedge is sharp.

### Mitigation
Lead with the strongest demoable behavior: guided traversal over a mapped terrain.

---

## 17. Practical first milestone

A very reasonable first milestone would be:

### Milestone: “Map, route, and street view”

The user can:
- open a terrain map
- choose a journey
- see the route highlighted
- step forward and backward through directions
- watch the current location remain stable while switching layers
- see a corresponding mocked UI screen with a highlighted action area

That one milestone would validate the central concept better than a dozen slide decks.

---

## 18. Proposed initial deliverables

The next concrete artifacts worth creating are:

1. **Product segmentation brief**
   - Viewscape vs GuideRail
   - audience
   - value proposition
   - workflow relationship

2. **Kernel architecture note**
   - canonical model
   - shared services
   - context sync rules

3. **UX shell sketch**
   - map
   - directions panel
   - simulator panel
   - layer switching behavior

4. **Seed dataset spec**
   - sample nodes
   - edges
   - one journey
   - 6–10 steps
   - 3 layers
   - 6–10 simulator scenes

5. **MVP build plan**
   - phase 0 through phase 3
   - repo structure
   - technical stack
   - delivery checkpoints

---

## 19. Final recommendation

Lock in the segmentation as:

- **Viewscape** — terrain discovery and layered system understanding
- **GuideRail** — guided journey traversal and UI walkthrough

Treat them as two product surfaces on top of a single shared kernel.

Do not build them as separate disconnected apps first.

Design and prove the kernel behavior around this central promise:

**The user can move through a complex system visually, contextually, and step by step without losing their place.**

That is the real product.

Everything else is packaging.
