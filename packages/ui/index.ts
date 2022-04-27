import { FactorPlugin } from "@factor/api"
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

export class FactorUi extends FactorPlugin<{}> {
  constructor() {
    super({})
  }
  setup = () => {
    return {
      name: this.constructor.name,
      paths: [this.utils.safeDirname(import.meta.url)],
    }
  }
}
