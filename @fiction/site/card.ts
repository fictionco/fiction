import type { colorTheme, MediaObject, Query, StandardSizeComplete, vueRouter } from '@fiction/core'
import type { InputOption } from '@fiction/ui'
import type { CardQuerySettings } from './cardQuery.js'
import type { CardClassification } from './classification.js'
import type { SiteContentPath } from './load.js'
import type { CardOptionsWithStandard, StandardUserConfig } from './schema.js'
import type { Site } from './site.js'
import type { CardConfigPortable, TableCardConfig } from './tables.js'
import type { ComponentConstructor } from './type-utils.js'
import { deepMerge, FictionObject, objectId, setNested, toLabel, vue } from '@fiction/core'
import { z } from 'zod/v4'
import { CardFactory } from './cardFactory.js'
import { getContentWidthClass, getSpacingClass } from './styling.js'
import { siteGoto, siteLink } from './utils/manage.js'

export const OldCardTagsSchema = z.enum([
  'basic',
  'blog',
  'theme',
  'stats',
  'slider',
  'content',
  'layout',
  'media',
  'navigation',
  'social',
  'commerce',
  'form',
  'portfolio',
  'hero',
  'resume',
  'advanced',
])

type CardTags = z.infer<typeof OldCardTagsSchema>

// Utility type to merge two types
type MergeTypes<T, U> = T & Omit<U, keyof T>

export type CardTemplateSurfaceDefault<T extends string = string> = Partial<{
  templateId: T
  userConfig: any // Changed from Record<string, unknown> to any for flexibility
  schema: z.ZodType<any>
  queries: Record<string, Query>
  component: ComponentConstructor
}>

// Use defaults
type CardTemplateSurface<T> = MergeTypes<T, CardTemplateSurfaceDefault>
type CardTemplateUserConfigAll<T extends CardTemplateSurfaceDefault> = StandardUserConfig & T['userConfig']

type ConfigArgs = { site?: Site, card?: Card<any>, factory: CardFactory, templateId: string }

export type ConfigResponse<S extends CardTemplateSurfaceDefault = CardTemplateSurfaceDefault> = {
  schema?: CardTemplateSurface<S>[ 'schema' ]
  options?: InputOption[]
  userConfig?: CardTemplateUserConfigAll<S>
  demoPage?: CardConfigPortable
}

export interface CardTemplateSettings<
  S extends CardTemplateSurfaceDefault = CardTemplateSurfaceDefault,
> {
  root?: string

  templateId: CardTemplateSurface<S>[ 'templateId' ]
  title?: string
  subTitle?: string
  description?: string
  frequency?: 'common' | 'standard' | 'niche' | 'advanced'
  tags?: CardTags[]
  classification?: CardClassification
  screenshot?: { light: string, dark: string }
  icon?: string | MediaObject
  colorTheme?: typeof colorTheme[number]
  el: CardTemplateSurface<S>[ 'component' ]
  isPublic?: boolean
  isEffect?: boolean
  isDetached?: (args: { card: Card<CardTemplateUserConfigAll<S>> }) => boolean
  isPageCard?: boolean // full page wrap
  isContainer?: boolean // ui drawer
  isRegion?: boolean
  sections?: Record<string, CardConfigPortable>
  templates?: CardTemplate<any>[]
  onSiteLoad?: (args: { site: Site }) => void
  getConfig?: (args: ConfigArgs) => Promise<ConfigResponse<S>>
  getBaseConfig?: (args: CardSettings<CardTemplateUserConfigAll<S>>) => CardTemplateUserConfigAll<S>
  getQueries?: (args: CardQuerySettings) => CardTemplateSurface<S>[ 'queries' ]
  getContentPaths?: (args: { site: Site, card: Card<CardTemplateUserConfigAll<S>>, viewPath: string }) => Promise<SiteContentPath[]>

}

export class CardTemplate<
  S extends CardTemplateSurfaceDefault = CardTemplateSurfaceDefault,
