module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.addPaths()
      // this.addSettings()
    }

    // addSettings() {
    //   Factor.$filters.add("settings", _ => {
    //     return [..._, require("./factor-settings")(Factor)]
    //   })
    // }

    async addPaths() {
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
