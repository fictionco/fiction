export default Factor => {
  return new class {
    constructor() {
      Factor.$filters.add("post-edit-components", _ => {
        _.push({
          type: ["page"],
          name: "Page Template Settings",
          component: () => import("./edit")
        })

        return _
      })

      Factor.$filters.add("post-edit-meta", _ => {
        _.push({
          type: ["page"],
          name: "Set Page Template",
          component: () => import("./set")
        })

        return _
      })

      Factor.$filters.add("content-routes-unmatched", _ => {
        _.unshift({
          path: "/:permalink",
          component: () => import("./template")
        })

        return _
      })
    }
  }()
}
