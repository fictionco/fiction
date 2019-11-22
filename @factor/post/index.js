import { preFetchPost } from "@factor/post/request"
import { addFilter, addCallback } from "@factor/tools/filters"

export * from "./request"
export * from "./util"

addCallback("global-prefetch", _ => preFetchPost(_))
addCallback("client-route-before", _ => preFetchPost({ clientOnly: true, ..._ }))

export const factorPostEdit = () => import("./el/edit-link.vue")

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
