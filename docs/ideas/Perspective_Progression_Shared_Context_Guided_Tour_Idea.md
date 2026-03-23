# IDEA — Perspective Progression, Shared Context, and Guided Tour Participation Model

## Context

As the product vision has expanded, a flat list of unrelated perspectives has started to feel semantically weak.

Earlier thinking treated many views as sibling perspectives:
- Overview
- Value Stream
- Journey
- Process
- Activity
- Architecture
- Components
- Sequence
- Risk Controls
- Provider

That made the product harder to explain and weakened the mental model for:
- when a user should enter each view
- how the views relate to each other
- how the canvas should change as the user moves from business understanding into technical understanding
- how storytelling and guided routes should move through the same world without feeling like arbitrary tab switching

A stronger organizing idea has emerged:

> the product should support a deliberate progression from broad terrain, to stable business structure, to real path, to execution, to technical realization, to runtime interaction.

That progression matters, but it is not the whole point.

The more important intent is this:

> the product should preserve a **shared thread of context** while the user moves through that progression.

The user should be able to:
- keep the same current capability in view
- pop into another perspective to inspect that capability through a different lens
- return without feeling like they left the topic
- remain anchored to the same route, waypoint, or business moment even while changing representation

This is the real differentiator.

The product is not merely a set of diagrams.  
It is a coherent system of lenses over the same underlying moment.

This idea captures that richer model and proposes a **7-perspective progression** with:
- a clearer progression of understanding
- a stronger shared-context contract across perspectives
- family-level canvas modes where needed
- bounded-entry canvas behavior
- a future guided-tour model where participants can either follow the presenter or temporarily inspect the current moment through another lens and then return

This is not yet a final implementation plan. It is an organizing idea for how the product can stay coherent as the number of views grows.

---

## Core Intent

The product should not be understood as a set of disconnected perspectives or diagram types.

Its real purpose is to let a user hold onto a **shared thread of context** while moving through different levels of understanding.

That shared thread may include:
- the current domain
- the current capability
- the current journey
- the current process
- the current story route or waypoint
- the current provider or evidence context
- the current business objective being explained

The user should be able to move into another perspective without feeling like they have left the subject and entered a different application.

This is the most important design principle:

> A perspective switch should mean “show me this same moment through another lens,” not “take me somewhere else.”

That principle should govern:
- the product model
- the canvas model
- the route model
- the future multi-participant guided-tour model

---

## Product Thesis

The product should support a progression from broad terrain, to stable business structure, to business path, to execution, to technical realization, to runtime interaction.

But this progression is not meant to be a rigid one-way staircase.

It is meant to be a **shared contextual ladder**.

That means:
- the user can descend deeper into detail
- the user can step sideways into another lens
- the user can return to a previous level
- and throughout that movement, the product keeps the current business thread intact

This is what makes the product more powerful than:
- a static map
- a set of unrelated diagrams
- or a presentation deck

It is a coherent system of views over the same current moment.

---

## Core Insight

The product is trying to explain two interlocked realities:

### Business-facing understanding
- what space we are in
- what business area is involved
- what capability is being exercised
- what path a user or operator is taking
- how that path fits inside a larger value-producing flow

### Technical realization
- how that path is executed
- what technical structure supports it
- what participating parts matter in this context
- how those parts interact at runtime

The product should not feel like a bag of perspectives.
It should feel like a progression of understanding where each new perspective answers a more specific question about the same thread.

---

## The 7 Perspectives

The product should organize itself around these seven perspectives:

1. **Landscape**
2. **Domain / Capability**
3. **Journey**
4. **Process**
5. **Architecture**
6. **Components / System**
7. **Sequence**

### Important clarification
Some important concepts remain first-class in the model, but are better treated as **modifiers, overlays, contextual layers, or family-internal modes**, not equal sibling perspectives:
- **Value Stream**
- **Provider**
- **Risk Controls**
- **Activity / Decision Logic**

This is an intentional move to avoid flattening every meaningful concept into another top-level tab.

---

## Full Progression

### Recommended progression

**Landscape → Domain / Capability → Journey → Process → Architecture → Components / System → Sequence**

With the following important rule:

- **Value Stream is not a perspective**
- **Value Stream is a framing modifier on Journey**

### Why this works

This progression gives the user a natural descent:

- broad terrain
- stable business structure
- real business/user path
- operational execution
- technical structure
- participating system parts
- runtime interaction

But the product should also make it easy to move *sideways* without losing the current thread.

For example:
- from Journey into Process for the same capability and path
- from Process into Architecture for the same current execution context
- from Architecture into Components / System for the same selected slice
- from Components / System into Sequence for the same runtime scenario
- from Sequence back to Process or Journey without losing the current business anchor

