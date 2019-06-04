const merge = require("deepmerge")
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
    extensions() {
      return {
        theme: Factor.$files.getExtended("theme"),
        stack: Factor.$files.getExtended("stack"),
        plugin: Factor.$files.getExtended("plugin")
      }
    }

    initialize() {
      const publicConfig = this.getConfig("public")
      const privateConfig = this.getConfig("private")

      const extensions = this.extensions()

      const configObjectsPublic = [
        Factor.FACTOR_CONFIG,
        publicConfig.config,
        publicConfig[NODE_ENV],
        publicConfig[FACTOR_ENV],
        extensions
      ].filter(_ => _)

      this._settingsPublic = merge.all(configObjectsPublic)

      const configObjectsPrivate = [
        privateConfig.config,
        privateConfig[NODE_ENV],
        privateConfig[FACTOR_ENV],
        process.env
      ].filter(_ => _)

      this._settingsPrivate = merge.all(configObjectsPrivate)

      this._settings = merge.all([this._settingsPublic, this._settingsPrivate])
    }

    publicSettings() {
      return this._settingsPublic
    }

    settings() {
      return this._settings
    }

    setting(key) {
      return this._settings[key]
    }
  })()
}
