import { preFetchPost } from "@factor/post"
import { addFilter, addCallback, pushToFilter } from "@factor/tools/filters"

export * from "./request"
export * from "./util"

addCallback("site-pre-fetch", _ => preFetchPost(_))
addCallback("client-route-before", _ => preFetchPost({ clientOnly: true, ..._ }))

pushToFilter("global-components", {
  name: "factor-post-edit",
  component: () => import("./el/edit-link.vue")
})

addFilter("dashboard-routes", _ => {
  return [
    ..._,
    {
      path: "posts",
      component: () => import("./view/dashboard-list.vue")
    },
    {
      path: "posts/edit",
      component: () => import("./view/dashboard-edit.vue")
    },
    {
      path: "posts/:postType/edit",
      component: () => import("./view/dashboard-edit.vue")
    },
    {
      path: "posts/:postType/add-new",
      component: () => import("./view/dashboard-edit.vue")
    },
    {
      path: "posts/:postType",
      component: () => import("./view/dashboard-list.vue")
    }
  ]
})