That continuity is more important than the abstract progression itself.

---

## Shared Context Contract

A perspective switch should preserve the current thread whenever possible.

The product should attempt to preserve:
- active domain
- active capability
- active journey
- active process
- active route / waypoint
- active provider or evidence reference
- the current business objective in play

A switch from one perspective to another should *not* reset the user into a fresh unrelated diagram unless the selected perspective truly cannot represent the current context.

### Examples

#### Example 1
The user is viewing:
- Capability: Money Movement
- Journey: Send ACH Transfer

If they switch from Journey to Process, they should land in:
- the Process that operationally executes that same Journey
- not in a generic unrelated process view

#### Example 2
The user is viewing:
- Capability: Account Opening
- Process: Account Opening flow

If they switch to Architecture, they should land in:
- the technical structure that supports that selected process and capability
- not in a generic architecture map with the thread lost

#### Example 3
The user is viewing:
- Route waypoint about a specific orchestration moment

If they switch to Components / System, they should still see:
- the participating technical parts for that same route moment
- not a fully different system context

This is the heart of the idea.

---

## Perspective Definitions

## 1. Landscape

### What question it answers
What world are we in?

### What it organizes
- broad terrain
- major clusters of meaning
- cross-domain relationships
- representative journeys
- light provider presence in context
- broad business framing before drill-down

### Purpose
Landscape is the entry perspective.
It provides the broadest orientation and prevents the user from falling directly into detail without context.

### Canvas behavior
Landscape should enter in a **bounded, summarized state**:
- major regions or boxes
- representative sub-elements
- simplified relationships
- no deep explosion of detail on first load

### Shared-context intent
Landscape should still preserve the user’s current route or topic context where possible.
If a user rises back up into Landscape while in the middle of a route or capability discussion, the broader terrain should still indicate:
- where that topic sits
- what region of the world the current thread belongs to
- what larger story the current discussion is inside

### Why it matters
Without Landscape, the product becomes too immediate and too local.
Landscape gives the user the sense of the whole before the parts.

---

## 2. Domain / Capability

### What question it answers
What stable business structure are we in?

### What it organizes
- domains such as:
  - Customer
  - Accounts
  - Payments
  - Cards
  - Identity & Access
  - Risk & Fraud
- capabilities such as:
  - Customer Onboarding
  - Account Opening
  - Money Movement
  - Authentication
  - Card Management

### Purpose
This perspective anchors the business structure of the space.
It is the durable business layer that connects the broader terrain to the deeper views below.

### Why Domain and Capability are paired
They are closely related enough that they do not need to be separated into two different top-level perspectives in this model.

This perspective can still support internal states or drill-down behavior such as:
- domain-first view
- domain-expanded capability view
- selected capability context

But it should be treated as one perspective family or one stage in the overall progression.

### Canvas behavior
Domain / Capability should remain bounded on entry:
- domain boxes or regions
- representative capabilities
- light relationships to neighboring domains
- clear drill-down affordances

### Shared-context intent
This perspective should be one of the strongest anchors in the whole system.
Most other perspectives should try to preserve the current selected capability when switching in and out.

### Why it matters
This is the stable business anchor of the product.

---

## 3. Journey

### What question it answers
What real path is being taken by the user, operator, or business participant?

### What it organizes
- Journey
- ordered Steps
- focal capabilities touched by the path
- supporting terrain elements
- representative stage groupings

### Important rule
**Journey is the real business or end-user path through the system.**
It is not the guided storytelling route of the product.

### Value Stream relationship
**Value Stream should modify or frame Journey, not become its own perspective.**

Value Stream answers:
- what larger value-producing flow is this journey part of?

Journey answers:
- what specific path is being taken?

So the relationship is:

> Value Stream frames the path. Journey shows the path.

### Canvas behavior
Journey should likely begin bounded:
- grouped route stages
- representative steps
- visible progression
- expandable into fuller step detail

### Shared-context intent
Journey should preserve the current capability and route context wherever possible.
If the user is in the middle of a guided route and switches to Journey, they should see the current business path for that same route moment.

### Why it matters
Journey is the core business path perspective and the natural place to connect:
- user movement
- business movement
- value context
- storytelling and route design

---

## 4. Process

### What question it answers
How is the Journey operationally executed?

### What it organizes
- Process
- ProcessStages
- operational flow
- stage groups
- handoffs
- execution logic
- linked capability and journey context

### Purpose
Process is the execution bridge between the business path and the technical layers that follow.

It is where the user begins to see how the path is actually carried out, not just what the path is.

### Canvas behavior
Process should enter bounded:
- stage groups
- representative tasks
- light flow lines
- deliberate expansion into fuller detail

