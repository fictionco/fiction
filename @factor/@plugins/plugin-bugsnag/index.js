import bugsnag from "@bugsnag/js"
import bugsnagVue from "@bugsnag/plugin-vue"

export default Factor => {
  return new (class {
    constructor() {
      this.clientApiKey = Factor.$setting.get("bugsnag.client_api_key")

      if (!this.clientApiKey || process.env.NODE_ENV == "development") {
        return
      }

      this.appVersion = Factor.$setting.get("version") || "0.0.0"

      const bugsnagClient = bugsnag({
        apiKey: this.clientApiKey,
        logger: this.customLogger(),
        appVersion: this.appVersion
      })

      bugsnagClient.use(bugsnagVue, Factor)

      Factor.$filters.add("initialize-app", () => {
        Factor.$events.$on("error", e => bugsnagClient.notify(e))

        Factor.$user.init(user => {
          if (user) bugsnagClient.user = user
        })
      })
    }

    customLogger() {
      return {
        debug: () => {},
        info: () => {},
        warn: () => Factor.$log.warn,
        error: () => Factor.$log.error
      }
    }
  })()
}
