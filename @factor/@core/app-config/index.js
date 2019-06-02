module.exports.default = Factor => {
  return new (class {
    settings() {
      const publicSettings = process.env.FACTOR_APP_CONFIG

      return publicSettings
    }

    setting(key) {
      const settings = this.settings()

      return settings[key]
    }
  })()
}
