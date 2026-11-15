# Documentation

Everything under `docs/`, with what each document is and where it stands. Owner of every document: the maintainer.

**If you want to know how the code works today, read the Current section and stop.** Everything below it is history or speculation, kept for context.

## How to read the status column

| Status | Meaning |
|---|---|
| **Current** | Describes the repository as it is. Kept up to date with the code |
| **Active** | A plan being executed now. Progress lives in its GitHub issues |
| **Shipped** | The work it plans is in the code. Any gaps are noted |
| **Partly shipped** | Some of it is in the code and some clearly is not |
| **Superseded** | Replaced by a later document, or written for the repositories that existed before this monorepo |
| **Proposed** | A product baseline put forward by the maintainer. It sets direction, and nothing in the code implements it yet |
| **Idea** | A proposal. Nothing in the code implements it. Not approved work |

An idea, a proposed specification or a historical plan never authorises work. Work starts from a GitHub issue ([CONTRIBUTING.md](../CONTRIBUTING.md)).

Statuses were assigned on 2026-11-15 by comparing each document with the code, and a sample of the findings was re-checked by hand. Long idea documents were judged from their summaries and from searching the code for their distinctive features, not from a line-by-line reading.

## Current

| Document | What it is |
|---|---|
| [../AGENTS.md](../AGENTS.md) | The working guide: commands, design rules, perspectives, contracts, known limitations |
| [../README.md](../README.md) | What GuideRail does today and how to run it |
| [architecture/README.md](architecture/README.md) | How the system is put together, in one page |
| [architecture/data-integrity.md](architecture/data-integrity.md) | What content is accepted, rejected and reported |
| [adr/](adr/README.md) | Decisions and the reasons for them |
| [performance.md](performance.md) | Bundle size, start-up time and the size budget |
| [releasing.md](releasing.md) | Versioning, compatibility and how a release is cut |
| [security/controls.md](security/controls.md) | Repository protections, alert ownership and accepted exceptions |
| [examples/minimal-content.json](examples/minimal-content.json) | A small content dataset, loaded by a test |
| [../CHANGELOG.md](../CHANGELOG.md), [../ROADMAP.md](../ROADMAP.md) | What changed, and what is next |

## Product specification

| Document | What it is | Status |
|---|---|---|
| [specs/GuideRail_Architecture_Exploration_and_Runtime_Spec_v1_0.md](specs/GuideRail_Architecture_Exploration_and_Runtime_Spec_v1_0.md) | The GuideRail 1.0 specification: point GuideRail at an existing repository, get an evidence-linked map, publish it as a static companion or to a hub, with release milestones 0.9, 0.10, 0.11 and 1.0 and an independent certification gate | Proposed. It is its own product baseline, separate from every plan below. None of it is triaged into issues yet |

## Plans

### Active

| Plan | Executed by |
|---|---|
| [plans/repository-foundation-plan.md](plans/repository-foundation-plan.md) | Issue #25 and the `Repository foundation` milestone. Ids HY-01 to HY-24 are issues #1 to #24 |
| [plans/GuideRail_Hygiene_Action_Backlog_2026-11-14.md](plans/GuideRail_Hygiene_Action_Backlog_2026-11-14.md) | The source of the plan above: twenty draft issues, HY-01 to HY-20, written against commit `faac155`. Kept as the record of what was asked. Where the plan departs from it, the plan says why |

### Version plans

Versions were never tagged; "shipped in" is the commit whose message names the version.

