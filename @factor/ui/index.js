import { addFilter, setting } from "@factor/tools"
import "./directives"

addFilter("components", __ => {
  // Forms / Inputs
  __["factor-form"] = () => import("./form/form.vue")
  __["factor-input-wrap"] = () => import("./form/wrap-input.vue")
  __["factor-input-email"] = () => import("./form/email.vue")
  __["factor-input-date"] = () => import("./form/date.vue")
  __["factor-input-password"] = () => import("./form/password.vue")
  __["factor-input-text"] = () => import("./form/text.vue")
  __["factor-input-textarea"] = () => import("./form/textarea.vue")
  __["factor-input-phone"] = () => import("./form/phone.vue")
  __["factor-input-checkbox"] = () => import("./form/checkbox.vue")
  __["factor-input-birthday"] = () => import("./form/birthday.vue")
  __["factor-input-image-upload"] = () => import("./form/image-upload.vue")
  __["factor-input-select"] = () => import("./form/select.vue")
  __["factor-input-submit"] = () => import("./form/submit.vue")

  // UI
  __["factor-btn"] = setting("core.components.btn")
  __["factor-btn-base"] = setting("core.components.btnBase")
  __["factor-btn-dashboard"] = setting("core.components.btnDashboard")
  __["factor-modal"] = setting("core.components.modalApp")
  __["factor-modal-dashboard"] = setting("core.components.modal")
  __["factor-loading-ring"] = setting("core.components.loadingRing")
  __["factor-lightbox"] = setting("core.components.lightbox")
  __["factor-link"] = setting("core.components.link")
  __["factor-avatar"] = () => import("./el/avatar.vue")
  __["factor-menu"] = () => import("./el/menu.vue")
  __["factor-icon"] = () => import("./el/icon.vue")

  return __
})
