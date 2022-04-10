/* eslint-disable unicorn/import-style */
/* eslint-disable no-console */
import dayjs from "dayjs"
import safeStringify from "fast-safe-stringify"
import chalk from "chalk"
import prettyoutput from "prettyoutput"
import consola from "consola"
import { logCategory, logLevel } from "./types"
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
  error?: Error | unknown
  disableOnRestart?: boolean
  priority?: number
  color?: string
}

class Logger {
  isNode: boolean

  constructor() {
    this.isNode = isNode
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

    if (disableOnRestart && process.env.IS_RESTART) {
      return
    }
    const points: (string | number)[] = [chalk.hex(color).dim(level.padEnd(5))]

    points.push(chalk.hex(color)(`(${context ?? "???"}): `.padEnd(10)))

    if (description) points.push(description)

    console.log(points.join(""))

    // test

    if (data instanceof Error) {
      consola.error(data)
    } else if (
      typeof data == "object" &&
      data &&
      Object.keys(data).length > 0
    ) {
      console.log(
        prettyoutput(
          this.refineDataRecursive(data) as Record<string, any>,
          {},
          2,
        ),
      )
    }

    if (error) {
      consola.error(error)
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

  warn(
    context: string,
    description: string,
    config?: Omit<LoggerArgs, "level" | "context" | "description">,
  ): void {
    this.log({ level: "warn", context, description, ...config })
  }

  error(
    context: string,
    description: string,
    config?: Omit<LoggerArgs, "level" | "context" | "description">,
  ): void {
    this.log({ level: "error", context, description, ...config })
  }

  info(
    context: string,
    description: string,
    config?: Omit<LoggerArgs, "level" | "context" | "description">,
  ): void {
    this.log({ level: "info", context, description, ...config })
  }

  debug(
    context: string,
    description: string,
    config?: Omit<LoggerArgs, "level" | "context" | "description">,
  ): void {
    this.log({ level: "debug", context, description, ...config })
  }
}

export const logger = new Logger()

export const log = logger
