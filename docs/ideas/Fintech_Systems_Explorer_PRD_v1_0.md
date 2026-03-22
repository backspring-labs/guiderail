# PRD: Fintech Systems Explorer
## Browser-Based Navigation System for Exploring the Fintech Industry as a Map, Route, and Journey

**Document Status:** Draft v1.0  
**Document Type:** Product Requirements Document  
**Product Working Name:** Fintech Systems Explorer  
**Product Metaphor:** Google Maps for the fintech industry, with Street View for customer and operator journeys

---

## 1. Executive Summary

The Fintech Systems Explorer is a browser-based product that transforms the modern fintech ecosystem from a static landscape of logos and categories into a navigable, layered, evidence-backed system of understanding.

Most industry maps are good at showing that many players exist. They are poor at showing how those players relate, where control sits, how money actually moves, how user journeys traverse the system, and where strategic power changes hands between banks, networks, wallets, orchestration layers, and other third parties. They are also poorly suited to the next wave of industry change, where agents may begin initiating, routing, and completing financial tasks within policy constraints.

This product addresses that gap by combining five ideas into one coherent experience:

1. **Map** — a spatial model of the modern banking and fintech stack  
2. **Layers** — selectable lenses such as architecture, control, payments, risk, and agentic commerce  
3. **Routes** — flows through the system, such as a card payment, RTP transfer, or agent-assisted transaction  
4. **Street View** — a sequence of screens and system states that makes an abstract route feel concrete  
5. **Research + Context** — evidence handles, role-aware access, and contextual Q&A tied to where the user is in the map

The product is intended to work as a strategy tool, teaching interface, architecture explainer, demo environment, and eventually a simulation substrate for more advanced reasoning. The MVP should prove the navigation model, the data-driven content model, and the core user experience that joins map, route, street view, and contextual explanation into one product.

---

## 2. Problem Statement

### 2.1 Current Problem

The financial technology ecosystem has become too layered, too fragmented, and too dynamic to be explained effectively through static diagrams, category maps, or vendor comparison tables alone.

Today, most teams rely on a mix of:
- static architecture slides
- market maps or placemats
- whitepapers
- analyst reports
- product demos
- tribal knowledge

These artifacts are useful in isolation, but they fail to create a coherent mental model of how the system actually works.

### 2.2 Practical Consequences

This creates real business and product problems:

- Product teams misunderstand what a provider actually controls versus what it merely supports.
- Executives conflate wallets, networks, and rails into one “payments” bucket.
- Architecture discussions drift into logos and categories instead of execution paths and control boundaries.
- Banks and fintech teams struggle to reason about where they retain control versus where they are ceding it to networks, wallet providers, or middleware layers.
- User journeys are discussed separately from system architecture, which makes the full experience feel disconnected.
- New paradigms such as agentic commerce are hard to place in the existing mental model.
- Research and supporting evidence live outside the model instead of inside it, forcing users to leave context to validate what they are seeing.

### 2.3 Opportunity

There is an opportunity to create a product that functions like a navigational system for the industry itself: a way to see the terrain, switch perspectives, trace routes, drop into journeys, and access supporting research without losing context.

That is the role of the Fintech Systems Explorer.

---

## 3. Product Vision

### 3.1 Vision Statement

Create a browser-based navigation system that allows users to explore the modern fintech stack the way they would explore a physical world in a mapping product.

The experience should let a user:
- see the high-level terrain of the industry
- toggle different lenses on the same terrain
- click into providers, capabilities, and control surfaces
- select flows and watch them traverse the ecosystem
- drop into “Street View” to experience a user or operator journey
- access supporting research and evidence in context
- ask questions based on where they are and what they are looking at

### 3.2 Product Metaphor

The product should deliberately lean into a mapping metaphor:

- **Map** = the architecture and ecosystem terrain  
- **Layers** = selectable views such as payments, control, risk, or agentic  
- **Pins** = providers, capabilities, abstractions, or entities  
- **Routes** = system flows across layers  
- **Actor** = the user or agent entering the map  
- **Street View** = a sequence of experience and system screens tied to a route  
- **Research Handles** = access points to supporting evidence  
- **Context Assistant** = map-aware explanation tied to the user’s current location

