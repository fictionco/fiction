/* eslint-disable no-console */
import consola, { Consola } from "consola"
import figures from "figures"
import chalk from "chalk"
import axios from "axios"
import { appId } from "@factor/api/about"
import { isNode } from "@factor/api"
interface DiagnosticEvent {
  event: string
  action?: string
  label?: string
}

export class NodeLog {
  utility: Consola

  constructor() {
    this.utility = consola.create({
      level: 5,
    })
  }

  error(..._arguments: any[]): void {
    Reflect.apply(this.utility.error, null, _arguments)
    const prime = _arguments[0]

    let msg
    if (prime instanceof Error) {
      msg = prime.message
    } else if (typeof prime == "string") {
      msg = prime
    }
    if (msg) {
      this.diagnostic({ event: "factorError", action: msg })
    }
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

  info(..._arguments: any[]): void {
    Reflect.apply(this.utility.log, null, _arguments)
  }

  server(text: string): void {
    this.log(chalk.hex("#0471ff")(`${figures.tick} `) + text)
  }

  /**
   * Send diagnostic information
   */
  async diagnostic({ event, action, label }: DiagnosticEvent): Promise<void> {
    if (!isNode) return
    label = label ? label : appId()
    const encoded = encodeURI(
      `https://factor.dev/__track_event__?event=${event}&action=${action}&label=${label}`
    )
    try {
      await axios.get(encoded)
    } catch {
      /* silence */
    }
  }

  /**
   * Formatted text CLI log
   */
  formatted({
    title,
    lines = [],
    format = "",
  }: {
    title: string
    lines?: { title: string; value?: string; indent?: boolean }[]
    format?: string
  }): void {
    // Don't log during tests
    if (process.env.FACTOR_ENV == "test") return

    const msg: string[] = []

    lines.forEach(({ title, value, indent }) => {
      if (!title && !value) {
        msg.push("")
      } else {
        const formattedTitle = indent
          ? "  " + chalk.hex("#0471ff")(title)
          : chalk.bold(title)
        const logVal = value ? value : ""
        msg.push(`${formattedTitle}${value ? ":" : ""} ${logVal}`)
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

export default new NodeLog()
