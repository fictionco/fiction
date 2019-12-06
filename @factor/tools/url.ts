import { setting } from "@factor/tools/settings"
import log from "@factor/tools/logger"

export const localhostUrl = (): string => {
  const port = process.env.PORT || 7777
  const routine = process.env.HTTP_PROTOCOL || "http"
  return `${routine}://localhost:${port}`
}

export const currentUrl = (): string => {
  if (process.env.NODE_ENV == "development" || process.env.FACTOR_ENV == "test")
    return localhostUrl()
  else {
    if (setting("app.url")) return setting("app.url")
    else if (setting("url")) return setting("url")
    else {
      log.warn("URL Missing. Set application URL in Factor settings.")
      return "https://url-needed-in-config"
    }
  }
}
