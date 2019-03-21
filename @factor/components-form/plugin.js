export default Factor => {
  return new class {
    constructor() {
      this.registerComponents()
    }

    registerComponents() {
      Factor.$filters.add("components", _ => {
        _["factor-form"] = () => import("./el/form")
        _["factor-input-email"] = () => import("./el/email")
        _["factor-input-password"] = () => import("./el/password")
        _["factor-input-text"] = () => import("./el/text")

        return _
      })
    }
  }()
}
