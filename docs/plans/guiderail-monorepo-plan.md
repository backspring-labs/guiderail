# GuideRail Monorepo Consolidation Plan

## Context

Viewscape and viewscape-core are converging into one product: **GuideRail**. The two separate repos (`viewscape-core` at 0.2.0 with 252 tests, `viewscape` at 0.2.0 with 39 tests) are being consolidated into a single pnpm + Turborepo monorepo under the `@guiderail` scope.

The empty `guiderail` repo at `/Users/jladd/Code/guiderail/` (with GitHub remote) becomes the new home. Old repos will be archived on GitHub.

### Target structure
```
guiderail/
├── packages/
│   └── core/          ← @guiderail/core (was viewscape-core)
├── apps/
│   └── web/           ← @guiderail/web (was viewscape)
├── pnpm-workspace.yaml
├── turbo.json
├── package.json       ← root workspace
├── biome.json
├── .editorconfig
├── .gitignore
├── lefthook.yml
├── LICENSE
├── README.md
└── CLAUDE.md
```

### Constraints
- No source code logic changes — only names, paths, and config
- All 252 core tests must pass
- All 39 web tests must pass
- The `mode: "viewscape" | "guiderail"` enum values in the kernel are domain concepts, not package names — leave them unchanged
- Package/repo naming changes must not be treated as a reason to rename domain concepts in the kernel unless the domain model itself changed
- `pnpm dev`, `pnpm build`, `pnpm test`, `pnpm check` all work from root
- Root command success depends on all per-package scripts being cwd-safe under workspace execution

### TypeScript ownership rule
TypeScript tool execution is root-owned (shared devDependency). tsconfig ownership remains package-local. Package build scripts invoke their own local tsconfig paths, not a shared root tsconfig.

---

## Design Tensions / Watchpoints

- **Monorepo consolidation must not change kernel semantics** — only package names and import paths change
- **Package renaming must not trigger domain-model renaming** — `mode: "viewscape" | "guiderail"` stays as-is
- **Direct imports into core internals (test fixtures via `@seed`) are a temporary monorepo convenience**, not a permanent package contract between `@guiderail/web` and `@guiderail/core`
- **Root tooling centralization must not blur per-package build/test ownership** — each package keeps its own tsconfig, vitest config, and build script
- **Subpath exports must remain stable before and after import rewrite** — validate export map before running global sed replacement
- **Biome merged config must be verified against both packages' source, tests, stories, and tool configs**

---

## Phase 1: Create Monorepo Scaffolding

### Goal
Set up root config files in `/Users/jladd/Code/guiderail/`. No source code yet.

### Files to create
- `pnpm-workspace.yaml` — defines `packages/*` and `apps/*`
- Root `package.json` — private, workspace scripts (`build`, `test`, `check`, `dev` via turbo), shared devDeps (biome, lefthook, turbo, typescript)
- `turbo.json` — build depends on `^build`, test depends on `^build`, check is independent, dev is persistent/uncached
- `biome.json` — merged rules from both repos (web config is the superset), overrides for vite/vitest configs, stories, tests. Must be verified against both packages' file patterns.
- `.editorconfig` — union of both repos (tabs for ts/tsx/js/json/css, spaces for yaml)
- `.gitignore` — union of both repos plus `.turbo`
- `lefthook.yml` — pre-commit runs `pnpm check` only (fast gate). Full `build` + `test` runs pre-push or in CI.
- `LICENSE` — MIT, 2026, Jason Ladd / Backspring Industries
- `README.md` — monorepo overview with package descriptions
- `CLAUDE.md` — monorepo conventions merged from both CLAUDE.md files
- `.claude/settings.json` — permission allowlists for pnpm/turbo/lefthook commands

### Done when
- All root config files exist
- No source code yet

---

## Phase 2: Copy packages/core and Update Configs

### Goal
Copy viewscape-core contents into `packages/core/`, rename package to `@guiderail/core`, strip per-repo configs that moved to root.

### What to copy
- `src/` entire directory
- `tests/` entire directory
- `package.json`
- `tsconfig.json`
- `tsconfig.build.json`
- `vitest.config.ts`

### What NOT to copy
`node_modules/`, `dist/`, `.git/`, `pnpm-lock.yaml`, `lefthook.yml`, `.editorconfig`, `LICENSE`, `biome.json`, `.claude/`, `README.md`

### Config changes
- `package.json`: name → `@guiderail/core`, remove lefthook/biome/typescript from devDeps (root provides them), keep vitest/xstate/zod, update description
- `src/index.ts` comment: `viewscape-core` → `@guiderail/core`
- Create `packages/core/CLAUDE.md` adapted for monorepo context

### Explicit export map validation
Before proceeding to Phase 3, verify that `packages/core/package.json` exports map still supports all subpath imports that the web app uses: `/entities`, `/graph`, `/context`, `/machines`, `/perspective`, `/adapters`, `/indexing`, `/provenance`, `/test-fixtures`.

