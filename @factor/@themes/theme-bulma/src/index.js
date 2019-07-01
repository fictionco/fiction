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
        const routes = [
          {
            path: "/",
            component: () => import("./page-home"),
            meta: { nav: true }
          },
          {
            path: "/elements",
            component: () => import("./page-elements"),
            meta: { nav: true }
          }
        ]

        return _.concat(routes)
      })
    }
  })()
}