### Shared-context intent
Process should be the strongest bridge perspective in the entire model.

When the user moves:
- from Journey into Process
- or from Process into Architecture

the product should preserve the current thread as cleanly as possible.

Process is where the current business moment should begin to expose the machinery beneath it without abandoning the business anchor.

### Why it matters
Without Process, the jump from Journey to technical structure is too abrupt.
Process is the natural execution layer between business path and technical realization.

---

## Process Family Modes

Process is also the correct home for concepts that were previously drifting toward becoming separate perspectives.

### A. Activity / Decision Logic
Activity should be treated as a **Process mode**, not a top-level sibling perspective.

Why:
- it is still about execution
- it reveals branch logic, decisions, alternate outcomes, forks/joins
- it does not need to become another equal sibling tab

### B. Risk Controls
If the structure is the same and only the emphasis changes, Risk Controls should also be a **Process mode or overlay**.

Risk Controls may highlight:
- control points
- risk checks
- policy gates
- ownership
- evidence / thresholds

So the Process family may support:
- Operational Flow
- Activity / Decision Logic
- Risk Controls

This is much cleaner than a flat perspective pile.

---

## 5. Architecture

### What question it answers
What technical structure supports this capability, journey, and process?

### What it organizes
- systems
- services
- boundaries
- technical zones
- structural relationships
- technical realizations of the selected business context

### Purpose
Architecture is the broader static technical structure view.

It answers:
- what systems exist?
- how are responsibilities partitioned?
- what structural technical shape supports the selected path?

### Canvas behavior
Architecture should begin bounded:
- technical zones or groups
- representative systems/services
- simplified inter-group relationships
- user expands to see more detail

### Family concept
Architecture should likely be a family rather than a single flat diagram.

Possible modes:
- Logical
- Deployment

### Important distinction
Logical and Deployment are often materially different diagram structures.
They should not be forced to pretend they are the same diagram with light emphasis changes.

### Shared-context intent
Architecture should preserve the current business anchor, not erase it.
The user should feel that they are still looking at the same capability, journey, or process — just now through the technical structure that realizes it.

### Why it matters
Architecture is the first technical-structure view in the progression.

---

## 6. Components / System

### What question it answers
What participating technical parts matter for this selected context?

### What it organizes
- scenario-scoped participating systems/components
- interfaces
- ports/adapters where relevant
- the technical cast of characters for the selected path/process

### Purpose
Components / System is the bridge between:
- broad static technical structure
- fully realized runtime interaction

This layer narrows Architecture down to the participating technical parts for the specific context the user is exploring.

### Important distinction
Architecture is broader and more static.

Components / System is:
- more concrete
- more scenario-scoped
- more specific to the selected path/process

### Canvas behavior
Components / System should also begin bounded:
- component groups or system boxes
- representative internals
- simplified relationships
- expansion into fuller participating-part detail

### Shared-context intent
This perspective should let the user inspect the technical cast of the current business moment without jumping all the way into runtime sequence.
It should be the technical “who is involved here?” view.

### Why it matters
Without this layer, the jump from Architecture to Sequence can feel too abrupt.

---

## 7. Sequence

### What question it answers
How do the participating technical elements interact at runtime?

### What it organizes
- participants / lifelines / interfaces
- messages
- request/response flow
- ordered runtime interaction
- runtime path tied back to the same selected business context

### Purpose
Sequence is the deepest and most dynamic technical view.

It is the culmination of the progression:
- business meaning
- business path
- execution
- technical structure
- participating parts
- runtime interaction

### Canvas behavior
Sequence should still enter in a bounded or summarized way:
- participant groups or collapsed lifelines
- representative messages
- expansion into fuller runtime trace

### Important rule
Sequence is not a generic fallback diagram system.
It is a disciplined runtime interaction perspective tied to the same selected context.

### Shared-context intent
Sequence should never feel like “we left the story and entered a different technical tool.”
It should feel like the same current moment, rendered as runtime interaction.

### Why it matters
Sequence is the most detailed runtime lens in the system.

---

## Contextual and Cross-Cutting Concepts

## Value Stream
Value Stream is **not** its own top-level perspective in this model.

It should instead:
- frame Journey
- shape story and route context
- group related journeys
- appear in overview and breadcrumb/detail context
- support the “why” behind the path

## Provider
Provider remains a first-class entity in the model, but not a primary sibling perspective.

Providers should appear:
- in context
- inside Domain / Capability, Journey, Process, Architecture, and Components views
- as badges, detail context, comparisons, or route callouts

## Risk Controls
Risk Controls belong under Process when the process topology is unchanged.

## Activity
Activity belongs under Process as a decision/branching mode.

---

## Bounded Canvas Principle

