// @unocss-include
import { FictionPlugin, safeDirname, vue } from '@fiction/core'
import { CardTemplate, type FictionSites, type SitesPluginSettings, createCard } from '..'
import type { ToolKeys } from './tools'
import { tools } from './tools'

type FictionSiteBuilderSettings = {
  fictionSites: FictionSites
} & SitesPluginSettings

export class FictionSiteBuilder extends FictionPlugin<FictionSiteBuilderSettings> {
  constructor(settings: FictionSiteBuilderSettings) {
    const s = { ...settings, root: safeDirname(import.meta.url) }

    super('FictionSiteBuilder', s)

    this.settings.fictionEnv.addHook({ hook: 'adminPages', callback: async (pages, meta) => {
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
            createCard({
              tpl: new CardTemplate({
                templateId: 'sites',
                el: vue.defineAsyncComponent(() => import('./ViewIndex.vue')),
              }),
            }),
          ],
          userConfig: {
            isNavItem: true,
            navIcon: 'i-tabler-browser',
            navIconAlt: 'i-tabler-browser-plus',
          },
        }),
        createCard({
          templates,
          regionId: 'main',
          templateId: 'dash',
          slug: 'edit-site',
          title: 'Edit Site',
          cards: [
            createCard({
              tpl: new CardTemplate({
                templateId: 'siteEdit',
                el: vue.defineAsyncComponent(() => import('./SiteEditor.vue')),
              }),
            }),
          ],
          userConfig: {
            isNavItem: false,
            layoutFormat: 'full',
            navIcon: 'i-tabler-home-plus',
          },
        }),
      ]
    } })
  }

  activeToolId = {
    left: vue.ref<ToolKeys | ''>(),
    right: vue.ref<ToolKeys | ''>(),
  }

  activeTool = {
    left: vue.computed(() => tools().find(t => t.toolId === this.activeToolId.left.value)),
    right: vue.computed(() => tools().find(t => t.toolId === (this.activeToolId.right.value ? this.activeToolId.right.value : 'editCard'))),
  }

  useTool(args: { toolId: ToolKeys | '' }) {
    const { toolId } = args
    const t = tools().find(t => t.toolId === toolId)
    const location = t?.location || 'left'
    this.activeToolId[location].value = toolId
  }

  isUsingTool(args: { toolId?: ToolKeys | '', locations?: ('left' | 'right')[] } = {}) {
    const { toolId, locations = ['left', 'right'] } = args
    return locations.some(l => this.activeToolId[l].value === toolId)
  }
}
