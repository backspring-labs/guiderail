# PRD — Viewscape V2: Provider Landscape, Narrative Routes, and Process-Aware Exploration

## Document Status

- **Product:** Viewscape
- **Version:** V2 PRD
- **Status:** Draft
- **Scope:** Post-MVP
- **Primary Audience:** Product, design, engineering, architecture, strategy
- **Related Inputs:** Viewscape MVP plan, Viewscape V2 idea, earlier Explorer / systems-explorer concepts

---

## 1. Executive Summary

Viewscape V1 proves a focused interaction truth:

> a user can navigate **Domain → Capability → Journey** while switching **Perspectives** on a live terrain canvas without losing context.

Viewscape V2 expands the product from a constrained navigation MVP into a broader **business architecture and provider landscape navigator** that can also support **guided narrative routes** for teaching, discussion, and directed exploration.

V2 is not just “more nodes and more polish.”

It should prove that users can:

- start from a broader industry landscape
- drill into Domains and Capabilities
- inspect providers in context
- move into Journeys and Processes
- follow a directed story path with destination, waypoints, and key messages
- pause for discussion, detour, and return without losing orientation

The product must remain an **explorable world first**, while gaining the ability to act as a **guided teaching and discussion environment**.

---

## 2. Problem Statement

The MVP proves context-preserving navigation mechanics, but it does not yet satisfy the fuller product vision.

Current limitations include:

- the terrain is small and seed-driven
- providers are not yet represented meaningfully in the space
- process is named as a perspective but not yet deeply modeled
- the product can highlight a journey, but not yet tell a guided story
- the current experience is useful for exploration, but not yet optimized for education, persuasion, or structured discussion

Users need more than a static landscape and more than a freeform explorer.

They need a tool that can help them:

- understand the shape of an industry space
- connect business architecture to real providers and platforms
- move from broad concepts into concrete flows
- present a narrative with a destination and meaningful stops
- hold discussion inside the same space rather than leaving it for slideware

---

## 3. Vision

Viewscape V2 should become:

> a business architecture and provider landscape navigator with guided narrative routes.

It should combine:

- **landscape exploration**
- **business architecture drill-down**
- **provider-aware context**
- **journey and process progression**
- **storytelling without becoming a deck**

The key design principle is:

> **guided routes should move through the same terrain the user can later explore freely.**

Storytelling must not be a separate artifact disconnected from the world.

---

## 4. V2 Product Goal

Viewscape V2 should evolve the product from:

> a terrain discovery MVP with domain/capability/journey navigation

to:

> a provider-aware business architecture navigator that supports landscape exploration, process-aware drill-down, and guided narrative routes.

### V2 proof statement

Viewscape V2 proves that a user can move from a provider-aware industry landscape into domains, capabilities, journeys, and processes, while also following guided narrative routes that educate without breaking spatial context.

---

## 5. Users and Audience Modes

V2 should support multiple types of users and discussion modes.

### Primary user groups

- Executive / leadership audience
- Strategy and transformation teams
- Product leaders
- Architects and solution designers
- Pre-sales / enablement teams
- Client and partner discussion participants
- Internal teams learning the platform and landscape

### Why this matters

The same terrain may need to be explained differently depending on audience.

Examples:

- **Executive mode** emphasizes strategic significance, control boundaries, growth implications
- **Architect mode** emphasizes systems, dependencies, orchestration, interfaces, control points
- **Product mode** emphasizes capability fit, journey implications, opportunity framing
- **Risk / banking mode** emphasizes controls, decision points, accountability, evidence

V2 should begin to accommodate this through narrative route design and panel content, even if full role-aware personalization is deferred.

---

## 6. Core Product Principles

1. **Explorable world first**
   - Viewscape is still a map and navigator, not a slideshow engine.

2. **Providers in context**
   - Providers should be represented meaningfully in the terrain, not just as a logo wall.

