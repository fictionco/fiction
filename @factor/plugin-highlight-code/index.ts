import type { FactorPluginSettings } from '@factor/api'
import { FactorPlugin } from '@factor/api'

export class FactorHighlightCode extends FactorPlugin<FactorPluginSettings> {
  constructor(settings: FactorPluginSettings) {
    super('highlightCode', settings)
  }
}
