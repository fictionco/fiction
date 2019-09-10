module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.addPaths()
      this.addComponents()
      if (Factor.FACTOR_TARGET == "app") {
        this.filters()
      }
    }

    // addSettings() {
    //   Factor.$filters.add("settings", _ => {
    //     return [..._, require("./factor-settings")(Factor)]
    //   })
    // }

    addComponents() {
      Factor.$filters.add("components", _ => {
        _["app-btn"] = () => import("./el/btn")
        _["app-link"] = () => import("./el/link")
        return _
      })
    }

    filters() {
      Factor.$filters.add(
        "factor_head",
        _ => {
          const add = Factor.$setting.get("headTags.font")

          return [..._, add]
        },
        { priority: 200 }
      )
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
            meta: {
              background: "#fafbff"
            }
          }
        ]

        return _.concat(routes)
      })
    }
  })()
}
