import type { FictionRouter, FontFamily } from '@fiction/core'
import type { Card, CardTemplate } from './card.js'
import type { FictionSites, ThemeConfig } from './index.js'

import type { SiteMode } from './load.js'
import type { ToolKeys } from './plugin-builder/tools/tools.js'
import type { prefersColorScheme } from './schema.js'
import type { CardConfigPortable, PageRegion, TableSiteConfig } from './tables.js'
import type { LayoutOrder } from './utils/layout.js'
import type { QueryVarHook } from './utils/site.js'
import { deepMerge, FictionObject, localRef, objectId, resetUi, Shortcodes, shortId, vue, waitFor } from '@fiction/core'
import { TypedEventTarget } from '@fiction/core/utils/eventTarget.js'
import { AutosaveUtility } from '@fiction/core/utils/save.js'
import { activeSiteFont } from './utils/fonts.js'
import { SiteFrameTools } from './utils/frame.js'
import { SiteHistory } from './utils/history.js'
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
  savedNeedsPublish: boolean
  isDirty: boolean
  savedPrefersColorScheme: 'light' | 'dark' | '' | 'auto'
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
  setActiveCard: CustomEvent<{ cardId: string }>
  editorActivateTool: CustomEvent<{ toolId: ToolKeys }>
}

export class Site<T extends SiteSettings = SiteSettings> extends FictionObject<T> {
  fictionSites = this.settings.fictionSites
  siteRouter = this.settings.siteRouter
  siteMode = vue.ref(this.settings.siteMode || 'standard')
  editToggle = vue.ref(false)
  isEditable = vue.computed(() => {
    const toggled = this.fictionSites.fictionEnv?.heldKeys.value.meta
    const isEditContext = ['editable', 'designer'].includes(this.siteMode.value) || false
    const editingStyle = this.editor.value.savedEditingStyle || 'normal'

    const isQuickEdit = editingStyle === 'quick' && !toggled
    const isCleanEdit = editingStyle === 'clean' && toggled

    return isEditContext && (isQuickEdit || isCleanEdit)
  })

  isDesigner = vue.computed(() => ['designer', 'coding'].includes(this.siteMode.value) || false)
  frame = new SiteFrameTools({ site: this, relation: this.isDesigner.value ? 'parent' : 'child' })
  events = new TypedEventTarget<SiteEventMap>({ fictionEnv: this.fictionSites.fictionEnv })

  constructor(settings: T) {
    super('Site', settings)
    this.watchers()
  }

  registeredHookKeys = new Set<string>()
  watchers() {
    if (typeof window === 'undefined') {
      return
    }

    const queryVarHooks: QueryVarHook[] = [{
      key: '_scheme',
      callback: (args: { site: Site, value: string }) => {
        const { value } = args
        const pref = this.prefersColorScheme.value
        if (value === 'toggle')
          this.prefersColorScheme.value = pref === 'light' ? 'dark' : 'light'
        else if (value)
          this.prefersColorScheme.value = value as typeof prefersColorScheme[number]

        return { reload: true }
      },
    }]
    setupRouteWatcher({ site: this, queryVarHooks })
  }

  async editorActivateTool(args: { toolId: ToolKeys }) {
    const { toolId } = args
    const { adminEditorController } = await import('@fiction/site/plugin-builder/tools/tools.js')
    adminEditorController.useTool({ toolId })
  }

  siteId = this.settings.siteId || objectId({ prefix: 'ste' })
  isProd = vue.ref(this.settings.isProd ?? this.fictionSites.fictionEnv?.isProd.value)
  title = vue.ref(this.settings.title)
  org = this.settings.org
  status = vue.ref(this.settings.status)
  subDomain = vue.ref(this.settings.subDomain || shortId({ prefix: `${this.title.value || 'site'}-`, len: 3 }))
  customDomains = vue.ref(this.settings.customDomains || [])
  isAnimationDisabled = vue.ref(false)
  themeId = vue.ref(this.settings.themeId)
  theme = vue.computed(() => {
    const themes = this.fictionSites.themes.value
    const found = themes.find(t => t.themeId === this.themeId.value)
    return found || themes[0]
  })

  history = new SiteHistory(this)

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

    await theme.loadThemeTemplates()

    const c = await theme.getThemeConfig({ site: this })

    this.themeConfig.value = c

    const pgs = this.settings.pages || []
    if (loadThemePages) {
      pgs.push(...c.pages)
    }

    await this.update({ pages: pgs }, { caller: 'loadConfig', noSave: true, noSync: this.siteMode.value === 'editable' })

    this.sections.value = setSections({ site: this, themeSections: c.sections })

    // register shortcodes etc
    this.theme.value?.templates.forEach(t => t.settings.onSiteLoad?.({ site: this }))

    this.history.init()

