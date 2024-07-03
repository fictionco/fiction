import type { CardConfigPortable, CardTemplate } from '@fiction/site'
import { createCard } from '@fiction/site'
import { standardCardTemplates } from '../index.js'

export function createDemoPage(args: { templateId: string, template: CardTemplate, cards: CardConfigPortable[], slug?: string }) {
  const { templateId, template, cards = [] } = args
  const slug = args.slug || `demo-${templateId}`
  return createCard({
    slug,
    cards: [
      createCard({ templateId: 'hero', templates: standardCardTemplates, userConfig: {
        superHeading: template.settings.category?.join(', '),
        heading: template.settings.title,
        subHeading: template.settings.description,
        actions: [],
        superColor: template.settings.colorTheme,
        superIcon: template.settings.icon,
      } }),
      ...cards,
    ],
  })
}
