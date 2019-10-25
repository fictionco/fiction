import { resolve } from "path"

import Factor from "@factor/core"

export default () => {
  const { NODE_ENV, FACTOR_ENV } = process.env
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

      require("dotenv").config({ path: resolve(Factor.$paths.get("app"), ".env") })

      this.initialize()
    }

    publicConfig() {
      const _f = Factor.$paths.get(`config-file-public`)

      let out = {}
      try {
        out = require(_f)
      } catch (error) {
        if (!error instanceof Error || error.code !== "MODULE_NOT_FOUND") throw error
      }

      return out
    }

    initialize() {
      const publicConfig = this.publicConfig("public")

      const configObjectsPublic = [
        publicConfig,
        publicConfig[NODE_ENV],
        publicConfig[FACTOR_ENV]
      ].filter(_ => _)

      this._settingsPublic = Factor.$utils.deepMerge(configObjectsPublic)

      const configObjectsPrivate = [process.env].filter(_ => _)

      this._settingsPrivate = Factor.$utils.deepMerge(configObjectsPrivate)

      const mergedConfig = Factor.$utils.deepMerge([
        this._settingsPublic,
        this._settingsPrivate
      ])

      this._settings = this.addCalculatedConfig(mergedConfig)
    }

    addCalculatedConfig(mergedConfig) {
      const currentUrl =
        NODE_ENV == "development" || !mergedConfig.url
          ? Factor.$paths.localhostUrl()
          : mergedConfig.url

      return {
        ...mergedConfig,
        currentUrl
      }
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
