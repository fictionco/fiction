import { dotSetting, deepMerge } from "@factor/tools/utils"
import { applyFilters, addCallback } from "@factor/tools/filters"
import { configSettings } from "@factor/tools/config"
import Vue from "vue"
import coreSettings from "@factor/app/core-settings"

addCallback("before-server-plugins", () => createSettings())
addCallback("before-app-plugins", () => createSettings())

let added = []
let config = {}
let settingsExports = []

function getSettings() {
  return Vue["$factorSettings"] ? Vue["$factorSettings"] : coreSettings()
}

function setSettings(settings) {
  Vue["$factorSettings"] = settings
}

export function createSettings() {
  config = configSettings()

  try {
    // Use sync require here
    // Needed for env matching, as import is problematic when settings might load after things that need them
    // eslint-disable-next-line import/no-unresolved
    // @ts-ignore
    settingsExports = require("__CWD__/.factor/loader-settings").default
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") throw new Error(error)
  }

  mergeAllSettings()
}

function mergeAllSettings() {
  const settingsArray = applyFilters(
    "factor-settings",
    [config, coreSettings, ...settingsExports, ...added].map(_export =>
      typeof _export == "function" ? _export() : _export
    )
  )

  const merged = deepMerge([config, coreSettings, ...settingsArray])

  const settings = applyFilters("merged-factor-settings", merged)

  setSettings(settings)

  return
}

export async function addSettings(settings) {
  added = [...added, settings]
  await mergeAllSettings()
}

export function setting(key) {
  const settings = getSettings()

  if (key == "all") {
    return settings
  }

  return dotSetting({ key, settings })
}
