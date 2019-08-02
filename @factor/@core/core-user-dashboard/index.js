export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      Factor.$filters.add("dashboard-routes", _ => {
        _.push({
          path: "account",
          component: () => import("./account"),
          meta: {
            postType: "user"
          }
        })

        return _
      })
      Factor.$filters.add("dashboard-menu", _ => {
        _.push({
          group: "account",
          path: "account",
          name: "Your Account",
          icon: require("./img/users.svg")
        })

        return _
      })

      Factor.$filters.add("post-types", _ => {
        _.push({
          postType: "user",
          baseRoute: "@",
          icon: require("./img/users.svg"),
          populated: ["covers"],
          nameIndex: "Users",
          nameSingle: "User",
          namePlural: "Users",
          accessLevel: 500,
          listTemplate: () => import("./list"),
          editTemplate: () => import("./edit.vue"),
          add: false
        })

        return _
      })
    }
  })()
}
