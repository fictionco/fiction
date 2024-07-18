import type { FictionRouter } from '@fiction/core'
import { FictionObject, deepMerge, getColorScheme, isDarkOrLightMode, localRef, objectId, resetUi, shortId, vue, waitFor } from '@fiction/core'
import { TypedEventTarget } from '@fiction/core/utils/eventTarget.js'
import type { CardConfigPortable, PageRegion, SiteUserConfig, TableCardConfig, TableSiteConfig } from './tables.js'
import type { Card, CardTemplate } from './card.js'
import { flattenCards, setLayoutOrder } from './utils/layout.js'
import type { LayoutOrder } from './utils/layout.js'
import { SiteFrameTools } from './utils/frame.js'
import { activePageId, getPageById, getViewMap, setPages, updatePages } from './utils/page.js'
import { addNewCard, removeCard } from './utils/region.js'
import type { QueryVarHook } from './utils/site.js'
import { saveSite, setSections, setupRouteWatcher, updateSite } from './utils/site.js'
import type { SiteMode } from './load.js'
import { type FontConfigVal, activeSiteFont } from './utils/fonts.js'
import type { FictionSites } from './index.js'

export type EditorState = {
  selectedCardId: string
  selectedPageId: string
  tempPage: CardConfigPortable
  tempSite: Partial<TableSiteConfig>
  selectedRegionId: PageRegion | undefined
  savedCardOrder: Record<string, string[]>
}

export type SiteSettings = {
  fictionSites: FictionSites
  siteRouter: FictionRouter
  currentPath?: vue.Ref<string> | vue.WritableComputedRef<string>
  isEditable?: boolean
  siteMode?: SiteMode
  isProd?: boolean
  isStatic?: boolean
} & Partial<TableSiteConfig> & { themeId: string, siteId: string }

export type SiteEventMap = {
  addCard: CustomEvent<{ template: CardTemplate }>
  setActiveCard: CustomEvent<{ cardId: string } >
}

export class Site<T extends SiteSettings = SiteSettings> extends FictionObject<T> {
  fictionSites = this.settings.fictionSites
  siteRouter = this.settings.siteRouter
  siteMode = vue.ref(this.settings.siteMode || 'standard')
  isEditable = vue.computed(() => this.siteMode.value === 'editable' || false)
  isDesigner = vue.computed(() => ['designer', 'coding'].includes(this.siteMode.value) || false)
  frame = new SiteFrameTools({ site: this, relation: this.isDesigner.value ? 'parent' : 'child' })
  events = new TypedEventTarget<SiteEventMap>({ fictionEnv: this.fictionSites.fictionEnv })

  constructor(settings: T) {
    super('Site', settings)
    this.watchers()
  }

  static async create<U extends SiteSettings>(settings: U, options: { loadThemePages?: boolean } = {}): Promise<Site<U>> {
    const site = new Site<U>(settings)
    await site.loadTheme(options)

    return site
  }

