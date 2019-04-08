export default Factor => {
  return new class {
    constructor() {
      this.filters()
    }

    filters() {
      // Factor.$filters.add("dashboard-routes", _ => {
      //   _.push({
      //     path: "account",
      //     component: () => import("./edit")
      //   })
      //   return _
      // })
      // Factor.$filters.add("dashboard-menu", _ => {
      //   _.push({
      //     group: "account",
      //     path: "account",
      //     name: "Your Account"
      //   })
      //   return _
      // })
    }
  }()
}
