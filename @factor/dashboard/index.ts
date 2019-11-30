import {
  addFilter,
  applyFilters,
  toLabel,
  postTypesConfig,
  pushToFilter
} from "@factor/tools"

import { setting } from "@factor/tools/settings"
import { userCan } from "@factor/user"

pushToFilter("content-routes", {
  name: "signin",
  path: "/signin",
  component: () => import("./sign-in-view.vue")
})

pushToFilter("site-components", {
  name: "sign-in-modal",
  component: () => import("./sign-in-modal.vue")
})

export const accountMenu = () => import("./account-menu.vue")
export const dashboardPane = () => import("./pane.vue")
export const dashboardPage = () => import("./page.vue")
export const dashboardTable = () => import("./table.vue")
export const dashboardGrid = () => import("./grid.vue")
export const dashboardGridControls = () => import("./grid-controls.vue")
export const dashboardGridActions = () => import("./grid-actions.vue")
export const dashboardGridFilter = () => import("./grid-filter.vue")
export const dashboardTableControls = () => import("./table-controls.vue")
export const dashboardTableFooter = () => import("./table-footer.vue")
export const dashboardInput = () => import("./el/input.vue")
export const dashboardUserCard = () => import("./el/user-card.vue")
export const dashboardUserList = () => import("./el/user-list.vue")
export const factorInputSortable = () => import("./el/sortable.vue")

addFilter("routes", (_) => {
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
    component: () => import("./wrap.vue"),
    children: applyFilters("dashboard-routes", [
      {
        path: "admin",
        component: () => import("./vd-dashboard.vue"),
        meta: { auth: true }
      },
      {
        path: "*",
        component: () => import("./vd-404.vue"),
        meta: { auth: true },
        priority: 3000
      }
    ]),
    meta: { auth: true, format: "dashboard", ui: "dashboard" }
  })

  return _
})

addFilter(
  "admin-menu",
  (_) => {
    _.push({
      group: "admin",
      path: "admin",
      name: "Admin",
      icon: require("./resource/dashboard.svg")
    })
    return _
  },
  { priority: 50 }
)

addFilter("admin-menu", (_) => {
  postTypesConfig()
    .filter(({ showAdmin, accessLevel }) => {
      return showAdmin === false || (accessLevel && !userCan({ accessLevel }))
        ? false
        : true
    })
    .forEach(({ postType, namePlural, icon = "", add = "add-new" }) => {
      const subMenu = []

      if (add) {
        subMenu.push({ path: add, name: toLabel(add) })
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
