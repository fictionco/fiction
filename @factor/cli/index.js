#!/usr/bin/env node

/**
 * @remarks
 * This file loads the Typescript transpiler which uses 'ts-node'
 * and requires the main CLI script.
 *
 * The shebang (#!) above runs the node executable. Note that this needs to be cross-env compatible if changed (i.e. windows)
 */

require("./transpile")()
module.exports = require("./cli")
