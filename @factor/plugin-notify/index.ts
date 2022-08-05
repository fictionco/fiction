import { FactorPlugin, FactorPluginSettings, emitEvent } from "@factor/api"

export class FactorNotify extends FactorPlugin<FactorPluginSettings> {
  constructor(settings: FactorPluginSettings) {
    super("notify", settings)
  }

  notifySuccess(message: string) {
    emitEvent("notify", {
      type: "success",
      message,
    })
  }
}
