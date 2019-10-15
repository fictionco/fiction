import settingsFiles from "~/.factor/loader-settings"

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
      const _imports = { ...settingsFiles, ...this.added }

      const _modules = await this.importModules(_imports)

      const settingsArray = Factor.$filters.apply(
        "factor-settings",
        _modules.map(_obj => (typeof _obj == "function" ? _obj(Factor) : _obj))
      )

      const merged = Factor.$utils.deepMerge([this.config, ...settingsArray])

      this._settings = Factor.$filters.apply("merged-factor-settings", merged)
    }

    async importModules(_imports) {
      return await Promise.all(
        Object.keys(_imports).map(async k => {
          const { default: val } = await _imports[k]()
          return val
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
