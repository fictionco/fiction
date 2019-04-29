const merge = require("deepmerge")
const env = process.env.NODE_ENV || "production"
module.exports = Factor => {
  return new (class {
    constructor() {}
    getPublicConfig() {
      let out = {}
      try {
        out = require("~/factor-config")
      } catch (error) {
        console.error(`Cant Find Public Config`)
        console.error(error)
      }
      return out
    }

    settings() {
      let publicConfig = this.getPublicConfig()

      const configObjects = [
        Factor.FACTOR_CONFIG,
        publicConfig[env],
        publicConfig.config,
        {
          env
        }
      ].filter(_ => _)

      return merge.all(configObjects)
    }

    setting(key) {
      const settings = this.settings()

      return settings[key]
    }
  })()
}
