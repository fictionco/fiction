import { FactorPlugin, FactorApp, vue } from "@factor/api"

const def = vue.defineAsyncComponent
type FactorUiSettings = {
  factorApp: FactorApp
}

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
}

export const els = {
  ElAvatar: def(() => import("./ElAvatar.vue")),
  ElButton: def(() => import("./ElButton.vue")),
  ElForm: def(() => import("./ElForm.vue")),
  ElInput: def(() => import("./ElInput.vue")),
  ElSpinner: def(() => import("./ElSpinner.vue")),
  ElModal: def(() => import("./ElModal.vue")),
}

export class FactorUi extends FactorPlugin<FactorUiSettings> {
  factorApp: FactorApp
  root = this.utils.safeDirname(import.meta.url)
  ui: Record<string, vue.Component> = inputs
  constructor(settings: FactorUiSettings) {
    super(settings)
    this.factorApp = settings.factorApp

    this.factorApp.addUiPaths([`${this.root}/*.vue`])
  }
  setup() {}
}
