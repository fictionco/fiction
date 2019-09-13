module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.addPaths()
      this.addComponents()
    }

    addComponents() {}

    async addPaths() {
      // Register doc routes for sitemap
      Factor.$filters.add("initial-server-start", () => {
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
            name: "Default",
            value: "default",
            component: () => import("./page-template-default")
          }
        ])
      })

      Factor.$filters.add("content-routes", _ => {
        const base = Factor.$setting.get("docs.base")
        const routes = [
          {
            path: "/",
            component: () => import("./page-home")
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
        return _.concat(routes)
      })
    }
  })()
}
