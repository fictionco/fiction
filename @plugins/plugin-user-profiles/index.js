import { addFilter } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      addFilter("content-routes-unmatched", _ => {
        _.unshift({
          path: "/@",
          component: () => import("./profile")
        })
        _.unshift({
          path: "/@:username",
          component: () => import("./profile")
        })

        return _
      })

      // addFilter("post-params", params => {
      //   const { username } = params
      //   if (username) {
      //     params = {
      //       ...params,
      //       permalink: username,
      //       field: "username"
      //     }
      //   }
      //   return params
      // })

      addFilter(
        "profile-menu",
        _ => {
          _.unshift({
            items: [
              {
                path: "/dashboard",
                name: "Dashboard"
              },
              {
                path: "/@",
                name: "View Profile"
              }
            ]
          })

          return _
        },
        { priority: 1000 }
      )
    }
  })()
}
