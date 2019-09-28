module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.addFilters()
    }

    async addFilters() {
      // Register doc routes for sitemap
      Factor.$filters.add("after-first-server-extend", () => {
        const base = Factor.$setting.get("docs.base")
        const pages = Factor.$setting.get("docs.pages")
        pages.forEach(p => {
          if (p.doc) {
            Factor.$router.registerRoute(`/${base}/${p.doc}`)
          }
        })
        // console.log("Factor.$router.registered()", Factor.$router.getRegisteredRoutes())
      })

      Factor.$filters.add("page-templates", _ => {
        return _.concat([
          {
            _id: "default",
            component: () => import("./page-template-default")
          }
        ])
      })

      Factor.$filters.add("content-routes", _ => {
        const base = Factor.$setting.get("docs.base")

        return [
          ..._,
          {
            path: "/plugins",
            component: () => import("./page-plugins")
          },
          {
            path: "/themes",
            component: () => import("./v-themes")
          },
          {
            path: "/compare",
            component: () => import("./page-compare")
          },
          {
            path: "/",
            component: () => import("./home/v-home")
          },
          {
            path: `/${base}`,
            component: () => import("./page-docs")
          },
          {
            path: `/${base}/:doc`,
            component: () => import("./page-docs")
          }
        ]
      })
    }
  })()
}
