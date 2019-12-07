import { pushToFilter, setting } from "@factor/tools"
import { writeConfig } from "@factor/cli/setup"
import inquirer from "inquirer"
const clientApiKey = setting("bugsnag.clientApiKey")

const setupTitle = "Plugin: Bugsnag"


const addFilters = (): void => {
  if (!clientApiKey) {
    pushToFilter("setup-needed", { title: setupTitle })

    return
  }
}


const addSetupCli = (name: string): void => {
  pushToFilter("cli-add-setup", {
    name,
    value: "bugsnag",
    callback: async () => {
      const questions = [
        {
          name: "clientApiKey",
          message: "What's your public client API key?",
          type: "input"
        }
      ]
      const { clientApiKey } = await inquirer.prompt(questions)

      await writeConfig("factor-config", {
        bugsnag: { clientApiKey }
      })
    }
  })
}


export const setup = (): void => {
  addSetupCli(setupTitle)

  addFilters()

}

setup()
