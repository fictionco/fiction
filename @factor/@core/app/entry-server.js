import Factor from "vue"
import { createApp } from "./app"

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default async ssrContext => {
  Factor.$ssrContext = ssrContext

  const { app, router, store } = createApp({ target: "server" })
  const { url } = ssrContext
  const { fullPath } = router.resolve(url).route

  // set router's location
  router.push(fullPath !== url ? fullPath : url)

  // Wait until router has resolved async imports
  await new Promise((resolve, reject) => {
    router.onReady(() => resolve(true), reject)
  })

  const { meta: { ui = "app" } = {} } =
    router.currentRoute.matched.find(_ => _.meta.ui) || {}

  await Promise.all([
    Factor.$filters.run("ssr-prefetch", fullPath),
    Factor.$filters.run("ssr-matched-components", router.getMatchedComponents(fullPath))
  ])

  // the html template extension mechanism
  // This uses a callback because the component's 'created' hooks are called after this point

  const metaHooks = ["factor_head", "factor_body_start", "factor_body_end"]

  metaHooks.forEach(h => {
    ssrContext[h] = () => {
      return Factor.$filters.apply(h, []).join("")
    }
  })

  const attrHooks = [
    { name: "factor_html_attr", attr: ['lang="en"'], classes: [`factor-${ui}`] },
    { name: "factor_body_attr", attr: [], classes: [] }
  ]

  attrHooks.forEach(({ name, attr, classes }) => {
    ssrContext[name] = additional => {
      classes.push(additional)
      attr.push(`class="${classes.join(" ")}"`)
      return Factor.$filters.apply(name, attr).join(" ")
    }
  })

  ssrContext.state = store.state

  return app
}
