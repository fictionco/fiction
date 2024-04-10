// @unocss-include
import type { vueRouter } from '@fiction/core'
import { FictionObject, deepMerge, objectId, setNested, toLabel, toSlug, vue } from '@fiction/core'
import type { InputOption } from '@fiction/ui'

import type { CardConfigPortable, SiteUserConfig, TableCardConfig } from './tables'
import type { Site } from './site'
import type { iconStyle } from './util'
import { CardGeneration } from './generation'
import type { ComponentConstructor } from './type-utils'

type CardCategory = 'basic' | 'theme' | 'stats' | 'marketing' | 'content' | 'layout' | 'media' | 'navigation' | 'social' | 'commerce' | 'form' | 'other' | 'special'

export const categoryOrder: CardCategory[] = ['basic', 'theme', 'marketing', 'content', 'stats', 'layout', 'media', 'navigation', 'social', 'commerce', 'form', 'other', 'special']

type CardTemplateUserConfig<T extends ComponentConstructor> = InstanceType<T> extends { $props: { card: { userConfig: { value: infer V } } } } ? V : undefined

interface CardTemplateSettings<U extends string = string, T extends ComponentConstructor = ComponentConstructor> {
  templateId: U
  title?: string
  description?: string
  category?: CardCategory[]
  icon?: string
  iconTheme?: keyof typeof iconStyle
  thumb?: string
  el: T
  //  render?: (card: Card) => vue.ComputedRef<CardRender<ComponentConstructor>>
  isContainer?: boolean // ui drawer
  isRegion?: boolean
  spacingClass?: string
  options?: InputOption[]
  userConfig?: CardTemplateUserConfig<T> & SiteUserConfig
  sections?: Record<string, CardConfigPortable>
  root?: string
}

export class CardTemplate<U extends string = string, T extends ComponentConstructor = ComponentConstructor> extends FictionObject<
CardTemplateSettings<U, T>
> {
  // jsonSchema = vue.computed(() => getOptionJsonSchema(this.settings.options))
  constructor(settings: CardTemplateSettings<U, T>) {
    super('CardTemplate', { title: toLabel(settings.templateId), ...settings })
  }

  toCard(args: { cardId?: string, site?: Site }) {
    const { cardId } = args
    const userConfig = this.settings.userConfig || {}
    return new Card({
      cardId: cardId || objectId({ prefix: 'crd' }),
      templateId: this.settings.templateId,
      title: this.settings.title,
      userConfig,
      ...args,
    })
  }
}

export type CardSettings<T extends Record<string, unknown> = Record<string, unknown> > = CardConfigPortable<T> & { site?: Site, inlineTemplate?: CardTemplate }
export type CardBaseConfig = Record<string, unknown> & SiteUserConfig

export class Card<
  T extends CardBaseConfig = CardBaseConfig,
