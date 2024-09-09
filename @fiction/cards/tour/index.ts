import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { stockMediaHandler } from '@fiction/ui/stock/index.js'
import { z } from 'zod'
import { options as heroOptions, schema as heroSchema } from '../hero/index'

const templateId = 'tour'

const schema = z.object({
  items: z.array(heroSchema).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', options: heroOptions }),
]

async function defaultConfig(): Promise<UserConfig> {
  return {
    items: [
      {
        heading: 'Catchy Headline',
        subHeading: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        splash: stockMediaHandler.getRandomByTags(['object', 'aspect:landscape']),
        layout: 'left' as const,
        overlays: [
          { media: stockMediaHandler.getRandomByTags(['object', 'aspect:landscape']), position: 'bottomLeft' },
          { media: stockMediaHandler.getRandomByTags(['object', 'aspect:landscape']), position: 'topRight' },
        ],
        actions: [
          { name: 'View Projects', href: '#', theme: 'primary' },
          { name: 'Case Studies', href: '#', design: 'textOnly' },
        ],
        // content: 'Led brand refresh initiatives for Coca-Cola, Nintendo, and Burberry. These projects involved modernizing visual identities while preserving brand heritage, resulting in average engagement increases of 28% across campaigns.'
      },
      {
        heading: 'Another Catchy Headline',
        subHeading: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        splash: stockMediaHandler.getRandomByTags(['object', 'aspect:landscape']),
        layout: 'right' as const,
        overlays: [{ media: stockMediaHandler.getRandomByTags(['aspect:square']), position: 'bottomLeft' }],
        actions: [
          { name: 'Explore Work', href: '#', theme: 'primary' },
          { name: 'UX Insights', href: '#', theme: 'naked' as const },
        ],
        // content: 'Spearheaded UX/UI redesigns for Google, Spotify, and Amazon. Projects focused on enhancing user engagement, simplifying complex processes, and improving accessibility. Achieved an average 22% increase in user satisfaction scores.'
      },
      {
        heading: 'Yet Another Catchy Headline',
        subHeading: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        splash: stockMediaHandler.getRandomByTags(['background', 'aspect:landscape', 'video']),
        overlays: [
          { media: stockMediaHandler.getRandomByTags(['object', 'aspect:landscape']) },
          { media: stockMediaHandler.getRandomByTags(['object', 'aspect:square']), position: 'bottomLeft' },
          { media: stockMediaHandler.getRandomByTags(['object', 'aspect:portrait']), position: 'topRight', widthPercent: 15 },
        ],
        actions: [
          { name: 'View Campaigns', href: '#', theme: 'primary' },
          { name: 'Results & Metrics', href: '#', theme: 'naked' as const },
        ],
      //  content: 'Created and executed integrated marketing campaigns for Nike, Apple, and Starbucks. These campaigns spanned digital, print, and experiential mediums, driving brand awareness and sales. Notable achievements include a 45% boost in social media engagement for Nike and a 30% increase in product launch sales for Apple.'
      },
    ],
  }
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['marketing'],
    description: 'A tour section with left and right hero images and text',
    icon: 'i-tabler-compass',
    colorTheme: 'green',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    schema,
    options,
    isPublic: true,
    getUserConfig: async () => defaultConfig(),
    demoPage: async () => {
      const userConfig = await defaultConfig()
      return {
        cards: [
          { templateId, userConfig },
        ],
      }
    },
  }),
] as const
