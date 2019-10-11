const consola = require("consola")
const chalk = require("chalk")
const boxen = require("boxen")
const figures = require("figures")

export default Factor => {
  return new (class {
    constructor() {
      this.logger = consola.create({
        level: 5,
        defaults: {
          additionalColor: "white"
        }
      })
    }

    util(type, params) {
      this.logger[type].apply(null, params)
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

    formatted({ title, lines = [], format = false, box = true, color = "cyan" }) {
      // Don't log during tests
      if (process.env.FACTOR_ENV == "test") return

      const msg = []

      lines.forEach(({ title, value, indent }) => {
        if (!title && !value) {
          msg.push("")
        } else if (typeof value != "undefined") {
          const formattedTitle = indent ? "  " + chalk[color](title) : chalk.bold(title)
          msg.push(`${formattedTitle}${value ? ":" : ""} ${value}`)
        }
      })

      let prefix = chalk.white(figures.pointer)

      if (format == "warn") {
        prefix = chalk.yellow(figures.warning)
      } else if (format == "error") {
        prefix = chalk.red(figures.cross)
      } else if (format == "success") {
        prefix = chalk.green(figures.tick)
      }

      const ttl = `${prefix} ${chalk.bold(title)}`
      console.log("")
      console.group(ttl)
      if (msg.length > 0) {
        console.log(msg.join(`\n`))
      }
      console.log("")
      console.groupEnd()
    }
  })()
}
