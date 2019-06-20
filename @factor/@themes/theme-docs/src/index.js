module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.addPaths()
      this.addComponents()
      this.addSettings()
    }

    addSettings() {
      Factor.$filters.add("settings", _ => {
        return [..._, require("./settings")(Factor)]
      })
    }

    addComponents() {
      Factor.$filters.add("components", _ => {
        _["app-btn"] = () => import("./el/btn")
        _["app-link"] = () => import("./el/link")
        return _
      })
    }

    async addPaths() {
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
            component: () => import("./page-home"),
            meta: { background: "#fafbff" }
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
