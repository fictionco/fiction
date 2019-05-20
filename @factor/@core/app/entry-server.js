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

  // wait until router has resolved possible async hooks
  await new Promise((resolve, reject) => {
    router.onReady(async () => {
      ssrContext.state = store.state

      resolve(true)
    }, reject)
  })

  // the html template extension mechanism
  // This uses a callback because the component's 'created' hooks are called after this point
  ssrContext.factor_head = () => Object.values(ssrContext.extend).join("")

  return app
}
