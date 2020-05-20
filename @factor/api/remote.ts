import { FactorUser } from "@factor/user/types"
import { factorVersion } from "@factor/api/about"
import { pushToFilter } from "@factor/api/hooks"
import { getCliExecutor } from "@factor/cli/util"
import latestVersion from "latest-version"
import log from "@factor/api/logger"
import axios from "axios"

const __remoteConfig = {
  apiUser: undefined,
  latestVersion: "",
}

interface FactorEdition {
  edition: string
  displayName?: string
}

export const getApiUserData = async (): Promise<
  | { user?: FactorUser; suite: { pro: boolean; business: boolean; hasError?: boolean } }
  | undefined
> => {
  if (__remoteConfig.apiUser) {
    return __remoteConfig.apiUser
  } else {
    const apiKey = process.env.FACTOR_API_KEY
    const apiMode = process.env.FACTOR_API_MODE

    if (apiKey) {
      const apiServerUrl =
        apiMode == "local" ? "http://localhost:3333" : "https://api-server.factor.dev"
      try {
        const {
          data: { result },
        } = await axios.get(`${apiServerUrl}?apiKey=${apiKey}`)
        return result
      } catch {
        return {
          suite: { pro: false, business: false, hasError: true },
        }
      }
    }
    return
  }
}

export const getSuiteEdition = async (): Promise<FactorEdition> => {
  let edition = "community"

  try {
    const result = await getApiUserData()

    if (result) {
      const { pro, business, hasError } = result.suite ?? {}

      if (business) {
        edition = "business"
      } else if (pro) {
        edition = "pro"
      } else if (hasError) {
        edition = "unknown"
      }
    }
  } catch {
    edition = "unknown"
  }

  return { edition }
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
  const _promises: Promise<any>[] = [getApiUserData(), getLatestVersion()]

  await Promise.all(_promises)

  return __remoteConfig
}
