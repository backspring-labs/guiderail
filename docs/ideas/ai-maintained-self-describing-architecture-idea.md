# IDEA — AI-Maintained Self-Describing Architecture for Guided Stakeholder Tours
_Date: 2026-04-04_

## 1. Purpose

This idea captures the next product direction for GuideRail:

> Use AI to continuously generate and refresh the canonical architecture model from existing source systems, so the system becomes increasingly self-describing and can support guided tours for different stakeholder audiences without heavy manual curation.

The goal is not to return to the old enterprise architecture model where a canonical library only stays useful if a team spends years manually maintaining diagrams, metadata, and cross-links.

The goal is to make GuideRail a **living semantic layer over real system sources**.

---

## 2. What GuideRail Is For

GuideRail is for helping people understand a complex system from different angles without losing the thread between business intent and implementation reality.

The product is especially useful when different stakeholders need different tours over the same underlying architecture:

- executives need capability and value-stream understanding
- product and operations teams need journeys, process flow, and risk/control context
- architects need system boundaries, ownership, dependencies, and evolution paths
- engineers need APIs, sequences, code references, and implementation evidence
- control, compliance, and audit teams need traceability from business process to control points and source evidence

The product thesis is that all of those views should come from one canonical model, not from one-off diagrams and throwaway presentations.

---

## 3. Core Thesis

The most important design bet is this:

> AI should not become the source of truth. AI should become the indexer, reconciler, summarizer, and tour composer over source-of-truth systems.

That means GuideRail should separate two responsibilities:

### Canonical model maintenance
AI and deterministic reconciliation keep the architecture graph current by reading code, docs, schemas, process definitions, and platform metadata.

### Guided architecture presentation
GuideRail uses the refreshed graph to generate and run stakeholder-specific tours, perspectives, and drill-down paths.

This separation matters because a beautiful tour is only useful if the model underneath it remains trustworthy and cheap to maintain.

---

## 4. The Problem to Solve

The historical failure mode of enterprise architecture repositories is not that the model is useless. It is that the model becomes expensive to keep current.

Common failure modes:

- architecture diagrams drift from code and platform reality
- process maps and API behavior evolve independently
- control libraries and implementation evidence lose traceability
- documentation describes an older version of the system
- nobody owns the full cross-perspective linkage
- maintaining the canonical library becomes a manual governance burden

GuideRail should aim to break that pattern by turning maintenance into a mostly automated refresh loop driven by existing sources.

---

## 5. Desired Product Behavior

### 5.1 A continually self-described system

The system should be able to answer:

- what domains and capabilities exist
- what journeys and processes exercise them
- what systems, interfaces, and messages participate
- what control points and policy obligations matter
- what code, config, docs, and runtime artifacts support those claims
- what changed recently, what is stale, and what is inferred rather than verified

### 5.2 Tours that adapt to stakeholder intent

A user should be able to ask for a guided route such as:

- “Explain account onboarding to a new product manager”
- “Walk an engineer from business capability to the relevant services and APIs”
- “Show the control and evidence path for this regulated process”
- “Give an executive summary of this value stream, then let me drill into one risky dependency”

The route should be generated from the canonical graph, but every stop should remain traceable to model objects and evidence.

### 5.3 Human review by exception, not full manual authorship

Humans should not need to hand-author most of the canonical model.

Instead, humans should mostly review:

- proposed entity merges/splits
- ambiguous mappings
- low-confidence inferred relationships
- breaking model diffs after source changes
- high-value route curation where a specific narrative matters

The operating model should be **curate exceptions, not rebuild the library by hand**.

---

## 6. Proposed Architecture Concept

## 6.1 Source Adapter Layer

Adapters ingest facts and artifacts from source systems such as:

- code repositories
- OpenAPI / AsyncAPI specs
- database schemas
- BPMN / process definitions
- service catalogs
- IaC and deployment metadata
- docs, ADRs, runbooks, Confluence-like knowledge sources
- control libraries, policies, and evidence repositories
- optionally runtime traces and telemetry for observed interaction paths

Each adapter should preserve enough source identity to support incremental refresh and provenance.

## 6.2 AI Extraction and Normalization Layer

AI maps raw source artifacts into candidate canonical entities and relationships:

- domains
- capabilities
- value streams
- journeys
- processes and stages
- nodes/systems/components
- interfaces
- messages/sequences
- control points
- evidence references
- candidate story routes

This layer can infer structure and summarize semantics, but it should produce **structured proposals**, not directly mutate trusted state.

## 6.3 Deterministic Validation and Reconciliation Layer

After AI proposes model updates, deterministic logic should decide:

- whether entity references are valid
- whether IDs should be preserved, merged, split, or deprecated
- whether a relationship conflicts with existing constraints
- whether a source artifact removal should delete, retire, or merely downgrade confidence
- whether a route can still be replayed after a model change

This is where GuideRail protects model integrity and avoids turning the graph into ungoverned AI output.

## 6.4 Provenance, Confidence, and Freshness Layer

Every meaningful model object and relationship should carry:

