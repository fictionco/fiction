import type { FictionRouter, FontFamily, SocialAccounts } from '@fiction/core'
import type { Contact } from '@fiction/plugins/plugin-contact/schema.js'
import type { Card, CardTemplate } from './card.js'
import type { FictionSites, ThemeConfig } from './index.js'
import type { SiteMode } from './load.js'
import type { ToolKeys } from './plugin-builder/tools/tools.js'
import type { PageRegion, TableSiteConfig } from './tables.js'
import type { LayoutOrder } from './utils/layout.js'
import type { QueryVarHook } from './utils/site.js'
import { deepMerge, FictionObject, objectId, resetUi, Shortcodes, vue, waitFor } from '@fiction/core'
import { TypedEventTarget } from '@fiction/core/utils/eventTarget.js'
import { AutosaveUtility } from '@fiction/core/utils/save.js'
import { siteEditorController } from './plugin-builder/tools/tools.js'
import { activeSiteFont } from './utils/fonts.js'
import { SiteFrameTools } from './utils/frame.js'
import { SiteHistory } from './utils/history.js'
import { flattenCards, setLayoutOrder } from './utils/layout.js'
import { siteLink } from './utils/manage.js'
import { activePageIdByRoute, getPageById, getViewMap } from './utils/page.js'
import { addNewCard, removeCard } from './utils/region.js'
import { saveSite, scrollActiveCardIntoView, setSections, setupRouteWatcher, updateSite } from './utils/site.js'
import '@vue/shared' // for non-portable types (?)

