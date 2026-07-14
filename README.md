# element-plus-admin-ts

A Vue 3 + TypeScript + Element Plus admin scaffold, published as a pnpm monorepo containing the template app and a `create-element-plus-admin` CLI generator.

## Quick start

### Use the scaffold (generate a new project)

```bash
npm create element-plus-admin my-app
cd my-app
pnpm install
pnpm dev
```

The app runs at `http://localhost:9527`. Log in with `admin / 111111`.

### Develop this monorepo

```bash
git clone <repo-url>
cd element-plus-admin-ts
pnpm install
pnpm dev          # start the template dev server
pnpm test         # run template tests (unit + e2e)
pnpm typecheck    # vue-tsc --noEmit across packages
pnpm build        # build template + CLI snapshot
```

## What's inside

```
packages/
├── template/                      ← Vue 3 + TS + Element Plus admin app
└── create-element-plus-admin/     ← npm create CLI (embeds template snapshot)
```

| Dimension | Choice |
|-----------|--------|
| Framework | Vue 3.4 (`<script setup>`) |
| Language | TypeScript (strict, `vue-tsc --noEmit` zero errors) |
| Build | Vite 5 |
| UI | Element Plus (Chinese locale) |
| State | Pinia (setup-store) |
| Router | vue-router 4 (hash history) |
| Icons | Element Plus icons only (`@element-plus/icons-vue`, globally registered) |
| Mock | vite-plugin-mock |
| Testing | Vitest (unit) + Playwright (e2e) |
| Node | >=18, pnpm |

## Features

- **Full dynamic permission** — `constantRoutes` (no role) + `asyncRoutes` (`meta.roles` filtered), navigation guard registers the authorized subset at runtime via `router.addRoute`. Admin sees everything, editor sees a filtered subset.
- **Login flow** — token cookie, router guard redirect, NProgress, re-login on token expiry (50008/50012/50014).
- **Layout shell** — collapsible Sidebar (mobile-responsive), Navbar with breadcrumb + user dropdown, AppMain.
- **Example pages** — Table (mock pagination), Tree, Form (validation), multi-level Nested menu.
- **Composables** — `useResizeHandler`, `useFixiOSBug` (replaced Vue 2 mixins).

## Architecture decisions

See `docs/adr/`:
- [ADR-0001](docs/adr/0001-monorepo-and-cli-source.md) — Monorepo with embedded-snapshot CLI
- [ADR-0002](docs/adr/0002-full-dynamic-permission-in-a-minimal-template.md) — Full dynamic permission in a minimal template
- [ADR-0003](docs/adr/0003-ep-icons-only-drop-svg.md) — Element Plus icons only, drop the SVG pipeline

Domain vocabulary: see `CONTEXT.md`.

## License

MIT
