#!/bin/sh
":" //# comment; exec /usr/bin/env node --no-warnings --experimental-loader=@factor/cli/loader.mjs --experimental-json-modules --noharmony "$0" "$@"

/**
 * @remarks
 * This file loads the Typescript transpiler which uses 'ts-node'
 * and requires the main CLI script.
 *
 * The shebang (#!) above runs the node executable. Note that this needs to be cross-env compatible if changed (i.e. windows)
 *
 * https://gist.github.com/rachidbch/5985f5fc8230b45c4b516ce1c14f0832
 */

import { transpiler } from "./transpile"

await transpiler()

const { execute } = await import("./program")

execute().catch(console.error)
