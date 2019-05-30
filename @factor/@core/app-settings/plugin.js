const merge = require("deepmerge")

export default Factor => {
  return new (class {
    constructor() {
      this.appSettings = {}

      const merged = [{}]
      if (Factor.FACTOR_ENV == "app") {
        try {
          const themeSettings = require("@theme/settings").default
          merged.push(themeSettings)
        } catch (error) {
          this.handleError(error)
        }

        try {
          const sourceSettings = require("@/settings").default
          merged.push(sourceSettings)
        } catch (error) {
          this.handleError(error)
        }
        this.appSettings = merge.all(merged)
      }
    }

    // https://stackoverflow.com/questions/21740309/how-to-check-in-node-if-module-exists-and-if-exists-to-load/21740439
    handleError(error) {
      if (error instanceof Error && error.code === "MODULE_NOT_FOUND") {
      } else throw error
    }

    get(name) {
      const k = name.split(".")

      let setting = null

      k.forEach((_, index) => {
        if (setting && setting[_]) {
          setting = setting[_]
        } else if (this.appSettings[_]) {
          setting = this.appSettings[_]
        }
      })

      return setting
    }
  })()
}
