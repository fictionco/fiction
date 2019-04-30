const merge = require("deepmerge")

module.exports = Factor => {
  return new (class {
    constructor() {
      this.env =
        process.env.NODE_ENV == "development" || Factor.FACTOR_CONFIG.env == "development"
          ? "development"
          : "production"

      this.initialize()
    }

    initialize() {
      let publicConfig = require(Factor.$paths.get("config-file"))

      const privateConfig = Factor.$keys.readEncrypted(this.env)

      const configObjects = [
        Factor.FACTOR_CONFIG,
        publicConfig[this.env],
        publicConfig.config,
        privateConfig[this.env],
        privateConfig.config,
        {
          env: this.env
        }
      ].filter(_ => _)

      this._settings = merge.all(configObjects)
    }

    settings() {
      return this._settings
    }

    setting(key) {
      return this._settings[key]
    }
  })()
}
