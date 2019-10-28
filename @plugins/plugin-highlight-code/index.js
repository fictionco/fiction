export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("components", _ => {
        _["plugin-highlight-code"] = () => import("./highlight-code.vue")

        return _
      })
    }
  })()
}
