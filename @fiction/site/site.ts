import type { FictionRouter } from '@fiction/core'
import type { Card, CardTemplate } from './card.js'
import type { FictionSites, ThemeConfig } from './index.js'

import type { SiteMode } from './load.js'
import type { CardConfigPortable, PageRegion, TableCardConfig, TableSiteConfig } from './tables.js'
import type { LayoutOrder } from './utils/layout.js'
import type { QueryVarHook } from './utils/site.js'
import { deepMerge, FictionObject, localRef, objectId, resetUi, setNested, shortId, vue, waitFor } from '@fiction/core'
import { TypedEventTarget } from '@fiction/core/utils/eventTarget.js'
import { activeSiteFont, type FontConfigVal } from './utils/fonts.js'
import { SiteFrameTools } from './utils/frame.js'
import { flattenCards, setLayoutOrder } from './utils/layout.js'
import { activePageId, getPageById, getViewMap, updatePages } from './utils/page.js'
import { addNewCard, removeCard } from './utils/region.js'
import { saveSite, scrollActiveCardIntoView, setSections, setupRouteWatcher, updateSite } from './utils/site.js'
import '@vue/shared' // for non-portable types (?)

export type EditorState = {
  selectedCardId: string
  selectedPageId: string
  tempPage: CardConfigPortable
  tempSite: Record<string, any>
  selectedRegionId: PageRegion | undefined
  savedCardOrder: Record<string, string[]>
  savedEditingStyle: 'clean' | 'quick'
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
  heldMetaKey = vue.computed(() => this.fictionSites.fictionEnv?.heldKeys.value.meta)
  isEditable = vue.computed(() => {
    const isEditContext = this.siteMode.value === 'editable' || false
    const editingStyle = this.editor.value.savedEditingStyle || 'normal'
    const held = this.heldMetaKey.value
    const out = isEditContext && ((editingStyle === 'quick' && !held) || (editingStyle === 'clean' && held))
    return out
  })

  isDesigner = vue.computed(() => ['designer', 'coding'].includes(this.siteMode.value) || false)
  frame = new SiteFrameTools({ site: this, relation: this.isDesigner.value ? 'parent' : 'child' })
  events = new TypedEventTarget<SiteEventMap>({ fictionEnv: this.fictionSites.fictionEnv })

  constructor(settings: T) {
    super('Site', settings)
    this.watchers()
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
          this.isLightMode.value = !this.isLightMode.value
        else if (value)
          this.isLightMode.value = value === 'light'

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
  userConfig = vue.ref(this.settings.userConfig || {})
  themeConfig = vue.ref<ThemeConfig>()
  fullConfig = vue.computed(() => deepMerge([this.themeConfig.value?.userConfig, this.userConfig.value]))

  static async create<U extends SiteSettings>(settings: U, options: { loadThemePages?: boolean } = {}): Promise<Site<U>> {
    const site = new Site<U>(settings)
    await site.loadConfig(options)

    return site
  }

  async loadConfig(options: { loadThemePages?: boolean } = {}) {
    const { loadThemePages = false } = options
    const theme = this.theme.value

    if (!theme)
      throw new Error(`Theme with ID ${this.themeId.value} not found`)

    const c = await theme.getConfig({ site: this })

    this.themeConfig.value = c

    const pgs = this.settings.pages || []
    if (loadThemePages) {
      pgs.push(...c.pages)
    }

    await this.update({ pages: pgs })

    this.sections.value = setSections({ site: this, themeSections: c.sections })

    return this
  }

  userFonts = vue.ref<Record<string, FontConfigVal>>({})
  siteFonts = activeSiteFont(this)
  configLightMode = vue.computed(() => this.fullConfig.value.styling?.isLightMode ?? false)
  localLightMode = localRef({ key: `fictionIsLightMode`, def: this.configLightMode.value, lifecycle: 'session' })
  isLightMode = vue.computed({
    get: () => {
      return (this.siteMode.value === 'standard') ? this.localLightMode.value : this.configLightMode.value
    },
    set: (v) => {
      this.userConfig.value = setNested({ data: this.userConfig.value, path: 'styling.isLightMode', value: v })
      if (this.siteMode.value === 'standard')
        this.localLightMode.value = v
    },
  })

  pages = vue.shallowRef([] as Card[])

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
    savedEditingStyle: 'quick',
    tempPage: {},
    tempSite: {},
    ...this.settings.editor,
  })

  editorStored = vue.computed(() => {
    // get object of keys with store in them
    const editorValues = this.editor.value
    const storeKeys = Object.keys(editorValues).filter(k => k.includes('saved'))
    const out = {} as Record<string, unknown>
    storeKeys.forEach((k) => {
      out[k] = editorValues[k as keyof EditorState] || []
    })
    return out
  })

  toConfig(args: { onlyKeys?: (keyof TableSiteConfig)[] | readonly (keyof TableSiteConfig)[] } = {}): { siteId: string } & Partial<TableSiteConfig> {
    const { onlyKeys = [] } = args
    const { fictionSites: _, siteRouter: __, ...savedSettings } = this.settings
    const pages = this.pages.value.filter(_ => !_.isSystem.value).map(p => p.toConfig())
    const sections = Object.fromEntries(Object.entries(this.sections.value).map(([k, v]) => [k, v.toConfig()]))
    const editor = this.editorStored.value

    const baseConfig = {
      ...savedSettings,
      editor,
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

  update = (newConfig: Partial<TableSiteConfig>, opts?: { caller?: string }) => updateSite({ site: this, newConfig, ...opts })
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

    resetUi({ scope: 'all', cause: 'setActiveCard', trigger: 'manualReset' })

    this.editor.value.selectedCardId = cardId

    this.events.emit('setActiveCard', { cardId })

    this.frame.syncActiveCard({ cardId })

    scrollActiveCardIntoView({ cardId, site: this })
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
    get: () => this.pages.value.find(r => r.cardId === (this.editor.value.selectedPageId || this.activePageId.value))?.toConfig() || {},
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

  activeRegionKey = vue.ref<PageRegion>('main')

  cleanup() {
    this.pages.value.forEach(p => p.cleanup())
    Object.values(this.sections.value).forEach(s => s.cleanup())
    this.pages.value = []
    this.sections.value = {}
  }
}
