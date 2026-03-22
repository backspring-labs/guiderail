# IDEA — Viewscape V2: Provider Landscape, Narrative Navigation, and Process-Aware Exploration

## Context

The current Viewscape MVP is designed to prove a narrow but important product truth:

> a user can navigate **Domain → Capability → Journey** while switching **Perspectives** on a live terrain canvas without losing context.

That MVP deliberately stays small:
- static banking seed data
- no backend or API
- journey activation and contextual highlighting, but not full GuideRail-style traversal
- no full fintech landscape yet
- no search, offline bundle, or richer assistant behavior

At the same time, the earlier product vision for the broader explorer is larger:
- represent the fintech and banking landscape as navigable terrain
- show layers, providers, control surfaces, and flows
- support routes, street-view-like journeys, and research-backed explanation
- teach through progression, not just static exploration

Viewscape V2 should be the first version that begins to connect those two worlds:
- the disciplined navigation kernel proven in MVP
- the broader landscape, provider, process, and storytelling ambitions from the Explorer vision

---

## V2 Goal

Viewscape V2 should evolve the product from:

> a terrain discovery MVP with domain/capability/journey navigation

to:

> a business architecture and provider landscape navigator that can move users from high-level landscape understanding into domains, capabilities, journeys, processes, and directed narrative paths.

The central V2 proof should be:

> a user can start in the broader landscape, drill into domains and capabilities, compare or inspect providers in context, enter a journey or process path, and follow a guided narrative thread without losing orientation.

---

## Why V2 Exists

V1 proves navigation mechanics and context preservation.

V2 should prove something more strategic:

1. **Landscape scale**  
   The product can represent more of the real industry terrain, not just a simplified banking seed.

2. **Provider awareness**  
   The map can show real providers and their role in the space without collapsing into a logo wall.

3. **Process and journey progression**  
   Users can move from business architecture concepts into more specific journeys and supporting process views.

4. **Directed narrative flow**  
   The product can capture attention and educate along a path without becoming “PowerPoint on a canvas.”

That last point matters a lot:
Viewscape should remain explorable, but it also needs a guided storytelling mode that helps people learn, compare, and present.

---

## V2 Product Framing

### Working positioning

**Viewscape V2 is a business architecture and provider navigation environment with guided narrative paths.**

It should let a user:
- see the industry terrain
- enter through broad business areas
- inspect capabilities
- see which providers play in that space
- switch among architecture, provider, process, and journey perspectives
- follow a curated story path that explains the terrain in a directed but still interactive way

---

## What V2 Should Add

## 1. Provider-Aware Landscape

The MVP proves the Domain → Capability → Journey navigation model on a small banking seed.
V2 should introduce a broader **provider-aware landscape**.

### Intent
Represent real industry players in the space while preserving the architectural and business meaning of the map.

### Product effect
A user should be able to:
- explore a domain such as Payments or Identity & Access
- see relevant capabilities within that domain
- see providers associated with those capabilities
- understand whether a provider is:
  - a capability owner
  - an infrastructure participant
  - an orchestration/control layer
  - a network/scheme
  - a rail/interface/provider
  - a supporting specialist

### Important design principle
Providers should be visible **in context**, not treated as the primary organizing model.

The product should not become:
> “a better market map of logos”

It should remain:
> “a navigator of business architecture, flows, and control — with providers embedded meaningfully into the terrain”

---

## 2. Expand the Navigation Progression

V2 should make the progression more explicit and useful:

**Landscape → Domain → Capability → Provider / Journey / Process**

This progression should feel natural rather than forced.

### Suggested structure

#### Landscape
The broader space or ecosystem overview.

#### Domain
Broad business area, such as:
- Customer
- Accounts
- Payments
- Cards
- Identity & Access
- Risk & Fraud
- Servicing

#### Capability
Enduring business ability, such as:
- Customer Onboarding
- Account Opening
- Money Movement
- Card Management
- Authentication
- Fraud Detection

