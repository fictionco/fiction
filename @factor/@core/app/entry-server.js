import Factor from "vue"
import { createApp } from "./app"
import { handleContext } from "./ssr-context"

// This exported function will be called by `bundleRenderer`
// https://ssr.vuejs.org/guide/structure.html#entry-server-js
export default async context => {
  const { app, router, store } = createApp()

  await handleContext(Factor, { context, app, router, store })

  return app
}
