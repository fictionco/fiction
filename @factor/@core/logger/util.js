import consola from "consola"
import figures from "figures"
import chalk from "chalk"

const logger = consola.create({
  level: 5,
  defaults: {
    additionalColor: "white"
  }
})

export function logError() {
  Reflect.apply(logger.error, null, arguments)
}

export function logInfo() {
  Reflect.apply(logger.log, null, arguments)
}

export function logSuccess() {
  Reflect.apply(logger.success, null, arguments)
}

export function logFormatted({ title, lines = [], format = false, color = "cyan" }) {
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
