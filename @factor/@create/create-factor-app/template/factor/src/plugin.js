// This is the standard format for a Factor extension
// Use this file to add routes, global components, config, etc.
module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("content-routes", _ => {
        _.push({
          path: "/",
          component: () => import("./v-home")
        })

        _.push({
          path: "/example",
          component: () => import("./v-example"),
          meta: {
            style: { backgroundImage: require("./img/bg.jpg"), color: "#ffffff" }
          }
        })

        return _
      })
    }
  })()
}
