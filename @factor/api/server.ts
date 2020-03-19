import { pushToFilter } from "@factor/api/hooks"
import inquirer from "inquirer"

import { writeConfig } from "@factor/cli/setup"
import { productionUrl } from "@factor/api/url"

export const setup = (): void => {
  /**
   * If production URL isn't set, then add a setup item for it
   */
  const url = productionUrl()

  if (!url) {
    pushToFilter({
      key: "appUrl",
      hook: "cli-add-setup",
      item: () => {
        return {
          name: "Production Url - Setup",
          value: "url",
          callback: async (): Promise<void> => {
            const questions = [
              {
                name: "url",
                message: "What's your app's production URL? (e.g. https://...)",
                type: "input",
                default: process.env.FACTOR_URL
              }
            ]

            const { url } = await inquirer.prompt(questions)

            await writeConfig("private", { FACTOR_URL: url })
          }
        }
      }
    })
  }
}

setup()
