import type { CardConfigPortable, CardTemplate, Site } from '@fiction/site'
import { CardFactory } from '@fiction/site/cardFactory.js'
import { getCardTemplates } from '../index.js'

export async function createDemoPage(args: { site: Site, templateId: string, template: CardTemplate, card: CardConfigPortable }) {
  const { templateId, template, card = {}, site } = args
  const slug = card.slug || `demo-${templateId}`
  const cards = card.cards || []

  const templates = await getCardTemplates()
  const factory = new CardFactory({ templates, site })

  const pg = await factory.create({
    slug,
    templateId: 'wrap',
    baseConfig: {
      seo: {
        title: `${template.settings.title} - Web Element Demo`,
      },
    },
    userConfig: {
      // fixedHeader: true,
    },
    cards: [
      await factory.create({
        templateId: 'hero',
        userConfig: {
          superHeading: template.settings.category?.join(', ').toUpperCase(),
          heading: template.settings.title,
          subHeading: template.settings.description,
          actions: [],
          superColor: template.settings.colorTheme,
          superIcon: template.settings.icon,
        },
      }),
      ...cards,
    ],
  })

  return pg
}
