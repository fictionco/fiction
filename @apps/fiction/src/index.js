module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.addPaths()
      this.events()
    }

    events() {
      // // Track email sign up events
      // Factor.$events.$on("email-list-new-email-added", ({ email, listId }) => {
      //   Factor.$http.request({
      //     method: "post",
      //     url:
      //       "https://hooks.slack.com/services/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",
      //     data: {
      //       text: `New email [${email}] added to [${listId}]`
      //     }
      //   })
      // })
    }

    async addPaths() {
      Factor.$filters.add("page-templates", _ => {
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

      Factor.$filters.add("content-routes", _ => {
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
