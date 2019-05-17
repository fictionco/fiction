const chalk = require("chalk")
module.exports = Factor => {
  return new (class {
    constructor() {}

    util(type, params) {
      var args = [].slice.call(params)

      console[type].apply(null, args)
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
      this.util("log", arguments)
      // console.log(boxen(msg, { padding: 1 }))
    }

    formatted({ title, lines }) {
      const msg = []

      lines.forEach(({ title, value }) => {
        if (typeof value != "undefined") {
          msg.push(`${title}: ${value}`)
        }
      })
      console.group(chalk.bold(title))
      console.log(msg.join(`\n`))
      console.groupEnd()
    }
  })()
}
