const chalk = require("chalk")
module.exports = Factor => {
  return new (class {
    constructor() {}

    util(type, params) {
      var args = [].slice.call(params)
      args[0] = "%c" + args[0]

      args.splice(1, 0, "font-weight: bold")
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

      lines.forEach(_ => {
        msg.push(_)
      })
      console.group(chalk.bold(title))
      console.log(msg.join(`\n`))
      console.groupEnd()
    }
  })()
}