    return this
  }

  userFonts = vue.ref<Record<string, FontFamily>>({})
  siteFonts = activeSiteFont(this)
  configPrefersColorScheme = vue.computed(() => this.fullConfig.value.site?.prefersColorScheme || 'auto')
  userPrefersColorScheme = localRef<typeof prefersColorScheme[number]>({ key: `fictionPrefersColorScheme`, def: '', lifecycle: 'session' })
  prefersColorScheme = vue.computed<typeof prefersColorScheme[number]>({
    get: () => {
      if (this.siteMode.value === 'standard') {
        return this.userPrefersColorScheme.value || this.configPrefersColorScheme.value
      }
      else {
        return this.editor.value.savedPrefersColorScheme || this.configPrefersColorScheme.value
      }
    },
    set: (v) => {
      if (this.siteMode.value === 'standard')
        this.userPrefersColorScheme.value = v
      else
        this.editor.value.savedPrefersColorScheme = v
    },
  })

  isLightMode = vue.computed({
    get: () => {
      const scheme = this.prefersColorScheme.value

      // If scheme is auto or empty, use system preference
      if (scheme === 'auto' || !scheme) {
        const isClient = typeof window !== 'undefined'
        return isClient ? window.matchMedia('(prefers-color-scheme: light)').matches : true
      }

      return scheme === 'light'
    },
    set: (v) => {
      this.prefersColorScheme.value = v ? 'light' : 'dark'
    },
  })

  pages = vue.shallowRef([] as Card[])

  primaryCustomDomain = vue.computed(() => this.customDomains.value?.find(d => d.isPrimary)?.hostname ?? this.customDomains.value?.[0]?.hostname)
  currentItemId = vue.computed(() => this.siteRouter.params.value.itemId as string | undefined)
  currentViewId = vue.computed(() => (this.siteRouter.params.value.viewId || '_home') as string)
  viewMap = vue.computed(() => getViewMap({ pages: this.pages.value }))
  activePageId = activePageId({ siteRouter: this.siteRouter, viewMapRef: this.viewMap })
  currentPage = vue.computed(() => getPageById({ pageId: this.activePageId.value, site: this }))
  sections = vue.shallowRef(setSections({ site: this, sections: this.settings.sections }))
  layout = vue.computed<Record<string, Card>>(() => ({ ...this.sections.value, main: this.currentPage.value }))
  shortcodes = new Shortcodes({ fictionEnv: this.fictionSites.fictionEnv })

  availableCards = vue.computed(() => flattenCards([...this.pages.value, ...Object.values(this.sections.value)]))

  currentPath = vue.computed({
    get: () => this.siteRouter.current.value.path,
    set: async v => this.siteRouter.push(v, { caller: 'currentPath' }),
  })

  editor: vue.Ref<EditorState> = vue.ref({
    selectedCardId: '',
    selectedPageId: '',
    selectedRegionId: 'main',
    savedCardOrder: {},
    savedEditingStyle: 'quick',
    savedPrefersColorScheme: '',
    savedNeedsPublish: false,
    tempPage: {},
    tempSite: {},
    isDirty: false,
    ...this.settings.editor,
  })

  editorStored = vue.computed(() => {
    // get object of keys with store in them
    const editorValues = this.editor.value
    const storeKeys = Object.keys(editorValues).filter(k => k.includes('saved'))
    const out = {} as Record<string, unknown>
    storeKeys.forEach((k) => {
      out[k] = editorValues[k as keyof EditorState]
    })
    return out
  })

  saveTimeout: ReturnType<typeof setTimeout> | null = null // Store timeout reference

  saveUtil = new AutosaveUtility({
    onSave: async () => this.save({ scope: 'draft' }),
  })

  // clearAutosave() {
  //   if (this.saveTimeout) {
  //     clearTimeout(this.saveTimeout) // Clear the timeout after saving
  //     this.saveTimeout = null
  //   }
  // }

  // autosave() {
  //   if (this.siteMode.value !== 'designer') {
  //     return
  //   }

  //   this.editor.value.isDirty = true
  //   this.clearAutosave()

  //   this.saveTimeout = setTimeout(() => {
  //     this.save({ scope: 'draft' }).catch(console.error) // Error handling
  //   }, 2000) // Set a new timeout for 2 seconds
  // }

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

  update = async (newConfig: Partial<TableSiteConfig>, opts: Partial<Parameters<typeof updateSite>[0]>) => updateSite({ site: this, newConfig, ...opts })
  save = async (args: { minTime?: number, scope?: 'draft' | 'publish' } = {}) => saveSite({ site: this, successMessage: 'Site Saved', ...args })
  syncChange = (args: { caller: string, noSave?: boolean, withHistory?: boolean, onlyKeys?: (keyof TableSiteConfig)[] }) => {
    const { caller, noSave = false, withHistory = false, onlyKeys } = args
    this.frame.syncSite(args)

    if (!noSave)
      this.saveUtil.autosave({ caller: `syncChange-${caller}` })

    if (withHistory)
      this.history.saveState({ description: caller, type: 'site', siteConfig: this.toConfig({ onlyKeys }) })
  }

  activeCard = vue.computed(() => this.availableCards.value.find(c => c.cardId === this.editor.value.selectedCardId))

  /**
   * sets active card and syncs active card between frames
   */
  setActiveCard(args: { cardId: string, action?: 'delete' | 'edit' | 'add' }) {
    const { cardId, action } = args

    resetUi({ scope: 'all', cause: 'setActiveCard', trigger: 'manualReset' })

    this.editor.value.selectedCardId = cardId

    this.events.emit('setActiveCard', { cardId })

    this.frame.syncActiveCard({ cardId, action })

    if (action === 'delete') {
      this.removeCard({ cardId })
    }
    else if (action === 'add') {
      this.editorActivateTool({ toolId: 'editLayout' })
    }
    else {
      scrollActiveCardIntoView({ cardId, site: this })
    }
  }

  async updateLayout(args: { order: LayoutOrder[] }) {
    const { order } = args

    this.log.info('updateLayout', { data: { order } })

    this.isAnimationDisabled.value = true

    setLayoutOrder({ site: this, order })

    await waitFor(100)

    this.syncChange({ caller: 'updateLayout', withHistory: true, onlyKeys: ['pages'] })

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

        this.syncChange({ caller: 'removeCard', withHistory: true, onlyKeys: ['pages'] })
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
