module.exports = Factor => {
  return new (class {
    constructor() {
      this.doApp()
    }

    doApp() {
      this.components()

      this.routes()
    }

    components() {
      require("@factor/components-standard").default(Factor)
      require("@factor/components-form").default(Factor)
    }

    routes() {
      Factor.$filters.add("routes", _ => {
        _.push({
          path: "/",
          component: () => import("@/content"),
          children: Factor.$filters.get("content-routes", [
            {
              name: "forbidden",
              path: "/forbidden",
              component: () => import("@/page-error"),
              meta: { error: 403 }
            }
          ]),
          meta: {
            nav: false
          }
        })

        _.push({
          path: "*",
          component: () => import("@/content"),
          children: Factor.$filters.apply("content-routes-unmatched", [
            {
              name: "notFound",
              path: "*",
              component: () => import("@/page-error"),
              meta: { error: 404 }
            }
          ]),
          priority: 3000
        })

        return _
      })

      // Add 404 Handling last
      // Factor.$filters.add(
      //   "routes",
      //   _ => {

      //     return _
      //   },
      //   { priority: 3000 }
      // )
    }
  })()
}
