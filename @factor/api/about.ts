import { setting } from "@factor/api/settings"
import pkg from "@factor/core/package.json"

/**
 * Gets the current primary version of Factor
 */
export const factorVersion = (): string => {
  return pkg.version
}

/**
 * Set the scope of the framework to control defaults and handling
 */
export const factorScope = (): "framework" | "cms" => {
  return setting("scope") ?? "cms"
}

/**
 * Get a unique ID to associate with an app
 */
export const appId = (): string => {
  const appUrl = setting<string>("app.email")
    ? setting<string>("app.email")
    : setting<string>("app.url")

  return `${appUrl || "unknown"}-${factorVersion()}`
}
