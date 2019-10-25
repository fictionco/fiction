// This is the standard format for a Factor extension
// Use this file to add routes, global components, config, etc.
import Factor from "@factor/core"
export default () => {
  return new (class {
    constructor() {
      // Here is where you can add routes/pages
      // Or use filters to control anything in your app

      Factor.$filters.push("content-routes", {
        path: "/",
        component: () => import("./index.vue")
      })
    }
  })()
}