### Done when
- `packages/core/package.json` has name `@guiderail/core`
- All 9 src/ module directories present
- Export map verified against web app import patterns
- No lefthook.yml, .editorconfig, LICENSE, biome.json in packages/core

---

## Phase 3: Copy apps/web and Update Configs + Imports

### Goal
Copy viewscape contents into `apps/web/`, rename package to `@guiderail/web`, update all imports from `viewscape-core` to `@guiderail/core`, fix alias paths, rename UI strings.

### What to copy
- `src/` entire directory
- `public/` entire directory
- `.storybook/` entire directory
- `package.json`, `tsconfig.json`, `tsconfig.node.json`
- `vite.config.ts`, `vitest.config.ts`
- `index.html`

### What NOT to copy
`node_modules/`, `dist/`, `dist-node/`, `.git/`, `pnpm-lock.yaml`, `lefthook.yml`, `.editorconfig`, `LICENSE`, `biome.json`, `.claude/`, `README.md`

### Config changes
- `package.json`: name → `@guiderail/web`, dependency `"viewscape-core": "link:../viewscape-core"` → `"@guiderail/core": "workspace:*"`, remove lefthook/biome/typescript from devDeps
- `tsconfig.json`: `@seed/*` path → `../../packages/core/src/test-fixtures/*`
- `vite.config.ts`: `@seed` alias → `../../packages/core/src/test-fixtures`
- `vitest.config.ts`: `@seed` alias → same

### `@seed` import note
Importing test fixtures directly from `@guiderail/core/src/test-fixtures` via the `@seed` alias is an intentional temporary monorepo convenience for current development and tests. It is not the long-term public content/data contract between packages. It will be replaced by a real content loading boundary when a backend is added.

### Import rewrite (19 source files)
All `from "viewscape-core/..."` → `from "@guiderail/core/..."` via:
```bash
find apps/web/src -type f \( -name '*.ts' -o -name '*.tsx' \) \
  -exec sed -i '' 's/from "viewscape-core\//from "@guiderail\/core\//g' {} +
```

### Post-rewrite validation
After the sed replacement, immediately run a TypeScript type-check (`npx tsc --noEmit` from apps/web) to verify all rewritten imports resolve correctly against the export map. Do not proceed to Phase 4 until this passes.

### UI string changes
- `TopBar.tsx`: "Viewscape" → "GuideRail"
- `index.html`: `<title>Viewscape</title>` → `<title>GuideRail</title>`
- `app.test.ts`: describe("Viewscape" → describe("GuideRail"

### Done when
- `grep -r "viewscape-core" apps/web/src/` returns zero results
- `@seed` aliases point to `../../packages/core/src/test-fixtures`
- TypeScript type-check passes after import rewrite
- UI title shows "GuideRail"
- No lefthook.yml, .editorconfig, LICENSE, biome.json in apps/web

---

## Phase 4: Install, Build, Test, Verify

### Goal
All 291 tests pass, dev server works, Storybook works, build works, biome passes.

### Steps
1. `pnpm install` — creates workspace linkage
2. `pnpm build` — turbo builds core first, then web
3. `pnpm test` — 252 core + 39 web = 291 tests
4. `pnpm check` — biome passes (verify patterns match both packages' source, tests, stories, and tool configs)
5. `pnpm dev` — web app loads with "GuideRail" title
6. `pnpm storybook` (from apps/web) — Storybook starts and renders node stories

### Troubleshooting watchpoints
- `@seed` alias resolution: path must be correct relative to `apps/web/`
- Subpath exports: `@guiderail/core` package.json exports map must be unchanged
- Biome glob patterns: verify overrides match from root invocation context
- Storybook: monorepo path and alias resolution often breaks Storybook differently than the app
- `dist-node/` from tsconfig.node.json composite: covered by .gitignore

### Done when
- `pnpm build` exits 0
- `pnpm test` shows 291 tests passing
- `pnpm check` exits 0 (1 complexity warning is acceptable)
- `pnpm dev` starts and app loads with "GuideRail" title
- Storybook renders node stories

---

## Phase 5: Cleanup, Commit, Push

### Steps
1. Final review: no stray `viewscape-core` or `viewscape` package name references (domain enum values excluded)
2. Commit with descriptive message
3. Push to `git@github.com:backspring-labs/guiderail.git`
4. Archive old repos on GitHub (manual step)

### Done when
- Clean commit on main branch
- Pushed to GitHub
- Old repos archived

---

## Verification

After all phases:
1. `pnpm install` — dependencies resolve via workspace
2. `pnpm check` — Biome passes
3. `pnpm build` — both packages build (core via tsc, web via vite)
4. `pnpm test` — 291 tests pass (252 + 39)
5. `pnpm dev` — web app runs with "GuideRail" title
6. `pnpm storybook` — Storybook renders from apps/web
7. No references to old package names in source code (domain enum values excluded)
