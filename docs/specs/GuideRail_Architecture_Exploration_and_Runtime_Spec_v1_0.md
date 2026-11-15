---
id: GUIDERAIL-SPEC-2026-11-14
product: GuideRail
title: Architecture Exploration, Assessment, and Runtime/Deployment Specification
version: 1.0
status: PROPOSED
date: 2026-11-14
owner_role: Product Owner
intended_repository: backspring-labs/guiderail
supersedes: none
---

# GuideRail — Architecture Exploration, Assessment, and Runtime/Deployment Specification

**Status:** Proposed product and implementation direction, not a claim that all features exist.  
**Core thesis:** *Dynmap for software*: aim GuideRail at an existing codebase, reveal an explorable, evidence-linked map, and keep it current as the project evolves.

**Revision note (2026-11-14):** This v1.0 baseline incorporates independent release certification in Section 18 and strengthens the related DoD and release gates. It specifies acceptance requirements; it does not report a certification result.

**Revision note (2026-11-15):** The release milestone numbers in Section 14 were shifted by one minor version. GuideRail 0.8.0 was released on 2026-11-15 as the repository-foundation release, which contains none of this specification's capabilities. The milestones first numbered 0.8, 0.9 and 0.9.5 are therefore 0.9, 0.10 and 0.11. Their content and order are unchanged, and 1.0 is unchanged.

## 1. Executive decision

GuideRail is a **lightweight, repository-agnostic architecture explorer and engineering decision-support tool**. It connects **business intent on the left** to **technical implementation on the right**, exposing relationships, evidence, uncertainty, risks, and opportunities for growth. It is not principally a documentation generator and does not require target projects to adopt a GuideRail schema, SDK, folder layout, build system, or runtime.

The product is **one GuideRail UI and one architecture model** with two independent choices:

1. **Adoption** — point at an existing repo/workspace (external attachment), or install optional GuideRail tooling as a development dependency/plugin (embedded developer workflow).
2. **Deployment** — publish a compact, project-hosted static companion (e.g., `/guiderail`), or operate a central hub for multiple projects.

These are orthogonal axes, **not four separate product implementations**. The companion requires no GuideRail backend, MCP server, or privileged process inside the target application. The hub may operate shared scanning, persistence, authentication, APIs, and optional read-only MCP **once for the hub**, never once per repository.

GuideRail's first obligation is **honest discovery and navigation**. Risk assessment, opportunity analysis, documentation publication, and agent access are optional layers on that foundation.

**1.0 success requires both development acceptance and independent certification under Section 18.** Risk, growth, and change-impact capabilities must be implemented and evaluated for 1.0, while remaining separable overlays that users can enable as needed. Documentation publication and agent interfaces remain optional extensions. The two adoption modes and two deployment modes retain the contracts in Sections 7–8.

## 2. Goals, users, and non-goals

### 2.1 Product outcomes

- A product owner or engineer can start with a capability or user outcome and navigate to the processes, services, contracts, source symbols, tests, and deployment evidence that support it.
- An engineer can start with a component or prospective change and trace **backward** to impacted capabilities and journeys.
- A reviewer can ask what is fragile, poorly covered, coupled, duplicated, expensive to change, or a promising extension point—and see an **explainable finding with evidence and confidence**, rather than an unexplained AI opinion.
- An unfamiliar project yields a useful **partial map immediately**; deeper semantic and behavioral coverage improves with available evidence, without mandatory project modifications.
- The same architecture snapshot can power interactive views, documentation export, CI reports, and optional agent queries.

### 2.2 Primary audiences

Product and business stakeholders; developers and architects; security, risk, and quality reviewers; technical leads; autonomous engineering agents acting under human direction.

### 2.3 Explicit non-goals

- Enforcing a project layout, capability registry, metadata convention, or required annotation schema.
- Replacing the source repository, tests, runtime telemetry, or CI/CD system as the source of truth.
- Requiring any target app to import GuideRail at production runtime.
- Claiming business behavior or live deployment status based only on static code, PRDs, or an LLM narrative.
- Mandating a central SaaS service, hosted LLM, database, MCP server, or internet connection for project-companion viewing.
- Automatically creating commits or overwriting authored documentation.
- Turning GuideRail into a project-management or task-execution engine.

## 3. Product experience: business left → technical right

### 3.1 Core interaction model

The primary UI is an **interactive terrain/graph map**, not a collection of disconnected diagrams. It presents a progressive spectrum:

**Business outcomes / capabilities → user journeys → operational processes → application architecture → services / infrastructure / source and evidence**.

Selecting an item preserves its context as the user moves across perspectives. Users must be able to:

- Expand and collapse entities; pan, zoom, search, filter, and inspect details.
- Follow **forward traces** from business outcome to code and **reverse traces** from a code node to affected user and business outcomes.
- See which relationships are verified, inferred, proposed, outdated, or unknown.
- Inspect supporting evidence: repository, commit, file, symbol/line range, contract, test, approved runtime observation, or document excerpt.
- Toggle risk, growth, coverage, change-impact, and confidence overlays without altering the underlying architecture.
- Compare two pinned snapshots and inspect architecture deltas.
- Use optional guided routes without making a route the only way to navigate.

A partial graph is legitimate. Empty or unverified areas must be presented as **unknown/not assessed**, not as absent functionality or zero risk.

### 3.2 Preserve seven synchronized perspectives

The previously established seven perspectives remain intact and are **projections of the same graph**:

| Perspective | User question | Typical evidence |
|---|---|---|
| **Orientation** | What is this project, and where do I begin? | README, docs, repo structure, verified summaries |
| **Landscape** | Which capabilities and domains exist? | requirements, routes, feature surfaces, tests, naming cues |
| **Journey** | How does a user or actor accomplish an outcome? | UX flows, feature tests, approved journey annotations |
| **Process** | What rules, workflows, and state transitions implement it? | state machines, handlers, workflows, tests |
| **Architecture** | Which modules/components and contracts implement it? | imports, calls, schemas, interfaces, dependency graph |
| **System** | Where does it execute, and across which boundaries? | infra definitions, manifests, confirmed observations |
| **Sequence** | In what order do components interact? | tests, traces, event contracts, call paths |

**Sequence** is a drill-down that may span multiple conceptual levels. **Orientation** and **Landscape** provide business-facing entry points. Do not force every project to have content for all seven.

### 3.3 Core example

With a capability selected (e.g., **SquadOps → Campaign Execution**), GuideRail highlights relevant journeys, orchestration states, agent coordination paths, interfaces, persistent state, tests, and source anchors. Switching from Landscape to Architecture or Sequence preserves selection. Selecting a vulnerable or changing component performs the reverse trace to show the associated campaign outcomes and user workflows.

