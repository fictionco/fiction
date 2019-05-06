#!/usr/bin/env node
const path = require("path")
const sao = require("sao")

const generator = path.resolve(__dirname, "./")
// In a custom directory or current directory
const outDir = path.resolve(process.argv[2] || ".")

console.log(`> Generating Factor project in ${outDir}`)

// See https://sao.js.org/#/advanced/standalone-cli
sao({ generator, outDir, logLevel: 2 })
  .run()
  .catch(error => {
    console.trace(err)
    process.exit(1)
  })
