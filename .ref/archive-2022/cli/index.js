#!/bin/sh
':' // # comment; exec /usr/bin/env node --no-warnings --experimental-loader=@factor/cli/loader.mjs --experimental-json-modules --noharmony "$0" "$@"

/**
 * @remarks
 * This file loads the Typescript transpiler which uses 'ts-node'
 * and requires the main CLI script.
 *
 * The shebang (#!) above runs the node executable. Note that this needs to be cross-env compatible if changed (i.e. windows)
 *
 * more advanced use case: http://sambal.org/2014/02/passing-options-node-shebang-line/
 */

const { execute } = await import('./cli')

execute()
