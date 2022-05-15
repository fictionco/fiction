import { FactorPlugin, FactorApp, vue } from "@factor/api"
import { inputs } from "./inputs"
const def = vue.defineAsyncComponent
type FactorUiSettings = {
  factorApp: FactorApp
}

export * from "./inputs"

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