The product should feel less like a slide deck and more like a navigable model of the industry.

---

## 4. Product Goals

### 4.1 Primary Goals

The product must:
- Provide a stable, navigable, layered map of the fintech and banking stack.
- Make important system distinctions legible, especially around payments, control, orchestration, and the role of the core.
- Connect architecture with real flows and user/operator journeys.
- Support evidence-backed exploration through in-context research links.
- Allow the system to be extended through structured data rather than hardcoded screens.

### 4.2 Secondary Goals

The product should:
- Help explain emerging concepts such as agentic commerce without forcing the user to abandon the existing map.
- Support internal and external storytelling, including demos, workshops, interviews, product discussions, and strategy sessions.
- Preserve a path toward offline use, entitlement-aware content, and contextual Q&A.

### 4.3 Non-Goals for MVP

The MVP is not intended to:
- become a full analyst database of every fintech vendor
- provide real-time market intelligence feeds
- simulate real transaction processing at production fidelity
- act as a collaborative whiteboard
- become a general document management platform
- replace dedicated research tools or BI products

---

## 5. Users and Use Cases

### 5.1 Primary Users

#### Product Leaders in Banking and Fintech
They need to understand:
- where providers fit
- how architecture and journey relate
- what control surfaces matter
- how future-state patterns such as agentic commerce could change product strategy

#### Technology Leaders / Architects / CTOs
They need to reason about:
- system layering
- role of orchestration
- distinctions between wallets, schemes, and rails
- control boundaries
- dependencies and modernization pathways

#### Strategy / Innovation / Advisory Teams
They need to explain:
- what the modern stack looks like
- where the white space is
- where the control shifts are happening
- and how different players or architectures can be compared

### 5.2 Secondary Users

#### Sales / Pre-Sales / Solution Consulting
They can use the Explorer as a guided conversation tool.

#### Internal Training / Enablement
It can become a teaching tool for new hires, product teams, or partner teams.

#### Thought Leadership / Content Teams
It can underpin demos, presentations, and future public or premium content.

### 5.3 Core User Jobs

Users come to the product to:
- understand how the modern stack is organized
- see where a provider sits and why it matters
- compare flows and control boundaries
- explain the stack to someone else
- explore how a real journey traverses architecture
- validate claims with supporting evidence
- ask contextual questions without leaving the product

---

## 6. Product Principles

The following principles should guide design and prioritization.

### 6.1 Spatial Coherence Matters
The user should always understand where they are in the system and how the current view relates to the whole.

### 6.2 Structure Must Survive Perspective Changes
Mode switches and overlays must reveal different truths about the same system, not replace the map entirely.

### 6.3 The Product Must Privilege Control and Flow, Not Just Categories
A useful model tells users who controls the interaction, the policy, the credential, the movement, and the record of truth.

### 6.4 The Core Must Remain Foundational
The product should not tell a “core is dead” story. It should show the core as the system of record and trust anchor, while highlighting the strategic importance of orchestration and payments control layers around it.

### 6.5 Payments Must Be Properly Decomposed
The Explorer should explicitly separate:
- wallets and payment interfaces
- networks and schemes
- rails and movement pathways

### 6.6 Agentic Commerce Must Be First-Class
Agents are not just another front end. The product should show how they alter initiation, routing, permissions, and execution.

### 6.7 Evidence Must Live Inside the Experience
Users should not need to leave the product to validate what they are seeing.

### 6.8 The Product Must Be Data-Driven
New vendors, flows, journeys, research links, and overlays should be added by updating structured data rather than by building new screens.

---

## 7. Product Scope and Experience Model

### 7.1 Experience Levels

The product should support four levels of depth.

#### Level 0: Overview Map
A high-level ecosystem view showing major layers and representative entities.

#### Level 1: Layer View
A deeper view of a selected layer, showing sub-categories, relationships, and strategic distinctions.

#### Level 2: Component View
A detailed view of a provider, capability, or abstraction, including role, dependencies, control points, attached research, and related flows.

#### Level 3: Route + Street View
An execution-focused view where the user can run a flow through the system and drop into journey steps that combine UX and system actions.

