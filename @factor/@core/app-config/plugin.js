const merge = require("deepmerge")
const env = process.env.NODE_ENV || "production"
const isNode = require("detect-node")
module.exports = Factor => {
  return new class {
    constructor() {}
    getPublicConfig() {
      let out = {}
      try {
        out = require("@config/keys-public.json")
      } catch (error) {
        console.error(`Cant Find Public Config`)
        console.error(error)
      }
      return out
    }

    settings() {
      let publicConfig = this.getPublicConfig()

      //const privateConfig = Factor.FACTOR_ENV != "app" && isNode ? this.serverPrivateConfig() : {}

      const configObjects = [
        Factor.FACTOR_CONFIG,
        publicConfig[env],
        publicConfig.all,
        isNode,
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
  }()
}
