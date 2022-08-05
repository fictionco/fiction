import { FactorPlugin, FactorPluginSettings, emitEvent } from "@factor/api"

export class FactorNotify extends FactorPlugin<FactorPluginSettings> {
  root = this.utils.safeDirname(import.meta.url)
  constructor(settings: FactorPluginSettings) {
    super("notify", settings)
    settings.factorEnv?.uiPaths.push(`${this.root}/*.vue`)
  }

  notifySuccess(message: string) {
    emitEvent("notify", {
      type: "success",
      message,
    })
  }
}
