import { addFilter } from "@factor/tools"

addFilter("content-routes-unmatched", _ => {
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
  "profile-menu",
  _ => {
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
