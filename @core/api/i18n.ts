import { addFilter, applyFilters } from "./hook"
import { setting } from "./settings"

/**
 * Sets the language locale
 * This loads in main files after settings usually so this needs to trigger settings update
 * @param localeCode - https://developer.chrome.com/webstore/i18n
 */
export const setLocale = (localeCode: string): void => {
  addFilter({
    key: "addLocale",
    hook: "locale",
    callback: (): string => localeCode,
  })
}
/**
 * Gets the language locale, defaults to english (en)
 */
export const getLocale = (): string => {
  const locale = setting("locale") ?? "en"
  return applyFilters("locale", locale)
}