### 3.4 Findings UX

Each risk/opportunity finding must answer **What / Why / Impact / Evidence / Confidence / Recommended next investigation**. Findings are filterable by severity, kind, confidence, project, capability, and snapshot. A finding may be dismissed, acknowledged, or annotated **in GuideRail-managed analysis state** without rewriting source-derived facts. Findings are suggestions unless independently verified; they are not assertions of a vulnerability or production incident.

## 4. Evidence-backed architecture graph

### 4.1 Unified, typed model

Model entities should support, as applicable: project, repository, capability, domain, actor, journey, step, process, state, application, package, module, component, service, interface, endpoint, event, data entity, deployment unit, environment, test, requirement/ADR, and evidence anchor.

Typed links include **implements, realizes, calls, imports, depends-on, emits, consumes, persists, deploys-to, verifies, documents, affects**, and **supersedes**. Links are navigable in either direction; inverse traversal does not imply a second authoritative edge.

Provide durable internal identities, with stable source-derived matching across ordinary renames where feasible. Optional existing project IDs/annotations can be used but are never compulsory.

### 4.2 Provenance and epistemic state

Every material entity, relationship, and assessment claim should carry:

- Source type and location, with repository identifier, commit SHA and file path; symbol/line span where available.
- Extractor or inference method/version, observation timestamp, and project snapshot ID.
- **Epistemic status:** `VERIFIED`, `INFERRED`, `PROPOSED`, `STALE`, or `UNKNOWN`; confidence where applicable.
- Evidence links and, if relevant, counterevidence or conflicts.

Distinguish **design intent** from **implemented behavior** and **observed deployment**. Code can verify an implementation artifact; it does not by itself prove a route is active or a service running in production. An LLM may summarize or propose links, but cannot promote an unsupported claim to verified status.

### 4.3 Authority model

The repository and approved external evidence are authoritative inputs. The GuideRail graph is **derived and disposable**: rebuildable from a pinned revision, extractor versions, and approved evidence inputs. Interactive user notes and assessment dispositions live in a separate overlay, retaining their own authorship and not silently becoming verified source facts.

## 5. Discovery, indexing, and refresh

### 5.1 Discovery pipeline

1. **Connect** a local path or authorized Git repository/ref in read-only mode by default.
2. **Inventory** languages, manifests, packages, docs, tests, API definitions, workflows, infra, and deployment declarations; respect ignores and explicit exclusions.
3. **Extract** deterministic structural facts using language-aware parsers and available OSS tooling.
4. **Resolve** cross-file dependencies, contracts, call/event paths, and candidate domain/capability clusters.
5. **Enrich** with requirements, existing documentation, tests, approved annotations, and optionally bounded LLM interpretation.
6. **Validate** claims, classify uncertainty, record evidence and inconsistencies.
7. **Package** a versioned, sanitized architecture snapshot and perspective projections for the same UI.
8. **Analyze** optional risk, growth, and impact overlays; publish outputs to the selected destination.

Avoid making foundation-model inference a prerequisite for basic discovery, navigation, or offline rendering. Business capability naming often requires interpretation and may remain `INFERRED` until confirmed by documentation or the owner.

### 5.2 Incremental updates

- Record file hashes and extractor versions; identify changes from Git diff, filesystem watcher, CI event, or explicit refresh.
- Recompute affected extraction units and the **transitive invalidation neighborhood** needed to preserve graph correctness. Fall back to full rebuild when tool versions, schemas, or evidence dependencies require it.
- Retain snapshot IDs and reproducible manifests; support before/after comparison.
- Mark invalidated assertions stale until revalidated; do not silently preserve obsolete relationships.
- Never mutate project source while scanning. Optional approved publication is a separate step.

### 5.3 Partial and conflicting evidence

Unparseable languages, generated code, dynamic dispatch, external services, unknown runtime routes, and absent tests create **visible coverage gaps**. Conflicting definitions remain discoverable with citations; one unsupported interpretation does not erase another.

## 6. Assessment overlays

### 6.1 Risk

Begin with deterministic, explainable heuristics such as high fan-in/out, tight coupling, cyclic dependencies, fragile chokepoints, untested high-impact paths, unowned interfaces where ownership can be established, stale contracts, missing verification, architectural boundary crossings, and deploy-time single points of failure where topology evidence exists.

Risk cards separate **observed fact** (e.g., a dependency cycle) from **inferred consequence** (e.g., change fragility). Never claim a security vulnerability solely from architecture topology. Show *potential* blast radius and whether test/deployment data are available.

### 6.2 Growth and evolution

Identify possible reusable capabilities, duplicated logic, useful extension points, package boundaries, under-documented integrations, bottlenecks and modernization candidates. These are **hypotheses for evaluation**, not automatic refactoring mandates. Each opportunity includes scope, supporting graph evidence, likely tradeoffs, and what additional validation would be needed.

### 6.3 Change-impact analysis

Given a selected node, commit diff, PR, or proposed change set, traverse affected dependencies toward both technical dependents and business capabilities. Return impacted paths and tests, confidence, known unknowns, and candidate verification work. Do not imply that graph reachability proves a runtime failure.

### 6.4 Scoring

Use human-readable severity bands only when inputs are sufficient. Keep **severity**, **confidence**, and **coverage** distinct; do not fabricate precision or suppress gaps behind a single composite score.

## 7. Two adoption modes — one product

### A. External attachment: point GuideRail at a project

- Supply Git URL/ref or local workspace path to a GuideRail scanner or hub.
- No source modifications, installed app dependency, required config, manifest, naming rules, or special folders.
- Run on demand, via an authorized watcher, or in CI if an owner elects to integrate it.
- Generate a portable architecture package; make it visible in either deployment mode.
- Ideal for existing applications, unfamiliar repos, audits, and one-time exploration.

### B. Optional development dependency / plugin

- A project elects to add GuideRail developer tooling to its dev/build workflow or plugin system.
- It may expose convenient local scan/preview/build commands, hooks, or CI integration using the same discovery engine.
- **No production application import, required server process, SDK calls, or runtime coupling.** The dependency must be dev-only or tooling-only; the emitted static site/package is independent of that dependency at viewing time.
- Uninstalling tooling cannot break the target app. Existing repository layouts remain authoritative.

**Neither adoption mode is itself a hosting choice.** Either can export to a project companion or send sanitized package data to a hub, subject to authorization.

## 8. Two deployment modes — tightened runtime contract

### 8.1 Project companion: static by default

**Desired shape:** compiled GuideRail UI assets + generated, versioned architecture package served from a project-owned location such as `/guiderail/`, a documentation/static hosting service, or local static preview.

