export default Factor => {
  return new (class {
    constructor() {
      this.registerComponents()
    }

    registerComponents() {
      Factor.$filters.add("components", _ => {
        _["factor-btn"] = Factor.$setting.get("core.components.btn")
        _["factor-btn-app"] = Factor.$setting.get("core.components.btnApp")
        _["factor-btn-dashboard"] = Factor.$setting.get("core.components.btnDashboard")

        _["factor-modal"] = Factor.$setting.get("core.components.modal")
        _["factor-app-modal"] = Factor.$setting.get("core.components.modal")

        _["factor-loading-ring"] = Factor.$setting.get("core.components.loadingRing")
        _["factor-lightbox"] = Factor.$setting.get("core.components.lightbox")
        _["factor-link"] = Factor.$setting.get("core.components.link")

        // _["factor-btn-app"] = Factor.$setting.get("core.components.btn")
        // _["factor-app-loading-ring"] = Factor.$setting.get("core.components.loadingRing")
        // _["factor-app-modal"] = Factor.$setting.get("core.components.modal")
        // _["factor-app-lightbox"] = Factor.$setting.get("core.components.lightbox")
        // _["factor-app-link"] = Factor.$setting.get("core.components.link")

        _["factor-client-only"] = () => import("vue-client-only")

        _["factor-avatar"] = () => import("./el/avatar")

        _["factor-pop"] = () => import("./el/pop")

        _["factor-menu"] = () => import("./el/menu")
        _["factor-tag"] = () => import("./el/tag")
        _["factor-icon"] = () => import("./el/icon")
        return _
      })
    }
  })()
}
