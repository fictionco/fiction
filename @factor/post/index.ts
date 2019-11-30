import { preFetchPost } from "@factor/tools/prefetch"
import { addFilter, addCallback, pushToFilter } from "@factor/tools/filters"
import Vue from "vue"
export * from "./request"
export * from "./util"

addCallback("global-prefetch", (_) => preFetchPost(_))
addCallback("client-route-before", (_) => preFetchPost({ clientOnly: true, ..._ }))

export const factorPostEdit = () => import("./el/edit-link.vue")

export function addPostEditComponent(item): void {
  pushToFilter("post-edit-components", item)
}

addFilter("dashboard-routes", (_) => {
  return [
    ..._,
    {
      path: "posts",
      component: (): Promise<Vue> => import("./view/dashboard-list.vue")
    },
    {
      path: "posts/edit",
      component: (): Promise<Vue> => import("./view/dashboard-edit.vue")
    },
    {
      path: "posts/:postType/edit",
      component: (): Promise<Vue> => import("./view/dashboard-edit.vue")
    },
    {
      path: "posts/:postType/add-new",
      component: (): Promise<Vue> => import("./view/dashboard-edit.vue")
    },
    {
      path: "posts/:postType",
      component: (): Promise<Vue> => import("./view/dashboard-list.vue")
    }
  ]
})
