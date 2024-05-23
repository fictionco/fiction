#!/usr/bin/env node --import=tsx --import=@fiction/core/plugin-env/loader.mjs --max-old-space-size=4096 --trace-deprecation

const { execute } = await import('./cliProgram')

execute().catch(console.error)
