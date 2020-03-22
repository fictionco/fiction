import { addFilter, setting, addContentRoutes, addPostType } from "@factor/api"
import { addPageTemplate } from "@factor/templates"
import { Component } from "vue"

export const setup = (): void => {
  addFilter({
    key: "alphaFont",
    hook: "factor_head",
    callback: (_: string[]) => {
      return [..._, setting("headTags.font")]
    },
    priority: 200
  })

  // post types
  const baseRoute = setting("work.postRoute")

  addPostType({
    postType: "work",
    baseRoute,
    icon: require("./img/dashicon-work.svg"),
    nameIndex: "Work",
    nameSingle: "Work Post",
    namePlural: "Work Posts",
    templateSettings: setting("work.templateSettings")
  })

  // page templates

  addPageTemplate({
    slug: "default",
    component: (): Promise<Component> => import("./page-template-default.vue")
  })

  // content routes

  addContentRoutes({
    key: "alphaRoutes",
    routes: [
      {
        path: "/",
        component: setting("home.component"),
        meta: { nav: true }
      },
      {
        path: "/about",
        component: setting("about.component"),
        meta: { nav: true }
      },
      {
        path: setting("work.indexRoute") ?? "/",
        component: setting("work.components.workWrap"),
        children: [
          {
            path: "/",
            component: setting("work.components.workIndex")
          },
          {
            path: `${setting("work.postRoute")}/:permalink`,
            component: setting("work.components.workSingle")
          }
        ]
      },
      {
        path: "/contact",
        component: setting("contact.component"),
        meta: { nav: true }
      }
    ]
  })
}

setup()
