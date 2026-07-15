# create-element-plus-admin

从内嵌的模板快照生成一个全新的 Vue 3 + TypeScript + Element Plus 后台项目。

## 使用方式

```bash
npm create element-plus-admin my-app
# 或
pnpm create element-plus-admin my-app
```

CLI 会执行以下步骤：
1. 提示输入项目名称（默认为传入的参数）、包名、描述和作者
2. 将内嵌的模板快照复制到 `my-app/`
3. 替换 `package.json` 和 `README.md` 中的占位符
4. 初始化 git 仓库并创建首次提交
5. 打印后续步骤（`cd my-app && pnpm install && pnpm dev`）

### 非交互模式

```bash
node bin/index.js my-app --yes
```

跳过交互提示，使用从项目名派生的默认值。

## 工作原理

CLI 内嵌了一份 `packages/template` 的**快照**（由 `scripts/snapshot.cjs` 在构建时复制）。它完全离线运行——不发起网络请求，不拉取 GitHub。快照在每次 `npm publish` 前通过 `prepublishOnly` 钩子重新生成。

架构决策详见 `docs/adr/0001-monorepo-and-cli-source.md`。

## 开发

```bash
# 从 packages/template 重新生成内嵌快照
pnpm --filter create-element-plus-admin snapshot

# 运行 CLI 冒烟测试
pnpm --filter create-element-plus-admin test
```
