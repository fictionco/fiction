export default Factor => {
  return new (class {
    constructor() {
      this._settings = {}

      this.setup()
    }

    async setup() {
      const config = Factor.$config.settings()

      // This is a workaround to deal with problems including
      // a CWD relative file across environments
      // Webpack throws 'request is an expression' issues if a var is used
      // While there are problems with using aliases across resolvers (jest v node)
      const settingsFiles = !process.env.FACTOR_SSR
        ? require("./server.js").default(Factor)
        : require("./client.js").default(Factor)

      const settingsArray = Factor.$filters.apply(
        "factor-settings",
        Object.values(settingsFiles).map(_obj => _obj(Factor))
      )

      const merged = Factor.$utils.deepMerge([config, ...settingsArray])
      this._settings = Factor.$filters.apply("merged-factor-settings", merged)
    }

    all() {
      return this._settings
    }

    get(key, defaultValue) {
      return Factor.$utils.dotSetting({ key, settings: this._settings }) || defaultValue
    }
  })()
}
