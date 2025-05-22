import type { CardConfigPortable, PageRegion, Site } from './index.js'
import type { StandardUserConfig } from './schema.js'
import type { ComponentConstructor } from './type-utils.js'
import { FictionObject } from '@fiction/core'
import { createStockMediaHandler } from '@fiction/ui/stock'
import { CardTemplate } from './card.js'

type BaseCardConfig = {
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

type CardFactorySettings<U extends readonly CardTemplate[]> = {
  templates: U
  site?: Site
  caller: string
}

type ExtractTemplateInfo<T extends CardTemplate> = {
  templateId: T extends CardTemplate<infer S> ? S['templateId'] : never
  userConfig: T extends CardTemplate<infer S> ? S['userConfig'] : never
}

export class CardFactory<U extends readonly CardTemplate<any>[] = readonly CardTemplate<{ userConfig: StandardUserConfig }>[]> extends FictionObject<CardFactorySettings<U>> {
  templates: U
  caller: string

  constructor(settings: CardFactorySettings<U>) {
    super('CardFactory', settings)

    this.templates = this.settings.templates
    this.caller = this.settings.caller || 'CardFactory(Unknown)'
  }

  async getStockMedia() {
    return createStockMediaHandler()
  }

  async fromTemplate<
    TTemplate extends CardTemplate<any> | U[number] = U[number],
  >(args: {
    // Template identification
    templateId?: ExtractTemplateInfo<TTemplate>['templateId']
    tpl?: TTemplate
    el?: ComponentConstructor

    // Config
    userConfig?: ExtractTemplateInfo<TTemplate>['userConfig'] & StandardUserConfig
    baseConfig?: ExtractTemplateInfo<TTemplate>['userConfig'] & StandardUserConfig

    // Base card properties
  } & BaseCardConfig,
  ): Promise<CardConfigPortable> {
    const { tpl, el, userConfig, baseConfig } = args

    const templateId = args.templateId || (args.slug ? 'cardPageWrapV1' : 'cardPageAreaV1')

    if (!templateId && !tpl)
      throw new Error('CardFactory: templateId or tpl required')

    const inlineTemplate = tpl || (el ? new CardTemplate({ el, templateId: `${templateId}-factory-inline` }) : undefined)

    const template = inlineTemplate || this.templates?.find(template => template.settings.templateId === templateId)

    // Ensure that 'templates' contains 'templateId'
    if (!template) {
      this.log.error(
        `Template with key "${templateId}" not found in provided templates (${this.caller})`,
        { data: { templateId, templates: this.templates.map(_ => _.settings.templateId) } },
      )
      return { templateId: 'cardHeroV1', userConfig: { heading: `Template not found (${templateId})` } }
    }

    const createdCard = await template.toCard({
      ...args,
      inlineTemplate,
      site: this.settings.site,
      userConfig,
      baseConfig,
    }, { factory: this })

    return createdCard.toConfig() as CardConfigPortable
  }
}
