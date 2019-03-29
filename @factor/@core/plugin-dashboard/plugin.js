export default Factor => {
  return new class {
    constructor() {
      if (Factor.FACTOR_ENV == "build") {
        const { resolve } = require("path")
        Factor.$filters.add("prepended-less-files", _ => {
          _.push(resolve(__dirname, "css/vars.less"))
          return _
        })
      } else {
        this.paths()
        this.components()
      }
    }

    components() {
      Factor.$filters.add("components", _ => {
        _["dashboard-pane"] = () => import("./pane")
        _["dashboard-page"] = () => import("./page")
        _["dashboard-banner"] = () => import("./banner")
        _["dashboard-table"] = () => import("./table")
        _["dashboard-form-grid"] = () => import("./form-grid")
        _["dashboard-splash"] = () => import("./splash")
        _["dashboard-chat"] = () => import("./chat")

        return _
      })
    }

    paths() {
      Factor.$filters.add("routes", _ => {
        _.push({
          path: "/admin",
          component: () => import("./wrap"),
          children: Factor.$filters.apply("admin-routes", [
            {
              path: "/",
              component: () => import("./vd-admin.vue"),
              meta: { auth: true }
            },
            {
              path: "*",
              component: () => import("./vd-404.vue"),
              meta: { auth: true },
              priority: 3000
            }
          ]),
          meta: { auth: true, priv: "admin", format: "admin" }
        })

        _.push({
          path: "/dashboard",
          component: () => import("./wrap"),
          children: Factor.$filters.apply("dashboard-routes", [
            {
              path: "/",
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
          meta: { auth: true, format: "dashboard" }
        })

        return _
      })

      Factor.$filters.add(
        "dashboard-menu",
        _ => {
          _.push({
            group: "home",
            path: "/dashboard",
            name: "Home",
            icon: require("./resource/dashboard.svg")
          })
          return _
        },
        { priority: 50 }
      )
    }
  }()
}
