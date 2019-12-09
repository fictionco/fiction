import bugsnag, { Bugsnag } from "@bugsnag/js"

import bugsnagVue from "@bugsnag/plugin-vue"
import { log, onEvent, addCallback, setting } from "@factor/api"

import { userInitialized } from "@factor/user"
import Vue from "vue"

const clientApiKey = setting("bugsnag.clientApiKey")

export const customLogger = (): Bugsnag.ILogger => {
  return {
    debug: (): void => {},
    info: (): void => {},
    warn: (): Function => log.warn,
    error: (): Function => log.error
  }
}

export const setup = (): void => {
  if (!clientApiKey || process.env.NODE_ENV == "development") return

  const appVersion = setting("version") || "0.0.0"

  const bugsnagClient = bugsnag({
    apiKey: clientApiKey,
    logger: customLogger(),
    appVersion
  })

  bugsnagClient.use(bugsnagVue, Vue)

  addCallback({
    key: "bugsnag",
    hook: "initialize-app",
    callback: async (): Promise<void> => {
      onEvent("error", (error: Error) => bugsnagClient.notify(error))

      const user = await userInitialized()

      if (user) bugsnagClient.user = user
    }
  })
}

setup()
