#!/bin/sh
":" //# comment; exec /usr/bin/env node "$0" "$@"

require("./transpile")
module.exports = require("./cli.js").default
