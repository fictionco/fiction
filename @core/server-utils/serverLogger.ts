/* eslint-disable no-console */
import { logCategory, logLevel, LogHandler } from "@factor/types"
import chalk from "chalk"
import highlight from "cli-highlight"
import consola from "consola"
import prettyOutput from "prettyoutput"
import Handlebars from "handlebars"
import { serverConfigSetting } from "@factor/server/serverConfig"
/**
 * Output JSON nicely to the CLI
 */
export const prettyJson = (data: Record<string, any>): string => {
  return highlight(prettyOutput(data, { noColor: true }), {
    theme: {
      string: chalk.hex("#00ABFF"),
      built_in: chalk.dim,
      number: chalk.hex("#00BD0C"),
      attr: chalk.dim,
      name: chalk.dim,
      class: chalk.dim,
      literal: chalk.dim,
      keyword: chalk.dim,
    },
  })
}

interface LoggerArgs {
  level: keyof typeof logLevel
  context?: "build" | "server" | "billing" | "auth" | string
  description: string
  data?: Record<string, any> | unknown
}

export const logger = (args: LoggerArgs): void => {
  const { level, context, description } = args
  let { data } = args

  const priority = logLevel[level].priority
  const color = logCategory[level].color

  const points: (string | number)[] = [chalk.hex(color)(level.padEnd(5))]

  if (context) {
    points.push(chalk.hex(color).dim(`(${context})`))
  }

  points.push(chalk.dim(`: `), description)

  console.log(points.join(""))

  if (
    priority < 10 &&
    process.env.NODE_ENV !== "production" &&
    !process.env.FACTOR_DEBUG
  ) {
    data = undefined
  }

  if (data instanceof Error) {
    consola.error(data)
  } else if (typeof data == "object" && data && Object.keys(data).length > 0) {
    console.log(prettyJson(data as Record<string, any>))
  }

  const logger = serverConfigSetting<LogHandler>("log")

  if (logger) {
    logger({ priority, color, category: level, level, description, data })
  }
}

/**
 * Standard logging
 */
const __startLogging = +Date.now()
export const nLog = (
  prefix: keyof typeof logCategory | [keyof typeof logCategory, string],
  description: string,
  data?: Record<string, any> | unknown,
): void => {
  const category: keyof typeof logCategory =
    typeof prefix == "string" ? prefix : prefix[0]
  const preLog: string[] = typeof prefix == "string" ? [prefix] : prefix

  const priority = logCategory[category].priority
  const color = logCategory[category].color

  const template = Handlebars.compile(description)

  const result = template({})

  const points: (string | number)[] = [
    ...preLog.map((_) => chalk.hex(color)(_.padStart(10))),
    result,
    chalk.dim(
      Math.round((+Date.now() - __startLogging) / 1000)
        .toString()
        .padStart(5),
    ),
  ]

  if (
    category == "debug" &&
    process.env.NODE_ENV !== "production" &&
    !process.env.DARWIN_DEBUG
  ) {
    data = undefined
  }

  description = points.join(chalk.dim(` → `))
  console.log(description)
  if (data instanceof Error) {
    consola.error(data)
  } else if (typeof data == "object" && data && Object.keys(data).length > 0) {
    console.log(prettyJson(data as Record<string, any>))
  }

  const logger = serverConfigSetting<LogHandler>("log")

  if (logger) {
    logger({ priority, color, category, description, data })
  }
}