### 7.2 Modes / Lenses

The product should support different perspectives on the same map.

#### Architecture Mode
The default structural view. It teaches the model.

#### Control Mode
Shows who owns what and where authority shifts.

#### Payments Mode
Explodes payments into wallets, schemes, and rails.

#### Risk / Decisioning Mode
Shows signals, policy, decision points, and challenge/approve/deny logic.

#### Agentic Mode
Shows agents as actors that interact directly with orchestration and decisioning.

#### Data / Rewards Overlay
An optional overlay showing feedback loops, incentives, and behavioral logic.

MVP will not necessarily include all modes at full depth, but the system must be designed to support them.

---

## 8. Conceptual Domain Model

The Explorer should be built around these major domain entities.

### 8.1 Layer
A major architectural or conceptual band in the map.

Examples:
- Agentic Commerce
- Experience / Channels
- Orchestration / Control Plane
- Risk / Identity / Decisioning
- Wallets / Interfaces
- Networks / Schemes
- Rails / Money Movement
- Core / System of Record
- Data / Rewards Overlay

### 8.2 Component
A provider, capability, abstraction, or entity that sits within a layer.

Examples:
- Visa
- Mastercard
- Paze
- Apple Pay
- Infinant
- RTP
- FedNow
- “Bank-Controlled Policy Engine”
- “Personal AI Agent”

### 8.3 Flow
A path through the system made up of ordered steps, decision points, and transitions.

Examples:
- Card payment flow
- RTP transfer
- Zelle-like experience flow
- Agent-assisted payment
- Risk intervention
- Behavioral rewards loop

### 8.4 Journey
A step-by-step experience sequence associated with a flow, including UX screens and system states.

### 8.5 Research Artifact
A document or supporting resource attached to a layer, component, flow, or annotation.

### 8.6 Actor
The initiating party or context entering the system.

Examples:
- Human customer
- Bank operator
- Merchant operator
- Agent

### 8.7 User Context
The authenticated user’s role, entitlements, preferences, and current navigation context.

---

## 9. Functional Requirements

### 9.1 Map Engine

#### Intent
Render the fintech system as a stable, layered spatial model.

#### Requirements
- The application must render a horizontal layered map as the default experience.
- Layers must remain in stable relative order across interactions.
- The user must be able to zoom and pan.
- The user must be able to select a layer and focus it without losing overall orientation.
- A breadcrumb or contextual header must reflect current map location.

#### Acceptance Criteria
- User can identify current layer and see surrounding layers at all times.
- Zoom and pan interactions do not break layout or relationship clarity.
- Returning from a drill-down restores prior context cleanly.

---

### 9.2 Layer and Mode System

#### Intent
Allow the user to explore the same map through different analytical lenses.

#### Requirements
- The application must support mode toggles.
- Modes must change visual emphasis, overlays, and relationship highlighting without rebuilding the map from scratch.
- Multiple overlays may be active if they are not contradictory.

#### Acceptance Criteria
- Toggling a mode changes highlighting within 300ms under normal data sizes.
- A mode switch preserves the current focal component or layer where possible.
- Users can tell which mode is active and what it is emphasizing.

---

### 9.3 Component / Pin System

#### Intent
Make each component an explorable unit of knowledge.

#### Requirements
- Components must be represented as selectable nodes or cards within layers.
- Clicking a component must open a contextual detail panel.
- The detail panel must include:
  - name
  - type
  - role
  - description
  - control significance
  - dependencies
  - related flows
  - attached research handles

#### Acceptance Criteria
- Selecting a component highlights related edges or nearby entities where applicable.
- Component panels load from structured data with no hardcoded content.
- Component detail can be rendered consistently across different component types.

---

### 9.4 Flow / Route Engine

#### Intent
Show how the system executes real flows across multiple layers.

#### Requirements
- The system must support flows defined as ordered steps.
- A flow may include branching decision points.
- The route engine must be able to:
  - highlight the active path
  - step through one stage at a time
  - autoplay the route
  - display step context and what changed

#### Acceptance Criteria
- User can start, pause, step through, and reset a flow.
- Route highlights are legible and do not turn the map into visual noise.
- Flow steps can reference layers, components, and journey steps without code changes.

