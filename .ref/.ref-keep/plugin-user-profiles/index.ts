import { addFilter } from "@factor/tools"

import { RouteConfig } from "vue-router"
addFilter("content-routes-unmatched", (_: RouteConfig[]) => {
  _.unshift({ path: "/@", component: () => import("./profile.vue") })
  _.unshift({ path: "/@:username", component: () => import("./profile.vue") })

  return _
})

// addFilter("post-params", params => {
//   const { username } = params
//   if (username) {
//     params = {
//       ...params,
//       permalink: username,
//       field: "username"
//     }
//   }
//   return params
// })

addFilter(
  "account-menu",
  (_: object[]): object[] => {
    _.unshift({
      items: [
        { path: "/dashboard", name: "Dashboard" },
        { path: "/@", name: "View Profile" }
      ]
    })

    return _
  },
  { priority: 1000 }
)
