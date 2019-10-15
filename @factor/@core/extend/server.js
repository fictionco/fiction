import plugins from "~/.factor/loader-server"
import { importPlugins } from "./util"
export default Factor => {
  return new (class {
    constructor() {}

    async reload() {
      await this.loadCore()
      await this.loadPlugins()
    }

    async extend(_arguments) {
      const { loadPlugins = true, restart = false } = _arguments || {}
      process.env.FACTOR_TARGET = "server"

      await this.loadCore()

      // Loading plugins is sometimes not desireable e.g. when creating loaders
      if (loadPlugins !== false) {
        await importPlugins(plugins)

        await Factor.$filters.run("initialize-server")

        if (!restart) Factor.$filters.run("after-first-server-extend")
      }
    }

    async loadCore() {
      const core = {
        log: () => import("@factor/core-log/server"),
        tools: () => import("@factor/tools"),
        filters: () => import("@factor/filters"),
        paths: () => import("@factor/paths/server"),
        loaders: () => import("@factor/build/loaders"),
        override: () => import("@factor/core-override"),
        configServer: () => import("@factor/config/server"),
        setting: () => import("@factor/settings")
      }

      await importPlugins(core)

      // Add router and store to node, for utilities that need them
      // For example: sitemaps need information from router.

      const { default: router } = await import("@factor/app/router")
      const { default: store } = await import("@factor/app/store")

      router().create()
      store().create()
    }
  })()
}
