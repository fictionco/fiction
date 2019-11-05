import { pushToFilter } from "@factor/tools"

pushToFilter("content-routes", {
  name: "signin",
  path: "/signin",
  component: () => import("./view-signin.vue")
})

pushToFilter("global-components", {
  name: "plugin-signin-profile-menu",
  component: () => import("./profile-menu.vue")
})

pushToFilter("site-components", {
  name: "plugin-signin-modal",
  component: () => import("./modal.vue")
})
