# Contributing to GuideRail

Thanks for your interest. GuideRail is pre-1.0 and maintained by one person, so this guide is short and the process is light.

Working instructions for the codebase (commands, architecture, conventions) are in [AGENTS.md](AGENTS.md). This file covers how a change gets proposed, reviewed and merged.

## Ways to contribute

| You want to | Do this |
|---|---|
| Report a bug | Open a [Bug issue](https://github.com/backspring-labs/guiderail/issues/new/choose) |
| Report a security problem | Follow [SECURITY.md](SECURITY.md). Never a public issue |
| Propose a feature | Open an Enhancement issue. It is a proposal until triaged |
| Fix or improve tooling, tests or docs | Open a Maintenance issue, or comment on an existing one |
| Ask a question or get help | Open an issue and say it is a question. There is no other support channel |
| Report a conduct problem | See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) |

## From issue to merged change

1. **Start from an issue.** For anything beyond a typo, agree the problem and scope before writing code. An issue is Ready when it states the problem, scope, non-goals, acceptance criteria and dependencies.
2. **Branch from `main`.** Direct pushes to `main` are blocked.
3. **Keep one concern per pull request.** An issue may take several pull requests.
4. **Run the checks** and record the results in the pull request:
   ```bash
   pnpm exec biome ci --error-on-warnings .
   pnpm check:boundaries
   pnpm build
   pnpm check:bundle
   pnpm typecheck
   pnpm test:coverage
   pnpm check:package
   pnpm test:e2e
   ```
5. **Add a line to `CHANGELOG.md`** under `## [Unreleased]` if the change is something a user or a consumer of the kernel would notice.
6. **Fill in the pull request template.** It asks for the resulting behaviour, the checks you ran, what you did not verify, and the effects on compatibility, security and release.
7. **For a bug fix, add a test that fails without the fix,** and say how you confirmed that.
8. **CI must pass.** The `CI gate` check is required, and the branch must be up to date with `main`.

### Done

An issue is Done when every acceptance item has recorded evidence, not when a pull request merges. Work left over becomes a linked issue with an explicit disposition.

### Where status lives

Progress lives in GitHub issues and milestones only. Plans and docs describe intent; they do not track status.

## Who decides

- **Maintainer:** [@jasonLadd](https://github.com/jasonLadd). The maintainer triages issues, decides what is in scope, and has the final say on design.
- **Merging:** only the maintainer merges. Pull requests are squash-merged, one commit per pull request. No approval count is required while there is a single maintainer; the required gate is CI.
- **Releases:** only the maintainer tags and releases, following [docs/releasing.md](docs/releasing.md). See [ROADMAP.md](ROADMAP.md) for what is planned and [CHANGELOG.md](CHANGELOG.md) for what changed.
- **Branch protection applies to the maintainer too.** There is no bypass.
- **Automated contributors:** agents, bots and scripts open pull requests for issues the maintainer has authorised. They do not merge, release or change policy. What an agent may do is in [AGENTS.md](AGENTS.md#agent-authority); the reason is [ADR 0008](docs/adr/0008-agents-propose-the-maintainer-merges.md).

Ownership by area is listed in [.github/CODEOWNERS](.github/CODEOWNERS).

## Licence of contributions

GuideRail is released under the [MIT License](LICENSE). By submitting a contribution you agree that it is licensed under the same terms. There is no contributor licence agreement to sign.

Only submit work you have the right to contribute. If part of a contribution comes from another project, say so in the pull request and keep its licence notice.

## What not to change

- `docs/ideas/` holds reference material. Do not edit idea documents unless asked.
- The `mode: "viewscape" | "guiderail"` enum is a domain concept, not a leftover package name.
