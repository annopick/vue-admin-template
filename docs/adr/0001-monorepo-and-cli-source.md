# Monorepo with embedded-snapshot CLI

The template (Vue 3 + TS + Element Plus app) and its CLI generator live in one pnpm-workspaces monorepo (`packages/template`, `packages/create-element-plus-admin`). The CLI embeds a **build-time snapshot** of the template rather than git-cloning it at runtime.

## Considered Options

- **Monorepo + embedded snapshot** (chosen) — single version, offline `npm create`, no network dependency.
- Monorepo + `git degit` at runtime — smaller package, but depends on GitHub availability.
- Flat repo + separate CLI package across repos — most decoupled, but version drift between template and CLI.

## Consequences

- Releasing a template change requires rebuilding and republishing the CLI (`prepublishOnly` copies `packages/template` → `packages/create-element-plus-admin/template`).
- The CLI cannot generate a project newer than its bundled snapshot; users wanting the absolute latest must use `pnpm create element-plus-admin` from the repo or wait for a CLI release.
