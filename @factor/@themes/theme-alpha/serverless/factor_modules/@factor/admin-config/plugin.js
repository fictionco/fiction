const merge = require("deepmerge")

const isNode = require("detect-node")
const { resolve } = require("path")
const consola = require("consola")
module.exports = Factor => {
  return new class {
    constructor() {
      this.env =
        process.env.NODE_ENV == "development" || Factor.FACTOR_CONFIG.staging
          ? "development"
          : "production"

      this.initialize()
    }

    initialize() {
      let publicConfig = require(Factor.$paths.get("keys-public"))

      const privateConfig = this.serverPrivateConfig()

      const configObjects = [
        Factor.FACTOR_CONFIG,
        publicConfig[this.env],
        publicConfig.all,
        privateConfig[this.env],
        privateConfig.all,
        isNode,
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

    getPasswords() {
      let password = Factor.$filters.apply(`master-password-${this.env}`)

      if (password) {
        return password
      }

      let passwordfile = null
      try {
        passwordfile = require(Factor.$paths.get("passwords"))
      } catch (error) {}

      password = passwordfile && passwordfile[this.env] ? passwordfile[this.env] : false

      if (!password) {
        consola.warn("Can't find a private key password.")
      }

      return password
    }

    serverPrivateConfig() {
      const password = this.getPasswords()

      let config = {}

      if (password) {
        config = Factor.$keys.readEncryptedSecrets({ build: this.env, password })
      }

      return config
    }
  }()
}
