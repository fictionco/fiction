const merge = require("deepmerge")
const env = process.env.NODE_ENV || "production"
const isNode = require("detect-node")
module.exports = Factor => {
  const handler = new class {
    getPublicConfig() {
      const out = {}
      try {
        out = require("@config/keys-public.json")
      } catch (error) {
        console.error(`Cant Find Public Config`)
      }
      return out
    }

    fullConfig() {
      let publicConfig = this.getPublicConfig()

      const privateConfig = Factor.FACTOR_ENV != "app" && isNode ? this.serverPrivateConfig() : {}

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
  }()

  return handler.fullConfig()
}
