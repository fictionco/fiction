import type { FictionEnv, FictionPluginSettings, ServiceList } from '@fiction/core'
import { FictionPlugin, deepMerge, log, parseObject, vue } from '@fiction/core'
import ElButton from '@fiction/ui/ElButton.vue'
import type { FictionAdmin } from '@fiction/admin/index.js'
import type { CreateUserConfigs, ExtractCardTemplateUserConfig, ExtractComponentUserConfig } from './card.js'
import type { CardConfigPortable, PageRegion, SiteUserConfig, TableCardConfig, ThemeUiSize } from './tables.js'
import { Card, CardTemplate } from './card.js'
import { imageStyle } from './util.js'
import type { ComponentConstructor } from './type-utils.js'
import { Site, type SiteSettings } from './site.js'

export type ThemeSettings<T extends Record<string, unknown> = Record<string, unknown>> = {
  root: string
  themeId: string
  title?: string
  version?: string
  description?: string
  screenshot: string
  templates: readonly CardTemplate[] | CardTemplate[]
  ui?: UiConfig
  isPublic?: boolean
  isDarkMode?: boolean
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
  templates = this.settings.templates
  ui = { button: { el: ElButton }, ...this.settings.ui }

  templateDefaults = vue.computed(() => ({ page: 'wrap', transaction: 'wrap', ...this.settings.templateDefaults }))

  constructor(settings: ThemeSettings<T>) {
    super('Theme', settings)
  }

  getUi(args: { elementId: keyof UiConfig }): UiItem {
    const { elementId } = args
    const out = this.ui?.[elementId]

    return out
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
      fonts: {
        mono: { fontKey: 'DM Mono', stack: 'monospace' },
        input: { fontKey: 'DM Mono', stack: 'sans' },
        title: { fontKey: 'Poppins', stack: 'sans' },
        sans: { fontKey: 'Plus+Jakarta+Sans', stack: 'sans' },
        body: { stack: 'serif' },
        serif: { stack: 'serif' },
        highlight: { fontKey: 'Caveat', stack: 'sans' },
      },
      spacing: {
        contentWidthSize: 'md',
        spacingSize: `md`,
      },
      isDarkMode: true,
      ai: {
        baseInstruction: `You are a world-expert copywriter and web designer, create website content designed to subtly persuade using reference info and objectives. Your content should:
  - Be elegant and concise, avoiding redundancy and excessive exclamations. Not cheesy, not cliche. Be creative. Don't be pushy.
  - Don't reuse the name of the site subject in the content, as it's provided elsewhere.
  - Focus on the PROBLEMS of the target customer, in likely context they can be solved by the provider.
  - Use an SEO-friendly approach without compromising the natural flow of information.`,
        objectives: {
          about: 'This is a portfolio website for James Bond, a secret agent working for MI6.',
          targetCustomer: 'The target customers government intelligence agencies, and similar agencies hiring secret agents',
          imageStyle: imageStyle.find(i => i.name === 'Grayscale')?.value || '',
        },
      },
      colors: {
        colorPrimary: 'blue',
        colorTheme: 'gray',
      },
    }
  }

  getSpacingClass(size: ThemeUiSize, direction: 'top' | 'bottom' | 'both' = 'both') {
    const spacingClassesTop = {
      'none': 'pt-0',
      'xs': 'pt-[calc(0.25rem+1vw)]',
      'sm': 'pt-[calc(0.5rem+2vw)]',
      'md': 'pt-[calc(1.5rem+4vw)]',
      'lg': 'pt-[calc(2.5rem+6vw)]',
      'xl': 'pt-[calc(4rem+8vw)]',
      '2xl': 'pt-[calc(6rem+10vw)]',
      '3xl': 'pt-[calc(8rem+12vw)]',
    }
    const spacingClassesBottom = {
      'none': 'pb-0',
      'xs': 'pb-[calc(0.25rem+1vw)]',
      'sm': 'pb-[calc(0.5rem+2vw)]',
      'md': 'pb-[calc(1.5rem+4vw)]',
      'lg': 'pb-[calc(2.5rem+6vw)]',
      'xl': 'pb-[calc(4rem+8vw)]',
      '2xl': 'pb-[calc(6rem+10vw)]',
      '3xl': 'pb-[calc(8rem+12vw)]',
    }

    const parts = []

    if (direction === 'top' || direction === 'both')
      parts.push(spacingClassesTop[size])

    if (direction === 'bottom' || direction === 'both')
      parts.push(spacingClassesBottom[size])

    return parts.join(' ')
  }

  getContentWidthClass(size: ThemeUiSize) {
    const max = 'max-w-none px-4 sm:px-6 lg:px-20 mx-auto'
    const contentWidthClasses = {
      'none': 'mx-auto',
      'xs': 'max-w-screen-md px-5 sm:px-6 lg:px-12 mx-auto',
      'sm': 'max-w-screen-lg px-5 sm:px-6 lg:px-16 mx-auto',
      'md': 'max-w-screen-2xl px-5 sm:px-6 lg:px-20 mx-auto',
      'lg': 'max-w-screen-2xl px-5 sm:px-6 lg:px-20 mx-auto',
      'xl': 'max-w-screen-2xl px-5 sm:px-6 lg:px-10 mx-auto',
      '2xl': 'max-w-[1700px] px-5 sm:px-6 lg:px-20 mx-auto',
      '3xl': max,
    }
    return contentWidthClasses[size] || contentWidthClasses.md
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
    log.error('createCard', `Template with key "${templateId}" not found in provided templates.`)
    throw new Error(`createCard: Template not found: "${templateId}"`)
  }

  const templateUserConfig = template?.settings.userConfig ? template?.settings.userConfig as CardUserConfig<U>[T] : {}

  const obj = deepMerge([templateUserConfig, args.userConfig])

  const userConfig = parseObject({ obj, onValue: ({ value }) => typeof value === 'string' ? value.replace('file://', '/@fs') : value })

  const { templates: _, ...rest } = args

  return new Card({ ...rest, inlineTemplate, userConfig }).toConfig() as TableCardConfig
}
