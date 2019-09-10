export default Factor => {
  return new (class {
    constructor() {
      this.paths()
      this.components()
    }

    components() {
      Factor.$filters.add("components", _ => {
        _["dashboard-pane"] = () => import("./pane")
        _["dashboard-page"] = () => import("./page")
        _["dashboard-banner"] = () => import("./banner")
        _["dashboard-table"] = () => import("./table")
        _["dashboard-grid"] = () => import("./grid")
        _["dashboard-grid-controls"] = () => import("./grid-controls")
        _["dashboard-grid-actions"] = () => import("./grid-actions")
        _["dashboard-grid-filter"] = () => import("./grid-filter")
        _["dashboard-table-controls"] = () => import("./table-controls")
        _["dashboard-table-footer"] = () => import("./table-footer")
        _["dashboard-form-grid"] = () => import("./form-grid")
        _["dashboard-input"] = () => import("./el/input")
        _["dashboard-btn"] = () => import("./el/btn")
        _["dashboard-link"] = () => import("./el/link")
        _["dashboard-loader"] = () => import("./el/loader")
        _["dashboard-user-card"] = () => import("./el/user-card")
        _["dashboard-user-list"] = () => import("./el/user-list")
        _["factor-input-sortable"] = () => import("./el/sortable")
        return _
      })
    }

    paths() {
      Factor.$filters.add("routes", _ => {
        _.push({
          path: "/admin",
          redirect: "/dashboard"
        })

        _.push({
          path: "/dashboard",
          component: () => import("./wrap"),
          children: Factor.$filters.apply("dashboard-routes", [
            {
              path: "admin",
              component: () => import("./vd-dashboard.vue"),
              meta: { auth: true }
            },
            {
              path: "*",
              component: () => import("./vd-404.vue"),
              meta: { auth: true },
              priority: 3000
            }
          ]),
          meta: { auth: true, format: "dashboard", ui: "dashboard" }
        })

        return _
      })

      Factor.$filters.add(
        "admin-menu",
        _ => {
          _.push({
            group: "admin",
            path: "admin",
            name: "Admin",
            icon: require("./resource/dashboard.svg")
          })
          return _
        },
        { priority: 50 }
      )
    }
  })()
}
