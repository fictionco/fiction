import { addFilter, pushToFilter, setting } from "@factor/tools"
import { writeConfig } from "@factor/cli/setup"

const gtm_id = setting("google_tag_manager.gtm_id")
const development_mode = setting("google_tag_manager.development_mode")

const setupTitle = "Plugin: Google Tag Manager"

addSetupCli(setupTitle)
addFilters()

function addFilters() {
  if (!gtm_id) {
    pushToFilter("setup-needed", { title: setupTitle })

    return
  }

  // Don't load in development by default
  if (process.env.NODE_ENV != "production" && !development_mode) {
    return
  }

  addFilter(
    "factor_head",
    _ => {
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
      })(window, document, "script", "dataLayer", "${gtm_id}")
    </script>`

      return [..._, add]
    },
    { priority: 200 }
  )

  addFilter("factor_body_start", _ => {
    const add = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtm_id}" height="0" width="0"
      style="display:none;visibility:hidden"></iframe></noscript>
  `
    return [..._, add]
  })
}

function addSetupCli(name) {
  // CLI admin setup utility
  addFilter("cli-add-setup", _ => {
    const setupAdmins = {
      name,
      value: "gtm",
      callback: async ({ inquirer }) => {
        const questions = [
          {
            name: "gtm_id",
            message: "What's your Google Tag Manager container ID?",
            type: "input"
          },
          {
            name: "development_mode",
            type: "list",
            message:
              "Load the tag manager in your 'development' environment? (Defaults to production only. This can be changed later)",
            choices: [{ name: "yes", value: true }, { name: "no", value: false }]
          }
        ]
        let { gtm_id, development_mode } = await inquirer.prompt(questions)

        await writeConfig("factor-config", {
          google_tag_manager: { gtm_id, development_mode }
        })
      }
    }

    return [..._, setupAdmins]
  })
}
