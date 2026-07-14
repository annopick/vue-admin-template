#!/usr/bin/env node
'use strict'

/**
 * Snapshot script: copies packages/template into packages/create-element-plus-admin/template.
 * Run before publishing so the CLI ships with a fresh embedded template.
 * Also wired as prepublishOnly in package.json (slice 8).
 */
const { cpSync, rmSync, existsSync } = require('node:fs')
const { resolve, dirname } = require('node:path')

const root = resolve(dirname(__filename), '..', '..', '..')
const templateSrc = resolve(root, 'packages', 'template')
const templateDest = resolve(dirname(__filename), '..', 'template')

if (!existsSync(templateSrc)) {
  console.error('❌ packages/template not found at', templateSrc)
  process.exit(1)
}

// Clean previous snapshot
rmSync(templateDest, { recursive: true, force: true })

cpSync(templateSrc, templateDest, {
  recursive: true,
  filter: (src) => {
    const rel = src.slice(templateSrc.length)
    const skip = ['node_modules', 'dist', '.git', 'coverage', 'test-results', 'playwright-report', 'pnpm-lock.yaml']
    return !skip.some((s) => rel === `/${s}` || rel.startsWith(`/${s}/`))
  },
})

console.log('✅ Template snapshot copied to packages/create-element-plus-admin/template')
