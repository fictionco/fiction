import { addFilter } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      // PAGE TEMPLATES

      addFilter("page-templates", _ => {
        return _.concat([
          {
            name: "Default",
            value: "default",
            component: () => import("./page-template-default.vue")
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
            path: "/elements",
            component: () => import("./page-elements"),
            meta: { nav: true }
          }
        ]

        return _.concat(routes)
      })
    }
  })()
}