| Plan | Planned | Status | Shipped in |
|---|---|---|---|
| [guiderail-monorepo-plan.md](plans/guiderail-monorepo-plan.md) | One pnpm and Turborepo monorepo under `@guiderail` | Shipped | `19b28b5` |
| [guiderail-0.3.0-plan.md](plans/guiderail-0.3.0-plan.md) | Fintech landscape seed, ELK layout, search, three guided routes | Partly shipped. Layout and search remain. The fintech seed and its routes shipped and were later replaced by the self-describing corpus | `4c9801d` |
| [guiderail-0.4.0-plan.md](plans/guiderail-0.4.0-plan.md) | Six-perspective progression, canvas modes, System and Sequence perspectives, shared context contract | Shipped, with gaps in #72 | `0b5a41e` |
| [guiderail-0.5.0-plan.md](plans/guiderail-0.5.0-plan.md) | Purpose-built Journey, Landscape, Architecture and System canvases; content loading from files | Partly shipped. Journey and Landscape canvases are in. Deployment mode and the component view are partial. The kernel parses content, but the app never loaded it from files | `f9bb467` |
| [sequence-entity-plan.md](plans/sequence-entity-plan.md) | `Sequence` as a first-class entity with a picker, left panel and search | Shipped, without the planned lookup indexes | `7614b36` and three follow-ups |
| [guiderail-0.6.0-plan.md](plans/guiderail-0.6.0-plan.md) | Left panel as a navigation hub; stepper transport control | Shipped. No commit set the version to 0.6.0 | `fe1c0c6`, `e9b8e8f` |
| [guiderail-0.7.0-plan.md](plans/guiderail-0.7.0-plan.md) | Orientation as a seventh perspective; a corpus that models GuideRail itself | Shipped, with gaps in #72 | `e9b8e8f` |
| [guiderail-0.7.1-plan.md](plans/guiderail-0.7.1-plan.md) | BPMN grammar, bounded swim lanes, stage highlighting, sub-process drill-in | Shipped, except panning to the active stage and the inclusive gateway marker | `0173c24` |

What was planned for a shipped version and is not in the code is listed, row by row, in issue #72. Those items are **unresolved**: each waits for the maintainer to schedule it, drop it, or fold it into 1.0.

Later work is recorded in pull requests, not plans. Sub-process back-navigation, process-scoped diagrams and the kernel's index contract, for example, came from the foundation campaign (#59, #57).

### Before the monorepo

These four were written for two earlier repositories, `viewscape-core` and `viewscape`. Their code arrived here in `19b28b5`, and the monorepo plan is the hand-over point. Their original commits are not in this repository, so nothing here can confirm when each was completed.

| Plan | Planned | Status |
|---|---|---|
| [viewscape-core-plan.md](plans/viewscape-core-plan.md) | The original headless kernel | Superseded; its code is `packages/core` |
| [viewscape-core-0.2.0-plan.md](plans/viewscape-core-0.2.0-plan.md) | Providers, value streams, processes and story routes in the kernel | Superseded; the entities exist |
| [viewscape-MVP.md](plans/viewscape-MVP.md) | The original UI over the kernel | Superseded; its code is `apps/web` |
| [viewscape-0.2.0-plan.md](plans/viewscape-0.2.0-plan.md) | Provider badges, detail panels and the story route bar | Superseded; the components exist |

## Product requirements

| Document | Proposes | Status |
|---|---|---|
| [prds/Viewscape_V2_PRD.md](prds/Viewscape_V2_PRD.md) | A provider landscape navigator with narrative routes | Superseded by the V3 PRD, which says so |
| [prds/Viewscape_V3_PRD.md](prds/Viewscape_V3_PRD.md) | Provider-aware context, process-aware understanding, story routes with pause and return | Partly shipped, before the monorepo. Providers and pausable routes exist. A provider perspective, route recap and provider comparison do not |
| [prds/guiderail_live_walkthrough_sessions_prd.md](prds/guiderail_live_walkthrough_sessions_prd.md) | Live sessions where a guide leads and participants follow | Idea. Nothing implements it |

## Ideas

Proposals and reference material. Do not edit them unless asked ([ideas/CLAUDE.md](ideas/CLAUDE.md)). The four marked "realised" led to something that shipped; the document itself is still a proposal, and the plan it led to is the record of what was built.

