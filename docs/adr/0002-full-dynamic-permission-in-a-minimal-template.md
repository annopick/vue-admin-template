# Full dynamic permission in a "minimal" template

Despite being positioned as a minimal scaffold, the template ships the **full** roles-based dynamic permission system (`asyncRoutes` + `meta.roles` filtering in the navigation guard) ported from the fuller `element-plus-admin` — not just `constantRoutes`.

## Considered Options

- **Full dynamic permission** (chosen) — role-aware menus are the core value of an admin template; without them the scaffold teaches the wrong pattern.
- Static `constantRoutes` only — truly minimal, but every user would have to re-implement permission filtering from scratch and likely get it wrong.
- Static + a placeholder `asyncRoutes` array with no guard logic — half-measure that misleads.

## Consequences

- The template is larger than a "hello world" scaffold and ships with a mock roles backend (`admin` / `editor`) to exercise the permission flow.
- The mock must return a `roles` array in `/user/info`, which is a contract the real backend must honour.
