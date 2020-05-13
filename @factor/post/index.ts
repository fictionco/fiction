import { preFetchPost } from "@factor/api/prefetch"
import { addFilter, addCallback, pushToFilter } from "@factor/api/hooks"

import { RouteConfig, Route } from "vue-router"
import { PostEditComponent } from "./types"
import "./post-type"

/**
 * the 'edit post' link component
 */
export const factorPostEdit = (): Promise<any> => import("./el/edit-link.vue")

export const addPostEditComponent = (item: PostEditComponent): void => {
  pushToFilter({ hook: "post-edit-components", key: item.name, item })
}

/**
 * Add standard dashboard routes for post management
 */
addFilter({
  key: "dashboardRoutes",
  hook: "dashboard-routes",
  callback: (_: RouteConfig[]): RouteConfig[] => {
    const routes = [
      {
        path: "posts",
        component: (): Promise<any> => import("./view/dashboard-list.vue"),
      },
      {
        path: "posts/edit",
        component: (): Promise<any> => import("./view/dashboard-edit.vue"),
      },
      {
        path: "posts/:postType/edit",
        component: (): Promise<any> => import("./view/dashboard-edit.vue"),
      },
      {
        path: "posts/:postType/add-new",
        component: (): Promise<any> => import("./view/dashboard-edit.vue"),
      },
      {
        path: "posts/:postType",
        component: (): Promise<any> => import("./view/dashboard-list.vue"),
      },
    ].map((p) => {
      return { ...p, meta: { auth: true } }
    })

    return [..._, ...routes]
  },
})

export const setup = (): void => {
  addCallback({
    key: "prefetch",
    hook: "global-prefetch",
    callback: (_: Route & { clientOnly: boolean }) => preFetchPost(_),
  })
  addCallback({
    key: "prefetch",
    hook: "client-route-before",
    callback: (_: Route & { clientOnly?: boolean }) => {
      return preFetchPost({ clientOnly: true, ..._ })
    },
  })
}

setup()
