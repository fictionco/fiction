export default Factor => {
  return new class {
    constructor() {
      this.filters()
    }

    filters() {
      Factor.$filters.add("post-types", _ => {
        _.push({
          type: "user",
          base: "@",
          icon: require("./img/posts.svg"),
          nameIndex: "Users",
          nameSingle: "User",
          namePlural: "Users",
          accessLevel: 500,
          index: () => import("./table"),
          edit: () => import("./edit.vue"),
          add: false
        })

        return _
      })
    }
  }()
}
