// This configures the context information needed to SSR the page
// Add lifecycle filters that allow plugins to control the context
import { applyFilters, runCallbacks, log } from "@factor/tools"

export async function handleContext({ context, app, router, store }) {
  const { url } = context

  const { fullPath } = router.resolve(url).route

  // Account for redirects
  router.push(fullPath !== url ? fullPath : url).catch(error => log.error(error))

  context = applyFilters("ssr-context-init", context, { app, router, store })

  // Wait until router has resolved async imports
  // https://router.vuejs.org/api/#router-onready
  await new Promise((resolve, reject) => {
    router.onReady(() => resolve(true), reject)
  })

  const matchedComponents = router.getMatchedComponents(fullPath)

  const ssrConfig = { context, fullPath, matchedComponents, app, router, store }

  await runCallbacks("ssr-context-callbacks", ssrConfig)

  // eslint-disable-next-line require-atomic-updates
  context = applyFilters("ssr-context-ready", context, ssrConfig)

  // This `rendered` hook is called when the app has finished rendering
  context.rendered = () => {
    // Add this last as the final "state" of the server context should always be rendered to page
    context.state = store.state
  }

  return context
}
