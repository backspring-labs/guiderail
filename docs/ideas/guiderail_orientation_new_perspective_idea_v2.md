# IDEA: Add an Orientation Perspective and Rebuild the GuideRail Starter Corpus Around the Real Application

## Status
Draft enhancement idea for the next GuideRail iteration.

## Summary
GuideRail should introduce **Orientation** as a new first-class perspective and use it as the foundation for a rebuilt starter corpus that teaches the product through the product itself.

The built-in corpus should model the actual GuideRail application across its perspectives so that a new user can understand:
- what GuideRail is
- how its perspective model works
- how a guided walkthrough progresses
- how concepts connect from product intent to operational flow to architecture to runtime systems
- how the same model can later be applied to an external domain corpus

This enhancement gives GuideRail a stronger onboarding experience, a more honest starter dataset, and a much clearer explanation of the product’s underlying model.

The central idea is simple:

> The default corpus should teach GuideRail by modeling GuideRail.

That means the starter data should represent:
- GuideRail’s own product concepts
- GuideRail’s own domains and capabilities
- GuideRail’s own user journeys
- GuideRail’s own operational workflows
- GuideRail’s own architecture
- GuideRail’s own system participants
- GuideRail’s own guided walkthrough execution flow

Orientation becomes the entry point that makes the rest of that traversal understandable.

---

## Core Intent
This enhancement is about making GuideRail legible, teachable, and extensible from the very first run.

The intent is to:

- give the product a true onboarding perspective rather than forcing users to infer meaning from downstream views
- let the starter corpus explain the actual application rather than a borrowed sample domain
- show that the perspective model is a real explanatory system, not just a set of diagram types
- demonstrate how GuideRail connects semantic concepts to journeys, processes, architecture, systems, and sequence
- make the canonical model visible enough that future users understand what kind of structure their own corpus will need
- create a worked example of how ingestion and mapping rely on a stable internal model
- strengthen the bridge between product understanding and technical implementation understanding

At a deeper level, this enhancement makes GuideRail self-describing in the best possible way: the product becomes a living reference implementation of its own explanatory method.

---

## Why This Matters
A first-time user who clones GuideRail should not have to reverse-engineer the product from the outside in.

They should be able to answer, quickly and clearly:

- What is this application for?
- What are these perspectives?
- How do they relate?
- What is the intended tour path?
- What kind of data model powers this?
- How does a topic stay linked as I move from one view to another?
- What would I need in my own application or corpus to make this work?

Those last two questions matter a great deal.

GuideRail is not only a viewer. It is a traversal engine driven by a **canonical internal model**. For an external corpus to work well inside GuideRail, that corpus needs to be ingested and mapped into a structure that preserves identity, relationships, semantics, and cross-perspective continuity.

The starter corpus should teach that implicitly and explicitly.

That is one of the most valuable outcomes of this enhancement:
someone using GuideRail should begin to understand that a guided traversal experience depends on a canonical model inside the app, even if the source material originally came from many different formats.

---

## Product Framing
GuideRail is easiest to understand when separated into three layers.

### 1. The GuideRail application
The real software product:
- app shell
- navigation
- route handling
- perspective switching
- view rendering
- detail panes
- state preservation
- content ingestion
- relationship traversal
- context mapping
- guided walkthrough progression

### 2. The built-in starter corpus
A curated corpus that comes with GuideRail to teach the product and demonstrate the perspective model.

### 3. The user’s external corpus
A separate corpus the user eventually points GuideRail to, after the starter pack has taught them the shape of the model.

This enhancement sharpens the distinction between those layers while using the starter corpus to explain how they connect.

---

## Proposed Perspective Order
With Orientation added, the most natural walkthrough becomes:

**Orientation → Landscape → Journey → Process → Architecture → System → Sequence**

That path works because it mirrors how understanding matures:

- first the user gets grounded
- then they see the map of product areas
- then they see what users are trying to accomplish
- then they see how those goals are operationalized
- then they see the structural design behind those operations
- then they see the runtime participants involved
- then they see the time-ordered interaction of those participants

GuideRail should make that progression feel deliberate.

---

# Orientation Perspective

## Purpose
Orientation gives the user the semantic and navigational grounding needed to interpret the rest of the product.

It should answer:
- what GuideRail is
- what this starter corpus is for
- what the perspectives mean
- how the user should move through them
- what the user is expected to learn
- what kind of internal model powers the experience
- how a future external corpus would need to map into that model

Orientation is not just a help screen. It is the opening layer of the walkthrough.

## Orientation content themes
Orientation should cover:
- GuideRail overview
- perspective overview
- walkthrough objectives
- terminology and semantics
- modeling conventions
- starter corpus purpose
- canonical model explanation
- ingestion and mapping overview
- how to replace the starter corpus later

