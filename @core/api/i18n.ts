import { addFilter } from "./hook"

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
  const locale = "en"
  return locale
}
