# element-plus-admin-ts

一个 Vue 3 + TypeScript + Element Plus 的后台管理脚手架，以 pnpm monorepo 形式发布，包含模板应用和 `create-element-plus-admin` 脚手架 CLI。

> 🎉 **[在线演示](https://annopick.github.io/vue-admin-template/)** — 登录 `admin / 111111`（生产环境内嵌 mock，无需后端）

## 快速开始

### 使用脚手架生成新项目

```bash
npm create element-plus-admin my-app
cd my-app
pnpm install
pnpm dev
```

应用运行在 `http://localhost:9527`。使用 `admin / 111111` 登录。

### 开发本 monorepo

```bash
git clone <仓库地址>
cd element-plus-admin-ts
pnpm install
pnpm dev          # 启动模板开发服务器
pnpm test         # 运行测试（unit + e2e）
pnpm typecheck    # 跨包类型检查 vue-tsc --noEmit
pnpm build        # 构建模板 + CLI 快照
```

## 仓库结构

```
packages/
├── template/                      ← Vue 3 + TS + Element Plus 后台应用
└── create-element-plus-admin/     ← 脚手架 CLI（内嵌模板快照）
```

| 维度 | 技术选型 |
|------|---------|
| 框架 | Vue 3.4（`<script setup>`） |
| 语言 | TypeScript（strict 模式，`vue-tsc --noEmit` 零错误） |
| 构建 | Vite 5 |
| UI 库 | Element Plus（中文语言包） |
| 状态管理 | Pinia（setup-store 风格） |
| 路由 | vue-router 4（hash 模式） |
| 图标 | 仅 Element Plus 图标（`@element-plus/icons-vue`，全局注册） |
| Mock | vite-plugin-mock |
| 测试 | Vitest（单元）+ Playwright（端到端） |
| Node | >=18，pnpm |

## 功能特性

- **完整动态权限** — `constantRoutes`（无角色要求）+ `asyncRoutes`（`meta.roles` 过滤），导航守卫在运行时通过 `router.addRoute` 注册授权子集。admin 可见全部菜单，editor 仅可见过滤后的子集。
- **登录流程** — token cookie 持久化、路由守卫重定向、NProgress 进度条、token 过期时弹出重新登录确认（50008/50012/50014）。
- **布局外壳** — 可折叠侧边栏（移动端自适应）、导航栏（面包屑 + 用户头像下拉菜单 + TagsView 标签页）、主内容区。
- **示例页面** — 表格（mock 分页）、树形控件、表单（校验）、多级嵌套菜单。
- **组合式函数** — `useResizeHandler`、`useFixiOSBug`（替代 Vue 2 mixin）。

## 架构决策

详见 `docs/adr/`：
- [ADR-0001](docs/adr/0001-monorepo-and-cli-source.md) — Monorepo + 内嵌快照 CLI
- [ADR-0002](docs/adr/0002-full-dynamic-permission-in-a-minimal-template.md) — 极简模板保留完整动态权限
- [ADR-0003](docs/adr/0003-ep-icons-only-drop-svg.md) — 仅使用 Element Plus 图标，移除 SVG 流水线

领域词汇表：见 `CONTEXT.md`。

## License

MIT