> extends FictionObject<CardTemplateSettings<S>> {
  constructor(settings: CardTemplateSettings<S>) {
    super('CardTemplate', { title: toLabel(settings.templateId), ...settings })
  }

  getBaseConfig = this.settings.getBaseConfig || (() => ({ }))

  async getConfig(args: { site?: Site, card?: Card }) {
    const { site, card } = args
    const factory = new CardFactory({
      site,
      templates: site?.theme.value?.templates || [],
      caller: 'cardTemplateGetConfig',
    })
    const a = {
      site,
      card,
      factory,
      templateId: this.settings.templateId || 'no-id',
    }
    if (this.settings.getConfig) {
      return this.settings.getConfig(a)
    }
    else {
      return { }
    }
  }

  async toCard(cardSettings: {
    cardId?: string
    site?: Site
    userConfig?: CardTemplateUserConfigAll<S>
    baseConfig?: CardTemplateUserConfigAll<S>
  } & CardSettings, args: { factory?: CardFactory } = {}) {
    const { cardId, site, baseConfig = {}, userConfig } = cardSettings
    const { getConfig } = this.settings
    const factory = args.factory || new CardFactory({
      site,
      templates: site?.theme.value?.templates || [],
      caller: `toCard-${site?.theme.value.themeId}`,
    })

    const config = getConfig ? await getConfig({ ...args, factory, templateId: this.settings.templateId || 'no-id' }) : {}

    const specificUserConfig = deepMerge([
      baseConfig,
      config.userConfig,
      userConfig,
    ].filter(Boolean))

    // pass user defined values to base config, allowing for adjustments
    const templateBaseConfig = this.getBaseConfig({ ...args, userConfig: specificUserConfig })

    const finalUserConfig = deepMerge([templateBaseConfig, specificUserConfig].filter(Boolean))

    return new Card({
      cardId: cardId || objectId({ prefix: 'crd' }),
      templateId: this.settings.templateId,
      ...cardSettings,
      userConfig: finalUserConfig,
    })
  }
}

// Updated cardTemplate function with proper constraint
export function cardTemplate<
  TTemplateId extends string,
  TSchema extends z.ZodObject<any>,
  TComponent extends ComponentConstructor,
  TQueries extends Record<string, Query> = Record<string, Query>,
>(settings: CardTemplateSettings<{
  templateId: TTemplateId
  component: TComponent
  queries: TQueries
  userConfig: z.infer<TSchema> // This will be properly inferred
  schema: TSchema
}>) {
  return new CardTemplate<{
    templateId: TTemplateId
    userConfig: z.infer<TSchema>
    schema: TSchema
    queries: TQueries
    component: TComponent
  }>(settings)
}

// Alternative: More flexible version that accepts any ZodType
export function cardTemplateFlexible<
  TTemplateId extends string,
  TSchema extends z.ZodType,
  TComponent extends ComponentConstructor,
  TQueries extends Record<string, Query> = Record<string, Query>,
>(settings: CardTemplateSettings<{
  templateId: TTemplateId
  component: TComponent
  queries: TQueries
  userConfig: z.infer<TSchema>
  schema: TSchema
}>) {
  return new CardTemplate<{
    templateId: TTemplateId
    userConfig: z.infer<TSchema>
    schema: TSchema
    queries: TQueries
    component: TComponent
  }>(settings)
}

export type CardSettings<T extends Record<string, unknown> = Record<string, unknown>> = CardConfigPortable<T> & {
  site?: Site
  inlineTemplate?: CardTemplate<any>
  el?: ComponentConstructor
  templates?: CardTemplate[] | readonly CardTemplate[]
  onSync?: (args: { card: Card, cardConfig: CardConfigPortable }) => void
  editorConfig?: T & StandardUserConfig
}
export type CardBaseConfig = CardOptionsWithStandard & StandardUserConfig & Record<string, unknown>

export type CardSurface = {
  requests: {
    [key: string]: { params: unknown, result: unknown }
  }
}

// Use defaults
type Surface<T> = MergeTypes<T, CardSurface>

function getDetaultTemplateId(card: Card): string {
  const inlineTemplateId = card.settings.inlineTemplate ? card.settings.inlineTemplate.settings.templateId : undefined
  return inlineTemplateId || card.settings.templateId || (card.parentId ? 'cardPageAreaV1' : card.site?.theme.value?.templateDefaults.value.page || 'cardPageWrapV1')
}

export class Card<
  T extends CardBaseConfig = CardBaseConfig,
  U extends CardSurface = CardSurface,
