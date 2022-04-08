import "@factor/api"
import "tailwindcss/tailwind.css"

import { isNode } from "@factor/api/utils"
import { getRouter } from "@factor/api/router"
import { getStore } from "@factor/api/store"
import { FactorAppEntry, MainFile } from "@factor/types"
import { getMeta } from "@factor/api/meta"
import { App as VueApp, createSSRApp, createApp, Component } from "vue"
import { initializeUser } from "@factor/engine/userInit"

import { setupAppFromMainFile } from "@factor/engine/setup"
import EmptyApp from "./EmptyApp.vue"
import { initializeWindow } from "./init"

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
  await setupAppFromMainFile({ mainFile })

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
