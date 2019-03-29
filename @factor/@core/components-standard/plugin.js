export default Factor => {
  return new class {
    constructor() {
      this.registerComponents()
    }

    registerComponents() {
      Factor.$filters.add("components", _ => {
        _["factor-link"] = () => import("./el/link")
        _["factor-btn"] = () => import("./el/btn")
        _["factor-modal"] = () => import("./el/modal")
        _["factor-lightbox"] = () => import("./el/lightbox")
        _["factor-avatar"] = () => import("./el/avatar")
        _["factor-loading-ring"] = () => import("./el/loading-ring")
        _["factor-pop"] = () => import("./el/pop")
        _["factor-logo"] = () => import("./el/logo")
        _["factor-card-user"] = () => import("./el/card-user")
        return _
      })
    }
  }()
}
