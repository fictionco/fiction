const merge = require("deepmerge")

const isNode = require("detect-node")
const { resolve } = require("path")
const consola = require("consola")
module.exports = Factor => {
  const handler = new class {
    constructor() {
      this.env =
        process.env.NODE_ENV == "development" || Factor.FACTOR_CONFIG.staging
          ? "development"
          : "production"
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

    fullConfig() {
      let publicConfig = require(Factor.$paths.get("keys-public"))

      const privateConfig = this.serverPrivateConfig()

      const configObjects = [
        Factor.FACTOR_CONFIG,
        publicConfig[this.env],
        publicConfig.all,
        privateConfig,
        isNode,
        {
          env: this.env
        }
      ].filter(_ => _)

      return merge.all(configObjects)
    }
  }()

  return handler.fullConfig()
}