## Example Orientation entities
- orient.guiderail_overview
- orient.perspective_model
- orient.walkthrough_objectives
- orient.modeling_conventions
- orient.canonical_model_intro
- orient.ingestion_mapping_intro
- orient.replace_with_your_corpus

## Why Orientation improves the product
Without Orientation, users are dropped directly into mapped content.  
With Orientation, they understand how to read that content, why it is structured the way it is, and how the rest of the perspectives build on it.

That makes every other view more meaningful.

---

# Rebuilt Starter Corpus: Model GuideRail Itself

## Purpose
The starter corpus should explain the GuideRail application by modeling the GuideRail application.

That means the corpus should be intentionally self-referential in a useful way:
not as a gimmick, but as a complete worked example of how the GuideRail model functions.

The corpus should show that one topic can be carried through:
- semantic framing
- business-facing map
- user intent
- operational flow
- structural realization
- runtime participation
- temporal interaction

That continuity is the heart of the product.

---

# Perspective-by-Perspective Content Model

## 1. Orientation
Ground the user in:
- what the product is
- how the walkthrough works
- why perspectives exist
- how the canonical model binds everything together

## 2. Landscape
Show the actual GuideRail product areas and capabilities.

### Example domains
- domain.orientation
- domain.content_model
- domain.ingestion_mapping
- domain.tour_navigation
- domain.visualization
- domain.explanation_inspection
- domain.application_platform

### Example capabilities
- cap.orientation_overview_delivery
- cap.orientation_tour_guidance
- cap.content_entity_management
- cap.content_relationship_mapping
- cap.content_perspective_binding
- cap.source_ingestion
- cap.schema_mapping
- cap.entity_resolution
- cap.model_validation
- cap.guided_tour_launch
- cap.cross_perspective_transition
- cap.highlight_focus_management
- cap.landscape_rendering
- cap.journey_rendering
- cap.process_rendering
- cap.architecture_rendering
- cap.system_rendering
- cap.sequence_rendering
- cap.detail_panel_explanation
- cap.semantic_lookup
- cap.route_state_management
- cap.view_state_persistence
- cap.runtime_configuration

Landscape should help the user see that GuideRail has its own real operating domains, not just borrowed subject matter.

## 3. Journey
Show what a user is trying to accomplish inside GuideRail.

### Example journeys
- journey.take_first_guided_tour
- journey.trace_a_topic_across_perspectives
- journey.explain_how_guiderail_works
- journey.load_custom_corpus

Journey stays user-intent centric even when the subject is GuideRail itself.

## 4. Process
Show how user intent becomes operational behavior.

### Example processes
- proc.launch_guided_walkthrough_v1
- proc.switch_perspective_with_context_v1
- proc.inspect_entity_details_v1
- proc.load_external_corpus_v1

Process is where the starter corpus starts to connect visibly to real application behavior:
- route resolution
- state transitions
- content lookup
- view-model assembly
- renderer invocation
- detail-panel updates
- preserved focus across perspective changes

## 5. Architecture
Show the structural design of GuideRail.

### Example architecture components
- arch.app_shell
- arch.navigation_router
- arch.tour_orchestrator
- arch.perspective_registry
- arch.view_model_builder
- arch.content_repository
- arch.mapping_ingestion_pipeline
- arch.selection_context_service
- arch.rendering_components
- arch.detail_explainer
- arch.config_runtime_layer
- arch.canonical_model_layer

Architecture should make the structure behind the walkthrough visible.

## 6. System
Show the runtime participants that make the walkthrough actually happen.

### Example system participants
- sys.web_client
- sys.route_state_manager
- sys.tour_controller
- sys.content_service
- sys.mapping_service
- sys.config_store
- sys.source_repository
- sys.telemetry_service
- sys.model_store

System should make runtime participation concrete.

## 7. Sequence
Show how those runtime participants interact over time during a walkthrough.

### Example sequences
- seq.first_walkthrough_across_perspectives_v1
- seq.perspective_switch_with_preserved_focus_v1
- seq.entity_selection_and_detail_expansion_v1
- seq.external_corpus_ingestion_and_publish_v1

Sequence should prove that the walkthrough is an actual application behavior, not just static documentation.

---

# Architecture and System Need to Teach the Canonical Model

One of the most important additions to this revision is the role of **Architecture** and **System** in teaching why GuideRail needs a canonical internal model.

That point is strategically important.

If a user later wants to point GuideRail at their own corpus, they need to understand that GuideRail cannot simply render arbitrary source files directly and still preserve meaningful traversal.

It needs an internal representation that can answer questions such as:
- what is this entity
- what kind of thing is it
- what relationships does it have
- what perspectives can represent it
- what linked entities correspond to it in other perspectives
- what topic or focus should remain preserved when the user switches views
- what metadata is required to build each view model

