import "./plugins/extension-server"
import { addFilter, setting, addRoutes } from "@factor/tools"

// Register doc routes for sitemap
addFilter("after-first-server-extend", () => {
  const base = setting("docs.base")
  const pages = setting("docs.pages")
  const canonical = pages
    .map(p => {
      return p.doc
        ? { path: `/${base}/${p.doc}`, component: () => import("./page-docs.vue") }
        : ""
    })
    .filter(_ => _)

  // Add canonical routes (sitemaps, etc)
  addRoutes(canonical)
})

addFilter("page-templates", _ => {
  return _.concat([
    {
      _id: "default",
      component: () => import("./page-template-default.vue")
    }
  ])
})

addFilter("content-routes", _ => {
  const base = setting("docs.base")

  return [
    ..._,
    // {
    //   path: "/plugins",
    //   component: () => import("./page-plugins")
    // },
    // {
    //   path: "/themes",
    //   component: () => import("./v-themes")
    // },
    {
      path: "/compare",
      component: () => import("./page-compare.vue")
    },
    {
      path: "/",
      component: () => import("./home/v-home.vue")
    },
    {
      path: `/${base}`,
      component: () => import("./page-docs.vue")
    },
    {
      path: `/${base}/:doc`,
      component: () => import("./page-docs.vue")
    },
    {
      path: `/themes`,
      component: () => import("./themes/themes-wrap.vue"),
      children: [
        {
          path: `/`,
          component: () => import("./themes/v-themes.vue")
        },
        {
          path: `/theme/:slug`,
          component: () => import("./themes/theme-single.vue")
        }
      ]
    },
    {
      path: `/plugins`,
      component: () => import("./plugins/plugins-wrap.vue"),
      children: [
        {
          path: `/`,
          component: () => import("./plugins/v-plugins.vue")
        },
        {
          path: `/plugin/:slug`,
          component: () => import("./plugins/plugin-single.vue")
        }
      ]
    }
  ]
})
