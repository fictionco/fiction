import {
  addFilter,
  applyFilters,
  setting,
  toLabel,
  postTypesConfig,
  pushToFilter
} from "@factor/tools"
import { userCan } from "@factor/user"

pushToFilter("content-routes", {
  name: "signin",
  path: "/signin",
  component: () => import("./sign-in-view.vue")
})

pushToFilter("global-components", {
  name: "account-menu",
  component: () => import("./account-menu.vue")
})

pushToFilter("site-components", {
  name: "plugin-sign-in-modal",
  component: () => import("./sign-in-modal.vue")
})

addFilter("components", _ => {
  _["dashboard-pane"] = () => import("./pane.vue")
  _["dashboard-page"] = () => import("./page.vue")
  _["dashboard-table"] = () => import("./table.vue")
  _["dashboard-grid"] = () => import("./grid.vue")
  _["dashboard-grid-controls"] = () => import("./grid-controls.vue")
  _["dashboard-grid-actions"] = () => import("./grid-actions.vue")
  _["dashboard-grid-filter"] = () => import("./grid-filter.vue")
  _["dashboard-table-controls"] = () => import("./table-controls.vue")
  _["dashboard-table-footer"] = () => import("./table-footer.vue")
  _["dashboard-input"] = () => import("./el/input.vue")
  _["dashboard-loader"] = () => import("./el/loader.vue")
  _["dashboard-user-card"] = () => import("./el/user-card.vue")
  _["dashboard-user-list"] = () => import("./el/user-list.vue")
  _["factor-input-sortable"] = () => import("./el/sortable.vue")
  return _
})

const dashboardRoute = setting("dashboard.route")

addFilter("routes", _ => {
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
  _ => {
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

addFilter("admin-menu", _ => {
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
