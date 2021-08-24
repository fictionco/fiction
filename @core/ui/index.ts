import { defineAsyncComponent as def } from "vue"

export const elements = {
  form: def(() => import("@factor/ui/ElemForm.vue")),
  button: def(() => import("@factor/ui/ElemButton.vue")),
  input: def(() => import("@factor/ui/ElemInput.vue")),
  modal: def(() => import("@factor/ui/ElemModal.vue")),
  spinner: def(() => import("@factor/ui/ElemSpinner.vue")),
  avatar: def(() => import("@factor/ui/ElemAvatar.vue")),
}

export const inputs = {
  email: def(() => import("@factor/ui/InputEmail.vue")),
  oneTimeCode: def(() => import("@factor/ui/InputOneTimeCode.vue")),
  text: def(() => import("@factor/ui/InputText.vue")),
  url: def(() => import("@factor/ui/InputUrl.vue")),
  domain: def(() => import("@factor/ui/InputDomain.vue")),
  toggle: def(() => import("@factor/ui/InputToggle.vue")),
  checkbox: def(() => import("@factor/ui/InputCheckbox.vue")),
  checkboxMulti: def(() => import("@factor/ui/InputCheckboxMulti.vue")),
  radio: def(() => import("@factor/ui/InputRadio.vue")),
  radioButton: def(() => import("@factor/ui/InputRadioButton.vue")),
  select: def(() => import("@factor/ui/InputSelect.vue")),
  selectCustom: def(() => import("@factor/ui/InputSelectCustom.vue")),
  multi: def(() => import("@factor/ui/InputSelectMulti.vue")),
  timezone: def(() => import("@factor/ui/InputTimezone.vue")),
  price: def(() => import("@factor/ui/InputPrice.vue")),
  phone: def(() => import("@factor/ui/InputPhone.vue")),
  submit: def(() => import("@factor/ui/InputSubmit.vue")),
  password: def(() => import("@factor/ui/InputPassword.vue")),
  textarea: def(() => import("@factor/ui/InputTextarea.vue")),
  weight: def(() => import("@factor/ui/InputWeight.vue")),
  number: def(() => import("@factor/ui/InputNumber.vue")),
}
