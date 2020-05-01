import { toLabel, slugify, postTypesConfig, currentUrl, addRoutes } from "@factor/api"

import { addCallback, pushToFilter, addFilter, applyFilters } from "@factor/api/hooks"
import { userCan } from "@factor/user"

import { DashboardMenuItem } from "./types"
import { getDashboardRoute, dashboardBaseRoute } from "./util"
import { preloadedDashboardRoutes } from "./menu"

export * from "./util"

export const dashboardPane = (): Promise<any> => import("./theme/pane.vue")
export const dashboardPage = (): Promise<any> => import("./theme/page.vue")
export const dashboardListPost = (): Promise<any> => import("./el/list-post.vue")
export const dashboardListControls = (): Promise<any> => import("./el/list-controls.vue")
export const dashboardListEmpty = (): Promise<any> => import("./el/list-empty.vue")
export const dashboardTableFooter = (): Promise<any> => import("./table-footer.vue")
export const dashboardInput = (): Promise<any> => import("./el/input.vue")
export const dashboardUserCard = (): Promise<any> => import("./el/user-card.vue")
export const dashboardUserList = (): Promise<any> => import("./el/user-list.vue")

declare global {
  interface Window {
    factorFrame: any
  }
}

interface MenuConfig {
  dashboard: DashboardMenuItem[]
  admin: DashboardMenuItem[]
}

const getPostTypeMenus = (): MenuConfig => {
  const out: MenuConfig = {
    dashboard: [],
    admin: [],
  }
  postTypesConfig()
    .filter(({ managePosts, accessLevel }) => {
      return !managePosts || (accessLevel && !userCan({ accessLevel })) ? false : true
    })
    .forEach(
      ({
        accessLevel = 100,
        postType,
        namePlural,
        icon = "",
        noAddNew = false,
        addNewText = "Add New",
      }) => {
        const subMenu: DashboardMenuItem[] = []

        if (!noAddNew && addNewText) {
          subMenu.push({ path: slugify(addNewText) ?? "", name: addNewText })
        }

        subMenu.push({ path: "edit" })

        const item = {
          group: postType,
          path: `posts/${postType}`,
          name: namePlural || toLabel(postType),
          icon,
          items: applyFilters(`admin-menu-post-${postType}`, subMenu),
        }

        if (accessLevel < 100) {
          out.dashboard.push(item)
        } else {
          out.admin.push(item)
        }
      }
    )
  return out
}

export const setup = (): void => {
  addCallback({
    hook: "initialize-app",
    key: "setupDashboard",
    callback: () => {
      const dashboardRoute = dashboardBaseRoute()

      const routes = preloadedDashboardRoutes()

      addRoutes({
        key: "dashboardRoutesPreloaded",
        location: "dashboard",
        routes,
      })

      addRoutes({
        key: "setupDashboard",
        location: "root",
        routes: [
          {
            path: dashboardRoute,
            redirect: getDashboardRoute("account"),
          },
          {
            path: dashboardRoute,
            component: (): Promise<any> => import("./theme/wrap.vue"),
            children: applyFilters("dashboard-routes", [
              {
                path: "*",
                component: (): Promise<any> => import("./vd-404.vue"),
                meta: { auth: true },
                priority: 3000,
              },
            ]),
            meta: { auth: true, format: "dashboard", ui: "dashboard" },
          },
        ],
      })
    },
  })
  // addFilter({
  //   key: "dashboard",
  //   hook: "routes",
  //   callback: (_: RouteConfig[]) => {
  //     const dashboardRoute = dashboardBaseRoute()

  //     let defaultRoute = getDashboardRoute("account")
  //     if (process.env.NODE_ENV == "development") {
  //       defaultRoute = getDashboardRoute("site")
  //     }

  //     _.push({
  //       path: dashboardRoute,
  //       redirect: defaultRoute,
  //     })

  //     _.push({
  //       path: dashboardRoute,
  //       component: (): Promise<any> => import("./theme/wrap.vue"),
  //       children: applyFilters("dashboard-routes", [
  //         {
  //           path: "*",
  //           component: (): Promise<any> => import("./vd-404.vue"),
  //           meta: { auth: true },
  //           priority: 3000,
  //         },
  //       ]),
  //       meta: { auth: true, format: "dashboard", ui: "dashboard" },
  //     })

  //     return _
  //   },
  // })

  pushToFilter({
    key: "frame",
    hook: "dashboard-routes",
    item: {
      path: "site",
      component: (): Promise<any> => import("./v-frame.vue"),
    },
  })

  addFilter({
    key: "dashboard",
    hook: "development-menu",
    callback: (_: DashboardMenuItem[]) => {
      if (userCan({ accessLevel: 100 })) {
        _.push({
          path: `site`,
          name: "View Site",
          icon: require("./img/dashboard.svg"),
          secondary: {
            icon: "fas fa-external-link-alt",
            click: (): void => {
              const url = window?.factorFrame?.location ?? currentUrl()

              window.open(url, "_blank")
            },
          },
        })
      }

      return _
    },
  })

  addFilter({
    key: "dashboard",
    hook: "admin-menu",
    callback: (_: DashboardMenuItem[]) => {
      const { admin } = getPostTypeMenus()
      _.push(...admin)
      return _
    },
  })

  addFilter({
    key: "dashboard",
    hook: "dashboard-menu",
    callback: (_: DashboardMenuItem[]) => {
      const { dashboard } = getPostTypeMenus()
      _.push(...dashboard)
      return _
    },
  })
}

setup()