Architecture and System are the best places to make that visible.

## What Architecture should teach
Architecture should show that GuideRail relies on a deliberate internal structure to support cross-perspective traversal.

That structure likely includes:
- a canonical entity model
- relationship definitions
- perspective bindings
- mapping logic from source artifacts into internal entities
- view-model builders that translate the canonical model into perspective-specific render data
- selection/focus context services that preserve continuity across views

Architecture should help the user understand:
“there is an internal model layer here, and that is what makes the walkthrough coherent.”

### Canonical model as an architecture concern
The canonical model layer is what allows GuideRail to normalize diverse source content into a consistent traversal structure.

Examples of what that layer may need:
- stable identifiers for entities
- entity types
- relationship types
- perspective eligibility/bindings
- semantic tags
- lineage or provenance back to source artifacts
- validation rules to ensure the graph is navigable

That means Architecture is not only showing components.  
It is showing why those components exist and how they support the product promise.

## What System should teach
System should show where those architectural responsibilities live at runtime.

For example:
- the source repository provides raw artifacts
- the mapping service transforms those artifacts into the canonical model
- the model store or content service serves canonical entities and relationships
- the route/state manager preserves focus and navigation context
- the renderer consumes view models generated from canonical data
- the tour controller coordinates progression using linked entities across perspectives

System should help the user understand:
“these are the runtime participants that operationalize the canonical model.”

That is a powerful lesson for anyone hoping to apply GuideRail to another application or corpus.

---

# Why the Canonical Model Is So Important for Ingestion Mapping

A person adopting GuideRail may assume they can point the product at an arbitrary docs folder, wiki, or application model and immediately get a coherent walkthrough.

In practice, the quality of the experience depends on mapping that source material into a stable internal model.

That is why this idea should explicitly teach the concept.

## What ingestion mapping really has to do
Ingestion mapping is not just “load content.”  
It has to:

- identify meaningful entities from source artifacts
- classify them into GuideRail’s model
- establish stable identifiers
- derive or assign relationships
- connect concepts across perspectives
- validate that the resulting graph is traversable
- preserve enough semantics that the app can explain continuity between views

Without that, the walkthrough becomes fragile or shallow.

## What the user should learn from the starter corpus
The starter corpus should quietly but clearly teach:
- GuideRail works because it has a canonical model
- the canonical model enables cross-perspective continuity
- ingestion is the act of mapping source material into that model
- the better the mapping, the better the walkthrough

That lesson has real product value because it prepares users to design their own content pipeline and application model more intelligently.

---

# Example Architecture Storyline for the Guided Tour

A helpful GuideRail walkthrough could show this progression:

1. **Orientation** introduces the idea that GuideRail is powered by a canonical internal model.
2. **Landscape** shows a domain such as ingestion/mapping and a capability such as content relationship mapping.
3. **Journey** shows the user goal of loading and exploring a corpus.
4. **Process** shows the workflow that ingests a source, maps it, validates it, and publishes it for traversal.
5. **Architecture** shows the mapping pipeline, canonical model layer, content repository, view-model builders, and focus/context services.
6. **System** shows the runtime participants that execute those responsibilities.
7. **Sequence** shows the time-ordered interaction from source ingestion to rendered traversal.

This is where the product becomes deeply teachable.

The user is no longer only seeing “screens.”  
They are seeing how the screens are made possible by a modeled and operationalized architecture.

---

# Example System Storyline for the Guided Tour

System can make the runtime chain visible:

- the user initiates a walkthrough
- the web client issues a route change
- the tour controller resolves the next step
- the content service queries canonical entities
- the model store provides linked relationships
- the view-model builder assembles renderable data
- the renderer displays the next perspective
- the route/state manager preserves focus
- the detail explainer resolves annotations and linked navigation

That helps the user understand the runtime discipline required to preserve a coherent guided experience.

---

# Example Seed Entity Expansion

## Orientation
- orient.guiderail_overview
- orient.perspective_model
- orient.walkthrough_objectives
- orient.modeling_conventions
- orient.canonical_model_intro
- orient.ingestion_mapping_intro
- orient.replace_with_your_corpus

## Landscape domains
- domain.orientation
- domain.content_model
- domain.ingestion_mapping
- domain.tour_navigation
- domain.visualization
- domain.explanation_inspection
- domain.application_platform

## Capabilities
- cap.orientation_overview_delivery
- cap.orientation_tour_guidance
- cap.content_entity_management
- cap.content_relationship_mapping
- cap.content_perspective_binding
- cap.source_ingestion
- cap.schema_mapping
- cap.entity_resolution
- cap.model_validation
- cap.guided_tour_launch
- cap.cross_perspective_transition
- cap.highlight_focus_management
- cap.landscape_rendering
- cap.journey_rendering
- cap.process_rendering
- cap.architecture_rendering
- cap.system_rendering
- cap.sequence_rendering
- cap.detail_panel_explanation
- cap.semantic_lookup
- cap.route_state_management
- cap.view_state_persistence
- cap.runtime_configuration