---

### 9.5 Street View / Journey Engine

#### Intent
Translate an abstract route into a concrete experience.

#### Requirements
- A flow may have one or more associated journeys.
- Journey steps must support:
  - UI-only screen
  - system-only state
  - hybrid step showing both
- The user must be able to move forward and backward through journey steps.
- The journey view must display what the actor sees and what the system does.

#### Acceptance Criteria
- Street View is clearly tied to a selected route or flow.
- Users can tell whether a step is customer-visible, operator-visible, or system-only.
- Journey steps support assets, descriptive text, and annotations.

---

### 9.6 Research Handle System

#### Intent
Provide evidence-backed exploration.

#### Requirements
- Layers, components, flows, and annotations may expose research handles.
- Research handles must visually indicate that supporting evidence is available.
- Clicking a handle must open supporting metadata, including:
  - title
  - short summary
  - source
  - open/download action

#### UX Guidance
Use a small, consistent icon system, such as:
- 📄 document
- 📚 collection
- 🔎 deep dive

#### Acceptance Criteria
- Research handles render only when attached content exists.
- Users can open research without leaving their current map context.
- Access to certain research items can be restricted by user entitlement.

---

### 9.7 Credentialed Access and User Context

#### Intent
Personalize and protect the experience.

#### Requirements
- The product must support credentialed access.
- The product must support user roles.
- Roles must influence:
  - what content is visible
  - what research is accessible
  - what edit/admin capabilities are available
- The product should store user preferences where permitted.

#### Acceptance Criteria
- Users must be able to authenticate and return to a remembered state.
- Role-restricted content must not be visible to unauthorized users.
- User role must be available to the contextual assistant and research system.

---

### 9.8 Offline Knowledge Bundle

#### Intent
Allow the product to remain useful without a live network connection.

#### Requirements
- The system should support an offline-capable content package for:
  - layers
  - components
  - flows
  - journeys
  - research summaries
  - indexed metadata
- User bookmarks, preferences, and recent context should be cached locally where appropriate.

#### MVP Note
Full offline support is not required for the first build, but the data architecture and client design must not prevent it.

#### Acceptance Criteria for Future Phase
- Core navigation and content rendering work offline from a packaged bundle.
- Research summaries remain accessible offline where rights allow.
- Contextual assistant can answer questions against local structured content and summaries.

---

### 9.9 Contextual Map Assistant

#### Intent
Provide explanation and discovery based on where the user is in the map.

#### Requirements
- The assistant must be aware of:
  - current layer
  - selected component
  - active mode
  - visible route or journey
  - attached research
  - user role / entitlements
- The assistant should support:
  - explain this
  - compare this to that
  - why does this matter
  - what does this control
  - show related flows
  - show relevant research

#### UX Guidance
The assistant should be embedded as a context panel, not a generic detached chatbox.

#### Acceptance Criteria
- Assistant responses are grounded in local product context.
- Suggested questions update as the user changes location in the map.
- Assistant does not expose content the user is not entitled to view.

---

## 10. Content and Data Model Requirements

The product must be data-driven. The UI should not assume a fixed set of vendors, layers, flows, or journeys.

### 10.1 Layer Entity
Fields should include:
- id
- name
- description
- order
- visual style or theme
- optional annotations
- optional research references

### 10.2 Component Entity
Fields should include:
- id
- name
- type
- layer_id
- description
- role
- control_points
- dependencies
- related_flows
- tags
- research_ids

### 10.3 Flow Entity
Fields should include:
- id
- name
- description
- entry_actor
- steps

Each step should include:
- id
- component_id or layer reference
- action
- explanation
- decision flag
- next step references
- optional journey step reference
- optional research references

### 10.4 Journey Entity
Fields should include:
- id
- flow_id
- title
- actor_view
- steps

Each journey step should include:
- id
- title
- type (ui, system, hybrid)
- description
- asset reference
- related component reference
- annotations

### 10.5 Research Entity
Fields should include:
- id
- title
- summary
- type
- source
- url or asset reference
- access classification
- related_entities

