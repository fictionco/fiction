import { renderToString } from "vue/server-renderer"
import { initApp } from "."

export const render = async (url: string) => {
  const { app, router } = initApp({ env: "server" })

  // set the router to the desired URL before rendering
  await router.push(url)
  await router.isReady()

  // passing SSR context object which will be available via useSSRContext()
  // @vitejs/plugin-vue injects code into a component's setup() that registers
  // itself on ctx.modules. After the render, ctx.modules would contain all the
  // components that have been instantiated during this render call.
  const ctx = {} as { modules: string[] }
  const html = await renderToString(app, ctx)

  return html
}
