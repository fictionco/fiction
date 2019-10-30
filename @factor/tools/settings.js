import { dotSetting, deepMerge, applyFilters, addCallback } from "@factor/tools"
import { getExports } from "@factor/extend/util"
import { configSettings } from "@factor/tools/config"

import coreSettings from "@factor/app/core-settings"

addCallback("before-server-plugins", () => createSettings())
addCallback("before-app-plugins", () => createSettings())

let settings = {}
let added = []
let config = {}
let settingsExports = []

async function createSettings() {
  config = await configSettings()

  const { default: settingsFiles } = await import("~/.factor/loader-settings")

  settingsExports = await getExports(settingsFiles).map(({ _exports }) => _exports)

  await mergeAllSettings()
}

async function mergeAllSettings() {
  const settingsArray = applyFilters("factor-settings", [...settingsExports, ...added])

  const merged = deepMerge([config, coreSettings, ...settingsArray])

  settings = applyFilters("merged-factor-settings", merged)

  return
}

export async function addSettings(settings) {
  added = [...added, settings]
  await mergeAllSettings()
}

export function setting(key) {
  return dotSetting({ key, settings })
}
