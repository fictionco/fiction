import { createApp } from "./app"
import { handleContext } from "./ssr-context"
import Vue from "vue"

// This exported function will be called by `bundleRenderer`
// this function is expected to return a Promise that resolves to the app instance.
// https://ssr.vuejs.org/guide/structure.html#entry-server-js
export default async (context): Promise<Vue> => {
  const { vm, router, store } = await createApp()

  await handleContext({ context, vm, router, store })

  return vm
}
