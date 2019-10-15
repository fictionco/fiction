import settingsFiles from "~/.factor/loader-settings"

export default Factor => {
  return new (class {
    constructor() {
      this._settings = {}
      this.added = {}
      this.setup()
    }

    async setup() {
      this.config = Factor.$configServer
        ? Factor.$configServer.settings()
        : Factor.$config.settings() || {}

      const _promises = Object.keys(settingsFiles).map(
        async k => (await settingsFiles[k]()).default
      )

      const _modules = await Promise.all(_promises)

      this.load(_modules)
    }

    load(_modules) {
      const factories = [..._modules, ...Object.values(this.added)]

      const settingsArray = Factor.$filters.apply(
        "factor-settings",
        factories.map(_obj => (typeof _obj == "function" ? _obj(Factor) : _obj))
      )

      const merged = Factor.$utils.deepMerge([this.config, ...settingsArray])

      this._settings = Factor.$filters.apply("merged-factor-settings", merged)
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
