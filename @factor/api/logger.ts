/* eslint-disable no-console */
import consola, { Consola } from "consola"
import figures from "figures"
import chalk from "chalk"

export class FactorLogger {
  utility: Consola

  constructor() {
    this.utility = consola.create({
      level: 5
    })
  }

  error(..._arguments: any[]): void {
    Reflect.apply(this.utility.error, null, _arguments)
  }

  warn(..._arguments: any[]): void {
    Reflect.apply(this.utility.warn, null, _arguments)
  }

  success(..._arguments: any[]): void {
    Reflect.apply(this.utility.log, null, _arguments)
  }

  log(..._arguments: any[]): void {
    Reflect.apply(this.utility.log, null, _arguments)
  }

  info(text: string, { color = "cyan" } = {}): void {
    const colorize = chalk.keyword(color)

    this.log(colorize(`${figures.info}`) + chalk.dim(`  ${text}`))
  }

  server(text: string, { color = "cyan" } = {}): void {
    const colorize = chalk.keyword(color)

    this.log(colorize(`${figures.arrowUp}${figures.arrowDown}`) + chalk.dim(` ${text}`))
  }

  formatted({
    title,
    lines = [],
    format = "",
    color = "cyan"
  }: {
    title: string;
    lines?: { title: string; value?: string; indent?: boolean }[];
    format?: string;
    color?: string;
  }): void {
    // Don't log during tests
    if (process.env.FACTOR_ENV == "test") return

    const msg: string[] = []

    lines.forEach(({ title, value, indent }) => {
      if (!title && !value) {
        msg.push("")
      } else if (typeof value != "undefined") {
        const formattedTitle = indent
          ? "  " + chalk.keyword(color)(title)
          : chalk.bold(title)
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
