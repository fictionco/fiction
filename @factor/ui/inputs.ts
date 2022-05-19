import { vue } from "@factor/api"

const def = vue.defineAsyncComponent

export const inputs = {
  InputEmail: def(() => import("./InputEmail.vue")),
  InputOneTimeCode: def(() => import("./InputOneTimeCode.vue")),
  InputText: def(() => import("./InputText.vue")),
  InputUrl: def(() => import("./InputUrl.vue")),
  InputToggle: def(() => import("./InputToggle.vue")),
  InputCheckbox: def(() => import("./InputCheckbox.vue")),
  InputCheckboxMulti: def(() => import("./InputCheckboxMulti.vue")),
  InputRadio: def(() => import("./InputRadio.vue")),
  InputRadioButton: def(() => import("./InputRadioButton.vue")),
  InputSelect: def(() => import("./InputSelect.vue")),
  InputSelectCustom: def(() => import("./InputSelectCustom.vue")),
  InputSelectMulti: def(() => import("./InputSelectMulti.vue")),
  InputTimezone: def(() => import("./InputTimezone.vue")),
  InputPrice: def(() => import("./InputPrice.vue")),
  InputPhone: def(() => import("./InputPhone.vue")),
  InputSubmit: def(() => import("./InputSubmit.vue")),
  InputPassword: def(() => import("./InputPassword.vue")),
  InputTextarea: def(() => import("./InputTextarea.vue")),
  InputWeight: def(() => import("./InputWeight.vue")),
  InputNumber: def(() => import("./InputNumber.vue")),
  InputMedia: def(() => import("./InputMedia.vue")),
}
