import { setting } from "@factor/api/settings"
import "./directives"
import { Component } from "vue"

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
export const factorMenu = (): Promise<Component> => import("./el/menu.vue")
export const factorIcon = (): Promise<Component> => import("./el/icon.vue")
export const factorAvatar = (): Promise<Component> => import("./el/avatar.vue")
export const factorLightbox = setting("core.components.lightbox")

export const factorForm = (): Promise<Component> => import("./form/form.vue")
export const factorInputWrap = (): Promise<Component> => import("./form/wrap-input.vue")
export const factorInputEmail = (): Promise<Component> => import("./form/email.vue")
export const factorInputTags = (): Promise<Component> => import("./form/tags.vue")
export const factorInputEditor = (): Promise<Component> => import("./form/editor.vue")
export const factorInputDate = (): Promise<Component> => import("./form/date.vue")
export const factorInputPassword = (): Promise<Component> => import("./form/password.vue")
export const factorInputText = (): Promise<Component> => import("./form/text.vue")
export const factorInputTextarea = (): Promise<Component> => import("./form/textarea.vue")
export const factorInputPhone = (): Promise<Component> => import("./form/phone.vue")
export const factorInputCheckbox = (): Promise<Component> => import("./form/checkbox.vue")
export const factorInputSortable = (): Promise<Component> => import("./form/sortable.vue")

export const factorInputBirthday = (): Promise<Component> => import("./form/birthday.vue")
export const factorInputImageUpload = (): Promise<Component> =>
  import("./form/image-upload.vue")
export const factorInputSelect = (): Promise<Component> => import("./form/select.vue")
export const factorInputSubmit = (): Promise<Component> => import("./form/submit.vue")
