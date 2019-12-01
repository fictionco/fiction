import { preFetchPost } from "@factor/tools/prefetch"
import { addFilter, addCallback, pushToFilter } from "@factor/tools/filters"
import { Component } from "vue"
import { RouteConfig } from "vue-config"
export * from "./request"
export * from "./util"

addCallback("global-prefetch", (_) => preFetchPost(_))
addCallback("client-route-before", (_) => preFetchPost({ clientOnly: true, ..._ }))

export const factorPostEdit = (): Promise<Component> => import("./el/edit-link.vue")

export function addPostEditComponent(item): void {
  pushToFilter("post-edit-components", item)
}

addFilter(
  "dashboard-routes",
  (_: RouteConfig): RouteConfig => {
    return [
      ..._,
      {
        path: "posts",
        component: (): Promise<Component> => import("./view/dashboard-list.vue")
      },
      {
        path: "posts/edit",
        component: (): Promise<Component> => import("./view/dashboard-edit.vue")
      },
      {
        path: "posts/:postType/edit",
        component: (): Promise<Component> => import("./view/dashboard-edit.vue")
      },
      {
        path: "posts/:postType/add-new",
        component: (): Promise<Component> => import("./view/dashboard-edit.vue")
      },
      {
        path: "posts/:postType",
        component: (): Promise<Component> => import("./view/dashboard-list.vue")
      }
    ]
  }
)
