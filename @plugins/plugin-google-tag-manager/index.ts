import { addFilter, pushToFilter, setting } from "@factor/tools"
import { writeConfig, SetupCliConfig } from "@factor/cli/setup"
import inquirer from "inquirer"

const googleTagManagerId = setting("googleTagManager.googleTagManagerId")
const developmentMode = setting("googleTagManager.developmentMode")

const setupTitle = "Plugin: Google Tag Manager"

function addFilters(): void {
  if (!googleTagManagerId) {
    pushToFilter("setup-needed", { title: setupTitle })

    return
  }

  // Don't load in development by default
  if (process.env.NODE_ENV != "production" && !developmentMode) {
    return
  }

  addFilter(
    "factor_head",
    (_: string[]): string[] => {
      const add = `<script>
      ; (function (w, d, s, l, i) {
        w[l] = w[l] || []
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" })
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l != "dataLayer" ? "&l=" + l : ""
        j.async = true
        j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl
        f.parentNode.insertBefore(j, f)
      })(window, document, "script", "dataLayer", "${googleTagManagerId}")
    </script>`

      return [..._, add]
    },
    { priority: 200 }
  )

  addFilter("factor_body_start", (_: string[]): string[] => {
    const add = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}" height="0" width="0"
      style="display:none;visibility:hidden"></iframe></noscript>
  `
    return [..._, add]
  })
}

function addSetupCli(name: string): void {
  // CLI admin setup utility
  addFilter("cli-add-setup", (_: SetupCliConfig[]) => {
    const setupAdmins: SetupCliConfig = {
      name,
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

        await writeConfig("factor-config", {
          googleTagManager: { googleTagManagerId, developmentMode }
        })
      }
    }

    return [..._, setupAdmins]
  })
}

addSetupCli(setupTitle)
addFilters()
