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
  }
}
