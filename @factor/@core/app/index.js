module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.components()
      this.routes()
      this.errorPageComponent = Factor.$setting.get("app.error404")

      Factor.$filters.push("site-mixins", require("./site-mixin").default)
      this.initializeClient()
    }

    // Allows components to definitively wait for client to init
    // otherwise we might throw hydration errors
    async client(callback) {
      await this._initializedClient

      if (callback) callback()

      return
    }

    initializeClient() {
      this._initializedClient = new Promise(async (resolve, reject) => {
        Factor.$events.$on("app-mounted", async () => {
          resolve()
        })
      })

      return this._initializedClient
    }

    components() {
      Factor.$filters.add("components", _ => {
        _["error-404"] = this.errorPageComponent
        return _
      })
    }

    routes() {
      Factor.$filters.add("routes", _ => {
        const contentRoutes = Factor.$filters
          .apply("content-routes", [
            {
              name: "forbidden",
              path: "/forbidden",
              component: this.errorPageComponent,
              meta: { error: 403 }
            }
          ])
          .filter((route, index, self) => {
            // remove duplicate paths
            const lastIndexOf = self.map(_ => _.path).lastIndexOf(route.path)
            return index === lastIndexOf
          })

        _.push({
          path: "/",
          component: Factor.$setting.get("app.content"),
          children: contentRoutes
        })

        _.push({
          path: "*",
          component: Factor.$setting.get("app.content"),
          children: Factor.$filters.apply("content-routes-unmatched", [
            {
              name: "notFound",
              path: "*",
              component: this.errorPageComponent,
              meta: { error: 404 }
            }
          ]),
          priority: 3000
        })

        return _
      })
    }
  })()
}
