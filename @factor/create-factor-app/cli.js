#!/usr/bin/env node

// @ts-nocheck
const path = require("path")
const sao = require("sao")
const consola = require("consola")
const generator = path.resolve(__dirname, "./")
const { name, version } = require("./package.json")
// In a custom directory or current directory
const outDir = path.resolve(process.argv[2] || ".")
const figures = require("figures")

consola.log(`${figures.pointer} Starting ${name}@${version}`)
consola.log()
consola.success(`Great work! Generating Factor project in: ${outDir}`)
consola.log()

// See https://sao.js.org/#/advanced/standalone-cli
sao({ generator, outDir, logLevel: 2 })
  .run()
  .catch(error => {
    consola.error(error)
    process.exit(1)
  })
