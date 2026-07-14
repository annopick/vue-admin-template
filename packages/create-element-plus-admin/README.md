# create-element-plus-admin

Scaffold a new Vue 3 + TypeScript + Element Plus admin project from the embedded template snapshot.

## Usage

```bash
npm create element-plus-admin my-app
# or
pnpm create element-plus-admin my-app
```

The CLI will:
1. Prompt for project name (defaults to the argument), package name, description, and author
2. Copy the embedded template snapshot into `my-app/`
3. Substitute placeholders in `package.json` and `README.md`
4. Initialize a git repo with the first commit
5. Print the next steps (`cd my-app && pnpm install && pnpm dev`)

### Non-interactive mode

```bash
node bin/index.js my-app --yes
```

Skips prompts, uses defaults derived from the project name.

## How it works

The CLI embeds a **snapshot** of `packages/template` (copied at build time by `scripts/snapshot.cjs`). It runs fully offline — no network calls, no GitHub fetch. The snapshot is regenerated before each `npm publish` via the `prepublishOnly` hook.

See `docs/adr/0001-monorepo-and-cli-source.md` for the architecture decision.

## Development

```bash
# Regenerate the embedded snapshot from packages/template
pnpm --filter create-element-plus-admin snapshot

# Run the CLI smoke test
pnpm --filter create-element-plus-admin test
```
