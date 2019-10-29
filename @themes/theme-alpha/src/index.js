import { addFilter, setting } from "@factor/tools"

export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      addFilter(
        "factor_head",
        _ => {
          const add = setting("headTags.font")

          return [..._, add]
        },
        { priority: 200 }
      )

      // POST TYPES

      const baseRoute = setting("work.postRoute")

      addFilter("post-types", _ => {
        _.push({
          postType: "work",
          baseRoute,
          icon: require("./img/work.svg"),
          model: "WorkPost",
          nameIndex: "Work",
          nameSingle: "Work Post",
          namePlural: "Work Posts"
        })

        return _
      })

      // PAGE TEMPLATES

      addFilter("page-templates", _ => {
        return _.concat([
          {
            name: "Default",
            value: "default",
            component: () => import("./page-template-default")
          }
        ])
      })

      // CONTENT ROUTES

      addFilter("content-routes", _ => {
        const routes = [
          {
            path: "/",
            component: () => import("./page-home"),
            meta: { nav: true }
          },
          {
            path: "/about",
            component: () => import("./page-about"),
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
            component: () => import("./page-contact"),
            meta: { nav: true }
          }
        ]

        return _.concat(routes)
      })
    }
  })()
}
