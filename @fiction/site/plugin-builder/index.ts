import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { CardTemplate, type FictionSites, type SitesPluginSettings, createCard } from '..'

type FictionSiteBuilderSettings = {
  fictionSites: FictionSites
} & SitesPluginSettings

export class FictionSiteBuilder extends FictionPlugin<FictionSiteBuilderSettings> {
  constructor(settings: FictionSiteBuilderSettings) {
    const s = { ...settings, root: safeDirname(import.meta.url) }

    super('FictionSiteBuilder', s)

    this.settings.fictionEnv.addHook({
      hook: 'adminPages',
      caller: 'FictionSiteBuilder',
      context: 'app',
      callback: async (pages, meta) => {
        const { templates } = meta
        return [
          ...pages,
          createCard({
            templates,
            regionId: 'main',
            templateId: 'dash',
            slug: '_home',
            title: 'Your Sites',
            cards: [
              createCard({ el: vue.defineAsyncComponent(() => import('./ViewIndex.vue')) }),
            ],
            userConfig: { isNavItem: true, navIcon: 'i-tabler-browser', navIconAlt: 'i-tabler-browser-plus' },
          }),
          createCard({
            templates,
            regionId: 'main',
            templateId: 'dash',
            slug: 'edit-site',
            title: 'Edit Site',
            cards: [
              createCard({ el: vue.defineAsyncComponent(() => import('./SiteEditor.vue')) }),
            ],
            userConfig: { isNavItem: false, layoutFormat: 'full', navIcon: 'i-tabler-home-plus' },
          }),
        ]
      },
    })
  }
}
