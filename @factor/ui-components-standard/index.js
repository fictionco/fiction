import { addFilter } from "@factor/tools"

export default Factor => {
  return new (class {
    constructor() {
      this.registerComponents()
    }

    registerComponents() {
      addFilter("components", _ => {
        _["factor-btn"] = Factor.$setting.get("core.components.btn")
        _["factor-btn-base"] = Factor.$setting.get("core.components.btnBase")
        _["factor-btn-dashboard"] = Factor.$setting.get("core.components.btnDashboard")

        _["factor-modal"] = Factor.$setting.get("core.components.modalApp")
        _["factor-modal-dashboard"] = Factor.$setting.get("core.components.modal")

        _["factor-loading-ring"] = Factor.$setting.get("core.components.loadingRing")
        _["factor-lightbox"] = Factor.$setting.get("core.components.lightbox")
        _["factor-link"] = Factor.$setting.get("core.components.link")

        _["factor-client-only"] = () => import("vue-client-only")

        _["factor-avatar"] = () => import("./el/avatar")

        _["factor-pop"] = () => import("./el/pop")

        _["factor-menu"] = () => import("./el/menu")
        // _["factor-tag"] = () => import("./el/tag")
        _["factor-icon"] = () => import("./el/icon")
        return _
      })
    }
  })()
}