- The **scanner runs at build/refresh time**, locally or in CI—not continuously inside the target application.
- At browse time, the **browser executes the React UI** and loads the architecture package. No dedicated GuideRail application server, database, privileged API, MCP server, or background agent is required for a snapshot.
- The target application can serve the files using its existing static-content mechanism, or host them separately. Mounting `/guiderail/` is **optional**, not a requirement to modify app routes.
- The UI must work on a static origin with no network calls except for explicitly authorized source-link navigation and optionally configured services.
- Base-path routing and asset resolution must support nested prefixes and hash/history routing as appropriate to static hosting.
- Package contents are filtered/sanitized for their destination. **Never publish private source, credentials, internal endpoints, or sensitive metadata into public static assets by accident.**
- Viewing a historic static package remains possible if scanner/hub are unavailable.

This replaces any presumed pattern of launching a long-lived per-project GuideRail server. **Project-hosted does not mean project-runtime-dependent.**

### 8.2 Central hub: multiple projects, shared services

**Desired shape:** one independently deployed GuideRail application, optionally with a shared scanner/indexing service, package registry, persistence, authentication/authorization, and query API.

- Register multiple repositories/branches; assign versioned snapshots to each project.
- The same UI supports project routes such as `/projects/squadops` (a friendly alias such as `/squadops` is optional) and cross-project navigation when explicitly authorized.
- Hub-side scanners may run on demand, on schedules, or from webhooks; enforce bounded resource use and isolation. **No required daemon or server in each target project.**
- The hub stores derived package versions and separate analysis annotations, not an independently editable model of supposed source truth.
- A small embedded database/object store may support the registry/history; no database is required for companion mode. Hub scale-out is an option, not an initial requirement.
- A hub failure must not affect a target application's production operation or invalidate previously published companion snapshots.
- If exposing an optional API/MCP for agents, place it at the **hub boundary** (or an independently run tooling service), scoped read-only initially to project authorization and snapshot evidence.

### 8.3 Runtime comparison

| Characteristic | Project companion | Central hub |
|---|---|---|
| UI | Same compiled GuideRail UI | Same GuideRail UI |
| Projects | Usually one package | Multiple versioned project packages |
| Serving | Existing static host or static preview | Independently hosted GuideRail service |
| Scanner | On demand / local / CI | Shared on demand / webhook / schedule |
| Always-on GuideRail backend in app | **None** | **None** |
| Database | **None required** | Optional registry/history/annotations |
| Target runtime dependency | **None** | **None** |
| MCP | Not required | Optional shared, scoped read-only endpoint |
| Offline snapshot browsing | Supported | Supported when a package is locally available |
| Write access to target repo | Not required | Not required; optional authorized publishing |

### 8.4 Runtime lifecycle and budgets

- **Scan jobs** are bounded processes with explicit start, progress, cancellation, retry, and resource controls. A failed scan leaves the last known-good published snapshot intact but visibly stale.
- **UI startup** should load project metadata and a coarse graph first; stream or lazily load large partitions as needed. No LLM inference on the critical path to first meaningful map.
- **Watchers and webhooks** are optional refresh triggers, not required always-on processes.
- **Hub scheduling** uses one shared job manager with per-project queueing, quotas, isolation, and no overlapping scans unless intentionally permitted.
- **Publishing** is an explicit, atomic promotion from validated candidate package to visible snapshot, with easy rollback.

## 9. Portable architecture package and persistence

The core interchange artifact is a **versioned, portable architecture package** (exact filename/schema remains to be designed, not an existing CLI contract). It should contain:

- Manifest: package schema version, source repository/ref/commit, generation time, extractor versions, allowlisted scope, summary counts and coverage metrics.
- Canonical entities, typed edges, cross-perspective indexes, source/provenance references, and visibility/uncertainty states.
- Precomputed navigational summaries and view projections where useful for fast startup.
- Optional risk/growth/impact findings, all with evidence and analysis version.
- Explicit exclusions, redaction summary, diagnostics, and generation warnings.

Use a portable JSON or comparable open representation with schema validation and migration policy. Large projects may use partitioned assets and content-addressed chunks. The output must load in both static companion and hub modes **without semantic re-interpretation**.

**Default storage:** GuideRail-managed build/output storage, not files injected into the target repository. Project-specific export and commit of generated assets remain opt-in. The authoritative data remains Git/docs/tests/approved runtime evidence, not the package or hub database.

## 10. Documentation publication: supporting, not primary

Generate human-readable artifacts from the **same verified architecture package**—never a competing shadow architecture. Suggested OSS building blocks include Tree-sitter/language parsers for extraction, Mermaid and D2 for diagrams, TypeDoc and OpenAPI-derived generators where relevant, and MkDocs for optional navigable static publishing.

Potential output: overview, capabilities, component map, contracts/API references, data model, process/sequence diagrams, change-impact summary, and evidence index. Coverage follows available evidence; do not create fictional missing sections.

- **Default:** GuideRail-managed output or downloadable artifact.
- **Optional repo publication:** owner-selected path, commonly `docs/guiderail/` but never required or reserved.
- **Writeback safety:** preview/diff and explicit approval; only update clearly owned generated files/sections; preserve human-authored material; no silent commits.
- **Runtime separation:** docs are a projection/export. The interactive UI reads the architecture package, **not** parsed Markdown as its primary state model.

## 11. Implementation architecture and current baseline

### 11.1 Observed repository baseline (checked 2026-11-14)

The `backspring-labs/guiderail` default branch advertises a `pnpm`/Turborepo monorepo with:

- `@guiderail/core` version `0.7.1`: headless canonical model, navigation/state, graph, perspective, indexing, adapters, and provenance exports.
- `@guiderail/web` version `0.7.1`: React/Vite UI with XState, React Flow (`@xyflow/react`), ELK, and Zustand dependencies.

**Caution:** package exports and README establish a codebase foundation, **not proof** that generic repository discovery, live risk overlays, multi-project hub, static package publication, or optional dependency distribution are implemented. These are proposed capabilities to verify before sequencing changes.

