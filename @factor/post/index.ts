import { preFetchPost } from "@factor/tools/prefetch"
import { addFilter, addCallback, pushToFilter } from "@factor/tools/filters"
import { Component } from "vue"
import { RouteConfig, Route } from "vue-router"
import { PostEditComponent } from "./types"

export const factorPostEdit = (): Promise<Component> => import("./el/edit-link.vue")

export const addPostEditComponent = (item: PostEditComponent): void => {
  pushToFilter("post-edit-components", item)
}

addFilter("dashboard-routes", (_: RouteConfig[]): RouteConfig[] => {
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
})

export const setup = (): void => {
  addCallback("global-prefetch", (_: Route & { clientOnly: boolean }) => preFetchPost(_))
  addCallback("client-route-before", (_: Route & { clientOnly: boolean }) =>
    preFetchPost({ clientOnly: true, ..._ })
  )
}

setup()
