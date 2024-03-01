#!/usr/bin/env node --import=tsx --import=@factor/api/plugin-env/loader.mjs

const { execute } = await import('./cliProgram')

execute().catch(console.error)
