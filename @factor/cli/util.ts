import prettyBytes from "pretty-bytes"
import chalk from "chalk"
import { getLatestVersion } from "@factor/api/remote"
import { factorVersion } from "@factor/api/about"
import { systemUrl } from "@factor/api/url"
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
 * Returns which module registry was used to execute the CLI
 */
export const getCliExecutor = (): string => {
  const ePath = process.env.npm_execpath
  return ePath && ePath.includes("yarn") ? "yarn" : "npm"
}

export const blueChalk = (text: string): string => {
  return chalk.hex("#0471ff").bold(text)
}

export const redChalk = (text: string): string => {
  return chalk.hex("#FF0076").bold(text)
}

/**
 * Log useful server info
 */
export const serverInfo = async ({
  NODE_ENV = process.env.NODE_ENV,
  command,
}: {
  NODE_ENV?: string
  command?: string
}): Promise<void> => {
  const lines = []

  const current = factorVersion()
  const latest = await getLatestVersion()
  const vLatest = latest != current ? `v${latest} upgrade available` : "latest"

  lines.push(
    chalk.bold(`Factor platform v${current} (${vLatest})`) +
      ` / ${chalk.bold(NODE_ENV)} mode`
  )

  if (command && ["dev", "serve", "start"].includes(command)) {
    lines.push(`Available at ${blueChalk(systemUrl("local"))}`)
  }

  log.log(`\n` + lines.join(`\n`) + `\n`)
}
