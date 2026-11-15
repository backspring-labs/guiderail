# Roadmap

What GuideRail is working on, in order. Progress on each item lives in GitHub issues and milestones, not here.

## Now: repository foundation

Hygiene work that makes the repository safe to change and to contribute to: required CI, branch protection, security controls, corrected defects, contributor documentation, and a checked release path. It was released as 0.8.0, and closed out in 0.8.1.

What remains is an independent assessment of the result by an external reviewer, and the items the campaign deferred, which are open issues in the milestone.

- Plan: [docs/plans/repository-foundation-plan.md](docs/plans/repository-foundation-plan.md)
- Status: the [Repository foundation milestone](https://github.com/backspring-labs/guiderail/milestone/1) and its tracking issue, #25

No new product features land until the assessment is in.

## Next: GuideRail 1.0

The 1.0 scope is defined by a [specification](docs/specs/GuideRail_Architecture_Exploration_and_Runtime_Spec_v1_0.md): point GuideRail at an existing repository and get an explorable, evidence-linked map of it. Its status is proposed. Nothing in it is committed work until it is triaged into issues.

| Milestone | Outcome |
|---|---|
| 0.9 | Discovery foundation: read-only discovery of a real repository, one graph with provenance, useful partial maps |
| 0.10 | Interactive architecture explorer: the seven perspectives over a discovered graph, tracing from business to code and back |
| 0.11 | Runtime and deployment: a static project companion, a multi-project hub, incremental refresh |
| 1.0 | Architecture intelligence: explainable risk, growth and change-impact overlays, and independent certification on unseen repositories |

## Shipped

| Version | What it delivered | Plan |
|---|---|---|
| 0.8.1 | Text contrast meets WCAG AA and is enforced by the checks. The 1.0 specification, the source backlog and the campaign's closure report are tracked | [closure report](docs/plans/repository-foundation-closure.md) |
| 0.8.0 | Repository foundation: required CI, security controls, corrected defects, one data boundary, a browser suite, contributor and release documentation. The first tagged version | [plan](docs/plans/repository-foundation-plan.md) |
| 0.7.1 | Process canvas fidelity and stepper fixes | [plan](docs/plans/guiderail-0.7.1-plan.md) |
| 0.6.0–0.7.0 | Navigation hub, stepper transport, Orientation perspective, self-referential demo corpus | [0.6.0](docs/plans/guiderail-0.6.0-plan.md), [0.7.0](docs/plans/guiderail-0.7.0-plan.md) |
| 0.5.0 | Canvas fidelity and file-based content loading | [plan](docs/plans/guiderail-0.5.0-plan.md) |
| 0.4.0 and earlier | Perspective system, kernel and monorepo foundations | [docs/plans/](docs/plans/) |

Versions up to 0.7.1 predate CI and were not released as tags. They are not represented as having passed the checks introduced by the foundation work.

## Not on the roadmap

Documents under [docs/ideas/](docs/ideas/) and [docs/prds/](docs/prds/) are proposals and reference material. An idea becomes work only when the maintainer triages it into an issue.
