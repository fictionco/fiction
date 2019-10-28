import { addFilter } from "@factor/tools"

export default Factor => {
  return new (class {
    constructor() {
      addFilter("content-routes", _ => {
        _.push({
          name: "signin",
          path: "/signin",
          component: () => import("./view-signin.vue")
        })

        return _
      })

      addFilter("components", _ => {
        _["plugin-signin-profile-menu"] = () => import("./profile-menu.vue")

        return _
      })

      addFilter("site-components", _ => {
        _["plugin-signin-modal"] = () => import("./modal.vue")

        return _
      })
    }
  })()
}
