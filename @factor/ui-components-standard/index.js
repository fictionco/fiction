import { addFilter, setting } from "@factor/tools"

export default Factor => {
  return new (class {
    constructor() {
      this.registerComponents()
    }

    registerComponents() {
      addFilter("components", _ => {
        _["factor-btn"] = setting("core.components.btn")
        _["factor-btn-base"] = setting("core.components.btnBase")
        _["factor-btn-dashboard"] = setting("core.components.btnDashboard")

        _["factor-modal"] = setting("core.components.modalApp")
        _["factor-modal-dashboard"] = setting("core.components.modal")

        _["factor-loading-ring"] = setting("core.components.loadingRing")
        _["factor-lightbox"] = setting("core.components.lightbox")
        _["factor-link"] = setting("core.components.link")

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
