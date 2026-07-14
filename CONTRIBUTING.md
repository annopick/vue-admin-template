# Contributing

## Development setup

```bash
pnpm install
pnpm dev          # template dev server at :9527
```

## Testing

```bash
pnpm --filter template test:unit     # Vitest
pnpm --filter template test:e2e      # Playwright (boots dev server)
pnpm --filter create-element-plus-admin test   # CLI smoke
pnpm typecheck                       # vue-tsc --noEmit across packages
```

## Release flow

The CLI (`packages/create-element-plus-admin`) is the only published package. The template is embedded as a snapshot.

1. Ensure the full test matrix is green: `pnpm typecheck && pnpm test`
2. Bump `packages/create-element-plus-admin/package.json` version
3. From the CLI package: `pnpm publish` — `prepublishOnly` regenerates the snapshot from `packages/template` and runs the smoke test automatically
4. The snapshot excludes `node_modules`, `dist`, `.git`, `coverage`, `test-results`, `playwright-report`, `pnpm-lock.yaml`

Never commit `packages/create-element-plus-admin/template/` — it's gitignored and regenerated on build.

## Architecture

See `docs/adr/` for decisions and `CONTEXT.md` for domain vocabulary. The codebase follows TDD — see the test files for behavior specifications.
