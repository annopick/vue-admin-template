# vue-admin-template → element-plus-admin-ts

A Vue 3 + TypeScript + Element Plus admin scaffold, published as a pnpm monorepo containing the template app and a `create-*` CLI generator.

## Language

**Template (packages/template)**:
The runnable Vue 3 + TS + Element Plus admin application that serves as the source of truth for the generated project. It is the *content* the CLI copies, not the thing the user runs directly.
_Avoid_: app, demo, starter

**CLI (packages/create-element-plus-admin)**:
The published npm package invoked as `npm create element-plus-admin <name>`. It embeds a snapshot of the Template, substitutes the project name, and runs `git init`. Its sole job is to produce a new project directory; it does not transpile or run the Template.
_Avoid_: generator, scaffolder, script

**Embedded snapshot**:
A frozen copy of `packages/template`'s files bundled into the CLI package at build time. The CLI never reads `packages/template` at runtime; it reads only the snapshot. This keeps `npm create` working offline.
_Avoid_: template reference, live copy

**Dynamic permission route (asyncRoute)**:
A route defined in `src/router/asyncRoutes.ts` whose `meta.roles` is filtered against the current user's roles in the navigation guard. Contrast with **constant route** (`constantRoutes`), which every authenticated user sees.
_Avoid_: role route, menu route

**constantRoute**:
A route with no role requirements (e.g. login, 404, dashboard). Registered unconditionally at startup.
_Avoid_: static route, public route

**setup-store**:
A Pinia store written in the setup-function style (`defineStore('id', () => { const x = ref(...); return { x } })`), as opposed to the Vuex-style options style. The project's three stores (`useUserStore`, `useAppStore`, `useSettingsStore`) all use this form.
_Avoid_: options-store, Pinia module

**Composable**:
A Vue 3 function named `use*` that encapsulates reactive logic previously held in Vue 2 mixins (e.g. `useResizeHandler`, `useFixiOSBug`). `<script setup>` cannot consume mixins, so the two legacy mixins become composables.
_Avoid_: hook, mixin

**EP icon**:
An icon from `@element-plus/icons-vue`, rendered via `<component :is="iconName">` after global registration. The project uses EP icons exclusively; custom SVG icons and `svg-sprite-loader` are removed.
_Avoid_: svg-icon, iconfont

**Sass :export**:
The `:export { key: $var }` block at the end of `variables.scss` that exposes SCSS values to TypeScript via Vite's CSS modules interop. Replaces direct `import variables from '@/styles/variables.scss'` patterns and carries the sidebar color tokens into JS.
_Avoid_: CSS variables, theme tokens (when referring to the SCSS mechanism specifically)