export type EditorState = {
  selectedCardId: string
  selectedPageId: string
  editPath: string
  selectedRegionId: PageRegion | undefined
  savedNeedsPublish: boolean
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

export const SITE_INJECTION_KEY = Symbol('siteRef') as vue.InjectionKey<vue.Ref<Site | undefined>>

export class Site<T extends SiteSettings = SiteSettings> extends FictionObject<T> {
  fictionSites = this.settings.fictionSites
  siteRouter = this.settings.siteRouter
  siteMode = vue.ref(this.settings.siteMode || 'standard')
  editToggle = vue.ref(false)
  isEditable = vue.computed(() => ['editable', 'designer'].includes(this.siteMode.value) || false)
  isPrimary = vue.ref(this.settings.isPrimary)
  isDesigner = vue.computed(() => ['designer', 'coding'].includes(this.siteMode.value) || false)
  frame = new SiteFrameTools({ site: this, relation: this.isDesigner.value ? 'parent' : 'child' })
  events = new TypedEventTarget<SiteEventMap>({ fictionEnv: this.fictionSites.fictionEnv })
  siteId = this.settings.siteId || objectId({ prefix: 'ste' })
  isProd = vue.ref(this.settings.isProd ?? this.fictionSites.fictionEnv?.isProd.value)
  title = vue.ref(this.settings.title)
  status = vue.ref(this.settings.status)
  handle = vue.ref(this.settings.handle)
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

  org = vue.computed(() => deepMerge([this.themeConfig.value?.org, this.settings.org]))

  subDomain = vue.computed(() => {
    const orgHandle = this.org.value?.handle
    return this.isPrimary.value && orgHandle ? orgHandle : `stage-${this.handle.value}`
  })

  url = vue.computed(() => {
    const origin = this.fictionSites.getOrigin({ subDomain: this.subDomain.value })
    return `${origin}${this.currentPath.value}`
  })

  constructor(settings: T) {
    super('Site', settings)
    this.watchers()
  }

  registeredHookKeys = new Set<string>()
  watchers() {
    if (typeof window === 'undefined') {
      return
    }

    const fictionUser = this.fictionSites.settings.fictionUser

    const queryVarHooks: QueryVarHook[] = [
      {
        key: '_logout',
        callback: async () => {
          await waitFor(100)
          await fictionUser?.logout({ caller: 'watchRouteUserChanges-logout-param' })
        },
      },
      {
        key: '_token',
        callback: async (args: { site: Site, value: string }) => {
          const { value } = args
          if (value) {
            await fictionUser?.setCurrentUser({ token: value, reason: 'watchRouteUserChanges-token-param' })
          }
        },
      },
    ]
    setupRouteWatcher({ site: this, queryVarHooks })

    // // show all pages on load of designer
    if (this.siteMode.value === 'designer') {
      vue.watch(
        () => [this.editingPageId.value],
        ([c]) => {
          this.editorController.hideToolDrawers.value = !c ? 'right' : ''
        },
        { immediate: true },
      )
    }

    if (this.siteMode.value === 'standard') {
      vue.watch(
        () => fictionUser?.activeUser.value?.userId,
        (userId) => {
          if (userId) {
            this.setActiveContact({ userId })
          }
        },
        { immediate: true },
      )
    }
  }

  editorController = siteEditorController({ site: this })

  async editorActivateTool(args: { toolId: ToolKeys | '' }) {
    const { toolId } = args

    this.editorController.useTool({ toolId })

    this.frame.syncTool({ toolId })
  }

  static async create<U extends SiteSettings>(settings: U, options: { isNewSite?: boolean } = {}): Promise<Site<U>> {
    const site = new Site<U>(settings)

    await site.loadConfig(options)

    return site
  }

  async loadTheme(args: { isNewSite?: boolean } = {}) {
    const { isNewSite = false } = args
    const theme = this.fictionSites.themes.value.find(t => t.themeId === this.themeId.value)
    if (!theme) {
      throw new Error(`Theme with ID ${this.themeId.value} not found`)
    }

    this.themeConfig.value = await theme.getThemeConfig({ site: this, isNewSite })
  }

  async loadConfig(args: { isNewSite?: boolean } = {}) {
    const { isNewSite = false } = args

    await this.loadTheme()

    const pgs = this.settings.pages || []
    if (isNewSite) {
      pgs.push(...(this.themeConfig.value?.pages || []))
    }

    await this.update({ pages: pgs }, { caller: 'loadConfig', noSave: true, noSync: this.siteMode.value === 'editable' })

    this.sections.value = setSections({ site: this, themeSections: this.themeConfig.value?.sections })

    this.theme.value?.templates.forEach(t => t.settings.onSiteLoad?.({ site: this }))

    this.history.init()
    return this
  }

  userFonts = vue.ref<Record<string, FontFamily>>({})
  siteFonts = activeSiteFont(this)
  shortcodes = new Shortcodes({
    fictionEnv: this.fictionSites.fictionEnv,
    shortcodes: [
      { shortcode: 'name', handler: () => this.org.value?.orgName || '' },
      { shortcode: 'handle', handler: () => this.org.value?.handle || '' },
      { shortcode: 'headline', handler: () => this.org.value?.headline || '' },
      { shortcode: 'about', handler: () => this.org.value?.about || '' },
      { shortcode: 'avatar', handler: () => {
        return this.org.value?.avatar?.url || ''
      } },
      { shortcode: 'social_url', handler: ({ attributes }) => {
        const src = attributes?.src as keyof SocialAccounts | undefined
        return (src && this.org.value?.accounts?.[src || '']) || ''
      } },
    ],
  })

  pages = vue.shallowRef([] as Card[])
  availableCards = vue.computed(() => flattenCards([this.currentPage.value, ...Object.values(this.sections.value)]))
  currentPath = vue.computed({
    get: () => this.siteRouter.current.value.path,
    set: async v => this.siteRouter.push(v, { caller: 'currentPath' }),
  })

  currentItemId = vue.computed(() => this.siteRouter.params.value.itemId as string | undefined)
  currentViewId = vue.computed(() => (this.siteRouter.params.value.viewId || '_') as string)
  viewMap = vue.computed(() => getViewMap({ pages: this.pages.value }))
  activePageId = activePageIdByRoute({ site: this })
  editingPageId = vue.computed({
    get: () => this.editor.value.selectedPageId,
    set: (v) => {
      this.editor.value.selectedPageId = v
      if (v) {
        this.activePageId.value = v
      }
    },
  })

  currentPage = vue.computed(() => getPageById({ pageId: this.activePageId.value, site: this }))
  homePageId = vue.computed(() => this.pages.value.find(p => p.isHome.value)?.cardId || this.pages.value[0]?.cardId)
  sections = vue.shallowRef(setSections({ site: this, sections: this.settings.sections }))
  layout = vue.computed<Record<string, Card>>(() => ({ ...this.sections.value, main: this.currentPage.value }))

  editor = vue.ref<EditorState>({
    selectedCardId: '',
    selectedPageId: '',
    selectedRegionId: 'main',
    editPath: '',
    savedNeedsPublish: false,
    ...this.settings.editor,
  })

  setEditPath(args: { path: string, caller: string }) {
    const { path, caller } = args

    if (!this || this?.siteMode.value === 'standard') {
      return
    }

    this.editor.value.editPath = path
    this.frame.syncEditPath({
      cardId: this.activeCard.value?.cardId || '',
      path,
      caller: `card:syncCard:${caller}`,
    })
  }

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
      isPrimary: this.isPrimary.value,
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

  activeCard = vue.computed(() => {
    const cardId = this.editor.value.selectedCardId
    const out = this.availableCards.value.find(c => c.cardId === cardId)

    return out
  })

  /**
   * sets active card and syncs active card between frames
   */
  setActiveCard(args: { cardId: string }) {
    const { cardId } = args

    resetUi({ scope: 'all', cause: 'setActiveCard', trigger: 'manualReset' })

    this.editor.value = { ...this.editor.value, selectedCardId: cardId }

    this.events.emit('setActiveCard', { cardId })

    this.frame.syncActiveCard({ cardId })

    scrollActiveCardIntoView({ cardId, site: this })
  }

  async updateLayout(args: { order: LayoutOrder[] }) {
    const { order } = args

    this.log.info('updateLayout', { data: { order } })

    this.isAnimationDisabled.value = true

    setLayoutOrder({ site: this, order })

    this.syncChange({ caller: 'updateLayout', withHistory: true, onlyKeys: ['pages'] })

    this.isAnimationDisabled.value = false
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

  async addCard(args: {
    templateId: string
    addToCardId?: string
    delay?: number
    cardId?: string
    location?: 'top' | 'bottom'
    addToRegion?: PageRegion
  }) {
    return addNewCard({
      site: this,
      ...args,
      onAdd: (config) => {
        config.cardId && (this.editor.value.selectedCardId = config.cardId)

        this.setActiveCard({ cardId: config.cardId || '' })
      },
    })
  }

  activeRegionKey = vue.ref<PageRegion>('main')

  cleanup() {
    this.pages.value.forEach(p => p.cleanup())
    Object.values(this.sections.value).forEach(s => s.cleanup())
    this.pages.value = []
    this.sections.value = {}
  }

  activeContact = vue.ref<Contact | undefined>()

  async setActiveContact(args: { userId?: string }) {
    const fictionContact = this.fictionSites.settings.fictionContact

    if (!fictionContact) {
      throw new Error('FictionContact is not available')
    }

    const targetOrgId = this.org.value.orgId || this.settings.orgId
    if (!targetOrgId) {
      this.log.error('No site orgId found for active contact', { data: { site: this.toConfig() } })
      return
    }

    const response = await fictionContact?.requests.ManageContact.request({ _action: 'current', targetOrgId }, { caller: 'getCurrentContact' })

    this.activeContact.value = response.data?.[0]
  }
}
