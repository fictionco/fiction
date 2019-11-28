import { setting } from "@factor/tools/settings"
import "./directives"
import Vue from "vue"

export const factorError404 = setting("app.components.error404")
export const factorContent = setting("app.components.content")
export const factorSite = setting("app.components.site")

export const factorLink = setting("core.components.link")
export const factorBtn = setting("core.components.btn")
export const factorBtnBase = setting("core.components.btnBase")
export const factorBtnDashboard = setting("core.components.btnDashboard")
export const factorModal = setting("core.components.modalApp")
export const factorModalDashboard = setting("core.components.modal")
export const factorLoadingRing = setting("core.components.loadingRing")
export const factorMenu = (): Promise<Vue> => import("./el/menu.vue")
export const factorIcon = (): Promise<Vue> => import("./el/icon.vue")
export const factorAvatar = (): Promise<Vue> => import("./el/avatar.vue")
export const factorLightbox = setting("core.components.lightbox")

export const factorForm = (): Promise<Vue> => import("./form/form.vue")
export const factorInputWrap = (): Promise<Vue> => import("./form/wrap-input.vue")
export const factorInputEmail = (): Promise<Vue> => import("./form/email.vue")
export const factorInputDate = (): Promise<Vue> => import("./form/date.vue")
export const factorInputPassword = (): Promise<Vue> => import("./form/password.vue")
export const factorInputText = (): Promise<Vue> => import("./form/text.vue")
export const factorInputTextarea = (): Promise<Vue> => import("./form/textarea.vue")
export const factorInputPhone = (): Promise<Vue> => import("./form/phone.vue")
export const factorInputCheckbox = (): Promise<Vue> => import("./form/checkbox.vue")
export const factorInputBirthday = (): Promise<Vue> => import("./form/birthday.vue")
export const factorInputImageUpload = (): Promise<Vue> =>
  import("./form/image-upload.vue")
export const factorInputSelect = (): Promise<Vue> => import("./form/select.vue")
export const factorInputSubmit = (): Promise<Vue> => import("./form/submit.vue")
