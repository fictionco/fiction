// @unocss-include
import type { FictionRouter } from '@fiction/core'
import { FictionObject, getColorScheme, localRef, objectId, resetUi, shortId, vue } from '@fiction/core'
import type { CardConfigPortable, PageRegion, TableCardConfig, TableSiteConfig } from './tables'
import type { Card } from './card'
import { flattenCards, orderCards } from './utils/layout'
import type { LayoutOrder } from './utils/layout'
import { SiteFrameTools } from './utils/frame'
import { activePageId, getPageById, getViewMap, setPages, updatePages } from './utils/page'
import { addNewCard, removeCard } from './utils/region'
import { activeMergedGlobalSections, activeSiteHostname, saveSite, updateSite } from './utils/site'
import type { SiteMode } from './load'
import type { FictionSites } from '.'

export type EditorState = {
  selectedCardId: string
  selectedPageId: string
  tempPage: CardConfigPortable
  selectedRegionId: PageRegion | undefined
  savedCardOrder: Record<string, string[]>
}

export type SiteSettings = {
  fictionSites: FictionSites
  siteRouter: FictionRouter
  useRouter?: boolean
  currentPath?: vue.Ref<string> | vue.WritableComputedRef<string>
  isEditable?: boolean
  siteMode?: SiteMode
  isProd?: boolean
} & Partial<TableSiteConfig> & { themeId: string }

export class Site<T extends SiteSettings = SiteSettings> extends FictionObject<T> {
  fictionSites = this.settings.fictionSites
  fictionAdmin = this.fictionSites.settings.fictionAdmin
  siteRouter = this.settings.siteRouter
  siteMode = vue.ref(this.settings.siteMode || 'standard')
  isEditable = vue.computed(() => this.siteMode.value === 'editable' || false)
  isEditor = vue.computed(() => this.siteMode.value === 'editor' || false)
  frame = new SiteFrameTools({ site: this, relation: this.siteMode.value === 'editor' ? 'parent' : 'child' })
  constructor(settings: T) {
    super('Site', settings)
  }

  siteId = this.settings.siteId || objectId({ prefix: 'ste' })

  isProd = vue.ref(this.settings.isProd ?? this.fictionSites.fictionEnv?.isProd.value)
  title = vue.ref(this.settings.title)
  status = vue.ref(this.settings.status)

  subDomain = vue.ref(this.settings.subDomain || shortId({ prefix: `${this.title.value || 'site'}-`, len: 3 }))
  customDomains = vue.ref(this.settings.customDomains || [])

  isAnimationDisabled = vue.ref(false)
  themeId = vue.ref(this.settings.themeId)
  theme = vue.computed(() => this.fictionSites.themes.value.find(t => t.themeId === this.themeId.value))

  userConfig = vue.ref(this.settings.userConfig || {})
  userConfigWithTheme = vue.computed(() => ({ ...this.theme.value?.config(), ...this.userConfig.value }))
  isDarkMode = localRef({ key: `isDarkMode-${this.themeId.value}`, def: this.userConfigWithTheme.value.isDarkMode })
  pages = vue.shallowRef(setPages({ pages: this.settings.pages, site: this }))

  primaryCustomDomain = vue.computed(() => this.customDomains.value?.find(d => d.isPrimary)?.hostname ?? this.customDomains.value?.[0]?.hostname)
  hostname = activeSiteHostname(this)
  currentViewId = vue.computed(() => (this.siteRouter.params.value.viewId || '_default') as string)
  viewMap = vue.computed(() => getViewMap({ pages: this.pages.value }))
  activePageId = activePageId({ siteRouter: this.siteRouter, viewMapRef: this.viewMap })
  currentPage = vue.computed(() => getPageById({ pageId: this.activePageId.value, pages: this.pages.value }))

  siteSections = vue.ref(this.settings.sections)
  sections = activeMergedGlobalSections({ site: this })

  layout = vue.computed<Record<string, Card>>(() => ({ ...this.sections.value, main: this.currentPage.value }))
  allLayoutCards = vue.computed<Card[]>(() => flattenCards(Object.values(this.layout.value)))

  currentPath = vue.computed({
    get: () => this.siteRouter.current.value.path,
    set: v => this.siteRouter.push(v),
  })

