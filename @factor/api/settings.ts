import { dotSetting, deepMerge } from "@factor/api/utils"
import { applyFilters, addCallback } from "@factor/api/hooks"
import { configSettings } from "@factor/api/config"
import Vue from "vue"
import coreSettings from "@factor/app/core-settings"

type SettingsObject = Record<string, any>

export type SettingsRecords = Record<string, SettingsObject>

/**
 * Returns a unique ID for a set of settings based on app directory
 * @param cwd - working directory
 */
const settingsId = (cwd?: string): string => {
  if (cwd) {
    return cwd
  } else if (process.env.FACTOR_CWD) {
    return process.env.FACTOR_CWD
  } else if (process.cwd()) {
    return process.cwd()
  } else {
    return "base"
  }
}
/**
 * Gets globally cached settings based on working directory
 * @remarks
 * - We use the global Vue instance since this doesn't get wiped during server restart
 * @param cwd - working directory
 */
const getSettings = (cwd?: string): SettingsObject => {
  if (!Vue.$factorSettings) Vue.$factorSettings = {}

  return Vue.$factorSettings[settingsId(cwd)]
    ? Vue.$factorSettings[settingsId(cwd)]
    : coreSettings()
}

const setSettings = (settings: object, cwd?: string): void => {
  if (!Vue.$factorSettings) Vue.$factorSettings = {}
  Vue.$factorSettings[settingsId(cwd)] = settings
}

export const createSettings = (cwd?: string): void => {
  const config = configSettings(cwd)

  let settingsExports: (Function | object)[] = []

  /**
   * @remark
   * - If this is made ASYNC then there are loading order problems. Settings might load after modules that need to use them.
   * - Dynamic requires only work in the server environment, as it will NOT work in webpack.
   * - The file is not required and if it doesn't exist, ignore the error
   */
  try {
    if (cwd) {
      settingsExports = require(`${cwd}/.factor/loader-settings`).default
    } else {
      settingsExports = require(`__CWD__/.factor/loader-settings`).default
    }
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") throw error
  }

  const settingsArray = applyFilters(
    "factor-settings",
    [config, coreSettings, ...settingsExports].map(_export =>
      typeof _export == "function" ? _export() : _export
    )
  )

  const merged = deepMerge([config, coreSettings, ...settingsArray])

  const settings = applyFilters("merged-factor-settings", merged, { cwd })

  setSettings(settings, cwd)
}

export const setting = (key: string, { cwd }: { cwd?: string } = {}): any => {
  const settings = getSettings(cwd)

  // For debugging
  if (key == "all") return settings

  return dotSetting({ key, settings })
}

export const setup = (): void => {
  const key = "createSettings"
  addCallback({
    hook: "before-server-plugins",
    callback: () => createSettings(),
    key
  })
  addCallback({
    hook: "before-app-plugins",
    callback: () => createSettings(),
    key
  })
}

setup()
