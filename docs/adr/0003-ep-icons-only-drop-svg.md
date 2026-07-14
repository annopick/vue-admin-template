# Element Plus icons only — drop the SVG pipeline

The template uses `@element-plus/icons-vue` exclusively and **removes** `src/icons/`, the 10 custom SVGs, `svg-sprite-loader`/`vite-plugin-svg-icons`, and the `<svg-icon>` component. Router `meta.icon` accepts only EP icon component names.

## Considered Options

- **EP icons only** (chosen) — zero-config, no loader plugin, aligns with "minimal scaffold".
- EP icons + `vite-plugin-svg-icons` for custom SVGs (what `element-plus-admin` does) — more flexible, but adds a plugin and a render-branch in `Sidebar/Item.vue` that a scaffold doesn't need.

## Consequences

- Projects that need brand/logo SVGs must add the SVG pipeline back themselves; this is a deliberate scope cut, documented in the template README.
- `Sidebar/Item.vue` simplifies to a single `<component :is="meta.icon">` with no `<svg-icon>` fallback.
