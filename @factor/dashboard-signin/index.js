import { pushToFilter, registerOnFilter } from "@factor/tools"

pushToFilter("content-routes", {
  name: "signin",
  path: "/signin",
  component: () => import("./view-signin.vue")
})

registerOnFilter("components", "plugin-signin-profile-menu", () =>
  import("./profile-menu.vue")
)

registerOnFilter("site-components", "plugin-signin-modal", () => import("./modal.vue"))
