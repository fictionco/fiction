import bugsnag from "@bugsnag/js"
import bugsnagVue from "@bugsnag/plugin-vue"

export default Factor => {
  return new (class {
    constructor() {
      this.clientApiKey = Factor.$config.setting("bugsnag.client_api_key")

      this.setupTitle = "Plugin: Bugsnag"
      this.addSetupCli(this.setupTitle)

      if (!this.clientApiKey) {
        Factor.$filters.push("setup-needed", { title: this.setupTitle })

        return
      }

      const bugsnagClient = bugsnag({ apiKey: this.clientApiKey })

      bugsnagClient.use(bugsnagVue, Factor)

      Factor.$events.$on("error", e => bugsnagClient.notify(e))

      Factor.$user.init(user => {
        bugsnagClient.metaData = { user }
      })
    }

    addSetupCli(name) {
      Factor.$filters.push("cli-add-setup", {
        name,
        value: "bugsnag",
        callback: async ({ program, inquirer }) => {
          const questions = [
            {
              name: "client_api_key",
              message: "What's your public client API key?",
              type: "input"
            }
          ]
          let { client_api_key } = await inquirer.prompt(questions)

          await Factor.$setup.writeConfig("factor-config", {
            bugsnag: { client_api_key }
          })
        }
      })
    }
  })()
}
