import { preFetchPost } from "@factor/api/prefetch"
import { addFilter, addCallback, pushToFilter } from "@factor/api/hooks"
import { Component } from "vue"
import { RouteConfig, Route } from "vue-router"
import { PostEditComponent } from "./types"

export const factorPostEdit = (): Promise<Component> => import("./el/edit-link.vue")

export const addPostEditComponent = (item: PostEditComponent): void => {
  pushToFilter({ hook: "post-edit-components", key: item.name, item })
}

addFilter({
  key: "dashboardRoutes",
  hook: "dashboard-routes",
  callback: (_: RouteConfig[]): RouteConfig[] => {
    const routes = [
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

    return [..._, ...routes]
  }
})

export const setup = (): void => {
  addCallback({
    key: "prefetch",
    hook: "global-prefetch",
    callback: (_: Route & { clientOnly: boolean }) => preFetchPost(_)
  })
  addCallback({
    key: "prefetch",
    hook: "client-route-before",
    callback: (_: Route & { clientOnly: boolean }) =>
      preFetchPost({ clientOnly: true, ..._ })
  })
}

setup()
