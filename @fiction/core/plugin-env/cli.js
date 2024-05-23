#!/usr/bin/env sh
':' // # comment; exec /usr/bin/env node --max-old-space-size=4096 --import=tsx --import=@fiction/core/plugin-env/loader.mjs "$0" "$@"

const { execute } = await import('./cliProgram')

execute().catch(console.error)
