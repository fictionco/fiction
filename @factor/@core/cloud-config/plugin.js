const merge = require("deepmerge")
const { existsSync } = require("fs-extra")
module.exports = Factor => {
  return new (class {
    constructor() {
      this.env =
        process.env.NODE_ENV == "development" || Factor.FACTOR_CONFIG.env == "development"
          ? "development"
          : "production"

      // Match the public config to what is available in the webpack app
      // Should NOT include private/secret config
      Factor.$filters.add("webpack-define", _ => {
        _["process.env.FACTOR_APP_CONFIG"] = JSON.stringify(this.publicSettings())
        return _
      })
      this.registerGlobalSettings()
      this.initialize()
    }

    getConfig(scope) {
      const configId = `config-${scope}`
      let conf = Factor.$filters.apply(configId, null, { env: this.env })

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
        publicConfig[this.env],
        extensions
      ].filter(_ => _)

      this._settingsPublic = merge.all(configObjectsPublic)
      this._settingsPublic = this.ensureDefaults(this._settingsPublic)

      const configObjectsPrivate = [privateConfig.config, privateConfig[this.env]].filter(_ => _)

      this._settingsPrivate = merge.all(configObjectsPrivate)

      this._settings = merge.all([this._settingsPublic, this._settingsPrivate])
    }

    publicSettings() {
      return this._settingsPublic
    }

    ensureDefaults(config) {
      const { url, title } = config
      if (!url) {
        config.url = config.homepage || Factor.$paths.localhostUrl()
      }

      if (!title) {
        config.title = Factor.$utils.toLabel(config.name)
      }

      return config
    }

    settings() {
      return this._settings
    }

    setting(key) {
      return this._settings[key]
    }

    registerGlobalSettings() {
      // Factor.$stack.registerSettings({
      //   title: "Global",
      //   settings: {
      //     group: "settings",
      //     config: ["url"],
      //     envs: "multi-optional"
      //   }
      // })
    }
  })()
}
