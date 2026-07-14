import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { execFileSync } from 'node:child_process'
import { existsSync, rmSync, readFileSync, mkdirSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

// CLI smoke test: the highest seam. Generates a project via the CLI, then
// verifies the output has the expected structure and substituted placeholders.

const __dirname = dirname(fileURLToPath(import.meta.url))
const CLI_BIN = resolve(__dirname, '..', 'bin', 'index.js')
const WORK_DIR = join(tmpdir(), `cli-smoke-${Date.now()}`)
const PROJECT_NAME = 'my-app'
const PROJECT_DIR = join(WORK_DIR, PROJECT_NAME)

describe('create-element-plus-admin CLI', () => {
  beforeAll(() => {
    rmSync(WORK_DIR, { recursive: true, force: true })
    mkdirSync(WORK_DIR, { recursive: true })
  }, 30_000)

  afterAll(() => {
    rmSync(WORK_DIR, { recursive: true, force: true })
  })

  it('generates a project directory with substituted package.json', () => {
    // Run the CLI: node bin/index.js my-app --yes
    execFileSync(process.execPath, [CLI_BIN, PROJECT_NAME, '--yes'], {
      cwd: WORK_DIR,
      env: { ...process.env, CI: '1' },
      timeout: 30_000,
      encoding: 'utf-8',
    })

    // Structure assertions
    expect(existsSync(PROJECT_DIR)).toBe(true)
    expect(existsSync(join(PROJECT_DIR, 'package.json'))).toBe(true)
    expect(existsSync(join(PROJECT_DIR, 'index.html'))).toBe(true)
    expect(existsSync(join(PROJECT_DIR, 'src/main.ts'))).toBe(true)
    expect(existsSync(join(PROJECT_DIR, 'src/router/index.ts'))).toBe(true)
    expect(existsSync(join(PROJECT_DIR, 'src/store/modules/user.ts'))).toBe(true)

    // package.json name substituted
    const pkg = JSON.parse(readFileSync(join(PROJECT_DIR, 'package.json'), 'utf-8'))
    expect(pkg.name).toBe(PROJECT_NAME)

    // git initialized
    expect(existsSync(join(PROJECT_DIR, '.git'))).toBe(true)
  }, 60_000)

  it('refuses to write into a non-empty directory', () => {
    // PROJECT_DIR now exists and is non-empty (from previous test)
    expect(() => {
      execFileSync(process.execPath, [CLI_BIN, PROJECT_NAME, '--yes'], {
        cwd: WORK_DIR,
        env: { ...process.env, CI: '1' },
        timeout: 10_000,
        encoding: 'utf-8',
      })
    }).toThrow()
  })
})
