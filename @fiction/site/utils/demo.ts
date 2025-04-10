import type { CardTemplate, Site } from '@fiction/site'
import { cardConfig } from '@fiction/cards/index.js'
import { toKebab } from '@fiction/core/index.js'

export async function createDemoPage(args: { site: Site, template: CardTemplate<any> }) {
  const { template } = args
  const { templateId, title, category, colorTheme, subTitle, description, icon } = template.settings

  const config = await template.getConfig(args)
  const card = config.demoPage || { cards: [] }

  const slug = card.slug || `demo-${toKebab(templateId)}`
  const cards = card.cards || []

  const pg = cardConfig({
    slug,
    templateId: 'cardPageWrapV1',
    userConfig: {
      standard: { title: `${title} - Web Element Demo` },
    },
    cards: [
      cardConfig ({
        templateId: 'cardHeroV1',
        userConfig: {
          items: [
            {
              superTitle: {
                text: category?.join(', ').toUpperCase(),
                icon: typeof icon === 'string' ? { class: icon } : icon,
                theme: colorTheme,
              },
              title,
              subTitle: subTitle || description?.slice(0, 100),
              action: { buttons: [] },
            },
          ],
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
