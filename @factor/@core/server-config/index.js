const { resolve } = require("path")
const { existsSync } = require("fs-extra")
const NODE_ENV = process.env.NODE_ENV == "development" ? "development" : "production"
const FACTOR_ENV = process.env.FACTOR_ENV || NODE_ENV

module.exports.default = Factor => {
  return new (class {
    constructor() {
      // Match the public config to what is available in the webpack app
      // Should NOT include private/secret config
      Factor.$filters.add("webpack-define", _ => {
        _["process.env.NODE_ENV"] = JSON.stringify(NODE_ENV)
        _["process.env.FACTOR_ENV"] = JSON.stringify(FACTOR_ENV)
        _["process.env.FACTOR_APP_CONFIG"] = JSON.stringify(this.publicSettings())
        return _
      })

      // Add environmental variables from .env if available

      const dotEnvPath = resolve(Factor.$paths.get("app"), ".env")
      if (dotEnvPath) {
        require("dotenv").config({ path: dotEnvPath })
      }

      this.initialize()
    }

    getConfig(scope) {
      let conf = Factor.$filters.apply(`config-${scope}`, null, { NODE_ENV, FACTOR_ENV })

      if (!conf) {
        const configFilePath = Factor.$paths.get(`config-file-${scope}`)
        if (existsSync(configFilePath)) {
          conf = require(configFilePath)
        }
      }
      return conf || {}
    }

    initialize() {
      const publicConfig = this.getConfig("public")

      const configObjectsPublic = [
        Factor.FACTOR_CONFIG,
        publicConfig,
        publicConfig[NODE_ENV],
        publicConfig[FACTOR_ENV]
      ].filter(_ => _)

      this._settingsPublic = Factor.$utils.deepMerge(configObjectsPublic)

      const configObjectsPrivate = [process.env].filter(_ => _)

      this._settingsPrivate = Factor.$utils.deepMerge(configObjectsPrivate)

      this._settings = Factor.$utils.deepMerge([
        this._settingsPublic,
        this._settingsPrivate
      ])
    }

    publicSettings() {
      return this._settingsPublic
    }

    settings() {
      return this._settings
    }

    setting(key, fallback) {
      return Factor.$utils.dotSetting({ key, settings: this._settings }) || fallback
    }
  })()
}
