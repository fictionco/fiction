/* eslint-disable unicorn/import-style */
/* eslint-disable no-console */
import { isNode } from "./utils"

import { logCategory, logLevel } from "@factor/types"
import type { ChalkInstance } from "chalk"
import type { Consola } from "consola"
export const logType = {
  event: { color: "#5233ff" },
  info: { color: "#00ABFF" },
  record: { color: "#FF9500" },
  data: { color: "#FF9500" },
  command: { color: "#FF9500" },
  send: { color: "#00BD0C" },
  error: { color: "#FF0076" },
  warn: { color: "#FF0076" },
  notify: { color: "#FF9500" },
  success: { color: "#00BD0C" },
}

/**
 * Log only in development mode
 * @reference https://itnext.io/console-rules-b30560fc2367
 */
export const dLog = (
  category: keyof typeof logType,
  description: string,
  data?: string | Record<string, any>,
): void => {
  // designed for browser, don't log in NODE
  if (isNode) return

  const shouldLog =
    process.env.NODE_ENV == "development" ||
    (typeof localStorage !== "undefined" && localStorage.getItem("dLog"))
      ? true
      : false

  if (shouldLog) {
    const color = logType[category].color
    const additional = ""

    // eslint-disable-next-line no-console
    console.log(
      `%c${category} > ${description}`,
      `color: ${color};padding: 5px 0;${additional}`,
      data ?? "",
    )
  }
}

interface LoggerArgs {
  level: keyof typeof logLevel
  context?: string
  description?: string
  data?: Record<string, any> | unknown
  disableOnRestart?: boolean
  priority?: number
  color?: string
}

class Logger {
  isNode: boolean
  srv: {
    chalk?: ChalkInstance
    consola?: Consola
    prettyOutput?: (
      a: Record<string, any>,
      b: Record<string, any>,
      c: number,
    ) => string
  }
  constructor() {
    this.isNode = typeof window === "undefined" ? true : false
    this.srv = {}
    if (this.isNode) {
      this.serverInit().catch((error) =>
        this.logServer({ level: "error", context: "log", data: error }),
      )
    }
  }

  async serverInit(): Promise<void> {
    const [
      { default: chalk },
      { default: prettyOutput },
      { default: consola },
    ] = await Promise.all([
      import("chalk"),
      import("prettyoutput"),
      import("consola"),
    ])

    this.srv = {
      chalk,
      prettyOutput,
      consola,
    }
  }

  logBrowser(config: LoggerArgs): void {
    const { level, description, context, color, data } = config
    const shouldLog =
      process.env.NODE_ENV == "development" ||
      (typeof localStorage !== "undefined" && localStorage.getItem("logger"))
        ? true
        : false

    if (shouldLog) {
      // eslint-disable-next-line no-console
      console.log(
        `%c${level} `,
        `color: ${color};opacity: .6;`,
        `(${context}):`,
        `color: ${color};`,
        description,
        data ?? "",
      )
    }
  }

  logServer(config: LoggerArgs): void {
    const {
      level,
      disableOnRestart,
      context,
      color = "#dddddd",
      data,
      description,
    } = config

    if (!this.srv.chalk) return
    if (!this.srv.consola) return
    if (!this.srv.prettyOutput) return

    if (disableOnRestart && process.env.IS_RESTART) return
    const points: (string | number)[] = [
      this.srv.chalk.hex(color).dim(level.padEnd(5)),
    ]

    points.push(this.srv.chalk.hex(color)(`(${context ?? "???"}): `.padEnd(10)))

    if (description) points.push(description)

    console.log(points.join(""))

    // test

    if (data instanceof Error) {
      this.srv.consola.error(data)
    } else if (
      typeof data == "object" &&
      data &&
      Object.keys(data).length > 0
    ) {
      console.log(this.srv.prettyOutput(data as Record<string, any>, {}, 2))
    }
  }

  log(config: LoggerArgs): void {
    const { level } = config

    config.priority = logLevel[level].priority
    config.color = logCategory[level].color

    if (
      config.priority < 10 &&
      process.env.NODE_ENV !== "production" &&
      !process.env.FACTOR_DEBUG
    ) {
      config.data = undefined
    }

    if (this.isNode) {
      this.logServer(config)
    } else {
      this.logBrowser(config)
    }
  }
}

export const logger = new Logger()