## Journeys
- journey.take_first_guided_tour
- journey.trace_a_topic_across_perspectives
- journey.explain_how_guiderail_works
- journey.load_custom_corpus

## Processes
- proc.launch_guided_walkthrough_v1
- proc.switch_perspective_with_context_v1
- proc.inspect_entity_details_v1
- proc.load_external_corpus_v1
- proc.map_source_artifacts_to_canonical_model_v1

## Architecture
- arch.app_shell
- arch.navigation_router
- arch.tour_orchestrator
- arch.perspective_registry
- arch.view_model_builder
- arch.content_repository
- arch.mapping_ingestion_pipeline
- arch.selection_context_service
- arch.rendering_components
- arch.detail_explainer
- arch.config_runtime_layer
- arch.canonical_model_layer

## Systems
- sys.web_client
- sys.route_state_manager
- sys.tour_controller
- sys.content_service
- sys.mapping_service
- sys.config_store
- sys.source_repository
- sys.telemetry_service
- sys.model_store

## Sequences
- seq.first_walkthrough_across_perspectives_v1
- seq.perspective_switch_with_preserved_focus_v1
- seq.entity_selection_and_detail_expansion_v1
- seq.external_corpus_ingestion_and_publish_v1
- seq.source_to_canonical_model_to_rendered_view_v1

---

# Suggested Guided Tours

## Tour 1: Understand GuideRail as a product
1. start in Orientation
2. review the perspective model
3. inspect the GuideRail domains and capabilities in Landscape
4. follow a user journey
5. inspect the operational realization in Process
6. inspect the structural realization in Architecture
7. inspect the runtime participants in System
8. inspect the time-ordered walkthrough behavior in Sequence

## Tour 2: Understand how one topic stays linked across perspectives
1. start from a capability in Landscape
2. follow it into a Journey
3. inspect the related Process
4. inspect the supporting Architecture components
5. inspect the runtime participants in System
6. inspect the linked temporal flow in Sequence

## Tour 3: Understand how a user corpus would need to map into GuideRail
1. start in Orientation with canonical model and ingestion concepts
2. inspect the ingestion/mapping domain in Landscape
3. follow the load-custom-corpus Journey
4. inspect the mapping Process
5. inspect the canonical model layer and ingestion pipeline in Architecture
6. inspect the mapping service and model store in System
7. inspect the source-to-canonical-model Sequence

---

# Implementation Notes

## Product implications
This enhancement likely requires:
- a new Orientation perspective definition
- routing/view support for Orientation
- seed entities and relationships for Orientation
- additional cross-perspective bindings starting from Orientation
- starter corpus updates across all perspectives

## Modeling implications
The starter corpus should make the canonical model visible enough that users understand its role without being buried in implementation detail.

That means the seed should express:
- stable entities
- explicit relationships
- cross-perspective topic continuity
- mapping from source concerns into internal modeled concerns

## Architecture implications
Architecture should expose the internal model and the components that depend on it:
- canonical model layer
- ingestion/mapping pipeline
- content repository
- view-model builders
- selection/focus context services

## System implications
System should expose the runtime participants that operationalize those responsibilities:
- source repository
- mapping service
- content service
- model store
- route/state manager
- tour controller
- renderer

## Strategic implication
This enhancement helps a future user understand not only how to use GuideRail, but how to prepare their own application or corpus so GuideRail can traverse it meaningfully.

That is a major value-add.

---

# Recommendation
Proceed with this as the next GuideRail enhancement.

Recommended direction:
1. add Orientation as a new first-class perspective
2. make Orientation the entry point to the built-in walkthrough
3. rebuild the starter corpus around the real GuideRail application
4. model actual GuideRail domains and capabilities in Landscape
5. represent real user goals in Journey
6. let Process reflect real GuideRail workflows
7. let Architecture explain the structural model that enables traversal
8. let System explain the runtime participants that operationalize that model
9. let Sequence show the actual interaction flow across perspectives
10. explicitly teach the importance of the canonical model for ingestion and mapping

---

# Closing Framing
The strongest GuideRail starter experience is one that teaches three things at once:

- how to use the product
- how the product works
- what kind of model a future corpus will need in order to work well inside the product

Orientation provides the grounding layer that makes that possible.

The rebuilt starter corpus then carries that grounding through Landscape, Journey, Process, Architecture, System, and Sequence so the user can see one continuous story from meaning to execution.

That is what makes this enhancement valuable.
