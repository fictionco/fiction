import prettyBytes from "pretty-bytes"
import chalk from "chalk"
import { pushToFilter } from "@factor/api/hooks"
import { factorVersion } from "@factor/api/about"
import { systemUrl } from "@factor/api/url"
import log from "@factor/api/logger"
import latestVersion from "latest-version"
import axios from "axios"
import { FactorUser } from "@factor/user/types"
const __remoteConfig = {
  apiUser: undefined,
  latestVersion: "",
}
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

export const getApiUser = async (): Promise<FactorUser | undefined> => {
  if (__remoteConfig.apiUser) {
    return __remoteConfig.apiUser
  } else {
    const apiKey = process.env.FACTOR_API_KEY

    if (apiKey) {
      try {
        const {
          data: { result },
        } = await axios.get(`https://api-server.factor.dev?apiKey=${apiKey}`)
        return result
      } catch {
        log.info("error getting API user")
      }
    }
    return
  }
}

interface FactorEdition {
  name: "pro" | "business" | "community"
  text?: string
}

export const getSuiteEdition = async (): Promise<FactorEdition> => {
  const apiUser = await getApiUser()
  return { name: "community", text: apiUser?.displayName ?? "" }
}

export const getLatestVersion = async (): Promise<string> => {
  if (__remoteConfig.latestVersion) {
    return __remoteConfig.latestVersion
  } else {
    let latest = ""
    try {
      latest = await latestVersion("@factor/core")
    } catch {
      log.info("Error getting latest Factor version")
    }
    const current = factorVersion()
    const executor = getCliExecutor()

    if (latest && current != latest) {
      pushToFilter({
        key: "newVersion",
        hook: "cli-notices",
        item: `Factor v${latest} is available (v${latest}) - Run: "${executor} upgrade"`,
      })
    }

    __remoteConfig.latestVersion = latest

    return latest
  }
}

export const getRemoteConfig = async (): Promise<typeof __remoteConfig> => {
  const _promises: Promise<any>[] = [getApiUser(), getLatestVersion()]

  await Promise.all(_promises)

  return __remoteConfig
}

export const blueChalk = (text: string): string => {
  return chalk.hex("#0471ff").bold(text)
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
  const { name } = await getSuiteEdition()

  const vLatest = latest != current ? `v${latest} upgrade available` : "latest"

  lines.push(chalk.bold(`Factor platform v${current} (${vLatest})`))

  lines.push(`Running ${chalk.bold(name)} edition in ${chalk.bold(NODE_ENV)} mode`)

  if (command && ["dev", "serve", "start"].includes(command)) {
    lines.push(`Available at ${blueChalk(systemUrl("local"))}`)
  }

  log.log(`\n` + lines.join(`\n`) + `\n`)
}
