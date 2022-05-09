import { FactorPlugin, FactorApp} from "@factor/api"
import { Component } from "vue"

type FactorUiSettings = {
  factorApp: FactorApp
}
export class FactorUi extends FactorPlugin<FactorUiSettings> {
  factorApp: FactorApp
  root = this.utils.safeDirname(import.meta.url)
  ui: Record<string, () => Promise<Component>> = {
    ElAvatar: () => import("./ElAvatar.vue"),
    ElButton: () => import("./ElButton.vue"),
    ElForm: () => import("./ElForm.vue"),
    ElInput: () => import("./ElInput.vue"),
    ElSpinner: () => import("./ElSpinner.vue"),
    ElModal: () => import("./ElModal.vue"),
    InputEmail: () => import("./InputEmail.vue"),
    InputOneTimeCode: () => import("./InputOneTimeCode.vue"),
    InputText: () => import("./InputText.vue"),
    InputUrl: () => import("./InputUrl.vue"),
    InputDomain: () => import("./InputDomain.vue"),
    InputToggle: () => import("./InputToggle.vue"),
    InputCheckbox: () => import("./InputCheckbox.vue"),
    InputCheckboxMulti: () => import("./InputCheckboxMulti.vue"),
    InputRadio: () => import("./InputRadio.vue"),
    InputRadioButton: () => import("./InputRadioButton.vue"),
    InputSelect: () => import("./InputSelect.vue"),
    InputSelectCustom: () => import("./InputSelectCustom.vue"),
    InputSelectMulti: () => import("./InputSelectMulti.vue"),
    InputTimezone: () => import("./InputTimezone.vue"),
    InputPrice: () => import("./InputPrice.vue"),
    InputPhone: () => import("./InputPhone.vue"),
    InputSubmit: () => import("./InputSubmit.vue"),
    InputPassword: () => import("./InputPassword.vue"),
    InputTextarea: () => import("./InputTextarea.vue"),
    InputWeight: () => import("./InputWeight.vue"),
    InputNumber: () => import("./InputNumber.vue"),
  }
  constructor(settings: FactorUiSettings) {
    super(settings)
    this.factorApp = settings.factorApp

    this.factorApp.addUiPaths([`${this.root}/*.vue`])
    this.factorApp.addUi(this.ui)
  }
  setup() {}
}
