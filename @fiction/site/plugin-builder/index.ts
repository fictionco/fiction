import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import type { FictionAdmin } from '@fiction/admin'
import { Obj } from '@fiction/core/obj'
import type { FictionSites, SitesPluginSettings } from '..'
import { createCard } from '..'
import { getWidgets } from './widgets/index.js'

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
    const widgets = getWidgets(this.settings)
    const w = Object.values(widgets)
    fictionAdmin.widgetRegister.value.push(...w)
    fictionAdmin.addToWidgetArea('homeMain', w.map(widget => widget.key))

    fictionAdmin.addAdminPages(({ templates }) => [
      createCard({
        templates,
        regionId: 'main',
        templateId: 'dash',
        slug: 'sites',
        title: 'Sites',
        cards: [createCard({ el: vue.defineAsyncComponent(() => import('./ViewIndex.vue')) })],
        userConfig: { isNavItem: true, navIcon: 'i-tabler-browser', navIconAlt: 'i-tabler-browser-plus' },
      }),
      createCard({
        templates,
        regionId: 'main',
        templateId: 'dash',
        slug: 'edit-site',
        title: 'Edit Site',
        cards: [createCard({ el: vue.defineAsyncComponent(() => import('./SiteEditor.vue')) })],
        userConfig: { isNavItem: false, layoutFormat: 'full', navIcon: 'i-tabler-home-plus' },
      }),
    ])
  }
}