3. **Business architecture remains primary**
   - The user should still be able to move through Domain → Capability → Journey / Process.

4. **Storytelling is route-based, not slide-based**
   - Narrative guidance should use route logic, waypoints, destination, and return-to-explore behavior.

5. **Context must never be lost**
   - Users must preserve orientation while switching perspectives, following routes, detouring, or resuming discussion.

6. **GuideRail boundary remains intact**
   - Viewscape may deepen route and process understanding, but should not become the full guided traversal product.

---

## 7. V2 Scope Overview

V2 introduces four major capability themes:

### Theme A — Broader industry terrain
- more domains
- more capabilities
- more representative industry topology
- provider presence in the terrain

### Theme B — Better downward progression
- stronger transitions from Landscape → Domain → Capability → Provider / Journey / Process

### Theme C — Narrative routes
- destination objective
- route overview
- waypoints
- key messages
- pause / detour / return behavior

### Theme D — Research-backed explanation
- evidence and annotations attached to routes, providers, journeys, and process points

---

## 8. Information Architecture

### Primary navigation progression

**Landscape → Domain → Capability → Provider / Journey / Process**

This should be the default mental model of V2.

### Navigation meanings

- **Landscape** = broader ecosystem overview
- **Domain** = broad business area
- **Capability** = enduring business ability within a domain
- **Provider** = real player operating in or supporting that space
- **Journey** = outcome-oriented path through capabilities
- **Process** = operational flow representation of how work moves
- **Perspective** = current view mode such as Overview, Architecture, Provider, Process, Journey, Control

### Example progression

- Landscape: modern banking / fintech terrain
- Domain: Payments
- Capability: Money Movement
- Branch choice:
  - Provider view
  - Journey view
  - Process view
- Optional route:
  - “How Money Moves in Modern Banking”

---

## 9. Major Features

## 9.1 Provider-Aware Landscape

### Description
Represent real industry providers in the terrain while keeping business architecture and control meaning primary.

### Goals
- show which providers are relevant to a selected domain or capability
- show provider role in the space
- show where providers participate in journeys or processes
- support discussion of control, dependency, and differentiation

### Provider role examples
- capability owner
- orchestration layer
- rail or network participant
- scheme
- infrastructure participant
- specialist service provider
- interface / wallet / enablement layer

### Success condition
A user can explore a capability and understand which providers participate in that capability area and what role they play.

---

## 9.2 Process-Aware Exploration

### Description
Make Process a richer, more meaningful navigation surface rather than a nominal perspective only.

### Goals
- distinguish process from journey
- show operational flow and control points
- support explanation of what actually happens through the system

### Process example
For Payments → Money Movement → Send ACH Transfer, a process perspective may show:
- initiation
- validation
- risk decision
- routing
- posting
- confirmation / notification

### Success condition
A user can clearly distinguish between:
- the **journey** a user/business is taking
- the **process** by which the system executes that path

---

## 9.3 Story Routes

### Description
Introduce a directed but interactive storytelling feature that guides the user through the terrain using destination, waypoints, and message framing.

### Design intent
Enable education, guided discussion, and presentation flow without turning the product into PowerPoint.

### Working name
**Story Routes**

This name is preferred over “slides” or “presentation mode” because it keeps the feature anchored to navigation.

### Story Route structure
A Story Route should include:

- title
- destination objective
- intended audience
- route overview
- ordered waypoints
- waypoint narrative
- key message at each stop
- optional perspective switch
- optional provider comparison prompt
- optional evidence / annotation attachments
- optional detours or pause-and-explore moments
- completion / recap state

### Key product behavior
A Story Route should:
- guide attention
- preserve map context
- allow pausing for discussion
- allow detouring into exploration
- support return to route

### What Story Routes are not
They are not:
- freeform slide authoring
- disconnected presentation decks
- animation-first storytelling
- a separate world outside the terrain

