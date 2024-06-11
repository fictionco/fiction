#!/usr/bin/env node --import=tsx --import=@fiction/core/plugin-env/loader.mjs --max-old-space-size=4096

import process from 'node:process'

process.noDeprecation = true

const { execute } = await import('./cliProgram.js')

execute().catch(console.error)
