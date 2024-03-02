#!/usr/bin/env node --import=tsx --import=@fiction/core/plugin-env/loader.mjs

const { execute } = await import('./cliProgram')

execute().catch(console.error)
