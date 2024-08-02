import type { Query, colorTheme, vueRouter } from '@fiction/core'
import { FictionObject, deepMerge, objectId, setNested, toLabel, vue } from '@fiction/core'
import type { InputOption } from '@fiction/ui'
import type { z } from 'zod'
import { refineOptions } from './utils/schema.js'
import type { CardConfigPortable, TableCardConfig } from './tables.js'
import type { Site } from './site.js'
import { CardGeneration } from './generation.js'
import type { ComponentConstructor } from './type-utils.js'
import { siteGoto, siteLink } from './utils/manage.js'
import type { CardQuerySettings } from './cardQuery.js'
import { getContentWidthClass } from './styling.js'
import type { CardOptionsWithStandard, SiteUserConfig } from './schema.js'

type CardCategory = 'basic' | 'posts' | 'theme' | 'stats' | 'marketing' | 'content' | 'layout' | 'media' | 'navigation' | 'social' | 'commerce' | 'form' | 'other' | 'special' | 'portfolio' | 'advanced' | 'effect'

export const categoryOrder: CardCategory[] = ['basic', 'theme', 'marketing', 'content', 'stats', 'layout', 'media', 'navigation', 'social', 'commerce', 'form', 'other', 'special']

type CardTemplateUserConfig<T extends ComponentConstructor> = InstanceType<T> extends { $props: { card: { userConfig: { value: infer V } } } } ? V : SiteUserConfig

type FullTemplateUserConfig<T extends ComponentConstructor> = SiteUserConfig & CardTemplateUserConfig<T>

interface CardTemplateSettings<
  U extends string = string,
  T extends ComponentConstructor = ComponentConstructor,
  X extends Record<string, Query> = Record<string, Query>,
> {
  root?: string
  templateId: U
  el: T

  isPublic?: boolean
  isEffect?: boolean
  isPageCard?: boolean // full page wrap
  isContainer?: boolean // ui drawer
  isRegion?: boolean
  options?: InputOption[]
  schema?: z.AnyZodObject
  sections?: Record<string, CardConfigPortable>
  getBaseConfig?: (args: { site?: Site }) => FullTemplateUserConfig<T>
  getUserConfig?: (args: { site: Site }) => Promise<FullTemplateUserConfig<T>> | (FullTemplateUserConfig<T>)
  getEffects?: (args: { site: Site }) => Promise<TableCardConfig[]>
  demoPage?: (args: { site: Site }) => Promise<{ cards: CardConfigPortable< FullTemplateUserConfig<T>>[] }>
  getQueries?: (args: CardQuerySettings) => X
  title?: string
  description?: string
  category?: CardCategory[]
  icon?: string
  colorTheme?: typeof colorTheme[number]
  thumb?: string

}

export class CardTemplate<
  U extends string = string,
  T extends ComponentConstructor = ComponentConstructor,
> extends FictionObject< CardTemplateSettings<U, T> > {
  constructor(settings: CardTemplateSettings<U, T>) {
    super('CardTemplate', { title: toLabel(settings.templateId), ...settings })
  }

  optionConfig = refineOptions({ options: this.settings.options || [], schema: this.settings.schema })
  getBaseConfig = this.settings.getBaseConfig || (() => ({}))

  async toCard(args: { cardId?: string, site: Site, userConfig?: FullTemplateUserConfig<T>, baseConfig?: FullTemplateUserConfig<T> } & CardSettings) {
    const { cardId, site, baseConfig = {}, userConfig } = args
    const { getUserConfig = () => {}, getEffects = () => [] } = this.settings

    const templateBaseConfig = this.getBaseConfig({ site })
    const asyncUserConfig = (await getUserConfig({ site })) || {}
    const initialUserConfig = userConfig || asyncUserConfig
    const effects = (await getEffects({ site })) || []

    const finalUserConfig = deepMerge([templateBaseConfig, baseConfig, initialUserConfig])

    return new Card({
      cardId: cardId || objectId({ prefix: 'crd' }),
      templateId: this.settings.templateId,
      title: this.settings.title,
      ...args,
      userConfig: finalUserConfig,
      effects,
    })
  }
}

