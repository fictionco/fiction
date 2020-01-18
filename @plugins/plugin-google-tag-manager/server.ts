import { addFilter, pushToFilter, setting } from "@factor/api"
import { writeConfig, SetupCliConfig } from "@factor/cli/setup"
import inquirer from "inquirer"

export const setup = (): void => {
  const googleTagManagerId = setting("googleTagManager.googleTagManagerId")

  const setupTitle = "Plugin: Google Tag Manager"

  if (!googleTagManagerId) {
    pushToFilter({ hook: "setup-needed", key: "tagManager", item: { title: setupTitle } })

    return
  }

  // CLI admin setup utility
  addFilter({
    key: "tagManagerSetup",
    hook: "cli-add-setup",
    callback: (_: SetupCliConfig[]) => {
      const setupAdmins: SetupCliConfig = {
        name: setupTitle,
        value: "gtm",
        callback: async (): Promise<void> => {
          const questions = [
            {
              name: "googleTagManagerId",
              message: "What's your Google Tag Manager container ID?",
              type: "input"
            },
            {
              name: "developmentMode",
              type: "list",
              message:
                "Load the tag manager in your 'development' environment? (Defaults to production only. This can be changed later)",
              choices: [
                { name: "yes", value: true },
                { name: "no", value: false }
              ]
            }
          ]
          const { googleTagManagerId, developmentMode } = await inquirer.prompt(questions)

          await writeConfig("public", {
            googleTagManager: { googleTagManagerId, developmentMode }
          })
        }
      }

      return [..._, setupAdmins]
    }
  })
}
setup()
