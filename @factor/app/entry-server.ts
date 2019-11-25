import { createApp } from "./app"
import { handleContext } from "./ssr-context"

// This exported function will be called by `bundleRenderer`
// this function is expected to return a Promise that resolves to the app instance.
// https://ssr.vuejs.org/guide/structure.html#entry-server-js
export default async context => {
  const { app, router, store } = await createApp()

  await handleContext({ context, app, router, store })

  return app
}
