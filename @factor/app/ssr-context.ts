// This configures the context information needed to SSR the page
// Add lifecycle filters that allow plugins to control the context
import log from "@factor/api/logger"
import { applyFilters, runCallbacks } from "@factor/api/hooks"
import { ServerRenderContext, ApplicationComponents } from "./types"

export const handleContext = async ({
  context,
  vm,
  router,
  store,
}: ApplicationComponents): Promise<ServerRenderContext> => {
  const { url = "" } = context

  const { fullPath } = router.resolve(url).route

  // Account for redirects
  router.push(fullPath !== url ? fullPath : url).catch((error) => log.error(error))

  context = applyFilters("ssr-context-init", context, { vm, router, store })

  // Wait until router has resolved async imports
  // https://router.vuejs.org/api/#router-onready
  await new Promise((resolve, reject) => {
    router.onReady(() => resolve(true), reject)
  })

  const matchedComponents = router.getMatchedComponents(fullPath)

  const ssrConfig = { context, fullPath, matchedComponents, vm, router, store }

  await runCallbacks("ssr-context-callbacks", ssrConfig)

  // eslint-disable-next-line require-atomic-updates
  context = applyFilters("ssr-context-ready", context, ssrConfig)

  // eslint-disable-next-line require-atomic-updates
  context.state = store.state

  return context
}
