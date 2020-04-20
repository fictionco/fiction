import { setting } from "@factor/api/settings"
import "./directives"

export const factorError404 = setting("app.components.error404")
export const factorContent = setting("app.components.content")
export const factorSite = setting("app.components.site")

export const factorLink = setting("core.components.link")
export const factorBtn = setting("core.components.btn")
export const factorBtnBase = setting("core.components.btnBase")
export const factorBtnDashboard = setting("core.components.btnDashboard")
export const factorModal = setting("core.components.modalApp")
export const factorModalDashboard = setting("core.components.modal")
// factorLoadingRing @deprecate 2.0
export const factorLoadingRing = setting("core.components.spinner")
export const factorSpinner = setting("core.components.spinner")
export const factorMenu = (): Promise<any> => import("./el/menu.vue")
export const factorIcon = (): Promise<any> => import("./el/icon.vue")
export const factorAvatar = (): Promise<any> => import("./el/avatar.vue")
export const factorLightbox = setting("core.components.lightbox")

export const factorForm = (): Promise<any> => import("./form/form.vue")
export const factorInputWrap = (): Promise<any> => import("./form/wrap-input.vue")
export const factorInputEmail = (): Promise<any> => import("./form/email.vue")
export const factorInputTags = (): Promise<any> => import("./form/tags.vue")
export const factorInputEditor = (): Promise<any> => import("./form/editor.vue")
export const factorInputDate = (): Promise<any> => import("./form/date.vue")
export const factorInputPassword = (): Promise<any> => import("./form/password.vue")
export const factorInputText = (): Promise<any> => import("./form/text.vue")
export const factorInputTextarea = (): Promise<any> => import("./form/textarea.vue")
export const factorInputPhone = (): Promise<any> => import("./form/phone.vue")
export const factorInputCheckbox = (): Promise<any> => import("./form/checkbox.vue")
export const factorInputSortable = (): Promise<any> => import("./form/sortable.vue")

export const factorInputBirthday = (): Promise<any> => import("./form/birthday.vue")
export const factorInputImageUpload = (): Promise<any> =>
  import("./form/image-upload.vue")
export const factorInputSelect = (): Promise<any> => import("./form/select.vue")
export const factorInputSubmit = (): Promise<any> => import("./form/submit.vue")
