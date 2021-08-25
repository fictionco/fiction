interface UrlOptions {
  domainOnly?: true
  location?: string
}
const removeProtocol = (url: string): string => {
  return url.replace(/(^\w+:|^)\/\//, "")
}

export const serverUrl = (): string => {
  if (process.env.FACTOR_ENDPOINT_URL) {
    return process.env.FACTOR_ENDPOINT_URL
  } else {
    return "http://localhost:3210"
  }
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
 */
export const productionUrl = (options: UrlOptions = {}): string => {
  let url = process.env.FACTOR_APP_URL

  if (url && options.domainOnly) {
    url = removeProtocol(url)
  }

  return url ? url : ""
}
/**
 * Gets current URl based on NODE_ENV - localhost or production
 */
export const currentUrl = (options: UrlOptions = {}): string => {
  const env = process.env.NODE_ENV

  const url =
    env == "development" || process.env.FACTOR_ENV == "test"
      ? localhostUrl(options)
      : productionUrl(options)

  return url
}
