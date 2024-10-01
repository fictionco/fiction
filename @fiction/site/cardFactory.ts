import type { vue } from '@fiction/core'
import type { CardConfigPortable, PageRegion, Site, TableCardConfig } from './index.js'
import type { SiteUserConfig } from './schema.js'
import type { ComponentConstructor } from './type-utils.js'
import { FictionObject, log } from '@fiction/core'
import { CardTemplate } from './card.js'

type CreateTuple<T extends readonly CardTemplate[]> = {
  [P in keyof T]: T[P] extends CardTemplate<infer S> ? [S['templateId'], S['userConfig'] ] : never
}[number]

type TupleToObject<T extends [string, any]> = {
  [P in T[0]]: T extends [P, infer B] ? B : never
}

export type TemplateUserConfigMap<T extends readonly CardTemplate[]> = TupleToObject<CreateTuple<T>>

export type ExtractComponentUserConfig<T extends ComponentConstructor> = InstanceType<T> extends { $props: { card: { userConfig: infer B } } } ? vue.UnwrapRef<B> & SiteUserConfig : never

export type ExtractCardTemplateUserConfig<T extends CardTemplate<any>> =
    T extends CardTemplate<infer S> ?
      S['component'] extends new (...args: any[]) => { $props: { card: { userConfig: infer B } } } ? vue.UnwrapRef<B> & SiteUserConfig : never
      : never

type UserConfigType<
  T extends keyof TemplateUserConfigMap<U>,
  U extends readonly CardTemplate[],
  W extends CardTemplate | undefined,
  X extends ComponentConstructor | undefined,
> = W extends CardTemplate
  ? TemplateUserConfigMap<U>[T] & SiteUserConfig
  : X extends ComponentConstructor
    ? ExtractComponentUserConfig<X>
    : U extends readonly CardTemplate[] ? TemplateUserConfigMap<U>[T] : Record<string, unknown>

type CreateCardArgs<
  T extends keyof TemplateUserConfigMap<U>,
  U extends readonly CardTemplate[],
  W extends CardTemplate | undefined,
  X extends ComponentConstructor | undefined,
> = {
  tpl?: W
  templateId?: T | 'wrap'
  el?: X
  userConfig?: UserConfigType<T, U, W, X>
  baseConfig?: UserConfigType<T, U, W, X>
  regionId?: PageRegion
  layoutId?: string
  cards?: CardConfigPortable[]
  cardId?: string
  isSystem?: boolean
  slug?: string
  title?: string
  description?: string
  isHome?: boolean
  is404?: boolean
}

type CardFactorSettings<U extends readonly CardTemplate[]> = {
  templates: U
  site?: Site
}

export class CardFactory<U extends readonly CardTemplate<any>[]> extends FictionObject<CardFactorSettings<U>> {
  private templates: U

  constructor(settings: CardFactorSettings<U>) {
    super('CardFactory', settings)

    this.templates = this.settings.templates
  }

  async create<
    T extends keyof TemplateUserConfigMap<U>,
    W extends CardTemplate | undefined,
    X extends ComponentConstructor | undefined,
  >(
    args: CreateCardArgs<T, U, W, X>,
  ): Promise<TableCardConfig> {
    const { tpl, el, userConfig, baseConfig } = args

    const templateId = args.templateId || (args.slug ? 'wrap' : 'area')

    if (!templateId && !tpl)
      throw new Error('CardFactory: templateId or tpl required')

    const inlineTemplate = tpl || (el ? new CardTemplate({ el, templateId: `${templateId}-inline` }) : undefined)

    const template = inlineTemplate || this.templates?.find(template => template.settings.templateId === templateId)

    // Ensure that 'templates' contains 'templateId'
    if (!template) {
      log.error('CardFactory', `Template with key "${templateId}" not found in provided templates.`)
      throw new Error(`CardFactory: Template not found: "${templateId}"`)
    }

    const createdCard = await template.toCard({ ...args, inlineTemplate, site: this.settings.site, userConfig, baseConfig })

    return createdCard.toConfig() as TableCardConfig
  }
}
