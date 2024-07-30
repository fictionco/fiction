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
  })).optional(),
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
        header: `Meet Tom`,
        subHeader: `Visionary Creative Director shaping brand narratives.`,
        media: { url: 'https://videos.pexels.com/video-files/7251409/7251409-uhd_1440_2560_25fps.mp4', format: 'video' },
        actions: [{ name: 'Learn More', href: '#' }],
      },
      {
        header: `NYC Creative Director`,
        subHeader: `Tom's work has been featured in the New York Times.`,
        media: { url: `https://videos.pexels.com/video-files/5828488/5828488-uhd_1440_2560_24fps.mp4`, format: 'video' },

        actions: [{ name: 'Learn More', href: '#' }],
      },
      {
        header: 'The Williams Exhibit',
        subHeader: 'Check out Tom\'s latest exhibit at the Williams Gallery.',
        media: { url: 'https://videos.pexels.com/video-files/1713836/1713836-hd_1080_1920_30fps.mp4', format: 'video' },

      },
      {
        header: `Let's Connect`,
        subHeader: `Tom is always looking for new collaborators. Reach out to him today.`,
        media: { url: 'https://videos.pexels.com/video-files/1884287/1884287-hd_720_1280_30fps.mp4', format: 'video' },
        actions: [{ name: 'Learn More', href: '#' }],
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
    getBaseConfig: () => {
      return { standard: { spacing: { contentWidth: 'none' } } }
    },
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
