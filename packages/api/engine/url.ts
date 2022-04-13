import { _stop } from "../error"
import { userConfigSetting } from "./plugins"

export const getAppPort = (): string => {
  return userConfigSetting("portApp") || process.env.PORT_APP || "3000"
}

export const getServerPort = (): string => {
  const port = userConfigSetting("port") || process.env.PORT || "3210"

  return port
}

export const serverUrl = (): string => {
  if (process.env.FACTOR_SERVER_URL) {
    return process.env.FACTOR_SERVER_URL
  } else {
    return `http://localhost:${getServerPort() || "3210"}`
  }
}

/**
 * Gets the localhost url based on port and protocol
 */
const localhostAppUrl = (): string => {
  const port = getAppPort() || "3000"
  const routine = process.env.HTTP_PROTOCOL || "http"

  const url = `${routine}://localhost:${port}`

  return url
}

/**
 * Gets production URL as configured
 */
const productionAppUrl = (): string => {
  const url = process.env.FACTOR_APP_URL

  if (!url) throw _stop("FACTOR_APP_URL is required in production")

  return url
}

/**
 * Gets current URl based on NODE_ENV - localhost or production
 */
export const currentUrl = (): string => {
  const env = process.env.NODE_ENV

  const url =
    env == "development" || process.env.TEST_ENV == "unit"
      ? localhostAppUrl()
      : productionAppUrl()

  return url
}
