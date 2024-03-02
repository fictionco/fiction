import { standardCardTemplates as templates } from './cards'
import { themeCard } from './theme'

export const page404 = themeCard({
  templates,
  regionId: 'main',
  templateId: 'wrap',
  slug: '_404',
  title: 'Not Found',
  cards: [
    themeCard({
      templates,
      templateId: '404',
      userConfig: {
        heading: 'Nothing here',
      },
    }),
  ],
})