export type CardSettings<T extends Record<string, unknown> = Record<string, unknown> > = CardConfigPortable<T> & {
  site?: Site
  inlineTemplate?: CardTemplate
  templates?: CardTemplate[] | readonly CardTemplate[]
  onSync?: (card: Card) => void
}
export type CardBaseConfig = CardOptionsWithStandard & SiteUserConfig & Record<string, unknown>

export type CardSurface = {
  requests: {
    [key: string]: { params: unknown, result: unknown }
  }
}

// Utility type to merge two types
type MergeTypes<T, U> = T & Omit<U, keyof T>

// Use defaults
type Surface<T> = MergeTypes<T, CardSurface>

export class Card<
  T extends CardBaseConfig = CardBaseConfig,
  U extends CardSurface = CardSurface,
> extends FictionObject<CardSettings<T>> {
  site = this.settings.site
  cardId = this.settings.cardId || objectId({ prefix: 'crd' })
  isHome = vue.ref(this.settings.isHome)
  is404 = vue.ref(this.settings.is404)
  isSystem = vue.ref(this.settings.isSystem)
  parentId = this.settings.parentId
  depth = vue.ref(this.settings.depth || 0)
  index = vue.ref(this.settings.index)
  regionId = this.settings.regionId || 'main'
  layoutId = vue.ref(this.settings.layoutId)
  templateId = vue.ref(this.settings.templateId || (this.parentId ? 'area' : this.site?.theme.value?.templateDefaults.value.page || 'wrap'))
  title = vue.ref(this.settings.title)
  description = vue.ref(this.settings.description)
  slug = vue.ref(this.settings.slug)
  displayTitle = vue.computed(() => this.title.value || toLabel(this.slug.value))
  userConfig = vue.ref<T>(this.settings.userConfig || {} as T)
  fullConfig = vue.computed(() => (deepMerge([
    this.site?.fullConfig.value,
    this.tpl.value?.getBaseConfig({ site: this.site }) || {},
    this.userConfig.value as SiteUserConfig & T,
  ]) as SiteUserConfig & T))

  config = vue.computed({
    get: () => this.fullConfig.value as T,
    set: (value: T) => (this.userConfig.value = vue.ref(value).value),
  })

  cards = vue.shallowRef((this.settings.cards || []).map(c => this.initSubCard({ cardConfig: c })))
  effects = vue.shallowRef((this.settings.effects || []).map(c => this.initSubCard({ cardConfig: c })))

  tpl = vue.computed(() => {
    const templates = [...(this.settings.templates || []), ...(this.site?.theme.value?.templates || [])]
    const foundTemplate = templates.find(t => t.settings.templateId === this.templateId.value)

    return this.settings.inlineTemplate || foundTemplate
  })

  genUtil = new CardGeneration({ card: this })
  isActive = vue.computed<boolean>(() => this.site?.editor.value.selectedCardId === this.settings.cardId)
  options: vue.ComputedRef<InputOption[]> = vue.computed(() => this.tpl.value?.optionConfig.options || [])
  isNotInline = vue.ref(false) // allows cards to break out of inline mode

  constructor(settings: CardSettings<T>) {
    super('Card', settings)
  }

  classes = vue.computed(() => {
    const spacing = this.fullConfig.value?.standard?.spacing
    const contentWidthSize = spacing?.contentWidth || 'md'
    const contentWidthClass = getContentWidthClass({ size: contentWidthSize, padSize: true })
    return {
      contentWidth: contentWidthClass,
    }
  })

  initSubCard(args: { cardConfig: CardConfigPortable }) {
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

  update(cardConfig?: CardConfigPortable<T>) {
    if (!cardConfig)
      return
    const availableKeys = ['title', 'slug', 'userConfig', 'templateId', 'isHome', 'is404']
    const entries = Object.entries(cardConfig).filter(([key]) => availableKeys.includes(key))
    entries.forEach(([key, value]) => {
      if (value !== undefined && vue.isRef(this[key as keyof this]))
        (this[key as keyof this] as vue.Ref).value = value

      this.settings = { ...this.settings, [key as keyof T]: value }
    })

    if (cardConfig.cards)
      this.cards.value = cardConfig.cards.map(c => this.initSubCard({ cardConfig: c }))

    this.syncCard({ caller: `updateCard:${this.templateId.value}`, cardConfig })
  }

  updateUserConfig(args: { path: string, value: unknown }) {
    const { path, value } = args

    this.userConfig.value = setNested({ data: this.userConfig.value, path, value })

    this.syncCard({ caller: `updateUserConfig:${this.templateId.value}`, cardConfig: { userConfig: this.userConfig.value } })
  }

  syncCard(args: { caller: string, cardConfig?: CardConfigPortable }) {
    if (!this.site)
      return

    const cardConfig = args.cardConfig ? { ...args.cardConfig, cardId: this.cardId } : this.toConfig()

    this.site.frame.syncCard({ caller: `card:syncCard:${args.caller}`, cardConfig })

    // allow for parent cards and inherited type functionality
    if (this.settings.onSync) {
      this.settings.onSync(this)
    }
  }

  link(location?: vueRouter.RouteLocationRaw) {
    if (!location)
      return ''
    return siteLink({ site: this.site, location })
  }

  async goto(location: vueRouter.RouteLocationRaw, options: Partial<Parameters<typeof siteGoto>[0]['options']> = { }) {
    return siteGoto({ site: this.site, location, options })
  }

  toConfig(): CardConfigPortable<T> {
    const { site: __, ...rest } = this.settings

    const cards = this.cards.value.filter(_ => !_.isSystem.value).map(c => c.toConfig())
    const effects = this.effects.value.filter(_ => !_.isSystem.value).map(c => c.toConfig())

    const generation = this.genUtil.toConfig()

    return {
      ...rest,
      regionId: this.regionId,
      layoutId: this.layoutId.value,
      templateId: this.templateId.value,
      cardId: this.cardId,
      isHome: !!this.isHome.value,
      is404: !!this.is404.value,
      title: this.title.value,
      description: this.description.value,
      slug: this.slug.value,
      userConfig: this.userConfig.value as T,
      cards,
      effects,
      scope: this.settings.scope,
      generation,
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
      throw new Error('Template not found')
    }
    const fictionSites = site.fictionSites
    const themeId = site.theme.value?.themeId

    return await fictionSites.requests.CardQuery.request({
      templateId,
      themeId,
      siteId: site.siteId,
      args: params as Record<string, any>,
      queryId: key as string,
    })
  }
}

/**
 * Special Types
 */
type CreateTuple<T extends readonly CardTemplate[]> = {
  [P in keyof T]: T[P] extends CardTemplate<infer X, infer Q> ? [X, InstanceType<Q>['$props']['card'] ] : never
}[number]

type TupleToObject<T extends [string, unknown]> = {
  [P in T[0]]: T extends [P, Card<infer B>] ? B & SiteUserConfig : never
}

export type CreateUserConfigs<T extends readonly CardTemplate[]> = TupleToObject<CreateTuple<T>>

export type ExtractComponentUserConfig<T extends ComponentConstructor> = InstanceType<T> extends { $props: { card: { userConfig: infer B } } } ? vue.UnwrapRef<B> & SiteUserConfig : never

export type ExtractCardTemplateUserConfig<T extends CardTemplate<any, any>> =
    T extends CardTemplate<infer _X, infer U> ?
      U extends new (...args: any[]) => { $props: { card: { userConfig: infer B } } } ? vue.UnwrapRef<B> & SiteUserConfig : never
      : never
