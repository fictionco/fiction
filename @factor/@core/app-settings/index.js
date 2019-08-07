import Factor from "vue"
export default Factor => {
  return new (class {
    constructor() {
      this._settings = {}

      this.setup()
      // Factor.$filters.add("initialize-app", () => {
      //   this.setup()
      // })
    }

    async setup() {
      const settingsFiles = require("~/.factor/loader-settings")

      const settingsArray = Factor.$filters.apply(
        "factor-settings",
        Object.values(settingsFiles).map(_obj => _obj(Factor))
      )

      this._settings = Factor.$utils.deepMerge(settingsArray)
    }

    get(key, defaultValue) {
      return Factor.$utils.dotSetting({ key, settings: this._settings }) || defaultValue
    }
  })()
}
