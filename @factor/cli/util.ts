import prettyBytes from "pretty-bytes"
import chalk from "chalk"
import { pushToFilter } from "@factor/api/hooks"
import { factorVersion } from "@factor/api/about"
import { localhostUrl } from "@factor/api/url"
import log from "@factor/api/logger"
import latestVersion from "latest-version"
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
 * Returns which module registry was used to execute the CLI
 */
export const getCliExecutor = (): string => {
  const ePath = process.env.npm_execpath
  return ePath && ePath.includes("yarn") ? "yarn" : "npm"
}

export const getLatestVersion = async (): Promise<string> => {
  const out = ""
  let latest
  try {
    latest = await latestVersion("@factor/core")
  } catch (error) {
    log.info("Error getting latest Factor version")
  }
  const current = factorVersion()

  if (latest && current != latest) {
    pushToFilter({
      key: "newVersion",
      hook: "cli-notices",
      item: `New Factor version available (v${latest})`
    })
  }

  return out
}

/**
 * Log useful server info
 */
export const serverInfo = async ({
  NODE_ENV = process.env.NODE_ENV,
  command
}: {
  NODE_ENV?: string;
  command?: string;
}): Promise<void> => {
  const lines = []

  const current = factorVersion()
  lines.push(chalk.bold(`Factor Platform v${current}`))

  lines.push(`Running in ${chalk.bold(NODE_ENV)} mode`)
  if (command && ["dev", "serve", "start"].includes(command)) {
    lines.push(`Serving at ${chalk.cyan(localhostUrl())}`)
  }

  getLatestVersion()

  log.log(lines.join(`\n`) + `\n`)
}
