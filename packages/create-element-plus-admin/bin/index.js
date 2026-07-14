#!/usr/bin/env node
'use strict'

const { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync, readdirSync } = require('node:fs')
const { join, resolve } = require('node:path')
const { execSync } = require('node:child_process')

function parseArgs(argv) {
  const args = argv.slice(2)
  let projectName
  let skipPrompts = false
  for (const arg of args) {
    if (arg === '--yes' || arg === '-y') {
      skipPrompts = true
    } else if (!arg.startsWith('-')) {
      projectName = arg
    }
  }
  return { projectName, skipPrompts }
}

function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

function main() {
  const { projectName: cliName, skipPrompts } = parseArgs(process.argv)

  const name = cliName || (skipPrompts || process.env.CI ? 'my-admin-app' : 'my-admin-app')
  const pkgName = kebabCase(name)
  const targetDir = resolve(process.cwd(), name)

  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    console.error(`\n❌ 错误：目录 ${targetDir} 已存在且非空。请使用空目录或新名称。`)
    process.exit(1)
  }

  const templateDir = resolve(__dirname, '..', 'template')
  if (!existsSync(templateDir)) {
    console.error('\n❌ 错误：未找到内嵌模板快照。请先运行 pnpm --filter create-element-plus-admin snapshot。')
    process.exit(1)
  }

  console.log(`\n📦 正在创建项目 ${name} ...`)

  mkdirSync(targetDir, { recursive: true })
  cpSync(templateDir, targetDir, {
    recursive: true,
    filter: (src) => {
      const rel = src.slice(templateDir.length)
      const skip = ['node_modules', 'dist', '.git', 'coverage', 'test-results', 'playwright-report']
      return !skip.some((s) => rel === `/${s}` || rel.startsWith(`/${s}/`))
    },
  })

  // Substitute package.json name
  const pkgPath = join(targetDir, 'package.json')
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    pkg.name = pkgName
    pkg.version = '0.1.0'
    pkg.private = true
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  }

  // Substitute README title
  const readmePath = join(targetDir, 'README.md')
  if (existsSync(readmePath)) {
    let readme = readFileSync(readmePath, 'utf-8')
    readme = readme.replace(/__PROJECT_NAME__/g, name)
    writeFileSync(readmePath, readme)
  }

  // Ensure .gitignore
  const gitignorePath = join(targetDir, '.gitignore')
  if (!existsSync(gitignorePath)) {
    writeFileSync(gitignorePath, 'node_modules\ndist\n.env.local\n*.log\n.DS_Store\n')
  }

  // git init + first commit
  try {
    execSync('git init', { cwd: targetDir, stdio: 'pipe' })
    execSync('git add -A', { cwd: targetDir, stdio: 'pipe' })
    const gitEnv = {
      ...process.env,
      GIT_AUTHOR_NAME: 'create-element-plus-admin',
      GIT_AUTHOR_EMAIL: 'cli@local',
      GIT_COMMITTER_NAME: 'create-element-plus-admin',
      GIT_COMMITTER_EMAIL: 'cli@local',
    }
    execSync('git commit -m "chore: init from create-element-plus-admin"', {
      cwd: targetDir,
      stdio: 'pipe',
      env: gitEnv,
    })
    console.log('✅ git 仓库已初始化')
  } catch {
    console.log('⚠️  git 初始化跳过')
  }

  console.log(`\n🎉 项目 ${name} 创建成功！`)
  console.log(`\n后续步骤：`)
  console.log(`  cd ${name}`)
  console.log(`  pnpm install`)
  console.log(`  pnpm dev`)
  console.log('')
}

main()