  editor = vue.ref<EditorState>({
    selectedCardId: '',
    selectedPageId: '',
    selectedRegionId: 'main',
    savedCardOrder: {},
    tempPage: {},
    ...this.settings.editor,
  })

  editorStored = vue.computed(() => {
    // get object of keys with store in them
    const storeKeys = Object.keys(this.editor).filter(k => k.includes('saved'))
    const out = {} as Record<string, unknown>
    storeKeys.forEach((k) => {
      out[k] = this.editor.value[k as keyof EditorState] || []
    })
    return out
  })

  toConfig(args: { onlyKeys?: (keyof TableSiteConfig)[] | readonly (keyof TableSiteConfig)[] } = {}): { siteId: string } & Partial<TableSiteConfig> {
    const { onlyKeys = [] } = args
    const { fictionSites: _, siteRouter: __, ...savedSettings } = this.settings
    const pages = this.pages.value.map(p => p.toConfig())

    const baseConfig = {
      ...savedSettings,
      editor: this.editorStored.value,
      siteId: this.siteId,
      themeId: this.themeId.value,
      status: this.status.value,
      title: this.title.value,
      subDomain: this.subDomain.value,
      customDomains: this.customDomains.value,
      userConfig: this.userConfig.value,
      pages,
    }

    return onlyKeys.length
      ? { siteId: this.siteId, ...Object.fromEntries(onlyKeys.map(key => [key, baseConfig[key]])) }
      : { ...baseConfig, siteId: this.siteId }
  }

  update = (newConfig: Partial<TableSiteConfig>) => updateSite({ site: this, newConfig })
  save = () => saveSite({ site: this, successMessage: 'Site Saved' })

  activeCard = vue.computed(() => this.allLayoutCards.value.find(c => c.cardId === this.editor.value.selectedCardId))
  activeCardConfig = vue.computed({
    get: () => this.activeCard.value?.toConfig() as Partial<TableCardConfig>,
    set: v => this.activeCard.value && v && this.activeCard.value.update(v),
  })

  /**
   * sets active card and syncs active card between frames
   */
  setActiveCard(args: { cardId: string }) {
    const { cardId } = args

    resetUi({ scope: 'all', cause: 'setActiveCard' })

    this.editor.value.selectedCardId = cardId

    this.settings.fictionSites.useTool({ toolId: 'editCard' })

    this.frame.syncActiveCard({ cardId })
  }

  async updateLayout(args: { order: LayoutOrder[] }) {
    const { order } = args

    this.isAnimationDisabled.value = true

    this.pages.value = orderCards({ cards: this.pages.value, order })

    await this.utils.waitFor(100)

    this.frame.syncSite({ caller: 'updateLayout' })

    this.isAnimationDisabled.value = false
  }

  editPageConfig = vue.computed({
    get: () => this.pages.value.find(r => r.cardId === this.editor.value.selectedPageId)?.toConfig(),
    set: v => updatePages({ site: this, pages: [v] }),
  })

  useEditPage(args: { cardId?: string } = {}) {
    const { cardId } = args

    if (cardId)
      this.activePageId.value = cardId

    this.editor.value.selectedPageId = cardId || ''

    this.settings.fictionSites.useTool({ toolId: cardId ? 'editPage' : 'createPage' })
  }

  removeCard(args: { cardId: string }) {
    return removeCard({
      site: this,
      ...args,
      onRemove: (_config) => {
        (this.editor.value.selectedCardId = '')

        this.frame.syncSite({ caller: 'removeCard' })
      },
    })
  }

  addCard(args: { templateId: string, addToCardId?: string, delay?: number, cardId?: string }) {
    return addNewCard({
      site: this,
      ...args,
      addToRegion: this.editor.value.selectedRegionId,
      onAdd: config => config.cardId && (this.editor.value.selectedCardId = config.cardId),
    })
  }

  colors = vue.computed(() => {
    const { colorPrimary = 'blue', colorTheme = 'slate', isDarkMode = false } = this.userConfigWithTheme.value
    const theme = getColorScheme(colorTheme)
    return {
      primary: getColorScheme(colorPrimary),
      theme,
      isDarkMode,
      canvasMain: isDarkMode ? theme[50] : theme[0],
      canvasBorder: isDarkMode ? theme[200] : theme[300],
      canvasPanel: isDarkMode ? theme[25] : theme[50],
    }
  })

  activeRegionKey = vue.ref<PageRegion>('main')
}
