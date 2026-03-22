# PRD — Viewscape V3: Provider-Aware Guided Exploration Through Business Architecture Terrain

## Document Status

- **Product:** Viewscape
- **Version:** V3 PRD
- **Status:** Draft
- **Scope:** Post-MVP / successor to V2
- **Primary Audience:** Product, design, engineering, architecture, strategy
- **Predecessors:** Viewscape MVP plan, Viewscape V2 idea, prior Viewscape V2 PRD
- **Positioning:** Guided explorable map for business architecture, provider context, and process-aware understanding

---

## 1. Executive Summary

Viewscape V1 proves that a user can navigate **Domain → Capability → Journey** while switching **Perspectives** on a live terrain canvas without losing context.

Viewscape V2 expanded that vision toward:
- broader industry terrain
- provider-aware context
- process-aware exploration
- guided narrative routes

The V3 PRD tightens that direction into a clearer and more buildable release thesis:

> **Viewscape V3 turns the map into a guided explorable teaching surface by adding provider-aware context, process-aware understanding, and lightweight Story Routes with pause-and-return behavior.**

V3 intentionally avoids trying to prove too many product truths at once. It does not attempt to become:
- a market-map logo wall
- a slide authoring tool
- a full guided traversal product
- a route authoring studio
- a role-personalized platform

Instead, V3 focuses on one central product outcome:

> A user can explore business architecture terrain, understand provider participation in context, distinguish journey from process, and follow a lightweight guided route through the same explorable world without losing orientation.

---

## 2. Problem Statement

The MVP proves context-preserving navigation mechanics, but by itself it does not yet support:
- broader industry understanding
- provider-aware explanation
- process-aware interpretation
- guided teaching and discussion

The earlier V2 vision correctly identified those needs, but bundled too many ambitious bets into one release:
- broader landscape scale
- provider awareness
- process/journey progression
- narrative routes
- discussion mode
- audience framing

That creates delivery risk and product blur.

The problem V3 solves is narrower and sharper:

> Users need a way to understand provider-aware business architecture terrain and follow a guided educational path through it, without collapsing the product into either slideware or a full guided traversal tool.

---

## 3. Product Vision

Viewscape should become:

> **an explorable business architecture map with guided routes for teaching, discussion, and provider-aware understanding.**

The product should remain:
- explorable
- spatial
- business-architecture-centered
- context-preserving

The product should gain:
- provider context in the terrain
- stronger process understanding
- route-based storytelling
- lightweight pause / detour / return behavior

The product should not become:
- PowerPoint on a canvas
- a generic provider comparison matrix
- GuideRail with a different skin

---

## 4. V3 Product Goal

Viewscape V3 should evolve the product from:

> a context-preserving explorer of business architecture terrain

to:

> a provider-aware, process-aware, guided explorable map that supports lightweight Story Routes.

### V3 proof statement

Viewscape V3 proves that a user can:
1. start from provider-aware business architecture terrain
2. drill into Domain and Capability context
3. distinguish Journey from Process in the same terrain
4. follow a Story Route with destination and waypoints
5. pause for discussion, briefly explore, and return to the route without losing orientation

---

## 5. Primary Release Spine

V3 should be organized around a single release spine:

### 1. Provider-aware landscape
Show providers in context, not as top-level organizing objects.

### 2. Process-aware understanding
Clarify how system execution differs from journey meaning.

### 3. Lightweight Story Routes
Guide users through the same map using destination, waypoints, and pause/return behavior.

Everything else in the release should support these three goals.

---

## 6. Users and Audiences

### Primary users
- strategy and transformation teams
- product leaders
- architects and solution designers
- pre-sales / enablement teams
- internal teams learning the terrain
- executive presenters using the map to explain an idea

### Audience use cases
V3 should support explanation to different audiences, but only in a lightweight way.

Examples:
- executives need a route that emphasizes significance and control boundaries
- architects need a route that emphasizes systems and flow
- product leaders need a route that emphasizes capabilities and user outcomes

### V3 constraint
Audience is supported as **route metadata and authoring intent only**.

V3 does **not** include:
- adaptive audience-specific runtime behavior
- dynamic content rewriting by audience
- role-based route personalization

---

## 7. Core Product Principles

1. **Explorable world first**
   - the terrain remains the primary product surface

2. **Business architecture remains primary**
   - Domain and Capability remain the main organizing anchors

3. **Providers exist in context**
   - providers are never the top-level organizing model

4. **Journey and Process must stay distinct**
   - journey = outcome path
   - process = operational execution flow

5. **Storytelling is route-based, not slide-based**
   - routes move through the world instead of replacing it

6. **Pause and return is more important than rich presentation effects**
   - discussion support matters more than animation sophistication

7. **GuideRail boundary must remain clear**
   - Viewscape guides understanding of terrain
   - GuideRail guides stepwise traversal of a chosen path

8. **Context is never lost**
   - route progression, detours, perspective switches, and exploration must preserve orientation

---

## 8. Information Architecture

### Primary navigation progression

**Landscape → Domain → Capability → Provider / Journey / Process**

### Definitions

