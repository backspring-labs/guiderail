# IDEA v2 — Self-Describing Architecture and AI-Refreshed Guided Tours
_Date: 2026-04-04_

## Product Thesis

GuideRail should become a **living architecture navigation system** where the canonical model is continuously refreshed from source-of-truth systems, and AI helps generate stakeholder-specific guided tours over that model.

The key bet:

> AI should maintain and explain the architecture graph, but real source systems remain the authority.

So the product is not “AI invents architecture documentation.”  
It is “AI keeps the architecture model synchronized with code, APIs, process definitions, platform metadata, and docs, then GuideRail turns that model into explainable tours.”

## What This Is For

This is for organizations where the architecture picture matters, but manually maintaining a canonical EA repository is too expensive and always goes stale.

GuideRail should help:

- executives understand domains, capabilities, value streams, and risk hotspots
- product/ops teams understand journeys and process execution
- architects understand system boundaries and dependencies
- engineers trace from business context to APIs, services, and code evidence
- compliance teams trace processes to controls and supporting evidence

One model, many stakeholder lenses, no throwaway diagram copies.

## Target Architecture

## 1. Source Ingestion Layer

Adapters read existing artifacts:

- repos and code structure
- OpenAPI / AsyncAPI specs
- BPMN or workflow definitions
- service catalogs
- database schemas
- IaC/deployment metadata
- docs, ADRs, runbooks
- control and policy repositories

Each extracted fact should retain source identity and timestamps so refresh can be incremental.

## 2. AI Extraction Layer

LLMs turn source artifacts into **candidate canonical entities and relationships**:

- domains, capabilities, value streams
- journeys, processes, stages
- systems, components, interfaces, messages
- control points and evidence refs
- candidate story routes for different audiences

Important rule: AI produces structured proposals, not trusted state directly.

## 3. Deterministic Reconciliation Layer

Code, not the LLM, decides whether candidate updates are safe to promote.

This layer should enforce:

- schema validity
- referential integrity
- stable ID preservation
- merge/split/deprecate rules
- route compatibility checks
- source removal vs stale/inactive semantics

This is the layer that prevents the graph from becoming plausible but unstable AI output.

## 4. Provenance and Confidence Layer

Every entity, relationship, summary, and route step should be able to answer:

- where did this come from?
- when was it last observed?
- was it directly extracted, generated from verified source, or inferred?
- how confident is the system?
- is this stale or contradicted by newer source changes?

That trust metadata should be visible in GuideRail, not hidden in pipeline internals.

## 5. Canonical Graph + Tour Layer

The reconciled model becomes the substrate for:

- free exploration
- perspective switching with shared context
- curated story routes
- AI-generated stakeholder tours
- impact/change review
- traceability from business concepts to implementation evidence

This aligns well with the existing repo shape:

- `packages/core` = canonical model, navigation context, graph semantics, adapters/indexing/provenance
- `apps/web` = stakeholder-facing exploration and guided tour UI

## Refresh Loop

1. Detect source change in repo/spec/docs/workflow/catalog.
2. Re-extract only the impacted slice.
3. Ask AI for candidate model updates and route/story suggestions.
4. Run deterministic reconciliation and validation.
5. Produce a model diff with provenance and confidence.
6. Auto-promote safe changes and queue ambiguous changes for human review.
7. Recompute affected perspectives/routes and flag broken or stale tour waypoints.

The operating goal is **review exceptions, not hand-author the architecture library**.

## First Implementation Slices

## Slice 1: Generated Technical Graph From Code + API Specs

Start with one bounded ingestion path:

- code repo structure/imports -> nodes and edges
- OpenAPI specs -> interfaces and messages
- source files/spec files -> evidence refs

Output should land in the existing canonical schema, with provenance attached.

Success criterion:
GuideRail can regenerate a technical slice of the graph from source and preserve enough stable identity for existing navigation to keep working.

## Slice 2: Model Diff and Review

Build a diff artifact for refresh runs:

- added/changed/retired entities
- relationship changes
- confidence changes
- source evidence for each change
- suspected breaking route impacts

Success criterion:
A human can review a refresh run like a code review instead of manually editing architecture objects.

## Slice 3: AI-Generated Stakeholder Route Drafts

Given an audience + objective + scope, generate a draft story route over canonical objects, for example:

- “Explain this capability to a new engineer”
- “Walk an auditor through this process and its control evidence”
- “Give an exec-level route through this value stream and its major dependencies”

Success criterion:
The generated route is navigable in GuideRail, traceable to canonical objects, and editable into a durable curated route.

## Slice 4: Staleness and Trust Indicators in the UI

Expose provenance/freshness directly in panels and routes:

- verified from source
- inferred, needs review
- stale since source changed
- missing evidence

Success criterion:
Stakeholders can tell when they are looking at trustworthy architecture versus an inferred or aging description.

## Design Principles

- One canonical graph, many audience-specific routes.
- AI proposes and summarizes; deterministic rules reconcile and guard.
- Provenance and confidence are first-class product features.
- Preserve object identity and route intent across refreshes.
- Optimize for incremental refresh, not big-bang remodeling.
- Human effort should focus on high-value curation and resolving ambiguity.

## Major Risks

- Stable identity is hard: repeated AI extraction may rename/resegment entities and break route continuity.
- Confidence can be misleading: inferred links may look cleaner than the source reality.
- Generated tours may be accurate but bland unless route intent and audience framing are handled well.
- Source coverage will be uneven, so the product must represent unknowns and gaps honestly.
- If review workflows are too heavy, the old EA maintenance burden returns in a new form.

## Open Questions

- What is the ID strategy for preserving entity continuity across repeated extractions?
- What confidence model is simple enough to ship but honest enough to be useful?
- Which changes are safe to auto-promote, and which always need review?
- How much of a route should be AI-generated versus human-authored narrative intent?
- Should runtime telemetry be part of the first refresh loop, or come after static source ingestion is stable?

## Recommended Near-Term Direction

The highest-leverage next move is probably:

1. define a source-backed refresh pipeline for one narrow technical slice
2. attach provenance/confidence to generated canonical entities
3. build a model diff/review artifact
4. prove that one stakeholder route can survive a source refresh without becoming stale or breaking identity

If that works, GuideRail’s product story becomes much stronger:

> not just a guided architecture viewer, but a continuously refreshed, source-backed narrative layer over the system.
