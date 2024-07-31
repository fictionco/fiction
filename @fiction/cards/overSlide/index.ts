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
  return {
    autoSlide: true,
    items: [
      {
        title: 'Forest MontClair',
        subTitle: 'Elite Travel Curator & Lifestyle Architect',
        textBlend: 'difference',
        media: { format: 'url', url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/7028f33c-75f6-477b-2180-27676397c400/public' },
      },
      {
        title: 'Ultra-Luxury Experience Designer',
        subTitle: `Crafting extraordinary experiences for discerning travelers. Let's design your next unforgettable adventure.`,
        textBlend: 'difference',
        media: { format: 'video', url: 'https://videos.pexels.com/video-files/6051210/6051210-uhd_2560_1440_25fps.mp4' },
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
