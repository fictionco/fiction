import "@factor/api"
import "tailwindcss/tailwind.css"

import { isNode } from "@factor/api/utils"
import { getRouter, setupRouter } from "@factor/api/router"
import { getStore } from "@factor/api/store"
import { installPlugins } from "@factor/engine/plugins"
import { logger } from "@factor/api/logger"
import { FactorAppEntry, UserConfig, MainFile } from "@factor/types"
import { getMeta } from "@factor/api/meta"
import { App as VueApp, createSSRApp, createApp, Component } from "vue"
import { initializeUser } from "@factor/engine/userInit"

import EmptyApp from "./EmptyApp.vue"
import { initializeWindow } from "./init"

export const setupApp = async (params: {
  mainFile?: MainFile
}): Promise<UserConfig> => {
  const { mainFile = {} } = params

  let userConfig: UserConfig = {}
  // run the app main file
  if (mainFile.setup) {
    userConfig = await mainFile.setup()
  }

  if (userConfig.plugins) {
    try {
      userConfig = await installPlugins({ userConfig, isServer: false })
    } catch (error: unknown) {
      const e = error as Error
      logger.log({ level: "error", description: e.message, data: error })
    }
  }

  if (userConfig.routes) {
    setupRouter(userConfig.routes)
  }

  return userConfig
}

/**
 * Create the main Vue app
 */
export const factorApp = async (
  context: {
    renderUrl?: string
    mainFile?: MainFile
    RootComponent?: Component
  } = {},
): Promise<FactorAppEntry> => {
  const { renderUrl, mainFile, RootComponent = EmptyApp } = context
  await setupApp({ mainFile })

  // only run in  browser
  if (typeof window !== "undefined") {
    initializeUser().catch(console.error)
  }

  const app: VueApp = renderUrl
    ? createSSRApp(RootComponent)
    : createApp(RootComponent)

  // add router and store
  const router = getRouter()
  const store = getStore()

  app.use(router)
  app.use(store)

  if (renderUrl) {
    await router.replace({ path: renderUrl })
  }

  await router.isReady()

  const meta = getMeta()
  app.use(meta)

  return { app, meta, router, store }
}

export const mountApp = async (params: {
  id: string
  mainFile: MainFile
  RootComponent?: Component
  renderUrl?: string
}): Promise<void> => {
  const {
    id = "#app",
    mainFile = {},
    RootComponent = EmptyApp,
    renderUrl,
  } = params

  if (!isNode) {
    const entry = await factorApp({ mainFile, RootComponent, renderUrl })

    initializeWindow().catch(console.error)

    entry.app.mount(id)
    document.querySelector(id)?.classList.add("loaded")
    document.querySelector(".styles-loading")?.remove()
  }
}
