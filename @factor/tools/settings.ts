import { dotSetting, deepMerge } from "@factor/tools/utils"
import { applyFilters, addCallback } from "@factor/tools/filters"
import { configSettings } from "@factor/tools/config"
import Vue from "vue"
import coreSettings from "@factor/app/core-settings"

let config = {}
let settingsExports: (Function | object)[] = []
type SettingsObject = Record<string, any>

const getSettings = (): SettingsObject => {
  return Vue.$factorSettings ? Vue.$factorSettings : coreSettings()
}

const setSettings = (settings: object): void => {
  Vue.$factorSettings = settings
}

const mergeAllSettings = (): SettingsObject => {
  const settingsArray = applyFilters(
    "factor-settings",
    [config, coreSettings, ...settingsExports].map(_export =>
      typeof _export == "function" ? _export() : _export
    )
  )

  const merged = deepMerge([config, coreSettings, ...settingsArray])

  const settings = applyFilters("merged-factor-settings", merged)

  return settings
}

export const createSettings = (): void => {
  config = configSettings()

  try {
    // Use sync require here
    // Needed for env matching, as import is problematic when settings might load after things that need them
    // eslint-disable-next-line import/no-unresolved
    settingsExports = require("__CWD__/.factor/loader-settings").default
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") throw error
  }

  const settings = mergeAllSettings()

  setSettings(settings)
}

export const setting = (key: string): any => {
  const settings = getSettings()

  if (key == "all") {
    return settings
  }

  return dotSetting({ key, settings })
}

export const setup = (): void => {
  addCallback("before-server-plugins", () => createSettings())
  addCallback("before-app-plugins", () => createSettings())
}

setup()
