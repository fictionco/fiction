export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      Factor.$filters.push("dashboard-routes", {
        path: "account",
        component: () => import("./account"),
        meta: {
          postType: "user"
        }
      })
      Factor.$filters.push("dashboard-menu", {
        group: "account",
        path: "account",
        name: "Your Account",
        icon: require("./img/users.svg")
      })

      Factor.$filters.push("post-types", {
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
