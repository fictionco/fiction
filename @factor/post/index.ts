import { preFetchPost } from "@factor/api/prefetch"
import { setting } from "@factor/api"
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
        component: setting("core.dashboard.dashboardList"),
      },
      {
        path: "posts/edit",
        component: setting("core.dashboard.dashboardEdit"),
      },
      {
        path: "posts/:postType/edit",
        component: setting("core.dashboard.dashboardEdit"),
      },
      {
        path: "posts/:postType/add-new",
        component: setting("core.dashboard.dashboardEdit"),
      },
      {
        path: "posts/:postType",
        component: setting("core.dashboard.dashboardList"),
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
