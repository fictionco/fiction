module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.components()
      this.routes()
      this.errorPageComponent = () => import("#/404.vue")

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
        _.push({
          path: "/",
          component: () => import("#/content.vue"),
          children: Factor.$filters.apply("content-routes", [
            {
              name: "forbidden",
              path: "/forbidden",
              component: this.errorPageComponent,
              meta: { error: 403 }
            }
          ])
        })

        _.push({
          path: "*",
          component: () => import("#/content.vue"),
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
