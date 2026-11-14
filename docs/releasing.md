# Releasing

How a version of GuideRail is cut. Only the maintainer tags and releases.

A release ties three things together: a **version**, the exact **commit** it was built from, which must have passed the required checks, and its **notes**.

## Versioning

- `@guiderail/core` and `@guiderail/web` share one version and move together.
- Versions are `MAJOR.MINOR.PATCH`. Tags are `v` plus the version, for example `v0.8.0`.
- GuideRail is pre-1.0. Until 1.0:
  - a **minor** version may contain breaking changes;
  - a **patch** version contains fixes only.

## Compatibility

What counts as the public surface, and so what a breaking change is:

| Surface | Covered |
|---|---|
| The entry points in `packages/core/package.json` `exports` | Yes: exported names, their types, and documented behaviour |
| `ContextMachineEvent` and `NavigationContext` | Yes: the event set and the meaning of each navigation field |
| The content format read by `parseContentBundle` | Yes: collection names, entity schemas, and the [data-integrity contract](architecture/data-integrity.md) |
| `@guiderail/core/demo` | No: it is sample data, and its contents change freely |
| Anything under `src/test-fixtures/` | No: internal |
| The web app's components, hooks and CSS class names | No: the app is not a library. `@guiderail/web` is private and is not published |

Every breaking change to a covered surface is listed in the changelog under **Changed** or **Removed**.

Supported Node.js lines are part of the contract too. Dropping one is a breaking change.

## Distribution

- Nothing is published to npm. `@guiderail/core` is correct when packed (`pnpm check:package` proves it on every pull request), but it is consumed only inside this repository.
- A release is a git tag and a GitHub release with notes. It has no build artifacts attached.
- Deferred until there is a decision to publish: npm trusted publishing, provenance attestations and artifact checksums.

## Checklist

1. **Decide the version.** Read `## [Unreleased]` in `CHANGELOG.md`. Anything under Changed or Removed that touches a covered surface means a minor bump before 1.0.
2. **Open a release pull request** that:
   - sets `version` in `packages/core/package.json` and `apps/web/package.json`;
   - renames `## [Unreleased]` to `## [X.Y.Z] - YYYY-MM-DD` and adds a fresh, empty `## [Unreleased]` above it.
3. **Merge it** once the `CI gate` passes, like any other pull request.
4. **Check the commit**, on an up-to-date `main`:
   ```bash
   git switch main && git pull
   pnpm check:release X.Y.Z
   ```
   This verifies that both packages carry the version, the changelog has a dated section for it, the working tree is clean, `HEAD` is the tip of `origin/main`, the tag does not exist yet, and the `CI gate` check on that commit succeeded. It then prints the three commands for the next step.
5. **Tag and release**, using the commands it printed:
   ```bash
   git tag -a vX.Y.Z <commit> -m "GuideRail X.Y.Z"
   git push origin vX.Y.Z
   gh release create vX.Y.Z --verify-tag --title "GuideRail X.Y.Z" --notes-file <notes file>
   ```
6. **Confirm the record.** Pushing the tag runs the `Release check` workflow, which repeats the verification on GitHub and publishes nothing. Its green run is the public evidence that the tag was checked.

## Tags are immutable

A repository ruleset blocks deleting or moving any `v*` tag, for everyone. A released version always means the same commit.

If a release is wrong, do not move its tag. Fix forward and release a new patch version.

## What is not claimed

Versions up to 0.7.1 were never tagged, and predate CI. The changelog lists them from the commit history and does not present them as checked releases.