### Success condition
A presenter or user can run a guided route through the terrain, pause for discussion, inspect context, and resume the route without losing orientation.

---

## 9.4 Route Overview, Destination, and Waypoints

### Description
Story Routes should open with an overview of where the user is going, why it matters, and the major stops along the way.

### Required concepts

#### Destination Objective
The route should start with:
- what the audience will understand by the end
- why the route matters

Examples:
- “Understand how money moves through the modern banking stack”
- “See where bank control is retained vs delegated”
- “Compare provider roles in account opening”
- “Understand the business and technical path of onboarding”

#### Route Overview
The route should show:
- current starting point
- ordered waypoint list
- destination
- optional branches/detours

#### Waypoints
Each waypoint should include:
- title
- key message
- why it matters
- what terrain elements are in focus
- optional evidence or supporting artifacts
- optional discussion prompt

### Success condition
Users can understand the route’s purpose before beginning and can track their progress through meaningful stops.

---

## 9.5 Interactive Discussion Mode

### Description
Story Routes must support live discussion, inspection, and contextual detours.

### Required capabilities
- pause route progression
- pan/zoom/explore locally
- inspect related nodes/providers/artifacts
- open evidence references
- take a short detour
- return to the active route

### Guiding principle
The route is a guided conversation framework, not a brittle scripted animation.

### Success condition
A live discussion can move off-route temporarily and still return cleanly to the route context.

---

## 9.6 Provider Comparison in Context

### Description
Within a selected capability, support targeted provider comparison.

### Example uses
Inside Payments → Money Movement, compare:
- RTP
- FedNow
- card-based route providers
- orchestration layers
- wallet/interface providers

### Comparison dimensions
- role in the flow
- dependencies
- control ownership
- where they participate in journeys
- where they participate in processes
- evidence/research references

### Success condition
Users can compare providers without leaving the business architecture context of the terrain.

---

## 9.7 Research-Backed Narrative and Exploration

### Description
Integrate evidence, annotations, and supporting research directly into routes and terrain exploration.

### Why
A strong route should not only guide attention — it should also explain why each stop matters and provide supporting proof.

### Expected content types
- annotations
- evidence refs
- research handles
- callouts
- discussion notes
- comparative context

### Success condition
Users can access supporting evidence at route waypoints and terrain stops without leaving the navigation context.

---

## 10. User Experience Model

### Default experience
1. enter the broader landscape
2. select a domain
3. select a capability
4. branch into:
   - Provider
   - Journey
   - Process
5. optionally enter a Story Route
6. return to free exploration at any point

### Story Route experience
1. open route
2. see destination objective and route overview
3. progress to first waypoint
4. view guided focus and message
5. optionally pause and explore
6. return to route
7. complete route and see recap

### Presentation behavior
At each waypoint, the UI should support:
- a focused terrain highlight
- a concise message headline
- short “why it matters” context
- supporting artifacts/evidence
- progress indication
- optional branch or detour

---

## 11. UX Requirements

### Required UX outcomes
- users always know where they are
- users understand the route objective before beginning
- users can see route progress
- waypoints feel spatially anchored to the terrain
- transitions among perspectives feel intentional
- detours do not destroy route state
- the product feels like a map with guided routes, not a deck

### Key interaction rules
- route context and free-exploration context must remain compatible
- perspective changes should preserve the same business anchor whenever possible
- provider context should remain tied to selected domain/capability
- process view should illuminate flow, not replace terrain logic
- route progression must support pause/resume/return

---

## 12. Functional Requirements

### FR-1: Broader landscape rendering
The system shall support a larger, provider-aware terrain beyond the MVP banking seed.

### FR-2: Domain and capability drill-down
The system shall allow users to navigate from landscape into domains and capabilities.

### FR-3: Provider-aware context
The system shall show providers associated with selected capabilities and indicate their role.

### FR-4: Provider perspective
The system shall support a provider-oriented perspective for selected terrain context.

