module.exports.default = Factor => {
  return new (class {
    settings() {
      const publicSettings = process.env.FACTOR_APP_CONFIG

      return publicSettings
    }

    setting(key) {
      return Factor.$utils.dotSetting({ key, settings: this.settings() })
    }
  })()
}