### 10.6 User Context Entity
Fields should include:
- id
- role
- entitlements
- preferences
- bookmarks
- recent history

### 10.7 Overlay / Mode Rules
Fields should include:
- mode id
- highlight rules
- visibility rules
- color overrides
- relationship emphasis rules

---

## 11. Detailed UX Requirements

### 11.1 Default Landing Experience
The user should land on a clean, high-level map of the ecosystem.

Visible by default:
- major capability regions / layers
- a manageable number of representative provider pins
- a legend or mode bar
- search
- clear indication of current mode

Hidden by default:
- dense dependency webs
- advanced flow detail
- overly verbose annotation text

The first screen should teach the model without overwhelming the user.

### 11.2 Journey Panel
When a user selects a route, there should be a persistent route or journey panel that serves as the UX anchor for:
- selected flow name
- actor type
- current step
- next step actions
- street view entry

### 11.3 Context Panel
A side panel should show current detail for the selected layer, component, or route.

### 11.4 Research Affordance
Research should never feel bolted on. A user should be able to see, at a glance, where evidence is available and open it without losing place.

### 11.5 Suggested Questions
The context assistant should offer suggested prompts such as:
- Why does this matter?
- What does this control?
- What is above and below this?
- Show related flows.
- Show supporting research.
- What changes in Agentic Mode?

---

## 12. Proposed Initial Map Structure

The initial map should be built around the following layered structure.

1. **Agentic Commerce**  
2. **Experience / Channels**  
3. **Orchestration / Control Plane**  
4. **Risk / Identity / Decisioning**  
5. **Wallets / Payment Interfaces**  
6. **Networks / Schemes**  
7. **Rails / Money Movement**  
8. **Core / System of Record**  
9. **Data / Rewards Overlay**  

This structure is important because it preserves the key distinctions surfaced in prior exploration:
- core remains foundational
- orchestration is a strategic action layer
- wallets are control surfaces
- schemes are governance and economics layers
- rails are movement pathways
- agents are a new actor class

---

## 13. Example Initial Flows

The PRD should not stop at generic references to “flows.” The MVP needs concrete examples to validate the product model.

### 13.1 Flow A: Traditional Card Payment

#### Purpose
Teach the relationship between user experience, wallet or checkout surface, card network, bank decisioning, settlement, and core recording.

#### Example Sequence
1. Human user initiates a payment in a merchant or banking experience.
2. Wallet or payment interface is selected or presented.
3. Orchestration layer identifies the payment context.
4. Risk and decisioning checks are performed.
5. Network / scheme path is engaged.
6. Authorization result is returned.
7. Core updates reflect the transaction record or related account state.
8. Rewards or analytics capture the event.

#### Why This Flow Matters
It demonstrates the distinction between:
- payment interface
- network rule layer
- core record layer
- and where bank control may be lost or retained

### 13.2 Flow B: Real-Time Account-to-Account Payment

#### Purpose
Teach the path where a bank or orchestrator may choose RTP or FedNow instead of a card-based route.

#### Example Sequence
1. Human or agent initiates transfer intent.
2. Orchestration evaluates eligible payment path.
3. Decisioning validates policy, identity, and risk.
4. Rail is selected (RTP or FedNow).
5. Movement occurs.
6. Core updates authoritative balances or records.
7. Notifications, analytics, and potential rewards triggers occur.

#### Why This Flow Matters
It helps users compare economics, timing, and control versus card flows.

### 13.3 Flow C: Agent-Assisted Payment

#### Purpose
Demonstrate how agentic commerce changes initiation and execution.

#### Example Sequence
1. User expresses an intent rather than manually completing a transaction.
2. Agent interprets intent within delegated permissions.
3. Orchestration evaluates options such as wallet, network, rail, timing, or reward logic.
4. Decisioning checks risk, permission, and policy constraints.
5. Execution path is selected and run.
6. Core records the resulting transaction state.
7. Evidence, research references, analytics, and optional rewards are updated.

#### Why This Flow Matters
It shows that agents are not just a chat layer. They alter initiation, routing, and control requirements.

---

## 14. Example Street View Journey

The MVP should include at least one fully realized street view journey so the product can prove the metaphor.

