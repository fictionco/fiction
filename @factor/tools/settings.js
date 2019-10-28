import Factor from "@factor/core"
import { dotSetting, deepMerge, applyFilters } from "@factor/tools"
import { getExports } from "@factor/extend/util"
import { configSettings } from "@factor/tools/config"

export class FactorSettings {
  constructor() {
    this.__settings = {}
    this.added = {}
  }

  add(files = {}) {
    this.added = { ...this.added, ...files }
    this.load()
  }

  all() {
    return this.__settings
  }

  get(key, defaultValue) {
    return dotSetting({ key, settings: this.__settings }) || defaultValue
  }

  async create() {
    this.config = await configSettings()

    const { default: settingsModules } = await import("~/.factor/loader-settings")

    this.settingsExports = await getExports(settingsModules)

    this.load()
  }

  async load() {
    const _objects = Object.values({ ...this.settingsExports, ...this.added }).map(
      _object => {
        return typeof _object == "function" ? _object(Factor) : _object
      }
    )

    const settingsArray = applyFilters("factor-settings", _objects)

    const merged = deepMerge([this.config, ...settingsArray])

    this.__settings = applyFilters("merged-factor-settings", merged)

    return
  }
}

export default new FactorSettings()
