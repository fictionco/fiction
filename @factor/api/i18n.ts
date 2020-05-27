import { addFilter, applyFilters } from "./hooks"
import { createSettings, setting } from "./settings"

/**
 * Sets the language locale
 * This loads in main files after settings usually so this needs to trigger settings update
 * @param localeCode - https://developer.chrome.com/webstore/i18n
 */
export const setLocale = (localeCode: string): void => {
  addFilter({
    key: "addLocale",
    hook: "i18n-locale",
    callback: (): string => {
      return localeCode
    },
  })

  // Update settings with locale data
  createSettings()
}

/**
 * Gets the language locale, defaults to english (en)
 */
export const getLocale = (): string => {
  const locale = setting("locale") ?? "en"
  return applyFilters("i18n-locale", locale)
}
