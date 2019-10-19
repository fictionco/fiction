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

      await this.load()
    }

    async load() {
      const _objects = await this.importModules({ ...settingsFiles, ...this.added })

      const settingsArray = Factor.$filters.apply("factor-settings", _objects)

      const merged = Factor.$utils.deepMerge([this.config, ...settingsArray])

      this._settings = Factor.$filters.apply("merged-factor-settings", merged)

      return
    }

    async importModules(_imports) {
      return await Promise.all(
        Object.values(_imports).map(async _module => {
          const _object = await _module // async imports
          return typeof _object == "function" ? _object(Factor) : _object
        })
      )
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
