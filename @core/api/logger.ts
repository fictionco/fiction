/* eslint-disable unicorn/import-style */
/* eslint-disable no-console */
import dayjs from "dayjs"
import { logCategory, logLevel } from "@factor/types"
import type { ChalkInstance } from "chalk"
import type { Consola } from "consola"
import safeStringify from "fast-safe-stringify"
import { isNode } from "./utils"
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

interface LoggerArgs {
  level: keyof typeof logLevel
  context?: string
  description?: string
  data?: Record<string, any> | unknown
  error?: Error
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
    this.isNode = isNode
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
    const { level, description, context, color, data, error } = config
    const shouldLog =
      process.env.NODE_ENV == "development" ||
      (typeof localStorage !== "undefined" && localStorage.getItem("logger"))
        ? true
        : false

    if (shouldLog) {
      // eslint-disable-next-line no-console
      console.log(
        `%c${level}%c(${context ?? "???"}):`,
        `color: ${color}99;`,
        `color: ${color};`,
        description,
        data ?? "",
      )

      if (error) {
        console.error(error)
      }
    }
  }

  refineDataRecursive(
    obj: Record<string, any>,
    depth = 0,
  ): Record<string, any> {
    depth++
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => {
        if (dayjs.isDayjs(v)) {
          v = `DAYJS: ${v.toISOString()}`
        } else if (typeof v === "object" && v && Object.keys(v).length > 0) {
          const len = safeStringify(v)
          if (len.length > 10_000 && !process.env.DEBUG) {
            v = `LARGE OBJECT(${len.length}): ${len.slice(0, 100)}...`
          } else if (depth < 4) {
            v = this.refineDataRecursive(v, depth)
          }
        }

        return [k, v]
      }),
    )
  }

  logServer(config: LoggerArgs): void {
    const {
      level,
      disableOnRestart,
      context,
      color = "#dddddd",
      data,
      description,
      error,
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
      console.log(
        this.srv.prettyOutput(
          this.refineDataRecursive(data) as Record<string, any>,
          {},
          2,
        ),
      )
    }

    if (error) {
      this.srv.consola.error(error)
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
