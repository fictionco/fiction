import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import type { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { mediaSchema } from '../schemaSets.js'
import { stockMediaHandler } from '../stock/index.js'

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

async function getDefaultConfig(): Promise<UserConfig> {
  return {
    autoSlide: true,
    items: [
      {
        title: 'First and Last Name',
        subTitle: 'Author and Speaker',
        textBlend: 'difference' as const,
        media: stockMediaHandler.getRandomByTags(['person', 'aspect:landscape']),
      },
      {
        title: 'Clever Headline',
        subTitle: 'Clever Headline Subtitle',
        textBlend: 'difference' as const,
        media: stockMediaHandler.getRandomByTags(['person', 'aspect:landscape', 'video']),
      },
      {
        title: 'Upcoming Event',
        subTitle: 'Speaking at Global Leadership Summit',
        textBlend: 'difference' as const,
        media: stockMediaHandler.getRandomByTags(['aspect:landscape']),
      },
      {
        title: 'Design Your Future',
        subTitle: 'Join My Coaching Program',
        textBlend: 'difference' as const,
        media: stockMediaHandler.getRandomByTags(['aspect:landscape']),
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
    getBaseConfig: () => ({ standard: { spacing: { verticalSpacing: 'sm' } } }),
    getUserConfig: () => getDefaultConfig(),
    demoPage: async () => {
      const userConfig = await getDefaultConfig()
      return {
        cards: [
          { templateId, userConfig },
        ],
      }
    },
  }),
] as const
