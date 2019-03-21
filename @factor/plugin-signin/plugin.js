export default Factor => {
  return new class {
    constructor() {
      Factor.$filters.add("content-routes", _ => {
        _.push({
          name: "signin",
          path: "/signin",
          component: () => import("./src/view-signin")
        })

        return _
      })

      Factor.$filters.add("components", (_ = {}) => {
        _["plugin-signin-profile-menu"] = () => import("./src/profile-menu")

        return _
      })

      Factor.$filters.add("site-components", (_ = {}) => {
        _["plugin-signin-modal"] = () => import("./src/modal")

        return _
      })
    }
  }()
}
