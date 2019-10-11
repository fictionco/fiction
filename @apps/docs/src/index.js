module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.addFilters()
    }

    events() {}

    async addFilters() {
      // Register doc routes for sitemap
      Factor.$filters.add("after-first-server-extend", () => {
        const base = Factor.$setting.get("docs.base")
        const pages = Factor.$setting.get("docs.pages")
        const canonical = pages
          .map(p => {
            return p.doc
              ? { path: `/${base}/${p.doc}`, component: () => import("./page-docs") }
              : ""
          })
          .filter(_ => _)

        // Add canonical routes (sitemaps, etc)
        Factor.$router.addRoutes(canonical)
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
          // {
          //   path: "/pluginsnew",
          //   component: () => import("./plugins/v-plugins")
          // },
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
          },
          {
            path: Factor.$setting.get("plugins.indexRoute"),
            component: () => import("./plugins/plugins-wrap"),
            //component: Factor.$setting.get("plugins.layout.index"),
            children: [
              {
                path: "/pluginsnew",
                component: Factor.$setting.get("plugins.layout.index")
              },
              {
                path: `${Factor.$setting.get("plugins.postRoute")}/:permalink`,
                component: Factor.$setting.get("plugins.layout.single")
              }
            ]
          }
        ]
      })
    }
  })()
}
