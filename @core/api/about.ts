import { version } from "./package.json"

/**
 * Gets the current primary version of Factor
 */
export const factorVersion = (): string => {
  return version
}
