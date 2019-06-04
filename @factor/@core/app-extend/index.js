export default Factor => {
  return new (class {
    constructor() {
      this.setup()
    }

    setup() {
      Factor.config.productionTip = false
      Factor.config.devtools = true
      Factor.config.silent = false
      this.addCoreExtension("tools", require("@factor/tools").default)
      this.addCoreExtension("log", require("@factor/core-log/app").default)
      this.addCoreExtension("filters", require("@factor/filters").default)
      this.addCoreExtension("config", require("@factor/app-config").default)
      this.addCoreExtension("stack", require("@factor/core-stack").default)
      this.injectPlugins()
    }

    addCoreExtension(id, extension) {
      Factor.use({
        install(Factor) {
          Factor[`$${id}`] = Factor.prototype[`$${id}`] = extension(Factor)
        }
      })
    }

    injectPlugins() {
      const plugins = require("~/.factor/loader-app")
      for (var _p in plugins) {
        if (plugins[_p]) {
          const plugin = plugins[_p]

          if (typeof plugin == "function") {
            Factor.use({
              install(Factor) {
                const h = `$${_p}`

                Factor[h] = Factor.prototype[h] = plugin(Factor)
              }
            })
          }
        }
      }
    }

    initializeApp() {
      Factor.$filters.run("initialize-app")
      Factor.$filters.run("after-initialize-app")

      const comps = Factor.$filters.apply("components", {})
      for (var _ in comps) {
        if (comps[_]) {
          Factor.component(_, comps[_])
        }
      }

      if (Factor.FACTOR_SSR == "client") {
        const directives = Factor.$filters.apply("client-directives", {})

        for (var _ in directives) {
          if (directives[_]) {
            Factor.directive(_, directives[_])
          }
        }
      }
    }

    mixinApp() {
      if (!Factor.$mixinsApplied) {
        const mixins = Factor.$filters.apply("mixins", {})

        Object.keys(mixins).forEach(key => {
          if (typeof mixins[key] == "function") {
            mixins[key]()
          }
        })

        Factor.$mixinsApplied = true
      }
    }
  })()
}
