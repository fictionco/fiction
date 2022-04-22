import { App as VueApp, createSSRApp, createApp, Component } from "vue"
import { FactorAppEntry, UserConfig } from "../config/types"

import { isNode } from "../utils"
import { getRouter, setupRouter } from "../utils/router"
import { getMeta } from "../utils/meta"

import { initializeResetUi } from "../utils/ui"
import { HookDictionary } from "../config/hookDictionary"
import { runHooks } from "../utils/hook"
import { createUserConfig } from "../config/entry"

export const setupApp = async (params: {
  userConfig: UserConfig
}): Promise<UserConfig> => {
  const { userConfig } = params

  if (userConfig.routes) {
    setupRouter(userConfig.routes)
  }

  await runHooks<HookDictionary, "afterAppSetup">({
    list: userConfig.hooks,
    hook: "afterAppSetup",
    args: [{ userConfig }],
  })

  return userConfig
}

export const setupAppFromMainFile = async (): Promise<UserConfig> => {
  const userConfig = await createUserConfig({ isApp: true })

  return await setupApp({ userConfig })
}

/**
 * Create the main Vue app
 */
export const factorApp = async (
  context: { renderUrl?: string } = {},
): Promise<FactorAppEntry> => {
  const { renderUrl } = context
  await setupAppFromMainFile()

  // @ts-ignore
  // eslint-disable-next-line import/no-unresolved
  const imported = (await import("@ROOT_COMPONENT_ALIAS")) as {
    default: Component
  }
  const RootComponent = imported.default

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
  renderUrl?: string
}): Promise<void> => {
  const { id = "#app", renderUrl } = params

  if (!isNode()) {
    const entry = await factorApp({ renderUrl })

    initializeResetUi().catch(console.error)

    entry.app.mount(id)
    document.querySelector(id)?.classList.add("loaded")
    document.querySelector(".styles-loading")?.remove()
  }
}
