const merge = require("deepmerge")
const env = process.env.NODE_ENV || "production"
module.exports = Factor => {
  return new (class {
    settings() {
      const publicSettings = process.env.FACTOR_APP_CONFIG

      return publicSettings
    }

    setting(key) {
      const settings = this.settings()

      return settings[key]
    }
  })()
}
