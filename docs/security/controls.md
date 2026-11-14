# Security controls

What protects this repository, who owns the alerts, and which risks are accepted for now. Settings were read back from the GitHub API on 2026-11-14.

To report a vulnerability, see [SECURITY.md](../../SECURITY.md).

## Repository protections

These are configured on the repository and apply to everyone, including the maintainer.

| Control | State | Notes |
|---|---|---|
| Branch ruleset `Protect main` | Active, no bypass actors | Pull request required; `CI gate` required and branch up to date; conversations resolved; force-push and deletion blocked; squash merge only |
| CI gate | Required | Lint, build and tests on Node 24 and 26, plus dependency review on pull requests |
| Dependency review | On for pull requests | Fails a pull request that adds a dependency with a known high or critical vulnerability |
| Secret scanning | Enabled | |
| Push protection | Enabled | Blocks a push that contains a recognised secret |
| Dependabot alerts | Enabled | |
| Dependabot security updates | Enabled | Grouped into one pull request (`.github/dependabot.yml`) |
| Dependabot version updates | Weekly, grouped | npm (runtime and dev tooling) and GitHub Actions |
| CodeQL | Default setup, weekly and on pull requests | JavaScript/TypeScript and Actions workflows |
| Private vulnerability reporting | Enabled | The reporting route in SECURITY.md |

### GitHub Actions policy

| Setting | State |
|---|---|
| Default workflow token | Read-only |
| Workflows may approve pull requests | No |
| Actions in this repository's workflows | Pinned to commit SHAs |
| Pull requests from forks | Run with the read-only token and no secrets (`pull_request` trigger) |
| Allowed actions | All. Not restricted to an allowlist; revisit if the workflow set grows |

No workflow uses a secret. There is no release automation and no publishing credential.

## Protections that are not the repository's

These depend on the person or the provider, and nothing in this repository can enforce them.

| Protection | Owner |
|---|---|
| Two-factor authentication and credential hygiene on maintainer accounts | Each account holder; the organisation can require 2FA |
| Push protection for a user's pushes to other repositories | Each user's own GitHub settings |
| Validity checks and non-provider secret patterns | Not enabled; available under GitHub's paid security products |
| Security of GitHub-hosted runners and of the pinned actions' own supply chain | GitHub and the action maintainers; pinning limits exposure to the reviewed commit |
| The npm registry and upstream packages | Upstream; the lockfile, the audit and dependency review limit exposure |

## Alert ownership

The maintainer owns every alert: Dependabot, secret scanning, CodeQL and private vulnerability reports.

- New alerts are triaged within a week of appearing.
- The weekly Dependabot pull requests are the standing prompt to review open alerts.
- An alert is closed by a fix, or by an entry in the exceptions register below.

## History scan

`gitleaks` 8.30.1 scanned the full git history on 2026-11-14 and found no leaks. GitHub secret scanning has also scanned the history since it was enabled and reports no alerts.

## Exceptions register

An exception is a known advisory accepted for a limited time. Each one names the affected paths, why exposure is low, an owner, and an expiry no more than 90 days out. An expired exception is remediated, or renewed with fresh rationale.

| Advisory | Affected | Why exposure is low | Condition | Owner | Expires | Tracking |
|---|---|---|---|---|---|---|
| GHSA-mrhx-c7xc-m3w5: Zod can exhaust memory validating oversized constrained collections (high) | `zod` 3.x in `@guiderail/core` | The parser only receives demo data bundled at build time. No untrusted input reaches it | Holds only while that stays true. It lapses if untrusted content loading is enabled before the fix | Maintainer | 2027-02-12 | #23 |

Advisories in development tooling are dispositioned in #5.
