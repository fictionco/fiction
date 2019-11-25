import bugsnag from "@bugsnag/js"
import bugsnagVue from "@bugsnag/plugin-vue"
import { log, onEvent, addCallback, setting } from "@factor/tools"

import { userInitialized } from "@factor/user"
import Vue from "vue"

const clientApiKey = setting("bugsnag.clientApiKey")

addFilters()

function addFilters() {
  if (!clientApiKey || process.env.NODE_ENV == "development") return

  const appVersion = setting("version") || "0.0.0"

  const bugsnagClient = bugsnag({
    apiKey: clientApiKey,
    logger: customLogger(),
    appVersion
  })

  bugsnagClient.use(bugsnagVue, Vue)

  addCallback("initialize-app", async () => {
    onEvent("error", e => bugsnagClient.notify(e))

    const user = await userInitialized()

    if (user) bugsnagClient.user = user
  })
}

function customLogger() {
  return {
    debug: () => {},
    info: () => {},
    warn: () => log.warn,
    error: () => log.error
  }
}
