#!/usr/bin/env node
const path = require("path")
const sao = require("sao")
const consola = require("consola")
const generator = path.resolve(__dirname, "./")
// In a custom directory or current directory
const outDir = path.resolve(process.argv[2] || ".")

consola.success(`[Great work! Generating Factor project in "${outDir}"]`)

// See https://sao.js.org/#/advanced/standalone-cli
sao({ generator, outDir, logLevel: 2 })
  .run()
  .catch(error => {
    consola.error(error)
    process.exit(1)
  })
