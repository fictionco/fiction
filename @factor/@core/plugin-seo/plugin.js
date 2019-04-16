export default Factor => {
  return new class {
    constructor() {
      Factor.$filters.add("post-edit-components", _ => {
        _.push({
          name: "SEO and Sharing",
          component: () => import("./edit")
        })

        return _
      })
    }
  }()
}