> extends FictionObject<CardSettings<T>> {
  cardId = this.settings.cardId || objectId({ prefix: 'crd' })
  isHome = vue.ref(this.settings.isHome)
  is404 = vue.ref(this.settings.is404)
  parentId = this.settings.parentId
  depth = vue.ref(this.settings.depth || 0)
  index = vue.ref(this.settings.index)
  regionId = this.settings.regionId || 'main'
  layoutId = vue.ref(this.settings.layoutId)
  templateId = vue.ref(this.settings.templateId || (this.parentId ? 'area' : 'wrap'))
  title = vue.ref(this.settings.title)
  description = vue.ref(this.settings.description)
  slug = vue.ref(this.settings.slug ?? `${(this.title.value ? toSlug(this.title.value) : `page`)}`)
  displayTitle = vue.computed(() => this.title.value || toLabel(this.slug.value))
  userConfig = vue.ref<T>(this.settings.userConfig || {} as T)
  fullConfig = vue.computed(() => deepMerge([this.site?.fullConfig.value, this.userConfig.value as T]) as SiteUserConfig & T)
  cards = vue.shallowRef((this.settings.cards || []).map(c => this.initSubCard({ cardConfig: c })))
  site = this.settings.site
  tpl = vue.computed(() => this.settings.inlineTemplate || this.site?.theme.value?.templates?.find(t => t.settings.templateId === this.templateId.value))
  generation = new CardGeneration({ card: this })
  isActive = vue.computed<boolean>(() => this.site?.editor.value.selectedCardId === this.settings.cardId)
  options: vue.ComputedRef<InputOption[]> = vue.computed(() => this.tpl.value?.settings.options || [])

  constructor(settings: CardSettings<T>) {
    super('Card', settings)

    this.init()
  }

  classes = vue.computed(() => {
    const spacing = this.site?.fullConfig.value?.spacing
    return {
      contentWidth: spacing?.contentWidthClass,
      spacingClass: this.tpl.value?.settings.spacingClass ?? spacing?.spacingClass,
    }
  })

  init() {
    // update index on card change (currently unused)
    vue.watch(this.cards, () => this.cards.value.forEach((c, index) => c.index.value = index))
  }

  initSubCard(args: { cardConfig: CardConfigPortable }) {
    const { cardConfig } = args
    const card = new Card({
      parentId: this.cardId,
      ...cardConfig,
      depth: this.depth.value + 1,
      site: this.settings.site,
      regionId: this.regionId,
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

    this.syncCard({ caller: 'getCompletion', cardConfig })
  }

  updateUserConfig(args: { path: string, value: unknown }) {
    const { path, value } = args
    this.userConfig.value = setNested({ data: this.userConfig.value, path, value })
  }

  syncCard(args: { caller: string, cardConfig?: CardConfigPortable }) {
    if (!this.site)
      return

    const cardConfig = args.cardConfig ? { ...args.cardConfig, cardId: this.cardId } : this.toConfig()

    this.site.frame.syncCard({ caller: `card:syncCard:${args.caller}`, cardConfig })
  }

  link(location: vueRouter.RouteLocationRaw) {
    const router = this.site?.siteRouter.router.value
    if (!router)
      return ''

    if (!router.currentRoute.value.matched[0])
      throw new Error('Card.link - No matched current route')

    const prefix = router.currentRoute.value.matched[0].path.match(/.*?(?=\/:viewId|$)/)?.[0] || ''
    const resolvedHref = router.resolve(location).href

    const out = !resolvedHref.startsWith(prefix) ? `${prefix}${resolvedHref}` : resolvedHref

    return out.replace(/([^:]\/)\/+/g, '$1')
  }

  async goto(location: vueRouter.RouteLocationRaw, options: { replace?: boolean } = { }) {
    const method = options.replace ? 'replace' : 'push'

    await this.site?.siteRouter[method](this.link(location), { caller: `card:goto:${this.title.value}` })
  }

  toConfig(): CardConfigPortable<T> {
    const { site: __, ...rest } = this.settings

    const cards = this.cards.value.map(c => c.toConfig())
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
      scope: this.settings.scope,
      generation: this.generation.toConfig(),
    }
  }
}

/**
 * Special Types
 */
type CreateTuple<T extends readonly CardTemplate[]> = {
  [P in keyof T]: T[P] extends CardTemplate<infer X, infer Q> ? [X, InstanceType<Q>['$props']['card'] ] : never
}[number]

type TupleToObject<T extends [string, unknown]> = {
  [P in T[0]]: T extends [P, Card<infer B>] ? B : never
}

export type CreateUserConfigs<T extends readonly CardTemplate[]> = TupleToObject<CreateTuple<T>>

export type ExtractComponentUserConfig<T extends ComponentConstructor> = InstanceType<T> extends { $props: { card: { userConfig: infer B } } } ? vue.UnwrapRef<B> & SiteUserConfig : never

export type ExtractCardTemplateUserConfig<T extends CardTemplate<any, any>> =
    T extends CardTemplate<infer _X, infer U> ?
      U extends new (...args: any[]) => { $props: { card: { userConfig: infer B } } } ? vue.UnwrapRef<B> & SiteUserConfig : never
      : never