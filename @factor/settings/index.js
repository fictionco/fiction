import Factor from "@factor/core"
import { dotSetting } from "@factor/tools/utils"
import { getExports } from "@factor/extend/util"

if (!Factor.$setting) {
  class FactorSettings {
    constructor() {
      this._settings = {}
      this.added = {}
    }

    add(files = {}) {
      this.added = { ...this.added, ...files }
      this.load()
    }

    all() {
      return this._settings
    }

    get(key, defaultValue) {
      return dotSetting({ key, settings: this._settings }) || defaultValue
    }

    async create() {
      this.config = Factor.$configServer
        ? Factor.$configServer.settings()
        : Factor.$config.settings() || {}

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

      const settingsArray = Factor.$filters.apply("factor-settings", _objects)

      const merged = Factor.$utils.deepMerge([this.config, ...settingsArray])

      this._settings = Factor.$filters.apply("merged-factor-settings", merged)

      return
    }
  }

  Factor.$setting = new FactorSettings()
}

export default Factor.$setting