### Suggested Journey: Card Payment Journey

#### Journey Goals
Show the difference between:
- what the user experiences
- what the system is doing
- and where hidden control changes occur

#### Sample Steps
1. User lands on payment initiation screen.
2. User selects payment method or wallet.
3. System shows confirmation or intermediate UX state.
4. Under the hood, risk and decisioning step runs.
5. Network path is engaged and authorization occurs.
6. User receives success or challenge screen.
7. Core and analytics systems update state in the background.

#### Journey Presentation
Each step should show:
- title
- actor view
- screen asset or placeholder
- system action summary
- related component
- optional research handle
- optional annotation such as “bank control decreases here” or “scheme rule applies here”

---

## 15. Research Integration Requirements

Research should function as a first-class product capability.

### 15.1 Supported Research Types
- Industry reports and papers
- Vendor documents
- Internal theses or internal strategy notes
- Educational explainers
- Architecture diagrams or API documentation

### 15.2 Product Requirements
- Research can attach to layers, components, flows, and journey steps.
- Research access can be filtered by credential or role.
- Research can open in a side panel, modal, or downloadable link depending on asset type.
- Summaries should be stored separately from the full asset to support quick preview and future offline use.

### 15.3 Why This Matters
This shifts the product from:
- a clever explorable diagram

to:
- an evidence-backed navigation environment

---

## 16. Credentialed Context Requirements

### 16.1 Role-Based Use
The same map should support different levels of access and detail.

Example roles:
- public / demo
- internal user
- strategist
- admin / author

### 16.2 Entitlement Examples
Entitlements may control:
- access to proprietary research
- internal-only annotations
- edit / author tools
- future premium content
- specific flows or views

### 16.3 Personalized Context
The product should remember:
- last location
- preferred mode
- saved bookmarks
- recent research
- recent questions
- recent routes

This makes the map feel like a workspace, not a one-time slide.

---

## 17. Non-Functional Requirements

### 17.1 Performance
- Initial map load should feel responsive on modern desktop browsers.
- Mode toggles and panel updates should be quick enough to preserve a sense of direct manipulation.

### 17.2 Maintainability
- Content updates should be driven by structured data files or a future content service.
- Component definitions, flows, journeys, and research links must not require code changes.

### 17.3 Extensibility
- New vendors, layers, routes, and journey screens should be addable without redesigning the app.
- The architecture must preserve a path to future graph views, offline bundles, and richer assistants.

### 17.4 Security
- Credentialed content must respect role and entitlement boundaries.
- Restricted research cannot be exposed through the assistant or asset URLs.

### 17.5 Accessibility
- Keyboard navigation should be supported for major actions.
- Panels and routes should remain legible with reasonable contrast and screen scaling.

---

## 18. MVP Scope

### 18.1 Included in MVP

#### Core Navigation
- overview map
- layer selection
- component selection
- zoom / pan
- context panel

#### Modes
- Architecture Mode
- Payments Mode
- Control Mode

#### Flows
- 2 to 3 initial flows
- route stepping and autoplay

#### Street View
- 1 fully realized journey
- support for ui/system/hybrid steps

#### Research
- research handles
- summaries
- open/download links

#### Credentialing
- login
- role-aware content visibility
- basic saved preferences

#### Assistant
- context-aware Q&A limited to current map context and attached content

### 18.2 Explicitly Excluded from MVP

- full offline knowledge bundle
- full authoring studio
- advanced graph analytics
- market-data ingestion
- real-time vendor feed updates
- fully autonomous simulation engine
- advanced agent execution logic

---

## 19. Roadmap Beyond MVP

### Phase 2
- Risk / Decisioning Mode
- Agentic Mode
- additional routes and journeys
- richer research browsing
- bookmarks and saved map views

### Phase 3
- offline bundle
- stronger contextual assistant
- packaged research summaries
- advanced entitlements

### Phase 4
- graph-backed relationship exploration
- more advanced route comparison
- scenario builder
- premium content bundles
- internal author/admin workflows

---

## 20. Technical Direction (Product-Level)

This PRD is not a full technical design, but it assumes the following broad direction.

