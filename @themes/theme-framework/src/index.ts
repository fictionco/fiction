import { addFilter, setting, addContentRoutes } from "@factor/api"
import { addPageTemplate } from "@factor/templates"

addFilter({
  key: "frameworkThemeFont",
  hook: "factor_head",
  callback: (_: string[]) => {
    return [..._, setting("headTags.font")]
  },
  priority: 200,
})

/**
 * Page templates
 */
addPageTemplate({
  slug: "default",
  component: (): Promise<any> => import("./page-template-default.vue"),
})

/*
 * The front end routes
 */
addContentRoutes({
  key: "frameworkThemeRoutes",
  routes: [
    {
      path: "/",
      component: setting("home.component"),
      meta: { nav: true },
    },
    // {
    //   path: "/blog",
    //   component: setting("blog.component"),
    //   meta: { nav: true },
    // },
    // {
    //   path: "/jobs",
    //   component: setting("jobs.component"),
    //   meta: { nav: true },
    // },
    {
      path: "/contact",
      component: setting("contact.component"),
      meta: { nav: true },
    },
  ],
})
