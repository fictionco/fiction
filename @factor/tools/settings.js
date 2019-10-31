import { dotSetting, deepMerge, applyFilters, addCallback } from "@factor/tools"

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

  // eslint-disable-next-line import/no-unresolved
  const { default: settingsFiles } = await import("~/.factor/loader-settings")

  settingsExports = settingsFiles.map(_export =>
    typeof _export == "function" ? _export() : _export
  )

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
