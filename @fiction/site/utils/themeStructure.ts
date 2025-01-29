import type { FictionRouter } from '@fiction/core'
import type { FictionSites, Theme } from '@fiction/site'
import { Site } from '@fiction/site'

export class ThemeStructureGenerator {
  themes: Theme[]
  fictionSites: FictionSites
  fictionRouterSites: FictionRouter
  mode?: 'simple' | 'complete'
  constructor(args: {
    themes: Theme[]
    fictionSites: FictionSites
    fictionRouterSites: FictionRouter
    mode?: 'simple' | 'complete'
  }) {
    this.themes = args.themes.filter(t => t.settings.isPublic)
    this.fictionSites = args.fictionSites
    this.fictionRouterSites = args.fictionRouterSites
    this.mode = args.mode || 'simple'
  }

  private async processTheme(theme: Theme) {
    const { settings } = theme

    const site = await Site.create({
      siteId: `processTheme-${theme.themeId}`,
      themeId: theme.themeId,
      fictionSites: this.fictionSites,
      siteRouter: this.fictionRouterSites,
    })

    const out: Record<string, any> = {
      themeId: settings.themeId,
      title: settings.title,
      description: settings.description || 'NO_DESCRIPTION',
      subTitle: settings.subTitle || 'NO_SUBTITLE',
      category: settings.category,
      icon: settings.icon,
      colorTheme: settings.colorTheme,
      isPublic: settings.isPublic,
    }

    if (this.mode === 'complete') {
      out.config = await theme.getThemeConfig({ site })
      out.templates = theme.templates.map(t => t.settings.templateId)
    }

    return out
  }

  async generateStructure() {
    const structure = {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      theme: await Promise.all(this.themes.map(t => this.processTheme(t))),
    }

    return {
      json: JSON.stringify(structure, null, 2),
      data: structure,
    }
  }
}

export async function generateThemeStructure(args: {
  themes: Theme[]
  fictionSites: FictionSites
  fictionRouterSites: FictionRouter
}) {
  const { themes, fictionSites, fictionRouterSites } = args

  const generator = new ThemeStructureGenerator({ themes, fictionSites, fictionRouterSites, mode: 'complete' })
  return await generator.generateStructure()
}
