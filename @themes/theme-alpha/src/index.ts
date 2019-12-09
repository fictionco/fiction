import { addFilter, setting, addContentRoutes, addPostType } from "@factor/tools"
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

  // POST TYPES

  const baseRoute = setting("work.postRoute")

  addPostType({
    postType: "work",
    baseRoute,
    icon: require("./img/work.svg"),
    model: "WorkPost",
    nameIndex: "Work",
    nameSingle: "Work Post",
    namePlural: "Work Posts"
  })

  // PAGE TEMPLATES

  addPageTemplate({
    _id: "default",
    component: (): Promise<Component> => import("./page-template-default.vue")
  })

  // CONTENT ROUTES

  addContentRoutes({
    key: "alphaRoutes",
    routes: [
      {
        path: "/",
        component: (): Promise<Component> => import("./page-home.vue"),
        meta: { nav: true }
      },
      {
        path: "/about",
        component: (): Promise<Component> => import("./page-about.vue"),
        meta: { nav: true }
      },
      {
        path: setting("work.indexRoute"),
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
