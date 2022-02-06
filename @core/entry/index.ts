import "@factor/api"
import "tailwindcss/tailwind.css"
// @ts-ignore
// eslint-disable-next-line import/no-unresolved, import/extensions, implicit-dependencies/no-implicit
import * as mainFile from "@src/index.ts"
// eslint-disable-next-line import/no-unresolved, import/extensions, implicit-dependencies/no-implicit
import App from "@src/App.vue"

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./vue.d.ts" />

import { initializeWindow } from "./init"
import { isNode } from "@factor/api/utils"
import { runCallbacks } from "@factor/api/hook"
import { getRouter, addRoutes } from "@factor/api/router"
import { getStore } from "@factor/api/store"
import { setupPlugins } from "@factor/api/extend"
import { logger } from "@factor/api/logger"
import { FactorAppEntry, UserConfigApp } from "@factor/types"
import { createHead } from "@vueuse/head"
import { App as VueApp, createSSRApp, createApp } from "vue"
import { initializeUser } from "@factor/api/userCurrent"

/**
 * Define process.env to prevent errors on any node code that runs
 */
if (!isNode) {
  window.process.env = {}
}

const setupApp = async (): Promise<UserConfigApp> => {
  let userConfig: UserConfigApp = {}
  // run the app main file
  if (mainFile.setup) {
    userConfig = mainFile.setup()
  }

  if (userConfig.plugins) {
    try {
      await setupPlugins(userConfig)
    } catch (error: unknown) {
      const e = error as Error
      logger.log({ level: "error", description: e.message, data: error })
    }
  }

  if (userConfig.routes) {
    addRoutes(userConfig.routes)
  }

  return userConfig
}

/**
 * Create the main Vue app
 */
export const factorApp = async (
  context: { renderUrl?: string } = {},
): Promise<FactorAppEntry> => {
  await setupApp()

  const renderUrl = context.renderUrl

  // only run in  browser
  if (typeof window !== "undefined") {
    initializeUser().catch((error) => console.error(error))
  }

  const app: VueApp = renderUrl ? createSSRApp(App) : createApp(App)

  // add router and store
  const router = getRouter()
  const store = getStore()

  app.use(router)
  app.use(store)

  if (renderUrl) {
    await router.replace({ path: renderUrl })
  }

  await router.isReady()

  const head = createHead()
  app.use(head)

  runCallbacks("appReady", { app, head }).catch((error) => console.error(error))

  return { app, head, router, store }
}
/**
 * In client mode, mount the app
 */
if (!isNode) {
  // add window watchers
  initializeWindow().catch((error) => console.error(error))

  factorApp()
    .then(({ app }) => {
      app.mount("#app")
      document.querySelector("#app")?.classList.add("loaded")
      document.querySelector(".styles-loading")?.remove()
    })
    .catch((error) => console.error(error))
}
