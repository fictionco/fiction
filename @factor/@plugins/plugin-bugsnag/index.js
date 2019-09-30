import bugsnag from "@bugsnag/js"
import bugsnagVue from "@bugsnag/plugin-vue"

export default Factor => {
  return new (class {
    constructor() {
      this.clientApiKey = Factor.$config.setting("bugsnag.client_api_key")

      if (!this.clientApiKey) {
        return
      }

      const bugsnagClient = bugsnag({ apiKey: this.clientApiKey })

      bugsnagClient.use(bugsnagVue, Factor)

      Factor.$events.$on("error", e => bugsnagClient.notify(e))

      Factor.$user.init(user => {
        if (user) bugsnagClient.user = user
      })
    }
  })()
}
