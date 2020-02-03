import prettyBytes from "pretty-bytes"
import chalk from "chalk"
import { factorVersion } from "@factor/api/about"
import { localhostUrl } from "@factor/api/url"
import log from "@factor/api/logger"

/**
 * Get node memory usage
 * https://nodejs.org/api/process.html#process_process_memoryusage
 */
export const getMemoryUsage = (): { heap: number; rss: number } => {
  const { heapUsed, rss } = process.memoryUsage()
  return { heap: heapUsed, rss }
}
/**
 * Get a formatted memory usage output for CLI
 */
export const getFormattedMemoryUsage = (): string => {
  const { heap, rss } = getMemoryUsage()
  return `Memory usage: ${chalk.bold(prettyBytes(heap))} (RSS: ${prettyBytes(rss)})`
}
/**
 * Log useful server info
 */
export const serverInfo = ({
  NODE_ENV = process.env.NODE_ENV
}: {
  NODE_ENV?: string;
}): void => {
  const lines = []
  lines.push(chalk.bold(`Factor Platform v${factorVersion()}`))
  lines.push(`Running in ${chalk.bold(NODE_ENV)} mode`)
  lines.push(`Serving locally at ${chalk.cyan(localhostUrl())}`)
  log.log(lines.join(`\n`) + `\n`)
}
