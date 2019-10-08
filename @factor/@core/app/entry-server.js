import Factor from "vue"
import { createApp } from "./app"

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default async ssrContext => {
  const { app, router, store } = createApp()
  const { url } = ssrContext

  const { fullPath } = router.resolve(url).route

  // Account for redirects
  router.push(fullPath !== url ? fullPath : url).catch(error => console.error(error))

  ssrContext = Factor.$filters.apply("ssr-context-init", ssrContext, {
    app,
    router,
    store
  })

  // Wait until router has resolved async imports
  // https://router.vuejs.org/api/#router-onready
  await new Promise((resolve, reject) => {
    router.onReady(() => resolve(true), reject)
  })

  const ssrConfig = {
    ssrContext,
    fullPath,
    matchedComponents: router.getMatchedComponents(fullPath),
    app,
    router,
    store
  }

  await Factor.$filters.run("ssr-context-callbacks", ssrConfig)

  ssrContext = Factor.$filters.apply("ssr-context-ready", ssrContext, ssrConfig)

  // Add this last as the final "state" of the server context should always be rendered to page
  ssrContext.state = store.state

  return app
}
