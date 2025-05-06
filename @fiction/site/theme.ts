import type { FictionAdmin } from '@fiction/admin/index.js'
import type { ColorThemeBright, CoreServices, FictionEnv, MediaObject, Organization, ServiceList } from '@fiction/core'
import type { CardTemplate } from './card.js'
import type { SiteGlobalUserConfig } from './schema.js'
import type { SiteSettings } from './site.js'
import type { CardConfigPortable, TableCardConfig } from './tables.js'
import { cardConfig } from '@fiction/cards/index.js'
import { deepMerge, FictionObject, toLabel, vue } from '@fiction/core'
import { CardFactory } from './cardFactory.js'
import { Site } from './site.js'

type ThemeCategory = 'blog' | 'portfolio' | 'business' | 'personal' | 'ecommerce' | 'landing' | 'internal'

export type ThemeConfig = {
  userConfig?: SiteGlobalUserConfig
  pages?: TableCardConfig[]
  sections?: Record<string, TableCardConfig>
  onMounted?: (args: { service: CoreServices }) => (void | Promise<void>)
  org?: Partial<Organization>
}

export type ThemeConfigArgs = {
  site: Site
  factory: CardFactory
  baseConfig: ThemeConfig
  templates: CardTemplate<any>[]
  isNewSite?: boolean
}

export type ThemeMeta = {
  root: string
  themeId: string
  title?: string
  version?: string
  subTitle?: string
  category?: ThemeCategory[]
  icon?: string
  colorTheme?: ColorThemeBright
  description?: string
  screenshots?: { light?: { desktop?: string, mobile?: string }, dark?: { desktop?: string, mobile?: string } }
  isPublic?: boolean
}

export type PageTemplate = {
  pageTemplateId: string
  title: string
  description: string
  icon?: MediaObject
  getCards: (args: { site: Site }) => Promise<CardConfigPortable[]>
}

export type ThemeSettings<T extends Record<string, unknown> = Record<string, unknown>> = {

  getTemplates?: (args: { site: Site }) => Promise<CardTemplate<any>[]>
  getPageTemplates?: () => PageTemplate[]
  getBaseConfig?: () => Partial<ThemeConfig> & { userConfig: T }
  getConfig: (args: ThemeConfigArgs) => Promise<ThemeConfig>

  templateDefaults?: {
    page?: string
    transaction?: string
  }
} & ThemeMeta

export type ThemeSetup = (args: ServiceList & { fictionEnv: FictionEnv, fictionAdmin: FictionAdmin }) => Promise<Theme>

export class Theme<T extends Record<string, unknown> = Record<string, unknown>> extends FictionObject<ThemeSettings<T>> {
  themeId = this.settings.themeId
  title = this.settings.title || toLabel(this.themeId)
  templates: CardTemplate<any>[] = []
  templateDefaults = vue.computed(() => ({ page: 'cardPageWrapV1', transaction: 'cardPageWrapV1', ...this.settings.templateDefaults }))

  constructor(settings: ThemeSettings<T>) {
    super('Theme', settings)
  }

  async loadThemeTemplates(args: { site: Site }) {
    if (!this.templates.length)
      this.templates = await this.settings.getTemplates?.(args) || []
  }

  async getThemeConfig(args: { site: Site, isNewSite?: boolean }) {
    const { site, isNewSite } = args
    await this.loadThemeTemplates(args)
    const factory = new CardFactory({ site, templates: this.templates, caller: 'Theme.getConfig' })
    const themeBaseConfig = this.settings.getBaseConfig?.()
    const defaultConfig = await this.defaultConfig()
    const baseConfig = deepMerge([defaultConfig, themeBaseConfig])
    const config = await this.settings.getConfig({
      site,
      factory,
      baseConfig,
      templates: this.templates,
      isNewSite,
    })

    const mergedConfig = deepMerge([baseConfig, config])

    const pages = mergedConfig.pages?.map(page => ({ ...page, templateId: page.templateId || this.templateDefaults.value.page }))

    return {
      ...mergedConfig,
      pages,
    }
  }

  async toSite(settings: Omit<SiteSettings, 'themeId'>): Promise<Site> {
    const site = await Site.create({ themeId: this.themeId, pages: [], sections: {}, ...settings }, { isNewSite: true })

    return site
  }

  async defaultConfig(): Promise<Promise<Promise<Promise<ThemeConfig>>>> {
    return {
      sections: {
        header: cardConfig({
          cards: [
            cardConfig({ templateId: 'cardSiteNavV1' }),
          ],
        }),
        footer: cardConfig({
          cards: [
            cardConfig({ templateId: 'cardStandardFooterV1' }),
          ],
        }),
        hidden: cardConfig({
          cards: [
            cardConfig({ templateId: 'cardModalMediaV1' }),
            cardConfig({ templateId: 'cardTextEffectV1' }),
            cardConfig({ templateId: 'cardCaptureV1' }),
          ],
        }),
      },
      userConfig: {
        standard: {
          fonts: {
            mono: { family: 'DM Mono', stack: 'monospace' },
            input: { family: 'DM Mono', stack: 'sans' },
            title: { family: 'Poppins', stack: 'sans' },
            sans: { stack: 'sans' },
            body: { stack: 'sans' },
            serif: { family: 'lora', stack: 'serif' },
            highlight: { family: 'Caveat', stack: 'sans' },
          },
        },
      },
      org: {
        orgName: 'No Organization',
      },
    }
  }
}
