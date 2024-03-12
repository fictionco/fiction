import type { FictionMedia, Processor } from '@fiction/core'
import { FictionObject, ObjectProcessor, deepMerge, isNode, log, parseObject, vue } from '@fiction/core'
import ElButton from '@fiction/ui/ElButton.vue'
import type { FontConfig } from '@fiction/core/utils/fonts'
import type { CardTemplate, CreateUserConfigs, ExtractCardTemplateUserConfig } from './card'
import type { CardConfigPortable, PageRegion, SiteUserConfig, TableCardConfig, TableSiteConfig } from './tables'
import { Card } from './card'
import { imageStyle, processUrlKey } from './util'

export type ThemeSettings = {
  themeId: string
  title?: string
  version?: string
  description?: string
  screenshot: string
  pages: TableCardConfig[]
  templates: readonly CardTemplate[] | CardTemplate[]
  ui?: UiConfig
  isPublic?: boolean
  fontConfig?: FontConfig
  spacing?: {
    contentWidthClass?: string
    spacingClass?: string
  }
  userConfig?: Partial<SiteUserConfig>
  sections?: Record<string, TableCardConfig>
}

export type UiItem = { el: vue.Component }
export interface UiConfig { button?: UiItem }

export class Theme extends FictionObject<ThemeSettings> {
  themeId = this.settings.themeId
  templates = this.settings.templates

  ui = { button: { el: ElButton }, ...this.settings.ui }
  pages = vue.computed(() => (this.settings.pages || []))
  constructor(settings: ThemeSettings) {
    super('Theme', settings)
  }

  getUi(args: { elementId: keyof UiConfig }): UiItem {
    const { elementId } = args
    const out = this.ui?.[elementId]

    return out
  }

  toSite(): Partial<TableSiteConfig> {
    return {
      themeId: this.themeId,
      pages: this.pages.value,
      userConfig: deepMerge([{ ai: this.ai() }, this.settings.userConfig]),
    }
  }

  async processToSite(args: {
    orgId: string
    userId: string
    fictionMedia?: FictionMedia
  }): Promise<Partial<TableSiteConfig>> {
    const { orgId, userId, fictionMedia } = args
    if (!fictionMedia)
      throw new Error('fictionMedia required')

    const processors: Processor<string>[] = [
      {
        condition: async ({ value }) => {
          if (typeof value !== 'string')
            return false

          try {
            // handle case where url is in a test that contains 'window' and browser-like import.meta.url
            const url = new URL(value, 'http://dummybase') // Handle relative URLs
            return url.protocol === 'file:' || url.toString().includes('@fs') || (isNode() && url.toString().includes('localhost'))
          }
          catch {
            return false // Return false for invalid URLs
          }
        },
        action: async (url) => {
          return await processUrlKey({ fictionMedia, url, userId, orgId, storagePath: this.themeId })
        },
      },
    ]
    const configProcessor = new ObjectProcessor(processors)

    const siteRaw = this.toSite()

    const site = await configProcessor.parseObject(siteRaw)

    return site
  }

  config() {
    return {
      fonts: this.fonts(),
      spacing: this.spacing(),
      ...this.ai(),
      colors: this.colors(),
    }
  }

  fonts() {
    const baseConfig = {
      mono: { fontKey: 'DM Mono', stack: 'monospace' },
      input: { fontKey: 'DM Mono', stack: 'sans' },
      title: { fontKey: 'Poppins', stack: 'sans' },
      sans: { stack: 'sans' },
      body: { stack: 'serif' },
      serif: { stack: 'serif' },
    }
    return { ...baseConfig, ...this.settings.fontConfig } as FontConfig
  }

  spacing() {
    return {
      // contentWidthClass: 'max-w-screen-2xl px-4 sm:px-6 lg:px-20 mx-auto',
      // spacingClass: `py-[calc(1.5rem+4vw)]`,
      ...this.settings.spacing,
    }
  }

  colors() {
    return {
      colorPrimary: 'blue',
      colorTheme: 'gray',
      isDarkMode: false,
    }
  }

  ai() {
    return {
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
    }
  }
}

type CardUserConfig<U extends readonly CardTemplate[]> = CreateUserConfigs<U>
// Base interface without slug
type BaseThemeCardArgs<
T extends keyof CardUserConfig<U>,
U extends readonly CardTemplate[],
V extends PageRegion,
W extends CardTemplate | undefined,
> = {
  templates?: U
  tpl?: W
  templateId?: T | 'wrap'
  userConfig?: W extends CardTemplate ? ExtractCardTemplateUserConfig<W> : CardUserConfig<U>[T]
  regionId?: V
  layoutId?: string
  cards?: CardConfigPortable[]
  slug?: string
  title?: string
  isHome?: boolean
  is404?: boolean
}

export function themeCard<
T extends keyof CreateUserConfigs<U>,
U extends readonly CardTemplate[],
V extends PageRegion,
W extends CardTemplate | undefined,
>(args: BaseThemeCardArgs<T, U, V, W>) {
  const { templates, templateId = 'area', tpl } = args

  if (!templateId && !tpl)
    throw new Error('themeCard: templateId or tpl required')

  const template = tpl || templates?.find(template => template.settings.templateId === templateId)

  // Ensure that 'templates' contains 'templateId'
  if (!template) {
    log.error('themeCard', `Template with key "${templateId}" not found in provided templates.`)
    throw new Error(`themeCard: Template not found: "${templateId}"`)
  }

  const templateUserConfig = template.settings.userConfig ? template.settings.userConfig as CardUserConfig<U>[T] : {}

  const obj = deepMerge([templateUserConfig, args.userConfig])

  const userConfig = parseObject({ obj, onValue: ({ value }) => typeof value === 'string' ? value.replace('file://', '/@fs') : value })

  const { templates: _, ...rest } = args

  return new Card({ ...rest, userConfig }).toConfig() as TableCardConfig
}
