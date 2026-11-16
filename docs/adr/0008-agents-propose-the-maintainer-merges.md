# 0008. Agents propose; the maintainer decides and merges

**Status:** Accepted. **Decided:** 2026-11-16, issue #90.

## Context
GuideRail has one maintainer. `main` requires a pull request and the `CI gate` check, and no approval (0007). That was sized for a person merging their own work. Its side effect is that any actor with write access can merge a pull request once CI is green.

Automated contributors are about to work here: SquadOps agents, and coding assistants the maintainer runs. Two things show the gap.

- During the foundation campaign a merge script guessed a pull request number and merged a Dependabot update that nobody had reviewed (#38, reverted in #45). CI had passed. The gate was the only control, and it does not know who is merging or why.
- The independent assessment of 0.8.1 found that instructions and controls for automated contributors had been deferred without an issue (finding ASSESS-11). It judged agent development ready with maintainer-controlled merges, and did not find unattended self-merging ready.

## Decision
An agent is any contributor that is not a person: a SquadOps agent, a coding assistant, a bot or a script.

**Agents propose. The maintainer decides.** An agent's work ends at a pull request and a report. Authorising work, merging, releasing and changing policy are the maintainer's acts. They stay the maintainer's when an agent holds a credential that would let it do them.

1. **Work is authorised per issue, by the maintainer.** The maintainer labels the issue `ready`, or names it when instructing an agent directly. A well-formed issue that an agent filed authorises nothing.
2. **An agent does not merge,** tag, release, change repository settings, or grant an exception to a check.
3. **An agent identifies a pull request before acting on it:** by its head branch, and by confirming it opened it. Never by number alone.
4. **An unattended agent has its own GitHub identity,** with the write role on this repository and nothing more. It does not use the maintainer's login.

The working rules that follow from this are in `AGENTS.md`, under "Agent authority".

## Consequences
- Every merge costs the maintainer one action. The maintainer is the bottleneck on purpose: it is the only review step the repository has.
- An agent's pull request that nobody merges waits. Nothing on the agent's side may unstick it.
- **Today this is held by instruction, not by GitHub.** The ruleset on `main` does not distinguish who merges. Closing that gap is part of #90: SquadOps gets its own identity with the write role, and a second ruleset on `main` restricts updates to the maintainer. `Protect main` keeps no bypass, so the maintainer still needs a pull request and a green gate. Until an agent's attempt to merge is shown to be refused, do not describe this as a control.
- A coding assistant run under the maintainer's own login can do whatever the maintainer can. For that case the rule can only ever be an instruction.
- The read-only token that GitHub Actions workflows receive says nothing about an external agent's credential.
- Letting an agent merge would need a new record, and a review requirement that the current ruleset does not have.
