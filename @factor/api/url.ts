import path from "path"
import { setting } from "@factor/api/settings"
import { dashboardBaseRoute } from "@factor/dashboard"

interface UrlOptions {
  domainOnly?: true;
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
export const currentUrl = (options = {}): string => {
  if (process.env.NODE_ENV == "development" || process.env.FACTOR_ENV == "test")
    return localhostUrl(options)
  else {
    return productionUrl(options)
  }
}

/**
 * Gets current URl based on NODE_ENV - localhost or production
 */
export const dashboardUrl = (): string => {
  return path.join(currentUrl(), dashboardBaseRoute())
}

/**
 * Ensure a full url is returned
 * Used in meta info, etc.
 * @param path - url or route
 */
export const canonicalUrl = (path: string): string => {
  const schemes = ["http:", "https:", "ftp:", "mailto:", "file:", "data:", "irc:"]

  if (schemes.some(scheme => path.includes(scheme))) {
    return path
  } else {
    return `${currentUrl()}${path}`
  }
}
