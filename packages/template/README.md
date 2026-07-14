# Vue Admin Template

A Vue 3 + TypeScript + Element Plus admin application. This is the template that `create-element-plus-admin` embeds.

## Usage

```bash
pnpm install
pnpm dev          # dev server at http://localhost:9527
pnpm build        # production build → dist/
pnpm test         # Vitest (unit) + Playwright (e2e)
pnpm typecheck    # vue-tsc --noEmit
```

Log in with `admin / 111111` (mock backend). An `editor` account (`editor / 111111`) demonstrates the dynamic permission model — it sees a filtered menu subset.

## Customization entry points

| What | Where |
|------|-------|
| App title | `src/settings.ts` |
| Sidebar colors | `src/styles/variables.scss` (SCSS) + `src/styles/variables.ts` (JS mirror) |
| Routes (public) | `src/router/index.ts` → `constantRoutes` |
| Routes (role-gated) | `src/router/index.ts` → `asyncRoutes` (set `meta.roles`) |
| API base URL | `.env.development` / `.env.production` → `VITE_APP_BASE_API` |
| Mock endpoints | `mock/*.ts` (served by vite-plugin-mock) |
| Pinia stores | `src/store/modules/` (`useUserStore`, `useAppStore`, `useSettingsStore`, `useRouteStore`) |

## Wiring a real backend

The mock returns `{ code: 20000, message, data }` for success and a non-20000 code on failure. Your backend must follow this envelope (or adjust `src/utils/request.ts`). Token is sent as the `X-Token` header. User info must return a `roles` array — the navigation guard filters `asyncRoutes` by intersecting `meta.roles` with the user's roles.

## Icons

Element Plus icons only (per [ADR-0003](../../docs/adr/0003-ep-icons-only-drop-svg.md)). Set `meta.icon` to an EP icon component name (e.g. `'HomeFilled'`). All icons are globally registered in `main.ts`.

If you need custom SVG icons, add `vite-plugin-svg-icons` back and a `<svg-icon>` component — the SVG pipeline was intentionally removed to keep the scaffold minimal.

## Dynamic permission

Built-in per [ADR-0002](../../docs/adr/0002-full-dynamic-permission-in-a-minimal-template.md). The navigation guard (`src/permission.ts`) fetches user info on first navigation, filters `asyncRoutes` by `meta.roles`, and registers the authorized subset via `router.addRoute`. The 404 catch-all is registered last so dynamic paths match before falling through.

## License

MIT