### FR-5: Process perspective
The system shall support a richer process-oriented perspective distinct from journey view.

### FR-6: Story Route creation and playback
The system shall support predefined Story Routes composed of ordered waypoints.

### FR-7: Destination objective and route overview
The system shall show a route destination objective and route overview before beginning a Story Route.

### FR-8: Waypoint messaging
The system shall support key message presentation and contextual explanation at each waypoint.

### FR-9: Pause and explore
The system shall allow users to pause route progression and inspect surrounding terrain.

### FR-10: Return to route
The system shall allow users to return to the active Story Route after a detour.

### FR-11: Perspective transitions during story
The system shall support perspective switching at route waypoints without losing orientation.

### FR-12: Evidence integration
The system shall allow route waypoints and provider/process/journey contexts to display supporting evidence.

### FR-13: Audience-aware route framing
The system should support route metadata for intended audience and route style.

### FR-14: Guided route recap
The system shall provide a route completion/recap state summarizing what was covered.

---

## 13. Non-Goals

V2 does not attempt to become:

- a generic slide authoring tool
- a full presentation deck builder
- the complete guided traversal product (GuideRail)
- a freeform BI/reporting dashboard
- a general research authoring system
- a full personalized role/permission platform

V2 also does not require:
- full backend CMS
- full offline sync
- full AI assistant integration
- complete multi-user collaboration

Those can remain future concerns.

---

## 14. Relationship to GuideRail

V2 should deepen Viewscape’s ability to guide and teach, but must still stop short of becoming GuideRail.

### Viewscape V2 should own
- broader landscape exploration
- domain/capability/provider/process understanding
- route-based storytelling
- light route progression
- contextual journey and process entry

### GuideRail should continue to own
- deeper stepwise walkthroughs
- fuller simulator-style guided traversal
- more detailed scene progression
- highly directed path-following behavior

### Boundary rule
Viewscape uses routes to guide understanding of the terrain. GuideRail uses traversal to guide execution through the path.

---

## 15. Core Implications

V2 likely drives evolution in `viewscape-core`.

### Likely additions
- StoryRoute
- StoryWaypoint
- Provider association model
- stronger process representation
- multi-target focus support
- perspective-aware narrative emphasis
- route state and detour-return semantics

### Important principle
These additions should support route-based guidance through the same terrain, not introduce a second disconnected presentation model.

---

## 16. Success Metrics

### Product proof metrics
- users can start from landscape and reach provider, journey, or process context without confusion
- users can complete a Story Route and explain the destination concept afterward
- users can detour during a Story Route and return cleanly
- users can compare providers in context rather than as disconnected logos
- users can distinguish journey and process as separate but related concepts

### Qualitative success signals
- “I understand where I am and where this route is taking me.”
- “This feels like a guided map, not a slideshow.”
- “I can answer questions without losing the thread.”
- “I can see why a provider matters here.”
- “I understand the control and process implications better than from static diagrams.”

---

## 17. Example Story Routes

Illustrative V2 route themes:

- How Money Moves in Modern Banking
- From Customer Onboarding to Account Opening
- Where Bank Control Changes Hands
- The Difference Between Wallets, Schemes, and Rails
- How Agentic Commerce Changes the Flow

These are useful for:
- demos
- strategy sessions
- pre-sales
- architecture education
- executive briefings
- internal enablement

---

## 18. Release Framing

### V2 release thesis
Viewscape V2 is the first release where the product becomes not just an explorer, but a structured teaching and discussion environment.

### Summary
V2 should advance the product in four meaningful ways:

1. represent more of the industry landscape
2. show providers in context
3. bridge from landscape into business architecture, journeys, and processes
4. introduce guided narrative routes with destination, waypoints, and discussion support

### North star
Viewscape V2 should remain an explorable world first, but add guided routes that help users learn, present, and compare without turning the product into a deck.
