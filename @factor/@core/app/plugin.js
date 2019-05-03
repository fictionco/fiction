module.exports = Factor => {
  return new (class {
    constructor() {
      this.routes()
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
              component: () => import("#/page-error"),
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
              component: () => import("#/page-error"),
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
