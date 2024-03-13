import { standardCardTemplates as templates } from './cards'
import { createCard } from './theme'

export const page404 = createCard({
  templates,
  regionId: 'main',
  templateId: 'wrap',
  slug: '_404',
  title: 'Not Found',
  cards: [
    createCard({
      templates,
      templateId: '404',
      userConfig: {
        heading: 'Nothing here',
      },
    }),
  ],
})
