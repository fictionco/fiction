import { FactorPlugin, emitEvent } from "@factor/api"

export class FactorNotify extends FactorPlugin<{}> {
  constructor() {
    super({})
  }
  setup() {}

  notifySuccess(message: string) {
    emitEvent("notify", {
      type: "success",
      message,
    })
  }
}