- **Landscape** = broad ecosystem terrain
- **Domain** = broad business area
- **Capability** = enduring business ability within a domain
- **Provider** = real participant in the space shown in context
- **Journey** = outcome-oriented path
- **Process** = operational execution flow
- **Perspective** = current viewing mode such as Overview, Architecture, Provider, Process, Journey, Control
- **Story Route** = a guided path through the same explorable terrain

### Intentional rule
Providers are visible only through domain/capability/journey/process/story context. They are not the primary top-level map taxonomy.

---

## 9. Major Features

## 9.1 Provider-Aware Terrain

### Description
Represent providers within the terrain in a way that preserves business architecture meaning.

### Required outcomes
- a user can see which providers participate in a selected capability
- a user can understand provider role in that capability space
- a user can see where a provider appears in a journey or process context
- provider visibility does not overwhelm domain/capability structure

### Allowed provider role examples
- capability participant
- orchestration layer
- rail/network participant
- scheme
- infrastructure participant
- specialist service provider
- interface/wallet layer

### Design rule
Providers are **embedded meaningfully** into the terrain. V3 must not become a logo wall.

### V3 non-goals
- no generic market map of all providers
- no arbitrary provider browsing outside context
- no provider ranking/scoring engine
- no full matrix comparison builder

---

## 9.2 Process-Aware Perspective

### Description
Strengthen Process as a real interpretation surface distinct from Journey.

### Required distinction

#### Journey answers:
What path is being taken toward an outcome?

#### Process answers:
How does the system operationally execute that path?

### Design consequence
- a journey may map to multiple process views
- a process view may support multiple journeys

### V3 requirement
A user must be able to select a capability and understand:
- the journey meaning
- the operational process meaning
- how they relate without collapsing into each other

### V3 non-goals
- no BPM suite behavior
- no generalized process modeling editor
- no arbitrary swimlane authoring
- no business process simulation engine

---

## 9.3 Story Routes

### Description
Introduce lightweight guided routes through the terrain for teaching, presentation, and discussion.

### Working definition
A Story Route is:
- an ordered path through the same terrain
- anchored to a destination objective
- composed of meaningful waypoints
- able to pause and return
- still compatible with free exploration

### V3 minimum Story Route
To reduce scope risk, the V3 Story Route feature is intentionally minimal.

A Story Route includes:
- title
- destination objective
- intended audience tag
- short route overview
- ordered waypoints
- one key message per waypoint
- optional perspective switch per waypoint
- progress indicator
- pause / resume
- return-to-route behavior after detour

### Story Route does not include in V3:
- freeform route authoring studio
- arbitrary branching logic
- slide composition
- custom animation timelines
- collaborative live route editing
- adaptive route logic by audience

### Key product rule
Story Routes are guided navigation through the same world, not a separate presentation artifact.

---

## 9.4 Route Overview, Destination, and Waypoints

### Description
Before beginning a Story Route, the user should understand:
- where the route is going
- why it matters
- what stops are ahead

### Required route elements

#### Destination Objective
A route begins by explaining:
- what the user should understand by the end
- why the route matters

Examples:
- Understand how money moves through the modern banking stack
- See where bank control is retained vs delegated
- Understand the difference between journey and process in account opening

#### Route Overview
A route overview includes:
- current position
- destination
- ordered waypoint list
- optional detour note if supported

#### Waypoints
Each waypoint includes:
- title
- key message
- why it matters
- the terrain context in focus
- optional supporting evidence

### V3 non-goals
- no freeform slide notes
- no long-form speaker script system
- no general storyboard editor

---

## 9.5 Pause, Explore, and Return

### Description
Support discussion and live inspection without breaking the route.

### Required behavior
- user can pause route progression
- user can pan/zoom and inspect nearby terrain
- user can inspect a node or provider in context
- user can return to the route
- route progress and waypoint state remain intact

### V3 interpretation
This is **lightweight route pause and return**, not a full standalone “discussion mode” subsystem.

### V3 non-goals
- no separate collaborative discussion workspace
- no threaded discussion feature
- no live multi-user facilitation controls

---

## 9.6 Contextual Provider Comparison

### Description
Support lightweight provider comparison within a selected capability or route context.

### Required behavior
A user can compare two or more providers by:
- role in the capability
- place in the flow
- control implications
- dependencies
- where they appear in journey/process context

### Example
Inside Payments → Money Movement, compare:
- RTP
- FedNow
- orchestration layers
- wallet/interface providers

### V3 non-goals
- no generic provider matrix builder
- no cross-domain freeform provider comparison engine
- no dynamic external market data feed

---

## 9.7 Research-Backed Explanation

### Description
Support evidence and annotations within terrain exploration and Story Routes.

### Required behavior
- route waypoints may include evidence refs
- provider/capability/process context may include annotations
- supporting material must remain attached to terrain context

### Design rule
Evidence should strengthen explanation without forcing the user out of the map experience.

### V3 non-goals
- no complete research authoring environment
- no document management platform
- no large-scale source ingestion workflow inside V3

---

## 10. User Experience Model

### Default exploration flow
1. enter the provider-aware landscape
2. select a Domain
3. select a Capability
4. inspect either:
   - Provider perspective
   - Journey perspective
   - Process perspective
