import { addFilter } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      addFilter("site-components", _ => {
        _["plugin-ssr-bar"] = () => import("./ssr-progress-bar.vue")

        return _
      })
    }
  })()
}
