/* eslint-disable no-console */
import consola from "consola"
import figures from "figures"
import chalk from "chalk"

export class FactorLogger {
  constructor() {
    this.utility = consola.create({
      level: 5
    })
  }

  error() {
    Reflect.apply(this.utility.error, null, arguments)
  }

  warn() {
    Reflect.apply(this.utility.warn, null, arguments)
  }

  success() {
    Reflect.apply(this.utility.log, null, arguments)
  }

  log() {
    Reflect.apply(this.utility.log, null, arguments)
  }

  info() {
    Reflect.apply(this.utility.info, null, arguments)
  }

  formatted({ title, lines = [], format = "", color = "cyan" }) {
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
}

export default new FactorLogger()
