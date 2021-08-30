import { FactorPluginConfigApp } from "@factor/types"
import { createSettings } from "./helpers"
import { DocsOptions } from "./types"
export const postType = "docsItem"
export * from "./helpers"
export * from "./types"
/**
 * Install as a Factor plugin
 */
export default (options: Partial<DocsOptions> = {}): FactorPluginConfigApp => {
  createSettings(options)

  return {
    name: "DocsEngineApp",
    setup: (): void => {
      // const basePath = docSetting("baseRoute") ?? "/"
      // const meta = docSetting("requireLoggedIn")
      //   ? { auth: true, allowBots: true }
      //   : {}
      // const DocWrap = docSetting("componentWrap")
      // const Home = docSetting("componentHome")
      // const Doc = docSetting("componentDoc")
      // const route: RouteRecordRaw = {
      //   path: basePath,
      //   component: DocWrap,
      //   meta,
      //   children: [
      //     {
      //       path: basePath,
      //       component: Home,
      //     },
      //     {
      //       path: `${basePath}/:docSlug`,
      //       component: Doc,
      //     },
      //   ],
      // }
      // addRoute(route)
    },
  }
}
