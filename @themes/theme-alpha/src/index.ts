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
  })

  // page templates

  addPageTemplate({
    slug: "default",
    component: (): Promise<Component> => import("./page-template-default.vue")
  })

  addPageTemplate({
    name: "Landing Page",
    slug: "landing-page",
    component: (): Promise<Component> => import("./page-template-landing.vue")
  })

  // content routes

  addContentRoutes({
    key: "alphaRoutes",
    routes: [
      {
        path: "/",
        component: (): Promise<Component> => import("./home/v-home.vue"),
        meta: { nav: true }
      },
      {
        path: "/about",
        component: (): Promise<Component> => import("./about/v-about.vue"),
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
        component: (): Promise<Component> => import("./page-contact.vue"),
        meta: { nav: true }
      }
    ]
  })
}

setup()