| Document | Proposes | Status |
|---|---|---|
| [guiderail_orientation_new_perspective_idea_v3.md](ideas/guiderail_orientation_new_perspective_idea_v3.md) | Orientation as a concept-deck perspective over a self-describing corpus | Realised in 0.7.0 |
| [guiderail_orientation_new_perspective_idea_v2.md](ideas/guiderail_orientation_new_perspective_idea_v2.md) | The earlier version of the same | Superseded by v3, which says so |
| [left-panel-contextual-navigation-idea.md](ideas/left-panel-contextual-navigation-idea.md) | The left panel as a context-scoped hub; the Sequence entity | Realised in 0.6.0 |
| [stepper-transport-control-idea.md](ideas/stepper-transport-control-idea.md) | Transport buttons and arrow keys for stepping | Realised in 0.6.0 |
| [Perspective_Progression_Shared_Context_Guided_Tour_Idea.md](ideas/Perspective_Progression_Shared_Context_Guided_Tour_Idea.md) | A perspective progression with a shared context contract | Realised in 0.4.0, except its presenter and follower model |
| [guiderail-idea-transforming-viewscape.md](ideas/guiderail-idea-transforming-viewscape.md) | One product with Explore, Guide, Evidence and Author modes | Idea. The merge into one product happened; the modes and roadmap modelling did not |
| [IDEA-viewscape-guiderail-segmentation.md](ideas/IDEA-viewscape-guiderail-segmentation.md) | Two products on a shared kernel | Superseded by the document above, which treats the split as a thinking device |
| [IDEA-viewscape-guiderail-stack-recommendation-v2.md](ideas/IDEA-viewscape-guiderail-stack-recommendation-v2.md) | A recommended stack and build shape | Idea. The front-end choices match what is used; the backend choices have no code |
| [Viewscape_V2_Idea.md](ideas/Viewscape_V2_Idea.md) | Provider landscape, story paths and process-aware exploration | Superseded by the V2 and V3 PRDs |
| [Fintech_Systems_Explorer_PRD_v1_0.md](ideas/Fintech_Systems_Explorer_PRD_v1_0.md) | A "maps for fintech" explorer | Superseded; the earliest product concept |
| [presentation-mode-idea.md](ideas/presentation-mode-idea.md) | A full-screen slide-style renderer for guided routes | Idea |
| [mobile-screen-preview-idea.md](ideas/mobile-screen-preview-idea.md) | A phone-frame preview kept in sync while navigating | Idea |
| [interactive_flow_visualizer_idea.md](ideas/interactive_flow_visualizer_idea.md) | A multi-band view pairing a UI journey with live sequence, token and persistence bands | Idea |
| [higher_level_views_and_mermaid_addendum.md](ideas/higher_level_views_and_mermaid_addendum.md) | Higher-level views backed by Mermaid sources | Idea |
| [session_replay_addendum.md](ideas/session_replay_addendum.md) | Replaying a real user session from logs and traces | Idea |
| [switchboard-plugin-model-idea.md](ideas/switchboard-plugin-model-idea.md) | A plugin runtime ported from Switchboard | Idea |
| [NEBULUS_FINANCIAL_GENESIS_DESIGN_PACK_SPEC_v2_DDD_HEX.md](ideas/NEBULUS_FINANCIAL_GENESIS_DESIGN_PACK_SPEC_v2_DDD_HEX.md) | A design-pack spec for a different product, Nebulus | Reference only. Not about this repository |

## Not in the repository

| Document | State |
|---|---|
| An independent assessment of the repository foundation | Not written yet. An external reviewer carries it out once the campaign's work is finished. It is what the backlog means by "the completion criteria in the assessment" |
| Four idea drafts on AI-maintained models (canonical model lifecycle, self-describing architecture; two versions of each) | They exist only in the maintainer's working copy and are not tracked. They are ideas; the later version of each pair appears to replace the earlier |

## Things to know about the older documents

- **Machine-specific paths.** Four plans and one idea contain absolute paths from the original author's machine (`guiderail-0.3.0-plan.md`, `guiderail-monorepo-plan.md`, `viewscape-core-plan.md`, `viewscape-MVP.md`, `switchboard-plugin-model-idea.md`). They are left as written, as historical record. No current document contains one.
- **Dates.** Only a few documents state their own date. Many entered this repository together in `306c979`, so a first-commit date says when a document arrived here, not when it was written.
- **Names.** The product was previously called Viewscape. `viewscape-core`, `viewscape` and `nebulus` in older documents are earlier repositories or other products.
