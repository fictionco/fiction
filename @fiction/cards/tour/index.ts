import { type ActionItem, vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { staticFileUrls } from '@fiction/site/utils/site'
import { options as heroOptions, schema as heroSchema } from '../hero/index'

const templateId = 'tour'

const schema = z.object({
  items: z.array(heroSchema).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', options: heroOptions }),
]

async function defaultConfig(args: { site: Site }): Promise<UserConfig> {
  const { site } = args

  const filenames = [
    'showcase-adidas.png',
    'showcase-apple.png',
    'showcase-cocacola.png',
    'showcase-disney.png',
    'showcase-google.png',
    'showcase-microsoft.png',
    'showcase-netflix.png',
    'showcase-nike.png',
    'showcase-spotify.png',
    'showcase-starbucks.png',
    'showcase-tesla.png',
    'showcase-amazon.png',
  ] as const

  const urls = staticFileUrls({ site, filenames })

  return {
    items: [
      {
        heading: 'Brand Revitalization',
        subHeading: 'Breathing new life into established global brands.',
        splash: { url: urls.showcaseDisney },
        layout: 'left' as const,
        overlays: [
          { media: { url: urls.showcaseCocacola }, position: 'bottomLeft' },
          { media: { url: urls.showcaseSpotify }, position: 'topRight' },
        ],
        actions: [
          { name: 'View Projects', href: '#', btn: 'primary' },
          { name: 'Case Studies', href: '#', btn: 'naked' as const },
        ],
        // content: 'Led brand refresh initiatives for Coca-Cola, Nintendo, and Burberry. These projects involved modernizing visual identities while preserving brand heritage, resulting in average engagement increases of 28% across campaigns.'
      },
      {
        heading: 'Digital Experience Design',
        subHeading: 'Crafting intuitive and engaging digital interfaces for tech giants.',
        splash: { url: urls.showcaseAmazon },
        layout: 'right' as const,
        overlays: [{ media: { url: urls.showcaseGoogle }, position: 'bottomLeft' }],
        actions: [
          { name: 'Explore Work', href: '#', btn: 'primary' },
          { name: 'UX Insights', href: '#', btn: 'naked' as const },
        ],
        // content: 'Spearheaded UX/UI redesigns for Google, Spotify, and Amazon. Projects focused on enhancing user engagement, simplifying complex processes, and improving accessibility. Achieved an average 22% increase in user satisfaction scores.'
      },
      {
        heading: 'Integrated Marketing Campaigns',
        subHeading: 'Developing cohesive, multi-channel campaigns for global brands.',
        splash: { url: urls.showcaseMicrosoft },
        overlays: [
          { media: { url: urls.showcaseNike } },
          { media: { url: urls.showcaseApple }, position: 'bottomLeft' },
          { media: { url: urls.showcaseTesla }, position: 'topRight', widthPercent: 15 },
        ],
        actions: [
          { name: 'View Campaigns', href: '#', btn: 'primary' },
          { name: 'Results & Metrics', href: '#', btn: 'naked' as const },
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
    getUserConfig: async args => defaultConfig(args),
    demoPage: async (args) => {
      const userConfig = await defaultConfig(args)
      return {
        cards: [
          { templateId, userConfig },
        ],
      }
    },
  }),
] as const
