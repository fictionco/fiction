const consola = require("consola")
const chalk = require("chalk")
const boxen = require("boxen")
module.exports = Factor => {
  return new (class {
    constructor() {}

    util(type, params) {
      consola[type].apply(null, params)
    }

    custom({ type, params, target }) {
      this.util(type, params, target)
    }

    log() {
      this.util("log", arguments)
    }

    info() {
      this.util("info", arguments)
    }

    success() {
      this.util("success", arguments)
    }

    error() {
      this.util("error", arguments)
    }

    warn() {
      this.util("warn", arguments)
    }

    box(msg) {
      console.log(boxen(chalk.bold(msg), { padding: 1, borderStyle: "double" }))
    }

    formatted({ title, lines }) {
      const msg = []

      lines.forEach(({ title, value, indent }) => {
        if (typeof value != "undefined") {
          const formattedTitle = indent ? "  " + chalk.magentaBright(title) : chalk.bold.cyan(title)
          msg.push(`${formattedTitle}: ${value}`)
        }
      })

      console.group(chalk.bold(title))
      console.log(msg.join(`\n`))
      console.log()
      console.groupEnd()
    }
  })()
}