  watchers() {
    if (typeof window === 'undefined') {
      return
    }

    const queryVarHooks: QueryVarHook[] = [{
      key: '_scheme',
      callback: (args: { site: Site, value: string }) => {
        const { value } = args
        if (value === 'toggle')
          this.isDarkMode.value = !this.isDarkMode.value
        else if (value)
          this.isDarkMode.value = value === 'dark'

        return { reload: true }
      },
    }]
    setupRouteWatcher({ site: this, queryVarHooks })
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

  async loadTheme(options: { loadThemePages?: boolean } = {}) {
    const { loadThemePages = false } = options
    const theme = this.theme.value

    if (!theme)
      throw new Error(`Theme with ID ${this.themeId.value} not found`)

    if (loadThemePages) {
      const themePages = await theme.getPages({ site: this })
      this.update({ pages: themePages })
    }

    const themeSections = await theme.getSections({ site: this })
    this.sections.value = setSections({ site: this, themeSections })

    return this
  }

  userConfig = vue.ref(this.settings.userConfig || {})
  fullConfig = vue.computed(() => deepMerge<SiteUserConfig>([this.theme.value?.config(), this.userConfig.value]))
  userFonts = vue.ref<Record<string, FontConfigVal>>({})
  siteFonts = activeSiteFont(this)
  configDarkMode = vue.computed(() => this.fullConfig.value.isDarkMode ?? isDarkOrLightMode() === 'dark')
  localDarkMode = localRef({ key: `fictionIsDarkMode`, def: this.configDarkMode.value })
  isDarkMode = vue.computed({
    get: () => {
      return (this.siteMode.value === 'standard') ? this.localDarkMode.value : this.configDarkMode.value
    },
    set: (v) => {
      this.userConfig.value = { ...this.userConfig.value, isDarkMode: v }
      this.localDarkMode.value = v
    },
  })

  pages = vue.shallowRef(setPages({ pages: this.settings.pages, site: this }))

  primaryCustomDomain = vue.computed(() => this.customDomains.value?.find(d => d.isPrimary)?.hostname ?? this.customDomains.value?.[0]?.hostname)

  currentViewId = vue.computed(() => (this.siteRouter.params.value.viewId || '_home') as string)
  viewMap = vue.computed(() => getViewMap({ pages: this.pages.value }))
  activePageId = activePageId({ siteRouter: this.siteRouter, viewMapRef: this.viewMap })
  currentPage = vue.computed(() => getPageById({ pageId: this.activePageId.value, site: this }))

  sections = vue.shallowRef(setSections({ site: this, sections: this.settings.sections }))
  layout = vue.computed<Record<string, Card>>(() => ({ ...this.sections.value, main: this.currentPage.value }))

  availableCards = vue.computed(() => flattenCards([...this.pages.value, ...Object.values(this.sections.value)]))
  currentPath = vue.computed({
    get: () => this.siteRouter.current.value.path,
    set: async v => this.siteRouter.push(v, { caller: 'currentPath' }),
  })

  editor = vue.ref<EditorState>({
    selectedCardId: '',
    selectedPageId: '',
    selectedRegionId: 'main',
    savedCardOrder: {},
    tempPage: {},
    tempSite: {},
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
    const pages = this.pages.value.filter(_ => !_.isSystem.value).map(p => p.toConfig())
    const sections = Object.fromEntries(Object.entries(this.sections.value).map(([k, v]) => [k, v.toConfig()]))

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
      sections,
    }

    return onlyKeys.length
      ? { siteId: this.siteId, ...Object.fromEntries(onlyKeys.map(key => [key, baseConfig[key]])) }
      : { ...baseConfig, siteId: this.siteId }
  }

  update = (newConfig: Partial<TableSiteConfig>) => updateSite({ site: this, newConfig })
  save = async (args: { minTime?: number } = {}) => saveSite({ site: this, successMessage: 'Site Saved', ...args })

  activeCard = vue.computed(() => this.availableCards.value.find(c => c.cardId === this.editor.value.selectedCardId))
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

    this.events.emit('setActiveCard', { cardId })

    this.frame.syncActiveCard({ cardId })
  }

  async updateLayout(args: { order: LayoutOrder[] }) {
    const { order } = args

    this.log.info('updateLayout', { data: { order } })

    this.isAnimationDisabled.value = true

    setLayoutOrder({ site: this, order })

    await waitFor(100)

    this.frame.syncSite({ caller: 'updateLayout' })

    this.isAnimationDisabled.value = false
  }

  editPageConfig = vue.computed({
    get: () => this.pages.value.find(r => r.cardId === this.editor.value.selectedPageId)?.toConfig() || {},
    set: v => updatePages({ site: this, pages: [v] }),
  })

  async setEditPageAsHome() {
    updatePages({ site: this, pages: this.pages.value.map(p => ({ ...p.toConfig(), isHome: false, slug: p.slug.value === '_home' ? 'old-home' : p.slug.value })) })
    this.editPageConfig.value = { ...this.editPageConfig.value, isHome: true, slug: '_home' }

    await this.save()

    this.activePageId.value = this.editPageConfig.value.cardId || ''
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

  async addCard(args: { templateId: string, addToCardId?: string, delay?: number, cardId?: string, location?: 'top' | 'bottom' }) {
    return addNewCard({
      site: this,
      ...args,
      addToRegion: this.editor.value.selectedRegionId,
      onAdd: config => config.cardId && (this.editor.value.selectedCardId = config.cardId),
    })
  }

  colors = vue.computed(() => {
    const { colorPrimary = 'blue', colorTheme = 'gray' } = this.fullConfig.value.colors || {}

    return { primary: getColorScheme(colorPrimary), theme: getColorScheme(colorTheme) }
  })

  activeRegionKey = vue.ref<PageRegion>('main')

  cleanup() {
    this.pages.value.forEach(p => p.cleanup())
    Object.values(this.sections.value).forEach(s => s.cleanup())
    this.pages.value = []
    this.sections.value = {}
  }
}
