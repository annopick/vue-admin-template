# Vue Admin Template

一个 Vue 3 + TypeScript + Element Plus 的后台管理应用。这是 `create-element-plus-admin` 脚手架内嵌的模板。

## 使用方式

```bash
pnpm install
pnpm dev          # 开发服务器：http://localhost:9527
pnpm build        # 生产构建 → dist/
pnpm test         # Vitest（单元测试）+ Playwright（端到端测试）
pnpm typecheck    # vue-tsc --noEmit
```

使用 `admin / 111111` 登录（mock 后端）。另外提供了一个 `editor` 账号（`editor / 111111`）用于演示动态权限模型——它只能看到过滤后的菜单子集。

## 定制入口

| 想改什么 | 改哪里 |
|---------|--------|
| 应用标题 | `src/settings.ts` |
| 侧边栏配色 | `src/styles/variables.scss`（SCSS）+ `src/styles/variables.ts`（JS 镜像） |
| 公共路由（所有人可见） | `src/router/index.ts` → `constantRoutes` |
| 权限路由（按角色过滤） | `src/router/index.ts` → `asyncRoutes`（设置 `meta.roles`） |
| API 基础地址 | `.env.development` / `.env.production` → `VITE_APP_BASE_API` |
| Mock 接口 | `mock/*.ts`（由 vite-plugin-mock 提供） |
| Pinia 状态仓库 | `src/store/modules/`（`useUserStore`、`useAppStore`、`useSettingsStore`、`useRouteStore`、`useTagsViewStore`） |

## 对接真实后端

Mock 在成功时返回 `{ code: 20000, message, data }`，失败时返回非 20000 的 code。你的后端需要遵循这个响应信封格式（或修改 `src/utils/request.ts`）。Token 通过 `X-Token` 请求头发送。用户信息接口必须返回 `roles` 数组——导航守卫会将 `meta.roles` 与用户角色取交集来过滤 `asyncRoutes`。

## 图标

仅使用 Element Plus 图标（详见 [ADR-0003](../../docs/adr/0003-ep-icons-only-drop-svg.md)）。在路由配置中设置 `meta.icon` 为 EP 图标组件名（如 `'HomeFilled'`）。所有图标已在 `main.ts` 中全局注册。

如果你需要自定义 SVG 图标，请自行添加 `vite-plugin-svg-icons` 和 `<svg-icon>` 组件——SVG 流水线已被有意移除，以保持脚手架的精简。

## 动态权限

内置动态权限（详见 [ADR-0002](../../docs/adr/0002-full-dynamic-permission-in-a-minimal-template.md)）。导航守卫（`src/permission.ts`）在首次导航时获取用户信息，根据 `meta.roles` 过滤 `asyncRoutes`，并通过 `router.addRoute` 注册授权子集。404 兜底路由最后注册，确保动态路由优先匹配。

## License

MIT
