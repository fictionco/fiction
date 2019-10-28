import Factor from "@factor/core"
import { dotSetting, deepMerge, applyFilters } from "@factor/tools"
import { getExports } from "@factor/extend/util"
import { configSettings } from "@factor/tools/config"
import settingsFiles from "~/.factor/loader-settings"
import coreSettings from "@factor/app/core-settings"
export class FactorSettings {
  constructor() {
    this.__settings = {}
    this.added = {}
  }

  add(settings) {
    this.added = [...this.added, settings]
    this.load()
  }

  all() {
    return this.__settings
  }

  get(key) {
    return dotSetting({ key, settings: this.__settings })
  }

  async create() {
    this.config = await configSettings()

    this.settingsExports = await getExports(settingsFiles).map(({ _exports }) => _exports)

    this.load()
  }

  async load() {
    const settingsArray = applyFilters("factor-settings", [
      ...this.settingsExports,
      ...this.added
    ])

    const merged = deepMerge([this.config, coreSettings, ...settingsArray])

    this.__settings = applyFilters("merged-factor-settings", merged)

    return
  }
}

export const $settings = new FactorSettings()

export function getSetting(key) {
  return $settings.get(key)
}

export function addSettings(settings) {
  return $settings.add(settings)
}