- source artifact references
- extraction method
- last observed timestamp
- confidence / verification status
- stale or drift indicators
- optionally competing hypotheses when the mapping is ambiguous

This is critical for trust. A stakeholder tour should be able to distinguish:

- “verified from source”
- “generated summary over verified source”
- “inferred relationship, needs review”
- “possibly stale, source changed since last reconciliation”

## 6.5 Canonical Graph and Route Layer

Once reconciled, the canonical graph becomes the reusable substrate for:

- free exploration
- perspective switching
- generated stakeholder tours
- curated story routes
- impact analysis and change review
- traceability from business concepts to code and evidence

This maps naturally to the current GuideRail direction: `core` owns the canonical model and navigation semantics, while `web` presents stakeholder-specific traversal experiences.

---

## 7. Refresh Loop

A possible operating loop:

1. **Observe source change**
   A repo, schema, process definition, or service catalog entry changes.

2. **Scope the affected region**
   Identify which source artifacts and model entities need re-extraction.

3. **Generate candidate model updates**
   AI proposes entity/relationship additions, edits, retirements, summaries, and route updates.

4. **Validate and reconcile**
   Deterministic checks enforce schema validity, referential integrity, and ID continuity rules.

5. **Produce a model diff**
   Show what changed, why it changed, and what evidence supports it.

6. **Auto-promote safe changes, queue uncertain ones**
   High-confidence mechanical updates can land automatically; ambiguous semantic changes go to review.

7. **Refresh tours and perspectives**
   Existing routes are checked for breakage or improved with newer evidence; new stakeholder tours can be generated from the updated graph.

This turns GuideRail from a manually maintained diagram repository into a continuously refreshed architecture knowledge system.

---

## 8. Key Design Principles

### One canonical graph, many stakeholder lenses
Different tours and perspectives should not fork the truth. They should traverse the same underlying model with audience-specific framing.

### AI proposes, deterministic rules protect
Use AI where interpretation and summarization are valuable, but preserve a hard validation/reconciliation layer so the model does not drift into plausible nonsense.

### Provenance is a first-class feature
If a route cannot explain where a claim came from, the system will eventually lose trust.

### Prefer incremental refresh over periodic big-bang remodeling
The system should behave more like a continuously indexed architecture graph than a quarterly EA documentation project.

### Preserve route intent while refreshing route content
A curated route may keep its narrative objective even as the underlying entities or evidence evolve.

### Optimize for review workflows, not manual diagramming
The product should make “accept/reject/adjust this model diff” easier than hand-maintaining the model.

---

## 9. Product Implications for GuideRail

This idea suggests a few concrete product capabilities:

- a model ingestion/reconciliation pipeline behind the current canonical entities
- a model diff and review experience
- evidence and confidence indicators in detail panels and routes
- “generated route from objective/audience” workflows
- route health checks when source changes invalidate a waypoint or sequence
- an explicit distinction between curated and generated narrative layers
- source freshness and drift status surfaced directly in the UI

It also suggests that `adapters`, `indexing`, and `provenance` should become more central to the product, not secondary infrastructure.

---

## 10. Major Risks and Open Questions

### Risk: AI-generated structure becomes unstable
If IDs, relationships, and labels churn too much between refreshes, routes and user trust will suffer.

Open question:
What identity-resolution strategy should preserve stable canonical objects across repeated extractions?

### Risk: the model becomes overconfident
AI may infer clean relationships where the source reality is partial or contradictory.

Open question:
How should confidence, ambiguity, and competing mappings be represented in the canonical model and UI?

### Risk: generated tours become generic
If stakeholder routes are only summarized from graph structure, they may feel accurate but not insightful.

Open question:
Which parts of a route should be generated automatically, and which parts deserve durable human-authored narrative intent?

### Risk: source coverage is uneven
Some systems have strong machine-readable artifacts; others only have sparse docs or tribal knowledge.

Open question:
How should GuideRail represent “known unknowns” so users understand where the map is incomplete?

### Risk: governance reappears through the back door
If every generated change requires human approval, the product may recreate the same maintenance burden it was meant to eliminate.

Open question:
What rules define safe auto-promotion versus mandatory review?

---

## 11. Possible First Implementation Slice

A practical first slice could be:

1. pick one or two source types that are already close to the model, such as code repo structure plus OpenAPI
2. generate canonical nodes/interfaces/messages/evidence refs into the existing schema
3. add provenance and confidence metadata to the generated entities
4. implement a model diff report for refreshed extractions
5. manually curate one stakeholder route over that generated graph
6. then test whether a source change can refresh the graph while preserving route intent and stable object identity

That would validate the core product bet without trying to solve every source adapter and every AI workflow at once.

---

## 12. Closing Thought

The deeper opportunity is that GuideRail can become a **living narrative interface over a continuously refreshed architecture graph**.

If the canonical model can be generated, reconciled, and kept trustworthy from real sources, then guided tours stop being expensive one-off architecture theater and become a durable way to explain the system to any audience.

That is the product direction this idea is meant to explore.
