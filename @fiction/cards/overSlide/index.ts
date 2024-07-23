import { vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import type { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { mediaSchema } from '../schemaSets.js'

const templateId = 'overSlide'

const schema = z.object({
  autoSlide: z.boolean().optional(),
  items: z.array(
    z.object({
      media: mediaSchema.optional(),
      mediaBackground: mediaSchema.optional(),
      title: z.string().optional(),
      subTitle: z.string().optional(),
      href: z.string().optional(),
      textBlend: z.enum(['normal', 'difference']).optional(),
    }),
  ).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
]

async function getDefaultConfig(args: { site: Site }): Promise<UserConfig> {
  // const { site } = args
  // const filenames = [
  //   'profile-man-landscape.png',
  //   'profile-man-computer-landscape.png',
  // ] as const

  // const urls = staticFileUrls({ site, filenames })
  return {
    autoSlide: true,
    items: [
      {
        title: 'Sean Smith',
        subTitle: 'Author and Speaker',
        textBlend: 'difference',
        media: { format: 'url', url: 'https://plus.unsplash.com/premium_photo-1661367915642-12ed8cc242bb?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        mediaBackground: { format: 'url', url: 'https://images.unsplash.com/photo-1482053450283-3e0b78b09a70?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      },
      {
        title: 'Grow Your Business',
        subTitle: `I have helped thousands, are you next?`,
        textBlend: 'difference',
        media: { format: 'video', url: 'https://videos.pexels.com/video-files/7414128/7414128-hd_1920_1080_24fps.mp4' },
        mediaBackground: { format: 'url', url: 'https://images.unsplash.com/photo-1604334532792-04708f86e69e?q=80&w=2052&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      },
    ],
  }
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['marketing', 'portfolio'],
    description: 'Overlayed profile slider, great for showcasing people or services.',
    icon: 'i-tabler-layers-intersect',
    colorTheme: 'teal',
    isPublic: false,
    schema,
    options,
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    getUserConfig: getDefaultConfig,
    demoPage: async (args) => {
      const userConfig = await getDefaultConfig(args)
      return {
        cards: [
          { templateId, userConfig },
        ],
      }
    },
  }),
] as const
