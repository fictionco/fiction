import { addFilter } from "@factor/tools"

export default Factor => {
  return new (class {
    constructor() {
      this.addPaths()
    }

    async addPaths() {
      addFilter("page-templates", _ => {
        return _.concat([
          {
            _id: "sticky-sidebar",
            component: () => import("./tpl-sticky-sidebar")
          },
          {
            _id: "landing-page",
            component: () => import("./tpl-landing-page")
          }
        ])
      })

      addFilter("content-routes", _ => {
        const routes = [
          {
            path: "/",
            component: () => import("./v-home/v-home")
          },
          {
            path: "/factor-js",
            component: () => import("./v-tour/page-tour"),
            meta: { nav: true }
          },
          {
            path: "/vip",
            component: () => import("./v-vip-2/v-vip")
          },
          {
            path: "/contact",
            component: () => import("./page-contact"),
            meta: { background: "#fafbff" }
          },
          {
            path: "/chat",
            component: () => import("./page-chat"),
            meta: { background: "#f7f9ff", auth: true }
          }
        ]

        return _.concat(routes)
      })
    }
  })()
}
