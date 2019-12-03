import {
  addFilter,
  applyFilters,
  toLabel,
  slugify,
  postTypesConfig,
  pushToFilter,
  addContentRoute
} from "@factor/tools"
import { Component } from "vue"
import { setting } from "@factor/tools/settings"
import { userCan } from "@factor/user"
import { RouteConfig } from "vue-router"
import { DashboardMenuItem } from "./types"

addContentRoute({
  name: "signin",
  path: "/signin",
  component: (): Promise<Component> => import("./sign-in-view.vue")
})

pushToFilter("site-components", {
  name: "sign-in-modal",
  component: (): Promise<Component> => import("./sign-in-modal.vue")
})

export const accountMenu = (): Promise<Component> => import("./account-menu.vue")
export const dashboardPane = (): Promise<Component> => import("./pane.vue")
export const dashboardPage = (): Promise<Component> => import("./page.vue")
export const dashboardTable = (): Promise<Component> => import("./table.vue")
export const dashboardGrid = (): Promise<Component> => import("./grid.vue")
export const dashboardGridControls = (): Promise<Component> =>
  import("./grid-controls.vue")
export const dashboardGridActions = (): Promise<Component> => import("./grid-actions.vue")
export const dashboardGridFilter = (): Promise<Component> => import("./grid-filter.vue")
export const dashboardTableControls = (): Promise<Component> =>
  import("./table-controls.vue")
export const dashboardTableFooter = (): Promise<Component> => import("./table-footer.vue")
export const dashboardInput = (): Promise<Component> => import("./el/input.vue")
export const dashboardUserCard = (): Promise<Component> => import("./el/user-card.vue")
export const dashboardUserList = (): Promise<Component> => import("./el/user-list.vue")
export const factorInputSortable = (): Promise<Component> => import("./el/sortable.vue")

addFilter("routes", (_: RouteConfig[]) => {
  const dashboardRoute = setting("dashboard.route")

  if (!dashboardRoute) {
    throw new Error("Dashboard base route setting is undefined.")
  }

  _.push({
    path: "/admin",
    redirect: dashboardRoute
  })

  _.push({
    path: dashboardRoute,
    component: (): Promise<Component> => import("./wrap.vue"),
    children: applyFilters("dashboard-routes", [
      {
        path: "admin",
        component: (): Promise<Component> => import("./vd-dashboard.vue"),
        meta: { auth: true }
      },
      {
        path: "*",
        component: (): Promise<Component> => import("./vd-404.vue"),
        meta: { auth: true },
        priority: 3000
      }
    ]),
    meta: { auth: true, format: "dashboard", ui: "dashboard" }
  })

  return _
})

addFilter("admin-menu", (_: DashboardMenuItem[]) => {
  _.push({
    group: "admin",
    path: "admin",
    name: "Admin",
    icon: require("./resource/dashboard.svg"),
    priority: 50
  })

  postTypesConfig()
    .filter(({ hideAdmin, accessLevel }) => {
      return hideAdmin === false || (accessLevel && !userCan({ accessLevel }))
        ? false
        : true
    })
    .forEach(({ postType, namePlural, icon = "", add = "add-new" }) => {
      const subMenu: DashboardMenuItem[] = []

      let addText = ""
      if (add === true) {
        addText = "Add New"
      } else if (add) {
        addText = toLabel(add)
      }

      if (addText) {
        subMenu.push({ path: slugify(addText), name: addText })
      }

      subMenu.push({ path: "edit" })

      _.push({
        group: postType,
        path: `posts/${postType}`,
        name: namePlural || toLabel(postType),
        icon,
        items: applyFilters(`admin-menu-post-${postType}`, subMenu)
      })
    })

  return _
})
