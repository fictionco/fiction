import { App as VueApp, createSSRApp, createApp, Component } from "vue"
import { FactorAppEntry, MainFile } from "../types"
import { setupAppFromMainFile } from "../engine/setup"
import { isNode } from "../utils"
import { getRouter } from "../router"
import { getMeta } from "../meta"
import { initializeUser } from "../userInit"

import { initializeResetUi } from "../ui"
import EmptyApp from "./EmptyApp.vue"

/**
 * Create the main Vue app
 */
export const factorApp = async (
  context: {
    renderUrl?: string
    mainFile?: MainFile
    RootComponent?: Component
    isSSR?: boolean
  } = {},
): Promise<FactorAppEntry> => {
  const { renderUrl, mainFile, RootComponent = EmptyApp, isSSR } = context
  await setupAppFromMainFile({ mainFile, isSSR })

  // only run in  browser
  if (typeof window !== "undefined") {
    initializeUser().catch(console.error)
  }

  const app: VueApp = renderUrl
    ? createSSRApp(RootComponent)
    : createApp(RootComponent)

  // add router and store
  const router = getRouter()

  app.use(router)

  if (renderUrl) {
    await router.replace({ path: renderUrl })
  }

  await router.isReady()

  const meta = getMeta()
  app.use(meta)

  return { app, meta, router }
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

    initializeResetUi().catch(console.error)

    entry.app.mount(id)
    document.querySelector(id)?.classList.add("loaded")
    document.querySelector(".styles-loading")?.remove()
  }
}
