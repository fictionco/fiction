import { addFilter, setting, addContentRoutes, addPostType } from "@factor/api"
import { addPageTemplate } from "@factor/templates"
import { Component } from "vue"

const baseRoute = setting("work.postRoute")

addFilter({
  key: "alphaFont",
  hook: "factor_head",
  callback: (_: string[]) => {
    return [..._, setting("headTags.font")]
  },
  priority: 200,
})

/*
 * Sets admin and CMS
 */

addPostType({
  postType: "work",
  baseRoute,
  icon: require("./img/dashicon-work.svg"),
  nameIndex: "Work",
  nameSingle: "Work Post",
  namePlural: "Work Posts",
  customPermalink: true,
  templateSettings: setting("work.templateSettings"),
})

/**
 * Page templates
 */
addPageTemplate({
  slug: "default",
  component: (): Promise<Component> => import("./page-template-default.vue"),
})

/*
 * The front end routes
 */
addContentRoutes({
  key: "alphaRoutes",
  routes: [
    {
      path: "/",
      component: setting("home.component"),
      meta: { nav: true },
    },
    {
      path: "/about",
      component: setting("about.component"),
      meta: { nav: true },
    },
    {
      path: setting("work.indexRoute") ?? "/",
      component: setting("work.components.workWrap"),
      children: [
        {
          path: "/",
          component: setting("work.components.workIndex"),
        },
        {
          path: `${setting("work.postRoute")}/:permalink`,
          component: setting("work.components.workSingle"),
        },
      ],
    },
    {
      path: "/contact",
      component: setting("contact.component"),
      meta: { nav: true },
    },
  ],
})
