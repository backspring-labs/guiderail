# GuideRail

Guided architecture navigation from business understanding to code reality.

## Packages

| Package | Description |
|---------|-------------|
| `@guiderail/core` | Headless kernel — canonical domain model, state machines, context synchronization |
| `@guiderail/web` | React UI — terrain canvas, detail panels, guided route bar |

## Requirements

- Node.js 26 (primary) or 24 (kept compatible). `.node-version` pins the development runtime; other lines are not supported.
- pnpm, at the exact version in the root `package.json` `packageManager` field.

CI runs lint, build and tests on both Node lines for every pull request and every push to `main`.

## Develop

```bash
pnpm install        # install all dependencies
pnpm dev            # start web dev server
pnpm build          # build all packages
pnpm test           # run all tests
pnpm check          # lint and format check
```

## Security

To report a vulnerability, see [SECURITY.md](SECURITY.md). Please do not open a public issue.

## License

[MIT](LICENSE)
