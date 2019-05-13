const merge = require("deepmerge")
const env = process.env.NODE_ENV || "production"
module.exports = Factor => {
  return new (class {
    settings() {
      const publicSettings = process.env.FACTOR_APP_CONFIG
      console.log("public", publicSettings)
      return publicSettings
      // let publicConfig = this.getPublicConfig()

      // const configObjects = [
      //   Factor.FACTOR_CONFIG,
      //   publicConfig[env],
      //   publicConfig.config,
      //   {
      //     env
      //   }
      // ].filter(_ => _)

      // return merge.all(configObjects)
    }

    setting(key) {
      const settings = this.settings()

      return settings[key]
    }
  })()
}
