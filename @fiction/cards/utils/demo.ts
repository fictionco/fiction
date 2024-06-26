import type { CardConfigPortable, CardTemplate } from '@fiction/site'
import { createCard } from '@fiction/site'
import { standardCardTemplates } from '../index.js'

export function createDemoPage(args: { templateId: string, template: CardTemplate, cards: CardConfigPortable[] }) {
  const { templateId, template, cards = [] } = args
  return createCard({
    slug: `demo-${templateId}`,
    cards: [
      createCard({ templateId: 'hero', templates: standardCardTemplates, userConfig: {
        superHeading: template.settings.category?.join(', '),
        heading: template.settings.title,
        subHeading: template.settings.description,
        actions: [],
      } }),
      ...cards,
    ],
  })
}
