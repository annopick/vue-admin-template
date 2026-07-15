#!/usr/bin/env node
'use strict'

/**
 * Build script: runs the snapshot step so the CLI has a fresh template
 * embedded. The bin/index.js is already plain JS (no compilation needed).
 */
const { execSync } = require('node:child_process')
const { resolve, dirname } = require('node:path')

const here = dirname(__filename)
execSync('node ' + resolve(here, 'snapshot.cjs'), { stdio: 'inherit' })
console.log('✅ CLI build complete')
