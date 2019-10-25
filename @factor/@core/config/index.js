import Factor from "@factor/core"
export default () => {
  return new (class {
    settings() {
      return process.env.FACTOR_APP_CONFIG
    }

    setting(key) {
      return Factor.$utils.dotSetting({ key, settings: this.settings() })
    }
  })()
}
