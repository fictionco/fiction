// @unocss-include
import type { vueRouter } from '@fiction/core'
import { FictionObject, objectId, setNested, toLabel, toSlug, vue } from '@fiction/core'
import { getOptionJsonSchema } from '@fiction/ui'
import type { InputOption, InputOptionGeneration } from '@fiction/ui'

import type { CardConfigPortable, TableCardConfig } from './tables'
import type { Site } from './site'
import type { iconStyle } from './util'
import { getCardCompletion } from './utils/ai'
import type { ComponentConstructor } from './type-utils'

export type EditorState = {
  selectedCardId: string
  selectedPageId: string
  selectedRegionId: 'header' | 'main' | 'footer'
  savedCardOrder: Record<string, string[]>
}

type CardCategory = 'basic' | 'theme' | 'stats' | 'marketing' | 'content' | 'layout' | 'media' | 'navigation' | 'social' | 'commerce' | 'form' | 'other' | 'special'

export const categoryOrder: CardCategory[] = ['basic', 'theme', 'marketing', 'content', 'stats', 'layout', 'media', 'navigation', 'social', 'commerce', 'form', 'other', 'special']

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
  userConfig?: InstanceType<T> extends { $props: { card: { userConfig: { value: infer V } } } } ? V : undefined
  sections?: Record<string, CardConfigPortable>
}

export class CardTemplate<U extends string = string, T extends ComponentConstructor = ComponentConstructor> extends FictionObject<
CardTemplateSettings<U, T>
> {
  // jsonSchema = vue.computed(() => getOptionJsonSchema(this.settings.options))
  constructor(settings: CardTemplateSettings<U, T>) {
    super('CardTemplate', { title: toLabel(settings.templateId), ...settings })
  }

  toCard(args: { cardId?: string }) {
    return new Card({
      cardId: objectId({ prefix: 'crd' }),
      templateId: this.settings.templateId,
      title: this.settings.title,
      userConfig: this.settings.userConfig as Record<string, unknown>,
      ...args,
    })
  }
}

type CardGenerationSettings = {
  card: Card
}

export type CardGenerationConfig = {
  prompt?: string
  totalEstimatedTime?: number
  userInputConfig?: Record<string, InputOptionGeneration>
}

export class CardGeneration extends FictionObject<CardGenerationSettings> {
  constructor(settings: CardGenerationSettings) {
    super('CardGeneration', settings)
  }

  card = this.settings.card
  savedSettings = this.card.settings.generation || {}
  tpl = vue.computed(() => this.card.tpl.value)
  site = this.card.site

  defaultInputConfig = vue.computed(() => {
    const getOptions = (opts: InputOption[]) => {
      let out: InputOption[] = []
      for (const opt of opts) {
        if (opt.input.value === 'group')
          out = [...out, ...getOptions(opt.options.value || [])]
        else
          out.push(opt)
      }

      return out
    }

    const options = getOptions(this.tpl.value?.settings.options || []).filter(_ => _.outputSchema.value)

    return options.map(opt => ({
      key: opt.key.value,
      label: opt.label.value,
      prompt: opt.generation.value.prompt,
      isDisabled: opt.generation.value.isDisabled,
      estimatedMs: opt.generation.value.estimatedMs || 4000,
    }))
  })

  defaultPrompt = vue.computed(() => {
    const c = this.card

    const p = this.site?.currentPage?.value
    const pageName = p?.title.value ? `on the "${p.title.value}" page` : ''
    return `create content for the "${c?.title.value || toLabel(c?.templateId.value)}" card ${pageName}`
  })

  userPrompt = vue.ref(this.savedSettings.prompt || '')
  prompt = vue.computed(() => this.userPrompt.value || this.defaultPrompt.value)
  userInputConfig = vue.ref< Record<string, InputOptionGeneration>>(this.savedSettings.userInputConfig || {})
  inputConfig = vue.computed(() => {
    const out: Record<string, InputOptionGeneration> = {}
    let cumulativeTime = 0
    const userInputConfig = this.userInputConfig.value
    this.defaultInputConfig.value.forEach((opt) => {
      const o = { ...opt, ...userInputConfig[opt.key] }

      if (!o.isDisabled)
        cumulativeTime += o.estimatedMs

      out[opt.key] = { ...o, cumulativeTime }
    })

    return out
  })