#### Journey
An outcome-oriented path, such as:
- Open Savings Account
- Send ACH Transfer
- Recover Account Access

#### Process
A more operational or architecture-linked representation of how work actually moves through the system.

### Why this matters
This creates a stronger bridge between:
- high-level business architecture
- provider landscape understanding
- concrete workflow explanation

---

## 3. Add Process as a More Explicit Navigation Surface

MVP includes Perspectives like Overview, Architecture, Provider, Process, and Journey, but V2 should begin to make **Process** more meaningful and visible.

### Intent
Show how work moves operationally, not just conceptually.

### Example
A user selects:
- Domain: Payments
- Capability: Money Movement
- Journey: Send ACH Transfer

Then switches to **Process Perspective** to see:
- initiation
- validation
- routing
- decision/control points
- posting/recording
- notification/follow-up

### Why this matters
Journeys and processes are related, but not identical.

- **Journey** is outcome/path-oriented
- **Process** is operational/flow-oriented

V2 should clarify that distinction instead of letting them blur.

---

## 4. Narrative Paths / Story Mode

This is the major new concept for V2.

You described an aspect of the tool that has not yet been fully captured:
the ability to **tell a story**.

That should become a first-class V2 concept, but carefully.

### Design intent
Create a directed educational/presentation mode that:
- keeps the spatial and interactive nature of the product
- guides attention through curated waypoints
- teaches along a path
- does not degrade into slideware

### Working concept
Introduce something like a:

- **Story Path**
- **Narrative Route**
- **Presentation Path**
- **Guided Thread**

### What a Story Path does
A Story Path would:
- define an ordered sequence of waypoints through the landscape
- pin the user to meaningful transitions
- optionally switch perspective at key moments
- spotlight nodes, edges, capabilities, providers, journeys, or process points
- present narrative copy and supporting evidence in context

### What it should not be
It should **not** become:
- PowerPoint slides on a canvas
- freeform slide authoring
- animation-first storytelling
- disconnected presentation mode

The story should always feel anchored to the same terrain the user can later explore freely.

### Key product rule
Story mode should be:
> **guided navigation through the same world**, not a separate presentation artifact.

---

## 5. Story Path Structure

A Story Path should likely include:

- title
- description
- intended audience
- ordered waypoints
- waypoint narrative
- optional perspective switches
- optional provider comparisons
- optional research/evidence attachments
- optional “pause and explore” markers
- optional return points back into free exploration

### Example Story Paths
- “How Money Moves in Modern Banking”
- “From Customer Onboarding to Account Opening”
- “Where Bank Control Changes Hands”
- “The Difference Between Wallets, Schemes, and Rails”
- “How Agentic Commerce Changes the Flow”

These map directly to the earlier Explorer vision and make the tool useful for:
- teaching
- demos
- pre-sales
- strategy workshops
- executive briefings

---

## 6. Provider Perspective and Comparison

The MVP already names Provider as a perspective.
V2 should make that real.

### Intent
Let a user see provider presence and role without breaking architectural coherence.

### Possible capabilities
- highlight providers relevant to a selected capability
- compare two providers within the same capability area
- show provider role, dependencies, and control significance
- show which journeys or processes a provider participates in
- attach research handles/evidence to provider nodes

### Example
Inside Payments → Money Movement, user can compare:
- RTP
- FedNow
- card-based route providers
- orchestration layers
- wallet/interface providers

This should support one of the original Explorer goals:
help users understand **who actually controls what**.

---

## 7. Role-Aware Exploration and Storytelling

The original PRD emphasizes the need to explain the system to different kinds of users:
- executives
- strategy teams
- architects
- product leaders
- enablement / pre-sales users

V2 should begin to reflect that.

### V2 opportunity
Story Paths and right-panel content can be tuned by role or audience type, even before full auth/entitlement complexity arrives.

For example:
- **Executive path** = high-level control shifts, strategic significance
- **Architect path** = systems, dependencies, orchestration, control boundaries
- **Product path** = user journey, capability implications, provider fit
- **Banking/risk path** = controls, decision points, evidence

