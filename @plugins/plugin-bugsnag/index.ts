import bugsnag from "@bugsnag/js"

import BugsnagPluginVue from "@bugsnag/plugin-vue"
import { setting } from "@factor/api"
import Vue from "vue"
import { currentUser } from "@factor/user"

const clientApiKey = setting("bugsnag.clientApiKey")

export const setup = (): void => {
  if (!clientApiKey || process.env.NODE_ENV == "development") return

  const appVersion = setting("package.version") || "0.0.0"

  bugsnag.start({
    apiKey: clientApiKey,
    // @ts-ignore
    plugins: [new BugsnagPluginVue(Vue)],
    onError: function (event) {
      const user = currentUser()
      if (user) {
        event.setUser(user._id, user.email, user.displayName)
      }
    },
    appVersion,
  })
}

setup()