  totalEstimatedTime = vue.computed(() => {
    const total = Object.values(this.inputConfig.value).filter(_ => !_.isDisabled).reduce((acc, opt) => {
      const time = opt.estimatedMs ?? 3000
      return acc + time
    }, 0)
    return Math.round(total / 1000)
  })

  progress = vue.ref({ percent: 0, status: '' })

  private simulateProgress() {
    this.progress.value = { percent: 0, status: `Initializing...` }
    const timeStart = Date.now()
    const totalEstimatedTime = this.totalEstimatedTime.value

    const interval = 500

    const updateProgress = () => {
      const timeElapsed = Date.now() - timeStart
      const percent = Math.round(Math.min((timeElapsed / (totalEstimatedTime * 1000)) * 100, 100))
      const currentSetting = Object.values(this.inputConfig.value).find(_ => !_.isDisabled && _.cumulativeTime && timeElapsed <= _.cumulativeTime)

      this.progress.value = {
        percent,
        status: `Generating ${currentSetting?.label || ''}`,
      }

      if (percent < 100)
        setTimeout(updateProgress, interval)

      else
        this.progress.value = { percent: 100, status: `Wrapping up...` }
    }

    updateProgress()

    return {
      complete: () => {
        this.progress.value = {
          percent: 100,
          status: `Complete!`,
        }
      },
    }
  }

  async getCompletion() {
    if (!this.site || !this.tpl.value)
      throw new Error('site and template required')

    const jsonSchema = getOptionJsonSchema(this.tpl.value.settings.options, this.inputConfig.value)

    const completionArgs = { runPrompt: this.prompt.value, outputFormat: jsonSchema, site: this.site }

    this.log.info('RUNNING COMPLETION', { data: completionArgs })

    const progress = this.simulateProgress()

    const c = await getCardCompletion(completionArgs)

    progress.complete()

    this.log.info('COMPLETION RESULT', { data: c })

    if (c) {
      let data = this.card.toConfig()
      Object.entries(c).forEach(([key, value]) => {
        data = setNested({ path: key, data, value, isMerge: true })
      })

      this.card.update(data)
    }

    return c
  }

  toConfig(): CardGenerationConfig {
    const config = {
      prompt: this.prompt.value,
      totalEstimatedTime: this.totalEstimatedTime.value,
      userInputConfig: this.userInputConfig.value,
    }

    return config
  }
}

export type CardSettings<T extends Record<string, unknown> = Record<string, unknown> > = CardConfigPortable<T> & { site?: Site, tpl?: CardTemplate }

export class Card<
  T extends Record<string, unknown> = Record<string, unknown>,
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
  slug = vue.ref(this.settings.slug ?? `${(this.title.value ? toSlug(this.title.value) : `page`)}`)
  displayTitle = vue.computed(() => this.title.value || toLabel(this.slug.value))
  userConfig = vue.ref<T>(this.settings.userConfig || {} as T)
  cards = vue.shallowRef((this.settings.cards || []).map(c => this.initSubCard({ cardConfig: c })))
  site = this.settings.site
  tpl = vue.computed(() => this.settings.tpl || this.site?.theme.value?.templates?.find(t => t.settings.templateId === this.templateId.value))
  generation = new CardGeneration({ card: this })
  isActive = vue.computed<boolean>(() => this.site?.editor.value.selectedCardId === this.settings.cardId)
  options: vue.ComputedRef<InputOption[]> = vue.computed(() => this.tpl.value?.settings.options || [])

  constructor(settings: CardSettings<T>) {
    super('Card', settings)

    this.init()
  }

  classes = vue.computed(() => {
    return {
      contentWidth: this.site?.theme.value?.spacing().contentWidthClass,
      spacing: this.tpl.value?.settings.spacingClass ?? this.site?.theme.value?.spacing().spacingClass,
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

export type ExtractCardTemplateUserConfig<T extends CardTemplate<any, any>> =
    T extends CardTemplate<infer _X, infer U> ?
      U extends new (...args: any[]) => { $props: { card: { userConfig: infer B } } } ? vue.UnwrapRef<B> : never
      : never