### Front End
- browser-based SPA
- component-driven UI
- map canvas plus context panels

### Visualization
- SVG or Canvas-based rendering
- or a node/edge library appropriate for stable route highlighting and spatial layouts

### Data
- structured JSON or YAML for MVP
- future API-backed content service

### Assistant
- retrieval-style context engine for MVP
- future local or remote LLM layer as needed

### Storage
- local preference and cache support
- future packaged offline bundle support

---

## 21. Success Metrics

The MVP should be considered successful if it demonstrates the following:

### Learning / Comprehension
- Users can explain a selected payment flow after a short guided session.
- Users can distinguish wallets, schemes, and rails more accurately after using the product.
- Users can identify where the core, orchestration, and decisioning layers each matter.

### Product Utility
- Users voluntarily use route and street view features rather than staying only on the overview map.
- Users access research handles while exploring.
- Users use contextual Q&A during exploration.

### Extensibility
- New components and research artifacts can be added through data changes only.
- New route definitions can be added without redesigning the route engine.

---

## 22. Key Risks and Mitigations

### Risk 1: The Product Becomes a Fancy Diagram
**Mitigation:** Prioritize route playback, street view, and contextual explanation in MVP.

### Risk 2: The Product Becomes Overbuilt Too Early
**Mitigation:** Keep MVP narrow and avoid graph analytics, authoring systems, or excessive modes in phase one.

### Risk 3: The UX Becomes Too Dense
**Mitigation:** Default landing view should be clean and layered. Density should reveal progressively.

### Risk 4: The Data Model Becomes Fragile
**Mitigation:** Define a stable schema early and keep content model modular.

### Risk 5: Research Integration Feels Bolted On
**Mitigation:** Research handles must be placed directly in the experience, not as a separate tab or hidden appendix.

### Risk 6: Context Assistant Feels Generic
**Mitigation:** Scope responses tightly to current location, active mode, attached content, and user role.

---

## 23. Open Questions

These do not block MVP, but they should be resolved as design and build proceed.

- Should the initial experience use a horizontal map only, or also support a swimlane route comparison view?
- Which exact initial entities are sufficient for MVP without overloading the dataset?
- Should street view open as a full-screen mode, side panel, or bottom-sheet-style sequence?
- What content rights model is needed if third-party research summaries are stored locally?
- How much of the assistant should be deterministic retrieval versus model-generated explanation in v1?

---

## 24. Final Product Framing

The Fintech Systems Explorer should not be positioned as just another market map or architecture viewer.

It is a product for navigating the industry as a system.

It should allow a user to:
- see the terrain
- switch lenses
- trace routes
- drop into journey view
- validate claims with evidence
- and ask grounded questions based on where they are

That is what makes it different.

A concise positioning line:

**Most people see fintech as a stack of logos. This product lets you navigate it like a world.**

---

## 25. Appendix A — Suggested Initial Entity Seeds

### Layers
- Agentic Commerce
- Experience / Channels
- Orchestration / Control Plane
- Risk / Identity / Decisioning
- Wallets / Interfaces
- Networks / Schemes
- Rails / Money Movement
- Core / System of Record
- Data / Rewards

### Components
- Visa
- Mastercard
- Paze
- Apple Pay
- RTP
- FedNow
- Zelle
- Infinant
- “Bank Policy Engine”
- “Personal AI Agent”
- Signature / Premier / other core examples

### Research Seeds
- Payment networks overview
- RTP overview
- FedNow overview
- Wallet / tokenization explainer
- Agentic commerce thought piece
- Decisioning / fraud / risk explainer

### Flows
- Card payment
- RTP transfer
- Agent-assisted payment

---

## 26. Appendix B — Suggested Figma-to-Product Transition

The initial design work may begin as a Figma prototype, but the product should be implemented against the structured content model from the start.

This avoids rebuilding the same concept repeatedly in design tools and ensures the eventual browser application stays aligned to the data-driven model.

The prototype should be used to validate:
- map layout
- panel behaviors
- route playback
- street view interaction
- research handle affordances
- contextual assistant placement

The build should then move into a browser implementation using the same core concepts and entity model described in this PRD.
