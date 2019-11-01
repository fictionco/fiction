import { pushToFilter, setting } from "@factor/tools"
import { writeConfig } from "@factor/cli/setup"

const clientApiKey = setting("bugsnag.client_api_key")

const setupTitle = "Plugin: Bugsnag"

addSetupCli(setupTitle)

addFilters()

function addFilters() {
  if (!clientApiKey) {
    pushToFilter("setup-needed", { title: setupTitle })

    return
  }
}

function addSetupCli(name) {
  pushToFilter("cli-add-setup", {
    name,
    value: "bugsnag",
    callback: async ({ inquirer }) => {
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
