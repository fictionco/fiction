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

export type InputColorTheme = "standard" | "overlay"
export const inputTheme = (theme: InputColorTheme = "standard"): string => {
  if (theme == "overlay") {
    return "border-white placeholder:text-white placeholder:text-opacity-50 bg-black bg-opacity-10 focus:ring-white focus:border-white disabled:bg-opacity-10 disabled:bg-white"
  } else {
    return "border-slate-400 placeholder:text-slate-400 focus:ring-primary-500 focus:border-primary-500  disabled:text-slate-500 disabled:bg-slate-50"
  }
}
