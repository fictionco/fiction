module.exports = Factor => {
  return new (class {
    constructor() {
      this.components()
      this.routes()

      this.errorPageComponent = () => import("#/not-found")
    }

    components() {
      Factor.$filters.add("components", _ => {
        _["not-found"] = this.errorPageComponent
        return _
      })
    }

    routes() {
      Factor.$filters.add("routes", _ => {
        _.push({
          path: "/",
          component: () => import("#/content"),
          children: Factor.$filters.get("content-routes", [
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
