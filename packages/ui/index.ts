import { FactorPlugin } from "@factor/api"
import { FactorApp } from "@factor/api/plugin-app"
import { Component } from "vue"

export const inputs: Record<string, () => Promise<Component>> = {
  email: () => import("./InputEmail.vue"),
  oneTimeCode: () => import("./InputOneTimeCode.vue"),
  text: () => import("./InputText.vue"),
  url: () => import("./InputUrl.vue"),
  domain: () => import("./InputDomain.vue"),
  toggle: () => import("./InputToggle.vue"),
  checkbox: () => import("./InputCheckbox.vue"),
  checkboxMulti: () => import("./InputCheckboxMulti.vue"),
  radio: () => import("./InputRadio.vue"),
  radioButton: () => import("./InputRadioButton.vue"),
  select: () => import("./InputSelect.vue"),
  selectCustom: () => import("./InputSelectCustom.vue"),
  multi: () => import("./InputSelectMulti.vue"),
  timezone: () => import("./InputTimezone.vue"),
  price: () => import("./InputPrice.vue"),
  phone: () => import("./InputPhone.vue"),
  submit: () => import("./InputSubmit.vue"),
  password: () => import("./InputPassword.vue"),
  textarea: () => import("./InputTextarea.vue"),
  weight: () => import("./InputWeight.vue"),
  number: () => import("./InputNumber.vue"),
}

type FactorUiSettings = {
  factorApp: FactorApp
}
export class FactorUi extends FactorPlugin<FactorUiSettings> {
  factorApp: FactorApp
  root = this.utils.safeDirname(import.meta.url)
  constructor(settings: FactorUiSettings) {
    super(settings)
    this.factorApp = settings.factorApp

    this.factorApp.addUiPaths([`${this.root}/*.vue`])
  }
  setup = () => {
    return {
      name: this.constructor.name,
    }
  }
}
