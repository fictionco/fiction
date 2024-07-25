import type { vue } from '@fiction/core'
import { FictionObject, deepMerge, log, parseObject } from '@fiction/core'
import { Card, CardTemplate } from './card.js'
import type { ComponentConstructor } from './type-utils.js'
import type { SiteUserConfig } from './schema.js'
import type { CardConfigPortable, PageRegion, Site, TableCardConfig } from './index.js'

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

type CardUserConfig<U extends readonly CardTemplate[]> = CreateUserConfigs<U>

type CreateCardArgs<
  T extends keyof CardUserConfig<U>,
  U extends readonly CardTemplate[],
  W extends CardTemplate | undefined,
  X extends ComponentConstructor | undefined,
> = {
  tpl?: W
  templateId?: T | 'wrap'
  el?: X
  userConfig?:
  W extends CardTemplate
    ? ExtractCardTemplateUserConfig<W>
    : X extends ComponentConstructor
      ? ExtractComponentUserConfig<X>
      : U extends readonly CardTemplate[] ? CardUserConfig<U>[T] : Record<string, unknown>
  regionId?: PageRegion
  layoutId?: string
  cards?: CardConfigPortable[]
  cardId?: string
  isSystem?: boolean
  slug?: string
  title?: string
  isHome?: boolean
  is404?: boolean
}

type CardFactorSettings<U extends readonly CardTemplate[]> = {
  templates: U
  site: Site
}

export class CardFactory<U extends readonly CardTemplate[]> extends FictionObject<CardFactorSettings<U>> {
  private templates: U

  constructor(settings: CardFactorSettings<U>) {
    super('CardFactory', settings)

    this.templates = this.settings.templates
  }

  async create<
    T extends keyof CreateUserConfigs<U>,
    W extends CardTemplate | undefined,
    X extends ComponentConstructor | undefined,
  >(
    args: CreateCardArgs<T, U, W, X>,
  ): Promise<TableCardConfig> {
    const { templateId = 'area', tpl, el } = args

    if (!templateId && !tpl)
      throw new Error('createCard: templateId or tpl required')

    const inlineTemplate = tpl || (el ? new CardTemplate({ el, templateId: `${templateId}-inline` }) : undefined)

    const template = inlineTemplate || this.templates?.find(template => template.settings.templateId === templateId)

    // Ensure that 'templates' contains 'templateId'
    if (!template && this.templates) {
      log.error('createCard', `Template with key "${templateId}" not found in provided templates.`)
      throw new Error(`createCard: Template not found: "${templateId}"`)
    }

    const templateUserConfig = template?.settings.userConfig ? template?.settings.userConfig as CardUserConfig<U>[T] : {}
    const asyncUserConfig = template?.settings.getUserConfig ? await template.settings.getUserConfig({ site: this.settings.site }) : {}

    const obj = deepMerge([templateUserConfig, asyncUserConfig, args.userConfig])

    const userConfig = parseObject({ obj, onValue: ({ value }) => typeof value === 'string' ? value.replace('file://', '/@fs') : value })

    const { ...rest } = args

    return new Card({ ...rest, inlineTemplate, userConfig }).toConfig() as TableCardConfig
  }
}
