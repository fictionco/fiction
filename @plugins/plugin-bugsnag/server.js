import { pushToFilter, setting } from "@factor/tools"
import { writeConfig } from "@factor/setup"
export default Factor => {
  return new (class {
    constructor() {
      this.clientApiKey = setting("bugsnag.client_api_key")

      this.setupTitle = "Plugin: Bugsnag"
      this.addSetupCli(this.setupTitle)

      if (!this.clientApiKey) {
        pushToFilter("setup-needed", { title: this.setupTitle })

        return
      }
    }

    addSetupCli(name) {
      pushToFilter("cli-add-setup", {
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

          await writeConfig("factor-config", {
            bugsnag: { client_api_key }
          })
        }
      })
    }
  })()
}
