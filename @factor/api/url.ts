import { setting } from "@factor/api/settings"
import log from "@factor/api/logger"

/**
 * Gets the localhost url based on port and protocol
 */
export const localhostUrl = (): string => {
  const port = process.env.PORT || 7777
  const routine = process.env.HTTP_PROTOCOL || "http"
  return `${routine}://localhost:${port}`
}

/**
 * Gets production URL as configured
 */
export const productionUrl = (): string => {
  const url = setting<string>("app.url") ?? setting<string>("url") ?? false
  if (url) {
    return url
  } else {
    log.warn(`Production URL isn't set. Add it under 'app.url' in settings.`)
    return "[not set]"
  }
}

/**
 * Gets current URl based on NODE_ENV - localhost or production
 */
export const currentUrl = (): string => {
  if (process.env.NODE_ENV == "development" || process.env.FACTOR_ENV == "test")
    return localhostUrl()
  else {
    return productionUrl()
  }
}

/**
 * Get a unique ID to associate with an app
 */
export const appId = (): string => {
  const appUrl = setting<string>("app.email")
    ? setting<string>("app.email")
    : setting<string>("app.url")

  return appUrl || "unknown"
}
