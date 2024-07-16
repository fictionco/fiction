import { vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { staticFileUrls } from '@fiction/site/utils/site'

const templateId = 'trek'

const schema = z.object({
  items: z.array(z.object({
    header: z.string().optional(),
    subHeader: z.string().optional(),
    media: z.object({
      url: z.string().optional(),
      video: z.string().optional(),
      format: z.enum(['url', 'video']).optional(),
    }).optional(),
    actions: z.array(z.object({
      name: z.string().optional(),
      href: z.string().optional(),
      btn: z.enum(['primary', 'default', 'minimal']).optional(),
    })).optional(),
  })),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', options: [
    new InputOption({ key: 'header', label: 'Header', input: 'InputText' }),
    new InputOption({ key: 'subHeader', label: 'Sub Header', input: 'InputText' }),
    new InputOption({ key: 'media', label: 'Media', input: 'InputMediaDispay' }),
  ] }),
]

async function defaultConfig(args: { site: Site }): Promise<UserConfig> {
  const { site } = args

  const filenames = ['trek-1.png', 'trek-2.png', 'trek-3.png', 'trek-4.png'] as const

  const urls = staticFileUrls({ site, filenames })

  return {
    items: [
      {
        header: `Gearing Up`,
        subHeader: `Get ready to embark on an interstellar journey.`,
        media: { url: 'https://cdn.pixabay.com/video/2023/08/09/175331-853193735_large.mp4', format: 'video' },
        actions: [{ name: 'Learn More', href: 'https://en.wikipedia.org/wiki/Star_Trek' }],
      },
      {
        header: `Space Station`,
        subHeader: `Experience the daily life of an astronaut.`,
        media: { url: 'https://cdn.pixabay.com/video/2024/05/06/210886_large.mp4', format: 'video' },
        actions: [{ name: 'Learn More', href: 'https://en.wikipedia.org/wiki/Star_Trek' }],
      },
      {
        header: `Uncharted Worlds`,
        subHeader: `Set foot on planets beyond our solar system.`,
        media: { url: 'https://cdn.pixabay.com/video/2024/06/09/216034_large.mp4', format: 'video' },

      },
      {
        header: `Galactic Discoveries`,
        subHeader: `Share your experiences and newfound knowledge with the world.`,
        media: { url: urls.trek4, format: 'url' },
        actions: [{ name: 'Learn More', href: 'https://en.wikipedia.org/wiki/Star_Trek' }],
      },
    ],
  }
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['content'],
    description: 'A tour card with sticky content and parallaxed images',
    icon: 'i-tabler-compass',
    colorTheme: 'blue',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    options,
    schema,
    isPublic: false,
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
