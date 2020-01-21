#!/usr/bin/env node

const path = require("path")
const sao = require("sao")
const consola = require("consola")
const generator = path.resolve(__dirname, "./")
const figures = require("figures")
const chalk = require("chalk")

const { name: packageName, version } = require("./package.json")

/**
 * Generate in a custom directory or in current directory?
 */
const outDir = path.resolve(process.argv[2] || ".")

consola.log(`${figures.pointer} Starting ${packageName}@${version}`)
consola.log()
consola.log(chalk.cyan.bold("Great work!"))
consola.success(`Generating Factor project in: ${outDir}`)
consola.log()

// See https://sao.js.org/#/advanced/standalone-cli
sao({ generator, outDir, logLevel: 2 })
  .run()
  .catch(error => {
    consola.error(error)
    process.exit(1)
  })