5. optionally launch a Story Route
6. pause, explore, and return as needed

### Story Route flow
1. open route
2. view destination objective
3. view route overview
4. enter first waypoint
5. see focused terrain and key message
6. optionally pause and explore
7. return to route
8. complete route and view recap

### Presentation behavior
At each waypoint, the UI should show:
- terrain focus
- message headline
- short “why it matters” context
- route progress
- optional evidence attachment

The route should feel like a guided map, not a deck.

---

## 11. UX Requirements

### Required outcomes
- users know where they are in the terrain
- users know where they are in the route
- users can distinguish journey from process
- users can see providers in context
- users can pause and return without route loss
- Story Routes feel guided but still spatial
- the map remains primary

### Core interaction rules
- route and exploration context must be compatible
- perspective changes must preserve the current business anchor whenever possible
- provider context must stay tied to domain/capability/journey/process context
- process perspective must illuminate operational execution, not replace terrain logic
- dimming may be used to preserve spatial context rather than hiding too aggressively

---

## 12. Functional Requirements

### FR-1: Provider-aware landscape
The system shall support a larger terrain that includes provider context tied to business architecture context.

### FR-2: Domain and capability drill-down
The system shall allow users to navigate from landscape into domains and capabilities.

### FR-3: Provider-in-context visibility
The system shall show provider participation within selected domain/capability/journey/process context.

### FR-4: Provider perspective
The system shall support a provider-oriented perspective tied to selected terrain context.

### FR-5: Process perspective
The system shall support a richer process perspective distinct from journey view.

### FR-6: Story Route playback
The system shall support predefined Story Routes composed of ordered waypoints.

### FR-7: Destination objective and route overview
The system shall show a route destination objective and route overview before route progression begins.

### FR-8: Waypoint messaging
The system shall support one key message and one short supporting explanation at each waypoint.

### FR-9: Pause route
The system shall allow the user to pause a Story Route and inspect local terrain context.

### FR-10: Return to route
The system shall allow the user to return to the active Story Route after a detour.

### FR-11: Perspective switching during route
The system shall support perspective switches at route waypoints while preserving orientation.

### FR-12: Evidence in context
The system shall allow Story Routes and selected terrain contexts to display supporting evidence or annotations.

### FR-13: Route recap
The system shall provide a route completion state summarizing what was covered.

### FR-14: Context preservation
The system shall preserve route and terrain context across navigation, pause, detour, return, and perspective change.

---

## 13. Explicit Non-Goals

V3 does not attempt to become:
- a generic slide authoring tool
- a deck builder
- a route authoring studio
- a full guided traversal product
- a BI dashboard
- a provider scoring platform
- a process modeling suite
- a collaborative facilitation product
- an adaptive role-personalized runtime

V3 also does not include:
- freeform branching story authoring
- custom comparison matrix builder
- full CMS/backend content platform
- full offline sync
- full AI assistant integration
- live multi-user route collaboration

---

## 14. Relationship to GuideRail

### Viewscape V3 owns
- provider-aware terrain exploration
- domain/capability/provider/process understanding
- Story Routes for guided understanding
- lightweight route progression
- context-preserving teaching and discussion

### GuideRail owns
- deeper stepwise traversal
- scene-heavy guided walkthroughs
- simulator-style instruction
- highly directed path-following behavior

### Operational boundary
Viewscape routes guide **understanding of terrain and relationships**.  
GuideRail guides **stepwise traversal or execution of a chosen path**.

---

## 15. Core Implications

V3 likely implies additions to `viewscape-core`, including:
- StoryRoute
- StoryWaypoint
- Provider association model
- stronger Process representation
- multi-target focus support
- route pause / return semantics
- route-aware perspective transitions

### Important architectural rule
These additions must support guided movement through the same terrain. They must not introduce a second disconnected presentation model.

---

## 16. Success Metrics

### Product proof checks
- a user can complete a Story Route with at least 5 waypoints
- a user can detour once and return to the active route successfully
- a user can compare at least 2 providers within a selected capability
- a user can switch between Journey and Process views without losing selected domain/capability context
- a user can complete a route and explain its destination concept afterward

### Qualitative success signals
- “I understand where I am and where the route is taking me.”
- “This feels like a guided map, not a slideshow.”
- “I can answer questions without losing the thread.”
- “I understand why these providers matter here.”
- “I can see the difference between the journey and the process.”

---

## 17. Example Story Routes

Illustrative V3 route themes:
- How Money Moves in Modern Banking
- From Customer Onboarding to Account Opening
- Where Bank Control Changes Hands
- The Difference Between Wallets, Schemes, and Rails

These are intentionally route-based teaching assets, not decks.

---

## 18. Release Framing

### Release thesis
Viewscape V3 is the release where the map becomes a **guided explorable teaching surface**.

### What makes V3 unmistakably new
1. provider-aware landscape
2. process-aware context
3. lightweight Story Routes with pause-and-return behavior

### North star
Viewscape V3 should remain an explorable world first, but add guided routes that help users learn, present, and compare without turning the product into a deck.