A major cross-perspective design rule should be:

> Every perspective should enter through a bounded, summarized state before allowing full detail expansion.

This applies across all seven perspectives.

### Why
This avoids:
- visual shock
- line explosion
- weak hierarchy
- poor presentation flow

### What bounded means
A bounded view should show:
- major containers or sections
- representative sub-elements
- summary counts or descriptors
- simplified relationships
- clear expansion affordance

This gives the product:
- stronger teaching flow
- clearer first impression
- better presenter control
- cleaner exploration

### Shared-context implication
Bounded entry does not mean generic entry.
Each bounded entry state should still preserve the user’s current thread and show the selected moment at the right level of abstraction.

---

## Canvas Modes and Secondary Switcher

The product likely needs two levels of switching:

## 1. Perspective Switcher
The main conceptual lens:
- Landscape
- Domain / Capability
- Journey
- Process
- Architecture
- Components / System
- Sequence

## 2. Canvas Mode Switcher
The diagram grammar inside a perspective family where relevant.

Examples:

### Process
- Operational
- Activity / Decision
- Risk Controls

### Architecture
- Logical
- Deployment

### Components / System
This may or may not need additional modes depending on how much internal variety is truly useful.

Not every perspective needs multiple modes.

### Design rule
> Perspective chooses the meaning; canvas mode chooses the diagram.

### Shared-context implication
Changing canvas mode should feel even lighter than changing perspective.
It should preserve the same current moment with even stronger continuity.

---

## Guided Tour and Storytelling Implications

This 7-perspective progression supports guided storytelling much better than a flat perspective list.

A Story Route can move through the same world in a controlled descent:
- broad terrain
- stable business structure
- journey framed by value stream
- process execution
- technical structure
- participating components
- runtime interaction

That creates a very strong explanatory arc.

But the deeper intent is even stronger:

> the guided route should preserve a shared thread across every perspective transition.

A route waypoint should not just say:
- “now go to Sequence”

It should mean:
- “now show this same moment through its runtime interaction lens”

That is a much better product.

---

## Future Guided Tour Participant Model

This progression also supports a future guided-tour model where:

- a presenter or tour leader is moving through the route
- participants may follow the presenter exactly
- participants may softly detach and inspect the same current moment through another perspective or mode
- participants can return to the presenter at any time

This is valuable because mixed audiences may care about different depths at the same moment:
- executive may stay in Landscape or Journey
- risk/control person may inspect Process / Risk Controls
- architect may inspect Architecture, Components, or Sequence

The same shared story context can still be preserved.

### Presenter state
The canonical shared route state should include:
- active route
- active waypoint
- current business anchor
- current perspective
- current canvas mode
- current viewport/focus

### Participant local state
A participant should be able to:
- follow the presenter
- or softly detach while remaining anchored to the same route moment

While detached, the participant may change:
- perspective
- canvas mode
- viewport
- local detail selection

But should still remain tied to:
- the same route
- the same waypoint
- the same business moment

### Return to presenter
A simple control should restore:
- presenter route
- presenter waypoint
- presenter perspective
- presenter canvas mode
- presenter viewport/focus

### Key principle
> The presentation has a shared route state, but each participant may temporarily inspect the same current moment through their own lens and then return to the shared thread.

This is a major future differentiator.

It makes the product more than:
- a presentation deck
- a diagram browser
- or a static guided route

It becomes a shared guided environment with personal inspection freedom.

---

## Recommended Final Model

## The 7 perspectives
1. Landscape
2. Domain / Capability
3. Journey
4. Process
5. Architecture
6. Components / System
7. Sequence

## Key modifiers and family-internal modes
- Value Stream = Journey framing modifier
- Activity = Process mode
- Risk Controls = Process mode or overlay
- Provider = contextual first-class layer across views

## Primary design principle
Perspective switches and mode switches must preserve a shared thread of context so the user can inspect the current moment through another lens without losing the topic.

---

## Best One-Line Summary

> The product should support a seven-perspective progression from Landscape, to Domain / Capability, to Journey framed by Value Stream, to Process, to Architecture, to Components / System, and finally to Sequence — all while preserving a shared thread of context so users and future guided-tour participants can move across lenses without losing the current moment.

---

## Final View

This model is stronger than the earlier flatter perspective list because it creates:
- a true progression of understanding
- a clearer place for Journey and Value Stream
- a disciplined home for Activity and Risk Controls
- a better bridge from Process into technical structure
- a clearer role for Components / System before Sequence
- a stronger shared-context contract across perspectives
- a more teachable and more explorable product
- a strong future foundation for presenter-led guided tours with participant follow/detach behavior

This feels like the clearest and most complete articulation of the perspective system so far.
