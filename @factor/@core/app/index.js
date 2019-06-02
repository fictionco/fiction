module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.components()
      this.routes()
      this.errorPageComponent = () => import("#/404")
    }

    components() {
      Factor.$filters.add("components", _ => {
        _["error-404"] = this.errorPageComponent
        return _
      })
    }

    routes() {
      console.log("RUOTEW")
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
