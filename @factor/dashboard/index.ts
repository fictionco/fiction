import { addFilter, applyFilters, toLabel, slugify, postTypesConfig } from "@factor/api"
import { Component } from "vue"
import { setting } from "@factor/api/settings"
import { userCan } from "@factor/user"
import { RouteConfig } from "vue-router"
import { DashboardMenuItem } from "./types"

export const dashboardPane = (): Promise<Component> => import("./theme/pane.vue")
export const dashboardPage = (): Promise<Component> => import("./theme/page.vue")
export const dashboardListPost = (): Promise<Component> => import("./el/list-post.vue")
export const dashboardListControls = (): Promise<Component> =>
  import("./el/list-controls.vue")
export const dashboardListEmpty = (): Promise<Component> => import("./el/list-empty.vue")
export const dashboardTableFooter = (): Promise<Component> => import("./table-footer.vue")
export const dashboardInput = (): Promise<Component> => import("./el/input.vue")
export const dashboardUserCard = (): Promise<Component> => import("./el/user-card.vue")
export const dashboardUserList = (): Promise<Component> => import("./el/user-list.vue")
/**
 * The base route for the dashboard
 */
export const dashboardBaseRoute = (): string => {
  const dashboardRoute = setting("dashboard.route")

  if (!dashboardRoute) {
    throw new Error(
      "Dashboard settings are missing. There may be a problem with settings generation; check the files in your '.factor' folder."
    )
  }
  return dashboardRoute
}

export const getDashboardRoute = (path?: string, parentPath?: string): string => {
  if (path && path.startsWith("/")) {
    return path
  } else {
    const base = parentPath ? parentPath : dashboardBaseRoute()
    const p = path || ""
    return `${base}/${p}`
  }
}

export const setup = (): void => {
  addFilter({
    key: "dashboard",
    hook: "routes",
    callback: (_: RouteConfig[]) => {
      const dashboardRoute = dashboardBaseRoute()

      const defaultRoute = getDashboardRoute("account")
      _.push({
        path: "/admin",
        redirect: defaultRoute
      })

      _.push({
        path: dashboardRoute,
        redirect: defaultRoute
      })

      _.push({
        path: dashboardRoute,
        component: (): Promise<Component> => import("./theme/wrap.vue"),
        children: applyFilters("dashboard-routes", [
          // {
          //   path: "admin",
          //   component: (): Promise<Component> => import("./vd-dashboard.vue"),
          //   meta: { auth: true }
          // },
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
      // _.push({
      //   group: "admin",
      //   path: "admin",
      //   name: "Admin",
      //   icon: require("./resource/dashboard.svg"),
      //   priority: 50
      // })

      postTypesConfig()
        .filter(({ hideAdmin, accessLevel }) => {
          return hideAdmin || (accessLevel && !userCan({ accessLevel })) ? false : true
        })
        .forEach(
          ({
            postType,
            namePlural,
            icon = "",
            noAddNew = false,
            addNewText = "Add New"
          }) => {
            const subMenu: DashboardMenuItem[] = []

            if (!noAddNew && addNewText) {
              subMenu.push({ path: slugify(addNewText) ?? "", name: addNewText })
            }

            subMenu.push({ path: "edit" })

            _.push({
              group: postType,
              path: `posts/${postType}`,
              name: namePlural || toLabel(postType),
              icon,
              items: applyFilters(`admin-menu-post-${postType}`, subMenu)
            })
          }
        )

      return _
    }
  })
}

setup()
