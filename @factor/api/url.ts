import path from "path"
import { setting } from "@factor/api/settings"
import { dashboardBaseRoute } from "@factor/api/dashboard"

interface UrlOptions {
  domainOnly?: true
  location?: string
}

const removeProtocol = (url: string): string => {
  return url.replace(/(^\w+:|^)\/\//, "")
}

/**
 * Gets the localhost url based on port and protocol
 */
export const localhostUrl = (options: UrlOptions = {}): string => {
  const port = process.env.PORT || 3000
  const routine = process.env.HTTP_PROTOCOL || "http"

  let url = `${routine}://localhost:${port}`

  if (url && options.domainOnly) {
    url = removeProtocol(url)
  }

  return url
}

/**
 * Gets production URL as configured
 *
 */
export const productionUrl = (options: UrlOptions = {}): string => {
  let url

  if (process.env.FACTOR_URL) {
    url = process.env.FACTOR_URL
  } else if (setting<string>("url")) {
    url = setting<string>("url")
  } else if (setting<string>("app.url")) {
    url = setting<string>("app.url")
  }

  if (url && options.domainOnly) {
    url = removeProtocol(url)
  }

  if (url) {
    return url
  } else {
    return ""
  }
}

/**
 * Gets current URl based on NODE_ENV - localhost or production
 */
export const currentUrl = (options: UrlOptions = {}): string => {
  if (process.env.NODE_ENV == "development" || process.env.FACTOR_ENV == "test")
    return localhostUrl(options)
  else {
    return productionUrl(options)
  }
}

/**
 * Gets current URl based on NODE_ENV - localhost or production
 */
export const dashboardUrl = (options: UrlOptions = {}): string => {
  const base = options.location == "current" ? currentUrl(options) : localhostUrl(options)
  return path.join(base, dashboardBaseRoute())
}

/**
 * Ensure a full url is returned
 * Used in meta info, etc.
 * @param path - url or route
 */
export const canonicalUrl = (path: string): string => {
  const schemes = ["http:", "https:", "ftp:", "mailto:", "file:", "data:", "irc:"]

  if (schemes.some((scheme) => path.includes(scheme))) {
    return path
  } else {
    return `${currentUrl()}${path}`
  }
}

/**
 * Gets the url of a common system based location based on string
 * @param location - system location
 */
export const systemUrl = (
  location: "production" | "local" | "dashboard" | "current",
  options: UrlOptions = {}
): string => {
  if (location == "production") {
    return productionUrl(options)
  } else if (location == "local") {
    return localhostUrl(options)
  } else if (location == "dashboard") {
    return dashboardUrl(options)
  } else {
    return currentUrl(options)
  }
}
