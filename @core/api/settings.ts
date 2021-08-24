import { getGlobalThis } from "@factor/api/utils"
import { applyFilters } from "./hook"
import { deepMerge, dotSetting } from "./utils"
import { AppSettings } from "@factor/types"

type SettingsObject = Record<string, any>
export type SettingsRecords = Record<string, SettingsObject>
/**
 * @singleton global settings container
 */
const __registered: SettingsObject[] = []
/**
 * Register an object into the global settings
 */
export const registerSettings = (settings: SettingsObject): void => {
  __registered.push(settings)
}
/**
 * Get all settings, merged into one object
 */
export const getSettings = (): SettingsObject => {
  const baseOptions = getGlobalThis().__factor ?? []
  return applyFilters(
    "factorSettings",
    deepMerge([baseOptions, ...__registered]),
  )
}
/**
 * Gets a settings from merged factor-settings files based on dot.notation
 */
export const setting = <T extends keyof AppSettings>(
  key: T,
): AppSettings[T] | undefined => {
  const settings = getSettings()

  return dotSetting({ key: key as string, settings })
}
/**
 * Initialize settings with values from package.json and config
 */
export const initializeSettings = (): void => {
  registerSettings({})
}

initializeSettings()