This makes the product more than just “navigable”; it becomes teachable.

---

## 8. Research and Evidence in the Narrative

The PRD makes clear that evidence should live inside the experience, not outside it.

V2 should begin to connect narrative paths to:
- research handles
- evidence refs
- annotations
- explanatory callouts

### Why
A good story path does not just move the user through the terrain.
It also:
- explains why the waypoint matters
- points to supporting artifacts
- lets the user dig deeper without losing place

This makes the experience stronger for:
- strategy conversations
- education
- proof-oriented product discussion
- partner/client explanation

---

## 9. Transition Toward GuideRail Without Becoming GuideRail

The MVP properly keeps Viewscape from turning into GuideRail too early.
That boundary should remain in V2.

### What V2 should do
- deepen journey and process navigation
- add story paths
- improve directed flow
- support more explicit step context

### What V2 should still avoid
- becoming a fully step-driven guided walkthrough product
- prioritizing scene-by-scene narration over terrain exploration
- turning Viewscape into the primary home of full GuideRail behavior

### Suggested split
- **Viewscape V2** = broader terrain + capability/provider/process/story navigation
- **GuideRail** = deeper guided traversal and stepwise simulated walkthrough

That keeps the product line healthy.

---

## 10. Proposed V2 Experience Flow

A likely V2 flow could look like this:

1. User enters at the broader landscape
2. Selects a Domain
3. Selects a Capability
4. Chooses one of three branches:
   - inspect Providers
   - inspect a Journey
   - inspect a Process
5. Optionally enters a Story Path that guides the exploration
6. At any point, can return to free exploration without losing orientation

This feels like the right bridge from:
- static landscape
to
- navigable understanding
to
- directed education

---

## 11. Core Additions Likely Needed

V2 likely implies additions to `viewscape-core`, such as:

### Potential new concepts
- StoryPath
- StoryWaypoint
- Provider association model
- stronger Process representation
- multi-target focus support
- perspective-aware narrative emphasis

### Likely supporting needs
- ability to mark focal sets larger than a single node/edge
- ability to preserve anchor context while perspective changes during story playback
- ability to bind evidence/annotation to story waypoints
- ability to represent “pause and explore” moments cleanly

This is not a request to overbuild the core immediately, but V2 should likely drive the next round of core evolution.

---

## 12. V2 Scope Themes

### V2 Theme A — Broader terrain
- larger seeded landscape
- more domains and capabilities
- provider presence in the map

### V2 Theme B — Better transitions downward
- stronger movement from landscape → domain → capability → journey/process

### V2 Theme C — Narrative navigation
- story paths
- guided waypoints
- audience-oriented exploration

### V2 Theme D — Research-backed explanation
- evidence integrated into journeys, providers, and story waypoints

---

## 13. Recommended V2 Proof Statement

A strong V2 proof statement could be:

> Viewscape V2 proves that users can move from a provider-aware industry landscape into domains, capabilities, journeys, and processes, while also following guided narrative paths that educate without breaking spatial context.

---

## 14. Suggested Naming for the New Directed Feature

Possible names:
- Story Paths
- Guided Threads
- Narrative Routes
- Explorer Paths
- Insight Paths

My current preference:
**Story Paths**

It is simple, understandable, and matches your “tell a story” instinct without sounding too slideware-heavy.

---

## 15. Recommended V2 Principle

> Viewscape V2 should remain an explorable world first, but add guided story paths that help users learn, present, and compare without turning the product into a deck.

That feels like the right north star.

---

## 16. Final Summary

V2 should not just be “more nodes and more polish.”

It should advance the product in four meaningful ways:

1. represent more of the industry landscape
2. show providers in context
3. bridge from landscape into business architecture, journeys, and processes
4. introduce guided story paths that direct attention and teach along a path

That is the next meaningful step beyond the MVP and aligns tightly with the earlier Explorer vision.