> extends FictionObject<CardSettings<T>> {
  site = this.settings.site
  cardId = this.settings.cardId || objectId({ prefix: 'crd' })
  isHome = vue.ref(this.settings.isHome)
  nav = vue.ref(this.settings.nav)
  isSystem = vue.ref(this.settings.isSystem)
  parentId = this.settings.parentId
  depth = vue.ref(this.settings.depth || 0)
  index = vue.ref(this.settings.index)
  regionId = this.settings.regionId || 'main'
  layoutId = vue.ref(this.settings.layoutId)
  templateId = vue.ref(getDetaultTemplateId(this))
  title = vue.ref(this.settings.title)
  description = vue.ref(this.settings.description)
  slug = vue.ref(this.settings.slug)
  displayTitle = vue.computed(() => this.title.value || toLabel(this.slug.value))
  editorConfig = vue.shallowRef(this.settings.editorConfig || {} as T) as vue.Ref<vue.UnwrapRef<T>> // editor only temporary config, not saved (signals/triggers)
  userConfig = vue.shallowRef(this.settings.userConfig || {} as T) as vue.Ref<vue.UnwrapRef<T>> // allow passing of components and other complex objects
  fullConfig = vue.computed(() => {
    const rawConfig = deepMerge([
      this.site?.fullConfig.value,
      this.tpl.value?.getBaseConfig(this.settings) || {},
      this.userConfig.value as StandardUserConfig & T,
      this.editorConfig.value,
    ]) as StandardUserConfig & T

    return this.site ? this.site?.shortcodes.parseObjectSync(rawConfig) as T : rawConfig
  })

  config = vue.computed({
    get: () => this.fullConfig.value as T,
    set: (value: T) => (this.userConfig.value = vue.ref(value).value),
  })

  cards = vue.shallowRef((this.settings.cards || []).map(c => this.initSubCard({ cardConfig: c })))

  tpl = vue.computed(() => {
    const templates = [
      ...(this.settings.templates || []),
      ...(this.site?.theme.value?.templates || []).flatMap(t => [t, ...(t.settings.templates || [])]),
    ]
    const foundTemplate = templates.find(t => t.settings.templateId === this.templateId.value)
    if (this.settings.inlineTemplate) {
      return this.settings.inlineTemplate
    }
    else if (foundTemplate) {
      return foundTemplate
    }
    else if (this.settings.el) {
      return new CardTemplate({ el: this.settings.el, templateId: `${this.cardId}-direct` })
    }
  })

  isActive = vue.computed<boolean>(() => this.site?.editor.value.selectedCardId === this.settings.cardId)
  isDetached = vue.computed(() => this.tpl.value?.settings.isDetached?.({ card: this }) || false)

  constructor(settings: CardSettings<T>) {
    super('Card', settings)
  }

  getVerticalSpacingClass(args: {
    size?: StandardSizeComplete
  }) {
    return getSpacingClass({ size: this.fullConfig.value?.standard?.spaceSize || args.size || 'md', direction: 'both' })
  }

  getContentWidthClass(args: {
    size?: StandardSizeComplete
    padSize?: boolean
  }) {
    return getContentWidthClass({ size: this.fullConfig.value?.standard?.widthSize || args.size || 'md' })
  }

  classes = vue.computed(() => {
    const spacing = this.fullConfig.value?.standard

    const contentWidthSize = spacing?.widthSize || 'md'
    const verticalSpacing = spacing?.spaceSize || this.site?.userConfig.value.standard?.spaceSize || 'md'

    const contentWidthClass = getContentWidthClass({ size: contentWidthSize })
    const verticalSpacingClass = [getSpacingClass({ size: verticalSpacing, direction: 'both' })].join(' ')
    return {
      contentWidth: contentWidthClass,
      verticalSpacing: verticalSpacingClass,
    }
  })

  initSubCard(args: { cardConfig: CardConfigPortable }): Card {
    const { cardConfig } = args
    const card = new Card({
      parentId: this.cardId,
      ...cardConfig,
      depth: this.depth.value + 1,
      site: this.settings.site,
      regionId: this.regionId,
      templates: this.settings.templates,
    })
    return card
  }

  addCard(args: { cardConfig: Partial<TableCardConfig>, location?: 'top' | 'bottom' }) {
    const { cardConfig, location = 'top' } = args
    const card = this.initSubCard({ cardConfig })
    this.cards.value = location === 'top' ? [card, ...this.cards.value] : [...this.cards.value, card]

    this.syncCard({ caller: 'addCard' })
  }

  update(cardConfig: CardConfigPortable<T>, opts: { caller: string, noHistory?: boolean }) {
    const { caller, noHistory = false } = opts

    this.log.info(`update:${caller}`, { noHistory, data: cardConfig })

    if (!cardConfig || !this.site) {
      this.log.error('update: no site or cardConfig')
      return
    }

    const availableKeys = ['title', 'slug', 'userConfig', 'editorConfig', 'templateId', 'isHome', 'nav']
    const newHomePage = cardConfig.isHome && this.site.homePageId.value !== this.cardId
    const entries = Object.entries(cardConfig).filter(([key]) => availableKeys.includes(key))
    entries.forEach(([key, value]) => {
      if (key === 'isHome' && newHomePage) {
        this.site?.pages.value.forEach(pg => pg.isHome.value = false)
        this.isHome.value = true
      }
      else {
        if (value !== undefined && vue.isRef(this[key as keyof this]))
          (this[key as keyof this] as vue.Ref).value = value

        this.settings = { ...this.settings, [key as keyof T]: value }
      }
    })

    if (cardConfig.cards)
      this.cards.value = cardConfig.cards.map(c => this.initSubCard({ cardConfig: c }))

    this.syncCard({ caller: `updateCard:${this.templateId.value}-${caller}`, cardConfig, noHistory })

    if (newHomePage) {
      this.site.currentPath.value = '/'
    }
  }

  updateUserConfig(args: { path: string, value: unknown }) {
    const { path, value } = args

    this.userConfig.value = setNested({ data: this.userConfig.value, path, value })

    this.syncCard({ caller: `updateUserConfig:${this.templateId.value}-${path}`, cardConfig: { userConfig: this.userConfig.value } })
  }

  syncCard(args: { caller: string, noSave?: boolean, noHistory?: boolean, cardConfig?: CardConfigPortable }) {
    const { caller, noHistory = false } = args

    if (!this.site || this.site.siteMode.value === 'standard')
      return

    const cardConfig = args.cardConfig ? { ...args.cardConfig, cardId: this.cardId } : this.toConfig()

    // allow for parent cards and inherited type functionality
    if (this.settings.onSync) {
      this.settings.onSync({ card: this, cardConfig })
    }
    else {
      this.site.frame.syncCard({ caller: `card:syncCard:${args.caller}`, cardConfig })
      if (!args.noSave)
        this.site?.saveUtil.autosave({ caller: `syncCard-${caller}` })

      if (!noHistory && this.site?.siteMode.value === 'designer') {
        this.site?.history.saveState({
          description: `Card updated: ${this.tpl.value?.settings.title}`,
          type: 'card',
          cardConfig,
        })
      }
    }
  }

  // syncing of item being edited
  editPath = vue.computed(() => this.isActive.value ? this.site?.editor.value.editPath : undefined)
  setEditPath = (args: { path: string, caller: string }) => {
    const path = `userConfig.${args.path}`
    this.site?.setEditPath({ ...args, path })
  }

  link(location?: vueRouter.RouteLocationRaw, opts?: { caller?: string }) {
    if (!location)
      return ''
    return siteLink({ site: this.site, location, ...opts })
  }

  async goto(location: vueRouter.RouteLocationRaw, options: Partial<Parameters<typeof siteGoto>[0]['options']> = { }) {
    return siteGoto({ site: this.site, location, options })
  }

  toConfig(): CardConfigPortable<T> {
    const { site: __, inlineTemplate, el, templates, ...rest } = this.settings

    const cards = this.cards.value.filter(_ => !_.isSystem.value).map(c => c.toConfig())

    return {
      ...rest,
      regionId: this.regionId,
      layoutId: this.layoutId.value,
      templateId: this.templateId.value,
      cardId: this.cardId,
      title: this.title.value,
      description: this.description.value,
      slug: this.slug.value,
      userConfig: this.userConfig.value as T,
      cards,
      scope: this.settings.scope,
      isHome: !!this.isHome.value,
      nav: this.nav.value,
    }
  }

  cleanup() {
    this.cards.value.forEach(c => c.cleanup())
    this.cards.value = []
  }

  async request<K extends keyof Surface<U>['requests'] = keyof Surface<U>['requests']>(
    key: K,
    params: Surface<U>['requests'][K]['params'],
  ): Promise<Surface<U>['requests'][K]['result']> {
    const site = this.site
    if (!site) {
      throw new Error('Site not found')
    }
    const templateId = this.tpl.value?.settings.templateId
    if (!templateId) {
      throw new Error('CardRequest: Template not found')
    }
    const fictionSites = site.fictionSites
    const themeId = site.theme.value?.themeId

    return fictionSites.requests.CardQuery.request({
      templateId,
      themeId,
      siteId: site.siteId,
      args: params as Record<string, any>,
      queryId: key as string,
    })
  }
}
