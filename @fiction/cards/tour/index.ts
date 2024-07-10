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
    'tour-clownfish.jpg',
    'tour-ukraine.jpg',
    'tour-farm.jpg',
    'tour-dogs.jpg',
    'tour-dogs2.jpg',
    'tour-dogs3.jpg',
    'tour-fish.jpg',
    'tour-savannah.jpg',
    'tour-asian.jpg',
  ] as const

  const urls = staticFileUrls({ site, filenames })

  return {
    items: [
      {
        heading: 'The Life of Dogs',
        subHeading: 'Perfect for pet lovers looking to add a touch of canine charm to their space.',
        splash: { url: urls.tourDogs },
        layout: 'left' as const,
        overlays: [{ media: { url: urls.tourDogs2 }, position: 'bottomLeft' }, { media: { url: urls.tourDogs3 }, position: 'topRight' }],
        actions: [
          { name: 'View Dog Gallery', href: '#', btn: 'primary' },
          { name: 'Contact Me', href: '#', btn: 'naked' as const },
        ],
      },
      {
        heading: 'Under the Sea',
        subHeading: 'Illustrations to take you underneath the waves.',
        splash: { url: urls.tourFish },
        layout: 'right' as const,
        overlays: [{ media: { url: urls.tourClownfish }, position: 'bottomLeft' }],
        actions: [
          { name: 'View Dog Gallery', href: '#', btn: 'primary' },
          { name: 'Contact Me', href: '#', btn: 'naked' as const },
        ],
      },
      {
        heading: 'Landscape Illustrations',
        subHeading: 'Ideal for adding serene and picturesque views to your decor.',
        splash: { url: urls.tourAsian },
        overlays: [
          { media: { url: urls.tourFarm } },
          { media: { url: urls.tourSavannah }, position: 'bottomLeft' },
          { media: { url: urls.tourUkraine }, position: 'topRight', widthPercent: 15 },
        ],
        actions: [
          { name: 'View Landscapes', href: '#', btn: 'primary' },
          { name: 'Contact Me', href: '#', btn: 'naked' as const },
        ],
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
    options,
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
