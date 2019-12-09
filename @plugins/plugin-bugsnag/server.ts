import { pushToFilter, setting } from "@factor/api"
import { writeConfig } from "@factor/cli/setup"
import inquirer from "inquirer"
const clientApiKey = setting("bugsnag.clientApiKey")

const setupTitle = "Plugin: Bugsnag"

const addFilters = (): void => {
  if (!clientApiKey) {
    pushToFilter({ key: "bugsnag", hook: "setup-needed", item: { title: setupTitle } })

    return
  }
}

const addSetupCli = (name: string): void => {
  pushToFilter({
    key: "bugsnag",
    hook: "cli-add-setup",
    item: {
      name,
      value: "bugsnag",
      callback: async (): Promise<void> => {
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
    }
  })
}

export const setup = (): void => {
  addSetupCli(setupTitle)

  addFilters()
}

setup()
