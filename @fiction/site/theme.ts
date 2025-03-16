import type { FictionAdmin } from '@fiction/admin/index.js'
import type { ColorThemeBright, CoreServices, FictionEnv, Organization, ServiceList } from '@fiction/core'
import type { CardTemplate } from './card.js'
import type { SiteUserConfig } from './schema.js'
import type { SiteSettings } from './site.js'
import type { TableCardConfig } from './tables.js'
import { deepMerge, FictionObject, toLabel, vue } from '@fiction/core'
import { CardFactory } from './cardFactory.js'
import { Site } from './site.js'

type ThemeCategory = 'blog' | 'portfolio' | 'business' | 'personal' | 'ecommerce' | 'landing' | 'internal'

export type ThemeConfig = {
  userConfig?: SiteUserConfig
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

export type ThemeSettings<T extends Record<string, unknown> = Record<string, unknown>> = {

  getTemplates?: () => Promise<CardTemplate<any>[]>
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

  async loadThemeTemplates() {
    if (!this.templates.length)
      this.templates = await this.settings.getTemplates?.() || []
  }

  async getThemeConfig(args: { site: Site }) {
    const { site } = args
    await this.loadThemeTemplates()
    const factory = new CardFactory({ site, templates: this.templates, caller: 'Theme.getConfig' })
    const themeBaseConfig = this.settings.getBaseConfig?.()
    const baseConfig = deepMerge([this.defaultConfig(), themeBaseConfig])
    const config = await this.settings.getConfig({
      site,
      factory,
      baseConfig,
      templates: this.templates,
    })

    const mergedConfig = deepMerge([baseConfig, config])

    const pages = mergedConfig.pages?.map(page => ({ ...page, templateId: page.templateId || this.templateDefaults.value.page }))

    return { ...mergedConfig, pages, sections: config.sections || {} }
  }

  async toSite(settings: Omit<SiteSettings, 'themeId'>): Promise<Site> {
    const site = await Site.create({ themeId: this.themeId, pages: [], sections: {}, ...settings }, { loadThemePages: true })
    return site
  }

  defaultConfig(): ThemeConfig {
    return {
      userConfig: {
        site: {
          prefersColorScheme: 'dark',
          fonts: {
            mono: { family: 'DM Mono', stack: 'monospace' },
            input: { family: 'DM Mono', stack: 'sans' },
            title: { family: 'Poppins', stack: 'sans' },
            sans: { family: 'Plus+Jakarta+Sans', stack: 'sans' },
            body: { stack: 'serif' },
            serif: { stack: 'serif' },
            highlight: { family: 'Caveat', stack: 'sans' },
          },
        },
      },
    }
  }
}
