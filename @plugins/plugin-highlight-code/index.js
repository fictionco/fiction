import { addFilter } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      addFilter("components", _ => {
        _["plugin-highlight-code"] = () => import("./highlight-code.vue")

        return _
      })
    }
  })()
}
