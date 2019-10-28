import Factor from "@factor/core"
import { dotSetting } from "@factor/tools"
export default () => {
  return new (class {
    settings() {
      return process.env.FACTOR_APP_CONFIG
    }

    setting(key) {
      return dotSetting({ key, settings: this.settings() })
    }
  })()
}
