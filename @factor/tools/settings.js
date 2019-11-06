import { dotSetting, deepMerge, applyFilters, addCallback } from "@factor/tools"

import { configSettings } from "@factor/tools/config"

import coreSettings from "@factor/app/core-settings"

addCallback("before-server-plugins", () => createSettings())
addCallback("before-app-plugins", () => createSettings())

let settings = {}
let added = []
let config = {}
let settingsExports = []

function createSettings() {
  config = configSettings()

  // Use sync require here
  // Needed for env matching, as import is problematic when settings might load after things that need them
  // eslint-disable-next-line import/no-unresolved
  settingsExports = require("~/.factor/loader-settings").default

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

  settings = applyFilters("merged-factor-settings", merged)

  return
}

export async function addSettings(settings) {
  added = [...added, settings]
  await mergeAllSettings()
}

export function setting(key) {
  if (key == "all") return settings

  return dotSetting({ key, settings })
}
