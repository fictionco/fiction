import type { FactorPluginSettings } from '@fiction/core'
import { FactorPlugin } from '@fiction/core'

export class FactorHighlightCode extends FactorPlugin<FactorPluginSettings> {
  constructor(settings: FactorPluginSettings) {
    super('highlightCode', settings)
  }
}
