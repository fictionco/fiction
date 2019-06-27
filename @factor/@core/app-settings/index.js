export default Factor => {
  return new (class {
    constructor() {
      this._settings = {}

      Factor.$filters.add("initialize-app", () => {
        this.setup()
      })
    }

    sourceSettings() {
      let request = require.context("@", false, /settings\.js/)

      const valArray = request
        .keys()
        .map(request)
        .map(_ => _.default)

      return valArray.length > 0 && typeof valArray[0] == "function" ? valArray[0](Factor) : {}
    }

    async setup() {
      const settingsArray = Factor.$filters.apply("settings", [{}])
      settingsArray.push(this.sourceSettings())

      this._settings = Factor.$utils.deepMerge(settingsArray)
    }

    get(key) {
      return Factor.$utils.dotSetting({ key, settings: this._settings })
    }
  })()
}
