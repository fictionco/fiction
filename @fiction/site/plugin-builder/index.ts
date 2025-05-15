import type { FictionAdmin } from '@fiction/admin'
import type { FictionSites, SitesPluginSettings } from '..'
import { FictionPlugin, safeDirname } from '@fiction/core'

export type FictionSiteBuilderSettings = {
  fictionSites: FictionSites
  fictionAdmin: FictionAdmin
} & SitesPluginSettings

export class FictionSiteBuilder extends FictionPlugin<FictionSiteBuilderSettings> {
  constructor(settings: FictionSiteBuilderSettings) {
    const s = { ...settings, root: safeDirname(import.meta.url) }

    super('FictionSiteBuilder', s)

    this.admin()
  }

  admin() {
    const { fictionAdmin } = this.settings
    // const widgets = getWidgets()
    // const w = Object.values(widgets)
    // fictionAdmin.widgetRegister.value.push(...w)
    // fictionAdmin.addToWidgetArea('homeMain', w.map(widget => ({ key: widget.key, priority: widget.settings.priority })))
  }
}
