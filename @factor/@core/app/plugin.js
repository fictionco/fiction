module.exports = Factor => {
  return new (class {
    constructor() {
      this.components()
      this.routes()

      this.errorPageComponent = () => import("#/fallback")
    }

    components() {
      Factor.$filters.add("components", _ => {
        _["fallback"] = this.errorPageComponent
        return _
      })
    }

    routes() {
      Factor.$filters.add("routes", _ => {
        _.push({
          path: "/",
          component: () => import("#/content"),
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
          component: () => import("#/content"),
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
