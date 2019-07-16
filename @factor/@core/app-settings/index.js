export default Factor => {
  return new (class {
    constructor() {
      this._settings = {}

      Factor.$filters.add("initialize-app", () => {
        this.setup()
      })
    }

    async setup() {
      const settingsFiles = require("~/.factor/loader-settings")

      const settingsArray = Factor.$filters.apply(
        "theme-settings",
        Object.values(settingsFiles).map(_obj => _obj(Factor))
      )

      this._settings = Factor.$utils.deepMerge(settingsArray)
    }

    get(key) {
      return Factor.$utils.dotSetting({ key, settings: this._settings })
    }
  })()
}
