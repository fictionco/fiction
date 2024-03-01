import { FactorPlugin, FactorPluginSettings } from "@factor/api"

export class FactorHighlightCode extends FactorPlugin<FactorPluginSettings> {
  constructor(settings: FactorPluginSettings) {
    super("highlightCode", settings)
  }
}
