import { pushToFilter } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      pushToFilter("dashboard-routes", {
        path: "account",
        component: () => import("./account"),
        meta: {
          postType: "user"
        }
      })
      pushToFilter("dashboard-menu", {
        group: "account",
        path: "account",
        name: "Your Account",
        icon: require("./img/users.svg")
      })

      pushToFilter("post-types", {
        postType: "user",
        icon: require("./img/users.svg"),
        nameIndex: "Users",
        nameSingle: "User",
        namePlural: "Users",
        listTemplate: () => import("./list"),
        editTemplate: () => import("./edit.vue"),
        baseRoute: "@",
        accessLevel: 500,
        add: false
      })
    }
  })()
}