Source baseline: [GuideRail repository](https://github.com/backspring-labs/guiderail), [core package](https://github.com/backspring-labs/guiderail/blob/main/packages/core/package.json), [web package](https://github.com/backspring-labs/guiderail/blob/main/apps/web/package.json).

### 11.2 Logical component boundaries

1. **Source connectors** — Git/local-path/CI inputs with explicit access control.
2. **Discovery and extraction** — deterministic parsers, evidence-aware inference, diagnostics.
3. **Graph builder / indexer** — unified typed model, provenance, partial-coverage semantics.
4. **Package publisher** — validation, sanitization, snapshots, static export.
5. **UI / navigation kernel** — the existing core and web foundation, extended to load arbitrary package data and overlays.
6. **Analysis engines** — optional risk/growth/impact evaluators, independent of UI rendering.
7. **Hub services** — optional multi-project registry, jobs, access, annotation store, API/MCP.
8. **Documentation exporter** — optional Markdown/diagram/site projection.

The central dependency direction is **source → discovery → validated graph/package → UI and optional consumers**. UI state never becomes authoritative architectural truth. Components 1–4 and 6–8 can be packages or deployment units as needed; do not preemptively restructure the repository to match a diagram.

### 11.3 Illustrative CLI / developer experience (PROPOSED, not implemented)

- `guiderail scan <repo-or-path>` — derive/validate a snapshot in managed local output.
- `guiderail preview <package>` — browse one package locally.
- `guiderail build --target static --base /guiderail/` — assemble an optional static companion.
- `guiderail publish --target hub --project <id>` — publish to an authorized hub.
- `guiderail diff <snapshot-a> <snapshot-b>` — compare architecture and evidence changes.

These are **interface sketches**, not a declaration of actual command names. The final CLI/API contract must be reconciled with the existing code and distribution model.

## 12. Security and trust boundaries

- Read-only repository access by default; narrow scopes, revocable credentials, no unnecessary token persistence.
- Honor `.gitignore`, explicit user exclusions, and secret/sensitive-content scanning. Default-deny hidden/sensitive sources until an operator authorizes them; evaluate symlinks and traversal safely.
- Separate **private scan inputs** from **publishable packages**; publishing requires destination-appropriate redaction and approval. A private Git repository must not silently produce a public asset exposing internals.
- Do not execute untrusted repository code as part of basic static discovery; if an optional build/test extractor requires execution, isolate/sandbox it and require explicit approval.
- Treat repository text and generated docs as **untrusted data**, not instructions for AI or a tool executor.
- Hub access control is enforced on project, snapshot, evidence, annotation, and query boundaries; prevent cross-project leakage.
- Never index user vaults, credentials, secrets, personal transcripts, runtime payloads, or unrelated private files by default.
- GuideRail loss, compromise, or unavailability must not block target application startup, build, or production operations.

## 13. Requirements and definition of done

The table defines development acceptance. The strengthened outcomes for GR-04, GR-05, GR-08, GR-09, and GR-10 must also pass the independent certification criteria referenced below. Completing feature demonstrations alone does not authorize a 1.0 release; Section 18 governs the final release decision. GR-01–GR-11, GR-13, and GR-14 are mandatory capabilities. GR-12 and GR-15 are optional; when supplied or enabled, their safety and access-control requirements still apply.

| ID | Requirement (WHAT) | Acceptance / DoD |
|---|---|---|
| GR-01 | Point at an unmodified repository | Scan and explore a representative repo with zero project changes and no custom metadata |
| GR-02 | Optional developer dependency | Demonstrate scan/build workflow with dev-only tooling; remove it and the app still builds/runs |
| GR-03 | Shared seven-perspective UI | All populated views resolve against the same graph and preserve selected context |
| GR-04 | Business→technical and reverse trace | Trace an actual capability to code/tests and a component back to impacted capability, with evidence/gaps; independent reviewers must correctly explain representative business capabilities and follow forward/reverse traces on unseen repositories, meeting CERT-02, CERT-03, and CERT-09 in Section 18 |
| GR-05 | Truthful provenance and coverage | Every material implementation claim has source anchors; unknown/inferred/proposed/stale states are inspectable; independently sampled source links and relationships must meet CERT-03/CERT-04 thresholds, with zero unsupported material claims labeled VERIFIED and accurate disclosure of missing evidence under the critical gates in Section 18 |
| GR-06 | Static project companion | Serve a valid package and UI under a non-root path with **no additional GuideRail backend or runtime dependency** |
| GR-07 | Central multi-project hub | Browse at least two distinct projects using the same UI and package semantics, with scoped access |
| GR-08 | Incremental refresh and history | Changed source invalidates correct graph regions; diff and last-good snapshot remain available; evaluator-controlled additions, modifications, and deletions must produce an actual incremental result equivalent to a clean full rebuild at the same commit, with stale/missing relationships checked under CERT-08 in Section 18 |
| GR-09 | Explainable risk overlay | Display at least three independently testable structural findings linked to source and impacted capabilities across development fixtures; independently validate at least one meaningful risk per eligible blind repository and meet the false-positive threshold in CERT-05, Section 18; finding volume alone does not establish success |
| GR-10 | Explainable growth overlay | Display evidence-backed improvement hypotheses and limitations, never unqualified implementation claims; independently validate at least one plausible, actionable improvement opportunity per eligible blind repository, including evidence, tradeoffs, and usefulness, under CERT-06 in Section 18 |
| GR-11 | Change-impact analysis | A representative code change yields technical and business-impact paths, suggested tests, and uncertainty |
| GR-12 | Optional safe docs publishing | Generate deterministic docs from the graph; preview changes; no overwrites or writes without authorization |
| GR-13 | Sanitized portable package | Same package renders equivalently in companion and hub; published assets pass leakage/redaction tests |
| GR-14 | Production isolation | Neither hosting mode creates a hard dependency on GuideRail for target app boot, runtime, or availability |
| GR-15 | Optional shared agent interface | When enabled, read-only project/snapshot/evidence queries respect hub auth; no per-app MCP endpoint |

## 14. Delivery plan: preserve and extend existing GuideRail

### Phase 0 — baseline audit and contract alignment

- Inspect existing `@guiderail/core` model/loaders, UI perspective implementations, adapters, indexing, and tests.
- Inventory what is implemented versus fixture-only, incomplete, or proposed.
- Agree the portable package contract, provenance model, coverage semantics, and compatibility plan **before** broad refactoring.
- Establish the supported technology scope and public certification protocol under Section 18 using synthetic fixtures and disclosed regression repositories; keep hidden target selection outside SquadOps development.
- **Exit gate:** written gap analysis and passing current baseline tests.

### Phase 1 — real repo discovery → useful map

- Local/Git read-only scanner; deterministic structural extraction; evidence anchors; partial-coverage model.
- Load an arbitrary generated package into the existing UI; prove forward/reverse source navigation.
- Collect development evidence for CERT-01–CERT-04 and CERT-09 using the strengthened GR-04/GR-05 DoD; reserve unseen repositories for release certification.
- **Exit gate:** two unlike repositories require no conventions or code changes, and each yields useful, truthful maps.

### Phase 2 — tight static companion

- Build/preview/publish sanitized portable packages with bundled UI; robust nested-base-path and offline static viewing.
- Add optional dev-dependency workflow without target production imports.
- Exercise the adoption/deployment contracts and isolation checks that feed CERT-07 and the Section 18 critical gates.
- **Exit gate:** `/guiderail/` loads on a static host with the target application unchanged and with no GuideRail server.

### Phase 3 — incremental updates and assessment

- Hash/diff invalidation, pinned snapshots, architecture-delta compare, coverage diagnostics.
- First explainable risk, growth, and change-impact overlays.
- Apply the strengthened GR-08/GR-09/GR-10 DoD, including incremental/full-rebuild comparisons, independent finding validation, false-positive measurement, and reviewed improvement hypotheses (CERT-03, CERT-05, CERT-06, CERT-08).
- **Exit gate:** modified feature refreshes affected graph, preserves history, and findings trace to evidence.

### Phase 4 — central hub and optional consumers

- Project registry and package history; shared bounded scan jobs; permissions and project routes.
- Optional shared API/MCP; optional OSS-powered docs publication.
- Complete the remaining runtime, lifecycle, package-equivalence, and hub-isolation evidence for CERT-07; optional consumers do not postpone the mandatory release capabilities.
- **Exit gate:** two projects use the same UI/model, with no per-project GuideRail service and no cross-project leaks.

**Prioritization rule:** do not delay Phase 1/2 discovery and exploration for a full AI analysis stack, elaborate hub infrastructure, or documentation generator.

### Release milestones and certification gate

The engineering phases above remain intact. The cumulative release milestones are **0.8.x → 0.9 → 0.10 → 0.11 → 1.0**; a phase may deliver capabilities used by more than one milestone.

| Milestone | Required outcome and development gate | Certification preparation |
|---|---|---|
| **0.9 — Discovery foundation** | Baseline audit, read-only discovery, unified graph, provenance, and useful partial maps from Phase 0/1 | Establish scope, evidence sampling, and CERT-01/CERT-04 regression checks |
| **0.10 — Interactive architecture explorer** | Seven synchronized perspectives, useful business comprehension, forward/reverse navigation, and disclosed gaps from Phase 1 | Meet strengthened GR-04/GR-05 DoD on known fixtures; rehearse CERT-02/CERT-03/CERT-09 |
| **0.11 — Runtime and deployment** | Both adoption modes, static companion, central hub, production isolation, and incremental refresh from Phase 2 and relevant Phase 3/4 work | Rehearse CERT-07/CERT-08 and all security, source-integrity, and isolation gates |
| **1.0 — Architecture intelligence** | Explainable risk, growth, and change-impact capabilities; all mandatory development DoD complete | Freeze the release candidate and pass independent certification for all nine criteria and every critical gate in Section 18 |

### 1.0 release certification — required after implementation acceptance

1. Record development acceptance for every mandatory requirement and applicable optional-feature safeguards.
2. Freeze the public evaluation protocol and candidate before the independent evaluator selects hidden repositories (Section 18.2).
3. Run the blind evaluation, preserve objective evidence, and issue the independent decision under Sections 18.3–18.7.
4. Declare GuideRail 1.0 successful only when **development acceptance AND independent certification both pass for the exact released candidate**. A failed or incomplete certification blocks release regardless of feature completion or demonstration quality.

## 15. Demonstration / test scenarios

These scenarios remain development demonstrations and regression cases. Named examples such as SquadOps and Nemo do not qualify as hidden certification targets. The evaluator chooses analogous tasks on unseen repositories under Section 18; completing these demonstrations does not replace certification. Scenario G remains optional when documentation publication is not supplied.

**Scenario A — unfamiliar existing project:** connect a repo with no GuideRail files. Immediately see verified packages/services, inferred capability labels, uncertainty, and source evidence. Explore without touching the repo.

**Scenario B — embedded dev workflow:** add optional developer tooling, regenerate a static companion during CI, host under `/guiderail/`. Remove the tooling; target app remains functional and last published static snapshot still loads.

**Scenario C — business to code:** select `Campaign Execution` in SquadOps; navigate Landscape → Journey → Process → Architecture → System/Sequence; inspect source, contracts, tests, and unverified links. Preserve selected capability throughout.

**Scenario D — risk and reverse impact:** select a highly coupled component; display a structural-risk explanation, impacted campaign capability, related tests, and possible mitigation. Distinguish detected dependency from hypothesized operational consequence.

**Scenario E — project evolution:** compare pre-/post-change revisions, show changed entities/relationships and affected capabilities. Previously published snapshots remain accessible.

**Scenario F — hub isolation:** register SquadOps and Nemo; compare projects only with explicit authorization. A project user cannot access another project's private evidence.

**Scenario G — safe docs export:** export selected perspectives to an owner-selected path such as `docs/guiderail/`; preview diff, preserve hand-written text, require explicit approval for any repository write.

## 16. Decisions, proposals, and unresolved design questions

### Retained product decisions

- No imposed repo structure, annotations, manifests, required app SDK, or runtime dependency.
- Seven perspectives and a single shared navigation context.
- Business-left to technical-right exploration, plus reverse tracing.
- Evidence/provenance, incremental refresh, and explicit partial coverage.
- One UI/model; static project companion and shared hub deployment, with **no per-project server/MCP requirement**.
- Optional documentation publication, not the primary product.

### New decisions proposed for approval in this spec

- Treat risk, growth, and change-impact as first-class explainable overlays, with separate confidence/coverage indicators.
- Make a portable validated architecture package the compatibility boundary between scanner, UI, hub, and docs publisher.
- Use atomic snapshot publication and last-known-good fallback.
- Adopt staged delivery favoring real discovery and static viewing before advanced hub services.
- Require independent 1.0 certification against blind, unseen repositories, with all critical gates and per-criterion thresholds met before declaring release success (Section 18).

### Open implementation choices

1. Final package schema, graph ID algorithm, and migration/versioning approach.
2. Extractor coverage order, language/parser adapters, and admissible runtime evidence.
3. Packaging/distribution of optional dev dependency and CLI (names above are illustrative).
4. Host routing strategy for `/guiderail/` with multiple SPA and static-host environments.
5. Hub database and job execution technology, selected only after actual scaling needs.
6. Static package partitioning and size budgets for very large repos.
7. Human annotations versus model regeneration conflict/ownership policy.
8. Security review requirements for public static exports of private repositories.

## 17. Recommended first engineering milestone

**Ship an end-to-end vertical slice before adding more perspectives or generators:**

> Point GuideRail at one existing project → extract a source-backed graph → render it in the current UI → trace one capability from business to code and back → show uncertainty and one evidence-backed structural risk → publish the same snapshot as a serverless static `/guiderail/` companion.

Use a second, differently structured repository to verify that the first success does not depend on project-specific conventions. This is the pivotal test of the product vision.

This milestone supplies development evidence. The independent release evaluation must still use fresh unseen repositories and satisfy Section 18.

## 18. GuideRail 1.0 independent certification

### 18.1 Purpose, scope, and release authority

Independent certification is a **mandatory acceptance criterion for declaring GuideRail 1.0 successful**. It answers:

> Can GuideRail take an unfamiliar software project, accurately reveal its business and technical architecture, explain what it knows and does not know, and help someone make an informed engineering decision without being tailored to that project?

Development acceptance establishes that the required capabilities in Section 13 are implemented correctly. Certification establishes that the frozen release candidate achieves those outcomes on independently selected, previously unseen repositories within its declared supported technology scope. **Both must pass.** Certification is a release requirement, not a demonstration after release or a claim of perfect understanding of all software.

The Product Owner records release acceptance against the independent evaluator's signed decision. Neither SquadOps nor the Product Owner may waive a failed critical gate or lower a threshold after seeing a target or result. This section adds evaluation obligations without imposing target-project schemas, metadata conventions, source changes, production dependencies, or new deployment modes. GR-12 documentation publication and GR-15 agent interfaces need not be enabled for certification; their safeguards apply whenever exercised or distributed.

### 18.2 Frozen protocol, candidate, and evaluator firewall

Before hidden repositories are selected, the Product Owner and independent evaluator must version and freeze a **public certification protocol** containing:

- Supported languages, frameworks, repository size envelope, parser coverage, known limitations, approved evidence types, and explicit exclusions.
- All nine criteria, critical gates, thresholds, sampling rules, scoring anchors, permitted setup, task time limits, scan/resource budgets, equivalence rules, and failure/retry rules. The baseline thresholds in Section 18.4 apply; a protocol may strengthen them but cannot silently relax them.
- The evaluator's identity, independence declaration, conflict/exposure checks, evidence-retention location, and decision authority.

Freeze the **release candidate** by source revision, distributable/build hashes, dependency lockfiles, scanner/extractor and schema versions, configuration defaults, documentation, and any optional inference model/version and inference settings. Reproducibility requires pinned inputs; a mutable external model alias alone is insufficient. All setup steps and optional services used must be recorded. Basic discovery, navigation, and static viewing must also run without a hosted LLM, as required by Sections 5 and 8.

The evaluator must be independent of the SquadOps work that implements or optimizes the candidate. It may be a separate person or evaluator process with independently controlled access and records; a development agent grading its own output is insufficient.

| SquadOps development may access | Evaluator privately controls until the attempt closes |
|---|---|
| Public requirements, supported scope, rubric, thresholds, synthetic fixtures, and disclosed regression repositories | Hidden repository identities, pinned commits, selected capabilities/tasks, independently assembled ground truth, controlled changes, and access credentials |

After the protocol and candidate are frozen, the evaluator selects **at least two previously unseen, independently maintained real repositories** with different structures or conventions inside the supported scope. It checks prior development exposure and pins each commit. A repository named in accessible development discussions, used as a fixture, previously evaluated, or otherwise known to the development team cannot satisfy the blind requirement. No specific certification target is designated by this specification.

The evaluator begins with the repository URL/ref or checkout and commit, rather than a curated architecture explanation. Generic prerequisites such as authorization, checkout location, output destination, and static base path are allowed. Project-specific adapters, configuration hints, architecture maps, annotations, scanner changes, source fixes, or developer coaching are prohibited. The optional dev-tooling exercise may make the minimal documented dependency/build-workflow changes in a disposable checkout; it must not add architecture hints or change application behavior. This does not weaken zero-change external attachment.

Ground-truth answers and undisclosed task manifests remain unavailable to the candidate and development agents. Evaluators may issue ordinary UI/query inputs to perform a task without supplying its expected answers. Ordinary source reading by GuideRail during evaluation is expected; advance developer exposure or hidden-answer access is not. An accidental disclosure invalidates the affected target, must be recorded, and requires an unseen replacement. If evaluation feedback reaches developers, the target becomes a regression target and cannot be reused for blind certification.

### 18.3 Nine required criteria

Each criterion must pass on each repository, including the applicable runtime exercises. The evaluator samples representative capabilities and subsystems, rather than claiming exhaustive knowledge of a large codebase. It assembles and seals source-backed ground truth and controlled changes before running the candidate. Task eligibility follows the frozen scope and available evidence, not the candidate's eventual output.

| ID / criterion | Required demonstration and objective assessment | Requirements covered |
|---|---|---|
| **CERT-01 — Zero-config discovery** | Index the pinned repository using documented defaults, without project changes or custom architecture metadata. Measure completion, structural discovery coverage, diagnostics, and resource use against an independently sampled inventory. | GR-01, GR-05, GR-13 |
| **CERT-02 — Business comprehension** | Independent reviewers use GuideRail to identify and explain real capabilities, their actors/outcomes, and implementation support. Compare explanations with ground truth; populated views or plausible names alone earn no credit. | GR-03, GR-04 |
| **CERT-03 — Technical traceability** | Follow business-to-implementation and reverse traces across applicable perspectives, preserving context and opening real evidence. Independently verify relationships and predicted change-impact paths, including false positives and missed paths. | GR-04, GR-05, GR-11 |
| **CERT-04 — Evidence quality** | Verify sampled claims, relationships, and source anchors at the pinned commit. Measure source-link accuracy, relationship precision, unsupported VERIFIED claims, and correct disclosure of uncertainty, conflicts, and missing evidence. | GR-05, GR-13 |
| **CERT-05 — Risk assessment** | Independently validate meaningful structural-risk findings for correctness, relevance, supported severity, and usefulness. Count false positives and unsupported consequences; finding volume is not a quality measure. | GR-09 |
| **CERT-06 — Growth analysis** | Independently review plausible, actionable improvement hypotheses supported by graph/source evidence, with scope, expected benefit, tradeoffs, limitations, and a next validation step. Keep hypotheses distinct from established implementation facts. | GR-10 |
| **CERT-07 — Runtime independence and reproducibility** | Exercise both adoption modes with both deployment modes using the same UI/package semantics. Verify static hosting, hub access isolation, application independence, secret protection, last-good fallback, and equivalent results from repeated pinned inputs. | GR-02, GR-06, GR-07, GR-13, GR-14 |
| **CERT-08 — Incremental refresh** | Apply evaluator-controlled additions, modifications, and deletions, demonstrate actual incremental processing, and compare with a clean full rebuild at the same new commit. Check stale, missing, duplicate, or wrongly retained entities, edges, source anchors, and affected projections. | GR-08 |
| **CERT-09 — Human usability** | First-time users complete defined exploration and evidence-verification tasks without developer coaching. Record correct completion, elapsed time, help requested, dead ends, and navigation failures. | GR-03, GR-04, GR-05 |

An unfamiliar repository need not contain requirements documents, runtime observations, tests for every path, or evidence for all seven perspectives. Correctly disclosing those limits receives credit. Ground truth must distinguish what can be established from what remains uncertain; invented missing evidence fails the provenance gate. An unavailable evidence type cannot be removed from scoring after results are known. Its applicability and expected uncertainty behavior must be recorded before execution.

The evaluator must choose targets with enough in-scope examples to exercise the required sampling and at least one independently supportable risk and growth opportunity. It determines suitability before candidate execution. Evidence absent from a target is not itself a product failure; inability to satisfy a mandatory criterion across the selected targets prevents certification and requires suitable unseen evaluation coverage.

### 18.4 Mandatory critical gates and scored thresholds

**Critical gates require 100% compliance in all prescribed checks. Any observed breach fails certification regardless of quality scores.** Checks include applicable negative and failure cases, not only successful navigation. Sampling limits must be reported; a pass does not imply exhaustive inspection of every claim.

| Critical gate | Mandatory result |
|---|---|
| **CG-01 — Source integrity** | Read-only external discovery leaves the target checkout unchanged. Optional tooling changes are confined to the approved disposable workflow. No unauthorized writes, publication, source execution, or commits occur. Record before/after diffs and relevant access logs. |
| **CG-02 — Production independence** | Target builds, starts, and passes its selected behavior checks with GuideRail tooling removed and scanner/hub unavailable. No production imports, per-project GuideRail server/MCP, or GuideRail availability dependency is introduced. |
| **CG-03 — Security and isolation** | No unauthorized secret/private-content export, filesystem traversal, cross-project evidence/query access, or execution of repository-provided instructions. Seeded synthetic secrets and denied-access cases remain protected under Section 12. |
| **CG-04 — Truthful provenance** | Every material claim labeled VERIFIED has sufficient, correct evidence for that exact claim and revision. Zero fabricated relationships/evidence, unsupported VERIFIED claims, or inferred deployment/behavior promoted to verified fact. Unknowns, stale evidence, and conflicts remain visible. |
| **CG-05 — Evaluation integrity** | Candidate/protocol freeze, independent target selection, firewall, permitted-setup rules, and attempt history are intact; no target-specific tuning, hidden-answer access, or unrecorded assistance occurs. |
| **CG-06 — Evidence and decision integrity** | Required evidence is attributable to the exact candidate, source revisions, environment, and attempt. Every mandatory result is reproducible or independently inspectable; missing or unverifiable required evidence cannot be scored as a pass. |

An incorrect relationship explicitly presented as an inference counts against quality thresholds. Misrepresenting it as VERIFIED or supporting it with fabricated evidence is a critical failure.

The following are **proposed normative baseline thresholds for this specification**, establishing numeric rules where the prior discussion set the outcomes but did not select numbers. They measure evaluation outcomes; they do not replace the separate severity, confidence, and coverage indicators in Section 6.4.

| Criterion | Minimum sample / exercise per repository | Pass threshold |
|---|---|---|
| CERT-01 | At least 20 independently identified in-scope structural entities across distinct modules/packages, or all if fewer exist | Successful scan within the frozen resource/time budget; correctly discover at least **80%** of sampled entities, with exclusions and failures visible |
| CERT-02 | Five independently selected representative capabilities | At least **4 of 5** explanations correct and useful against ground truth; each passing explanation identifies the real outcome and supporting implementation, with evidence limits stated |
| CERT-03 | Five forward and five reverse traces, plus at least ten adjudicated expected/predicted change-impact paths spanning technical and business effects | At least **80%** of trace tasks completed correctly; impact precision and recall each at least **80%**; context and uncertainty preserved on passing tasks |
| CERT-04 | At least 50 material claims, 50 typed relationships, and 50 source links, or the full population where smaller; include VERIFIED and inferred states, multiple subsystems, and negative/conflicting evidence where available | Source-link accuracy at least **95%** and relationship precision at least **90%**; all sampled unavailable/conflicting-evidence cases correctly disclosed; **zero** CG-04 violations anywhere observed |
| CERT-05 | Adjudicate all emitted findings if ten or fewer; otherwise inspect the ten highest-severity findings plus an evaluator-selected random ten from the remainder (or all remaining if fewer) | At least **one meaningful independently validated concern** and at least **80%** finding precision in the sample; report false-positive counts, severity errors, and usefulness ratings |
| CERT-06 | Review at least one emitted improvement hypothesis; include the candidate's highest-priority recommendation | At least **one** hypothesis scores **3 or 4** on the anchored usefulness rubric below and includes every required evidence/tradeoff/validation field |
| CERT-07 | All four adoption × deployment combinations; repeated scan of identical pinned inputs; tooling removal, hub outage, failed scan, and two-project denied-access exercises | **All** functional and isolation checks pass; repeated architecture results and companion/hub interpretation are equivalent under Section 18.5; last-good snapshot remains available and visibly stale after refresh failure |
| CERT-08 | At least one controlled addition, modification, and deletion, collectively affecting entities and relationships beyond the directly changed file | **Zero semantic mismatches** in canonical architecture facts after the frozen normalization; current relationships, epistemic states, and provenance match the clean full rebuild; history/fallback preserved; logs prove actual incremental processing |
| CERT-09 | At least two users per repository who have not used GuideRail or studied that repository; five tasks each: orient/explain, forward trace, reverse/impact trace, verify evidence/uncertainty, and assess a risk or opportunity | Each user correctly completes at least **4 of 5** tasks within one **60-minute exploration session**, excluding indexing and authorized access setup, using shipped documentation only and no coaching |

For CERT-02 and CERT-06, reviewers use these anchors: **0** = absent or materially false; **1** = generic or largely unsupported; **2** = partly correct but missing material support or decision value; **3** = correct/plausible, specific, evidence-backed, and useful with limits stated; **4** = meets 3 and independently provides clear tradeoffs and an actionable next decision or validation step. A CERT-02 explanation passes at 3 or 4. Two reviewers independently rate CERT-02, CERT-05 usefulness, and CERT-06; disagreements require a documented source-backed adjudication. A meaningful CERT-05 concern must score at least 3 for usefulness and have a verified structural basis; its operational consequence may remain explicitly inferred.

Precision is correct returned items divided by adjudicated returned items; false-positive rate here is the complementary share of returned items judged incorrect. Impact recall is correct returned expected paths divided by ground-truth expected paths. Deduplicate equivalent claims/paths before counting. A zero denominator cannot earn a pass for a required demonstration. Missing tasks count as incomplete; unsupported or unadjudicable returned findings count against precision. Record counts and denominators, sampling method/seed, and reasons for each judgment.

**Every critical gate, required demonstration, and threshold must pass on each repository.** A high result in one criterion or repository cannot compensate for failure elsewhere. No aggregate weighted score overrides these rules. Any stronger budgets or thresholds must be fixed in the public protocol before hidden-target selection; thresholds cannot be chosen or relaxed after observing results.

### 18.5 Runtime, refresh, and equivalence protocol

Use the four adoption/deployment combinations defined in Sections 7–8. A static companion must load under a non-root base path on an ordinary static origin with no GuideRail backend, database, MCP, or hosted inference service. Verify permitted network behavior, source-link handling, offline/local snapshot viewing, and preservation of a previously published snapshot when scanner/hub access is removed. Hub evaluation must contain at least two projects and check denied project/snapshot/evidence/annotation/query access. Optional interfaces, if enabled, inherit those same boundaries.

Compare the target application's documented build/start and representative behavior checks before adoption, after optional dev-tooling installation, and after removal. Only the documented disposable development-workflow edits are permitted; no application source fix or architecture hint may help the candidate pass. Failed/cancelled scans must leave the last-good published snapshot intact and visibly stale, and atomic promotion/rollback must preserve usable snapshots.

For CERT-08, the evaluator supplies controlled changes after the initial scan; GuideRail must not author them. Run incremental refresh and an isolated full rebuild with identical new commit, approved evidence, scanner versions, and settings. Compare canonical entities, typed edges, epistemic states, provenance, coverage, and relevant perspective/assessment outputs. Inspect transitive invalidation and deletion behavior. A full rebuild silently substituted for every refresh does not demonstrate incremental refresh; the manifest must declare fallback conditions and the run must prove a supported incremental path.

The frozen normalization policy may remove ordering, timestamps, generated identifiers with a defined stable mapping, layout coordinates, and other demonstrably nonsemantic differences. It must not discard relationships, evidence, uncertainty, or coverage to make results match. Repeated scans of the same pinned inputs must yield equivalent architecture results. Optional nondeterministic inference must use frozen model/settings and a predeclared bounded equivalence policy with repeated-run counts and objective semantic checks; unsupported VERIFIED claims always fail. Canonical source-derived facts must match exactly after normalization. Any permitted inference variation must satisfy the frozen semantic checks; an explanation alone cannot waive a mismatch. Obsolete relationships may remain in historical snapshots, but cannot persist in the refreshed current graph contrary to the full rebuild.

### 18.6 Objective evidence and certification record

Retain a versioned evidence bundle containing:

1. Public protocol, candidate/build hashes, dependency and scanner versions, approved inputs/settings, environment, budgets, evaluator independence declaration, and attempt identifier.
2. Restricted target manifest with repository identities, pinned before/after commits, exposure checks, task selections, ground-truth samples, controlled-change diffs, and sampling seeds. Protect target confidentiality during the attempt and credentials at all times.
3. Commands, job/event logs, timings, resource use, setup changes, before/after checkout diffs, network/access checks, generated packages, graph exports, and snapshot hashes.
4. Per-task observations or recordings, first-time-user eligibility, completion/correctness/time/help records, source-link and relationship adjudications, risk/growth reviews, confusion counts, and all scoring denominators.
5. Incremental/full-rebuild and repeated-run comparison reports, normalization rules, failure/fallback/rollback observations, all critical-gate outcomes, per-repository criterion results, limitations, and unresolved findings.
6. A signed or otherwise attributable independent decision identifying the exact candidate and scope, followed by the Product Owner's recorded release acceptance or rejection.

Screenshots and narrative claims alone are insufficient when source anchors, logs, or comparison artifacts are needed to reproduce the result. Preserve confidential evidence under appropriate access controls and publish a sanitized decision with evidence references. A certification pass states the tested supported scope and sample coverage; it does not imply exhaustive correctness or universal technology support.

### 18.7 Failure, remediation, retries, and release decision

- **Pass:** all mandatory development DoD, every critical gate, and every applicable criterion threshold pass for the exact frozen candidate. The independent evaluator records the evidence-backed decision; the Product Owner may then accept that candidate for 1.0.
- **Fail:** any product-caused critical breach, unmet threshold, missing mandatory demonstration, or unresolved required evidence blocks certification and 1.0 release. Record the failed candidate, conditions, observations, and failed gates/criteria. Do not silently patch the candidate, discard adverse runs, or rerun until a favorable result appears.
- **Remediate:** SquadOps receives a sanitized failure report sufficient to fix the general defect. Once disclosed, failed targets and tasks become development/regression cases under their access restrictions. Remediation must include those regressions and a new frozen candidate with changed build/revision identity.
- **Retry:** a new release-certification attempt repeats the full protocol on **at least two fresh unseen repositories**, with new independently selected tasks and controlled changes. Previous passes or repaired demonstrations on revealed targets cannot substitute for blind certification. Keep the complete attempt history; feedback never returns a revealed target to unseen status.
- **Invalid attempt:** only documented evaluator error, pre-existing target ineligibility, accidental disclosure, or external infrastructure failure under the frozen rules can invalidate an attempt. Preserve its evidence and rationale. A GuideRail defect, dependency failure in the frozen distribution, resource overrun, or product-controlled service failure is a product failure. If targets remain sealed and the evaluator proves the candidate received no feedback, an infrastructure retry may use them; any exposed target must be replaced. Product failures always follow the fresh-target retry rule.
- **Changes after a pass:** certification attaches to the exact candidate and declared scope. Changes to discovery/analysis behavior, dependencies, defaults, models, schemas, packaging, runtime, or security invalidate its use as evidence for a different release candidate and require recertification. Purely editorial corrections may be recorded by the evaluator only if distributed executable/package artifacts remain identical and no task or rubric changes.

The final release record must state **development acceptance: PASS** and **independent certification: PASS**, identify the certified build, link the evidence, and disclose supported scope and limitations. A partial result, waived gate, rehearsal, or pending decision must not be represented as GuideRail 1.0 success.

---

**Compatibility note:** Existing Nemo `PRD-007-guiderail-compatibility.md` describes a possible consumer of GuideRail's generic capabilities. It is **not** a GuideRail schema and must not become a mandatory set of conventions for unrelated repositories.
