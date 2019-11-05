import { addFilter, setting } from "@factor/tools"

addFilter("components", __ => {
  __["factor-btn"] = setting("core.components.btn")
  __["factor-btn-base"] = setting("core.components.btnBase")
  __["factor-btn-dashboard"] = setting("core.components.btnDashboard")
  __["factor-modal"] = setting("core.components.modalApp")
  __["factor-modal-dashboard"] = setting("core.components.modal")
  __["factor-loading-ring"] = setting("core.components.loadingRing")
  __["factor-lightbox"] = setting("core.components.lightbox")
  __["factor-link"] = setting("core.components.link")
  __["factor-client-only"] = () => import("vue-client-only")
  __["factor-avatar"] = () => import("./el/avatar")
  __["factor-pop"] = () => import("./el/pop")\
  __["factor-menu"] = () => import("./el/menu")
  __["factor-icon"] = () => import("./el/icon")
  return __
})
