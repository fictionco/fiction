import type { CardConfigPortable, CardTemplate } from '@fiction/site'
import { createCard } from '@fiction/site'
import { getCardTemplates } from '../index.js'

export async function createDemoPage(args: { templateId: string, template: CardTemplate, card: CardConfigPortable }) {
  const { templateId, template, card = {} } = args
  const slug = card.slug || `demo-${templateId}`
  const cards = card.cards || []

  const templates = await getCardTemplates()

  return createCard({
    slug,
    templateId: 'wrap',
    templates,
    userConfig: {
      // fixedHeader: true,
    },
    cards: [
      createCard({
        templateId: 'hero',
        templates,
        userConfig: {
          superHeading: template.settings.category?.join(', ').toUpperCase(),
          heading: template.settings.title,
          subHeading: template.settings.description,
          actions: [],
          superColor: template.settings.colorTheme,
          superIcon: template.settings.icon,
          // spacing: { spacingSize: '2xl' },
          // bg: {
          //   format: 'url',
          //   url: 'https://images.unsplash.com/photo-1488554378835-f7acf46e6c98?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          //   overlay: { color: '#000000', opacity: 0.5 },
          // },
        },
      }),
      ...cards,
    ],
  })
}
