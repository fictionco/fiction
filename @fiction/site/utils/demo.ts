import type { template as heroTemplate } from '@fiction/cards/content-hero/index.js'
import type { template as cardPageWrapV1Template } from '@fiction/cards/page-wrap/index.js'
import type { CardTemplate, Site } from '@fiction/site'
import { toKebab } from '@fiction/core/index.js'
import { CardFactory } from '../cardFactory.js'

export async function createDemoPage(args: { site: Site, template: CardTemplate<any> }) {
  const { template, site } = args
  const { templateId, title, category, colorTheme, subTitle, description, icon } = template.settings

  const config = await template.getConfig(args)
  const card = config.demoPage || { cards: [] }

  const slug = card.slug || `demo-${toKebab(templateId)}`
  const cards = card.cards || []

  const templates = await site.theme.value.templates

  const factory = new CardFactory({ templates, site, caller: 'createDemoPage' })

  const pg = await factory.fromTemplate<typeof cardPageWrapV1Template>({
    slug,
    templateId: 'cardPageWrapV1',
    baseConfig: { site: { title: `${title} - Web Element Demo` } },
    userConfig: {
      // fixedHeader: true,
    },
    cards: [
      await factory.fromTemplate<typeof heroTemplate>({
        templateId: 'cardHeroV1',
        userConfig: {
          superTitle: {
            text: category?.join(', ').toUpperCase(),
            icon: { format: 'iconClass', class: icon },
            theme: colorTheme,
          },
          title,
          subTitle: subTitle || description?.slice(0, 100),
          action: { buttons: [] },
        },
      }),
      ...cards,
    ],
  })

  return pg
}

export function getThemePreviewUrl(args: { site?: Site, themeId?: string }) {
  const { site, themeId } = args

  if (!site || !themeId) {
    return ''
  }

  const isProd = site.fictionSites.fictionEnv.isProd.value
  const app = site.fictionSites.settings.fictionAppSites
  const base = isProd ? app?.liveUrl.value : app?.localUrl.value
  const url = base.replace('*', `theme-${themeId}`)
  return url
}
