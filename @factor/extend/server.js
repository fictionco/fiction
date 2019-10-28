import Factor from "@factor/core"
import { importPlugins } from "./util"
import { runCallbacks } from "@factor/tools"
import "@factor/build/loaders"
import "@factor/build/override"
export default () => {
  return new (class {
    constructor() {}

    async reload() {
      await this.loadCore()
      await this.loadPlugins()
    }

    async extend(_arguments) {
      const { loadPlugins = true, restart = false } = _arguments || {}
      process.env.FACTOR_TARGET = "server"

      if (loadPlugins !== false) {
        await this.loadPlugins()

        await runCallbacks("initialize-server")

        if (!restart) runCallbacks("after-first-server-extend")
      }
    }

    async loadPlugins() {
      // Settings should only be loaded if loadPlugins option is set
      // It depends on generated loaders

      const mods = {
        setting: () => import("@factor/settings"),
        __router: () => import("@factor/app/router"),
        __store: () => import("@factor/app/store")
      }
      await importPlugins(mods)

      // Add router and store to node, for utilities that need them
      // For example: sitemaps need information from router.
      // Router/Store are reserved words in Vue, that why we use "__"
      await Factor.$setting.create()
      Factor.$__router.create()
      Factor.$__store.create()

      const { default: plugins } = await import("~/.factor/loader-server")

      await importPlugins(plugins)
    }
  })()
}
