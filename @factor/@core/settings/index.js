import * as settingsFiles from "~/.factor/loader-settings"

export default Factor => {
  return new (class {
    constructor() {
      this._settings = {}
      this._modules = []
      this.added = {}
      this.setup()
    }

    async setup() {
      this.config = Factor.$configServer
        ? Factor.$configServer.settings()
        : Factor.$config.settings() || {}

      this.load()
    }

    async load() {
      const _objects = Object.values({ ...settingsFiles, ...this.added }).map(_object => {
        return typeof _object == "function" ? _object(Factor) : _object
      })

      const settingsArray = Factor.$filters.apply("factor-settings", _objects)

      const merged = Factor.$utils.deepMerge([this.config, ...settingsArray])

      this._settings = Factor.$filters.apply("merged-factor-settings", merged)

      console.log("settings loaded", require("~/.factor/loader-settings"))

      return
    }

    add(files = {}) {
      this.added = { ...this.added, ...files }
      this.load()
    }

    all() {
      return this._settings
    }

    get(key, defaultValue) {
      return Factor.$utils.dotSetting({ key, settings: this._settings }) || defaultValue
    }
  })()
}
