import type { FictionEnv, FictionPluginSettings, ServiceList } from '@fiction/core'
import { FictionPlugin, deepMerge, log, parseObject, vue } from '@fiction/core'
import type { FictionAdmin } from '@fiction/admin/index.js'
import type { CreateUserConfigs, ExtractCardTemplateUserConfig, ExtractComponentUserConfig } from './card.js'
import type { CardConfigPortable, PageRegion, TableCardConfig } from './tables.js'
import { Card, CardTemplate } from './card.js'
import { imageStyle } from './util.js'
import type { ComponentConstructor } from './type-utils.js'
import { Site, type SiteSettings } from './site.js'
import type { SiteUserConfig } from './schema.js'

export type ThemeSettings<T extends Record<string, unknown> = Record<string, unknown>> = {
  root: string
  themeId: string
  title?: string
  version?: string
  description?: string
  screenshot: string
  templates?: readonly CardTemplate[] | CardTemplate[]
  ui?: UiConfig
  isPublic?: boolean
  userConfig?: Partial<SiteUserConfig> & T
  getConfig: (args: { site: Site }) => Promise<{
    userConfig: Partial<SiteUserConfig>
    pages: TableCardConfig[]
    sections: Record<string, TableCardConfig>
  }>
  templateDefaults?: {
    page?: string
    transaction?: string
  }
} & FictionPluginSettings

export type UiItem = { el: vue.Component }
export interface UiConfig { button?: UiItem }

export type ThemeSetup = (args: ServiceList & { fictionEnv: FictionEnv, fictionAdmin: FictionAdmin }) => Promise<Theme>

export class Theme<T extends Record<string, unknown> = Record<string, unknown>> extends FictionPlugin<ThemeSettings<T>> {
  themeId = this.settings.themeId
  templates = this.settings.templates || []
  templateDefaults = vue.computed(() => ({ page: 'wrap', transaction: 'wrap', ...this.settings.templateDefaults }))

  constructor(settings: ThemeSettings<T>) {
    super('Theme', settings)
  }

  async getConfig(args: { site: Site }) {
    const config = await this.settings.getConfig(args)

    const pages = config.pages.map(page => ({ ...page, templateId: page.templateId || this.templateDefaults.value.page }))

    const userConfig = deepMerge([this.defaultConfig(), this.settings.userConfig, config.userConfig])

    return { userConfig, pages, sections: config.sections || {} }
  }

  async toSite(settings: Omit<SiteSettings, 'themeId'>): Promise<Site> {
    const site = await Site.create({ themeId: this.themeId, pages: [], sections: {}, ...settings }, { loadThemePages: true })

    return site
  }

  defaultConfig(): SiteUserConfig {
    return {
      styling: {
        fonts: {
          mono: { fontKey: 'DM Mono', stack: 'monospace' },
          input: { fontKey: 'DM Mono', stack: 'sans' },
          title: { fontKey: 'Poppins', stack: 'sans' },
          sans: { fontKey: 'Plus+Jakarta+Sans', stack: 'sans' },
          body: { stack: 'serif' },
          serif: { stack: 'serif' },
          highlight: { fontKey: 'Caveat', stack: 'sans' },
        },

        isLightMode: false,
      },

      ai: {
        baseInstruction: `As an expert copywriter and web designer, create compelling website content that effectively showcases the subject's expertise and value proposition. Your content should:

  - Be clear, concise, and engaging, avoiding unnecessary jargon or clichés.
  - Adapt the tone and style to suit the subject's industry and target audience.
  - Focus on addressing the key problems and needs of the target customers.
  - Highlight unique selling points and differentiators effectively.
  - Incorporate SEO best practices naturally without compromising readability.
  - Use persuasive language that encourages desired user actions.
  - Ensure content is skimmable with clear headings, bullet points, and short paragraphs.
  - Balance professionalism with approachability as appropriate for the brand.`,
        objectives: {
          about: 'Create a compelling narrative about the subject, highlighting key strengths and values.',
          targetCustomer: 'Identify and address the primary audience, their needs, and pain points.',
          imageStyle: imageStyle.find(i => i.name === 'Grayscale')?.value || '',
        },
      },
    }
  }
}

type CardUserConfig<U extends readonly CardTemplate[]> = CreateUserConfigs<U>

// Base interface without slug
  type BaseCreateCardArgs<
    T extends keyof CardUserConfig<U>,
    U extends readonly CardTemplate[],
    V extends PageRegion,
    W extends CardTemplate | undefined,
    X extends ComponentConstructor | undefined,
  > = {
    templates?: U
    tpl?: W
    templateId?: T | 'wrap'
    el?: X
    userConfig?:
    W extends CardTemplate
      ? ExtractCardTemplateUserConfig<W>
      : X extends ComponentConstructor
        ? ExtractComponentUserConfig<X>
        : U extends readonly CardTemplate[] ? CardUserConfig<U>[T] : Record<string, unknown>
    regionId?: V
    layoutId?: string
    cards?: CardConfigPortable[]
    cardId?: string
    isSystem?: boolean
    slug?: string
    title?: string
    isHome?: boolean
    is404?: boolean
  }

export function createCard<
  T extends keyof CreateUserConfigs<U>,
  U extends readonly CardTemplate[],
  V extends PageRegion,
  W extends CardTemplate | undefined,
  X extends ComponentConstructor | undefined,
>(args: BaseCreateCardArgs<T, U, V, W, X>) {
  const { templates, templateId = 'area', tpl, el } = args

  if (!templateId && !tpl)
    throw new Error('createCard: templateId or tpl required')

  const inlineTemplate = tpl || (el ? new CardTemplate({ el, templateId: `${templateId}-inline` }) : undefined)

  const template = inlineTemplate || templates?.find(template => template.settings.templateId === templateId)

  // Ensure that 'templates' contains 'templateId'
  if (!template && templates) {
    log.error('createCard', `Template with key "${templateId}" not found in provided templates.`, { data: { templates } })
    throw new Error(`createCard: Template not found: "${templateId}"`)
  }

  const templateUserConfig = template?.settings.getBaseConfig ? template?.settings.getBaseConfig({}) as CardUserConfig<U>[T] : {}

  const obj = deepMerge([templateUserConfig, args.userConfig])

  const userConfig = parseObject({ obj, onValue: ({ value }) => typeof value === 'string' ? value.replace('file://', '/@fs') : value })

  const { templates: _, ...rest } = args

  return new Card({ ...rest, inlineTemplate, userConfig }).toConfig() as TableCardConfig
}
