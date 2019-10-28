export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      Factor.$filters.add(
        "factor_head",
        _ => {
          const add = Factor.$setting.get("headTags.font")

          return [..._, add]
        },
        { priority: 200 }
      )

      // POST TYPES

      const baseRoute = Factor.$setting.get("work.postRoute")

      Factor.$filters.add("post-types", _ => {
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

      Factor.$filters.add("page-templates", _ => {
        return _.concat([
          {
            name: "Default",
            value: "default",
            component: () => import("./page-template-default")
          }
        ])
      })

      // CONTENT ROUTES

      Factor.$filters.add("content-routes", _ => {
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
            path: Factor.$setting.get("work.indexRoute"),
            component: Factor.$setting.get("work.components.workWrap"),
            children: [
              {
                path: "/",
                component: Factor.$setting.get("work.components.workIndex")
              },
              {
                path: `${Factor.$setting.get("work.postRoute")}/:permalink`,
                component: Factor.$setting.get("work.components.workSingle")
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
