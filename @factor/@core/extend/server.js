import Factor from "@factor/core"
import { importPlugins } from "./util"

export default () => {
  return new (class {
    constructor() {}

    async reload() {
      await this.loadCore()
      await this.loadPlugins()
    }

    async extend(_arguments) {
      const { loadPlugins = true, restart = false, buildLoaders = false } =
        _arguments || {}
      process.env.FACTOR_TARGET = "server"

      const core = {
        log: () => import("@factor/core-log/server"),
        tools: () => import("@factor/tools"),
        filters: () => import("@factor/filters"),
        paths: () => import("@factor/paths/server"),
        loaders: () => import("@factor/build/loaders"),
        override: () => import("@factor/core-override"),
        configServer: () => import("@factor/config/server")
      }

      await importPlugins(core, { async: true })

      if (buildLoaders) {
        await Factor.$filters.run(`cli-run-create-loaders`)
      }

      // Loading plugins is sometimes not desireable e.g. when creating loaders
      if (loadPlugins !== false) {
        await this.loadPlugins()

        await Factor.$filters.run("initialize-server")

        if (!restart) Factor.$filters.run("after-first-server-extend")
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
      await importPlugins(mods, { async: true })

      // Add router and store to node, for utilities that need them
      // For example: sitemaps need information from router.
      // Router/Store are reserved words in Vue, that why we use "__"
      Factor.$__router.create()
      Factor.$__store.create()

      const plugins = await import("~/.factor/loader-server")

      await importPlugins(plugins)
    }
  })()
}
