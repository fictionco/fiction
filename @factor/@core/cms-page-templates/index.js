export default Factor => {
  return new (class {
    constructor() {
      // image require wont work outside webpack
      const icon = Factor.FACTOR_TARGET == "app" ? require("./img/pages.svg") : ""

      Factor.$filters.add("post-types", _ => {
        _.unshift({
          type: "page",
          base: "",
          icon,
          nameIndex: "Pages",
          nameSingle: "Page",
          namePlural: "Pages"
        })
        return _
      })

      Factor.$filters.add("post-edit-components", _ => {
        _.push({
          type: ["page"],
          name: "Page Template Settings",
          component: () => import("./edit")
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
  })()
}
