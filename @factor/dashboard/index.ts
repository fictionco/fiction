import {
  addFilter,
  applyFilters,
  toLabel,
  slugify,
  postTypesConfig,
  pushToFilter,
  addContentRoute
} from "@factor/api"

import { Component } from "vue"
import { setting } from "@factor/api/settings"
import { userCan } from "@factor/user"
import { RouteConfig } from "vue-router"
import { DashboardMenuItem } from "./types"

export const accountMenu = (): Promise<Component> => import("./account-menu.vue")
export const dashboardPane = (): Promise<Component> => import("./theme/pane.vue")
export const dashboardPage = (): Promise<Component> => import("./theme/page.vue")
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

export const setup = (): void => {
  addContentRoute({
    name: "signin",
    path: "/signin",
    component: (): Promise<Component> => import("./sign-in-view.vue")
  })

  pushToFilter({
    key: "dashboard",
    hook: "site-components",
    item: {
      name: "sign-in-modal",
      component: (): Promise<Component> => import("./sign-in-modal.vue")
    }
  })

  addFilter({
    key: "dashboard",
    hook: "routes",
    callback: (_: RouteConfig[]) => {
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
        component: (): Promise<Component> => import("./theme/wrap.vue"),
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
    }
  })

  addFilter({
    key: "dashboard",
    hook: "admin-menu",
    callback: (_: DashboardMenuItem[]) => {
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
        .forEach(({ postType, namePlural, icon = "", addNewText = "Add New" }) => {
          const subMenu: DashboardMenuItem[] = []

          if (addNewText) {
            subMenu.push({ path: slugify(addNewText), name: addNewText })
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
    }
  })
}

setup()
