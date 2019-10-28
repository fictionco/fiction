export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("content-routes", _ => {
        _.push({
          name: "signin",
          path: "/signin",
          component: () => import("./view-signin.vue")
        })

        return _
      })

      Factor.$filters.add("components", _ => {
        _["plugin-signin-profile-menu"] = () => import("./profile-menu.vue")

        return _
      })

      Factor.$filters.add("site-components", _ => {
        _["plugin-signin-modal"] = () => import("./modal.vue")

        return _
      })
    }
  })()
}
