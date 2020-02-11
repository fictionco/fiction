import { setting } from "@factor/api/settings"

/**
 * Gets the localhost url based on port and protocol
 */
export const localhostUrl = (): string => {
  const port = process.env.PORT || 3000
  const routine = process.env.HTTP_PROTOCOL || "http"
  return `${routine}://localhost:${port}`
}

/**
 * Gets production URL as configured
 *
 */
export const productionUrl = (): string => {
  let url

  if (process.env.FACTOR_URL) {
    url = process.env.FACTOR_URL
  } else if (setting<string>("url")) {
    url = setting<string>("url")
  } else if (setting<string>("app.url")) {
    url = setting<string>("app.url")
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
export const currentUrl = (): string => {
  if (process.env.NODE_ENV == "development" || process.env.FACTOR_ENV == "test")
    return localhostUrl()
  else {
    return productionUrl()
  }
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
