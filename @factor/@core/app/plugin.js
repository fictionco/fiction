module.exports = (Factor, { target }) => {
  return new class {
    constructor() {
      if (target == "build") {
        this.doBuild()
      } else {
        this.doApp()
      }
    }

    doBuild() {
      const path = require("path")

      Factor.$paths.add({
        entry: __dirname,
        "entry-client": path.resolve(__dirname, "entry-client.js"),
        "entry-server": path.resolve(__dirname, "entry-server.js")
      })
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
            // {
            //   path: "/:permalink",
            //   component: () => import("./template")
            // },
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
  }()
}
