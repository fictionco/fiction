import { MediaBasicSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { stockMediaHandler } from '@fiction/ui/stock/index.js'
import { z } from 'zod'

const templateId = 'overSlide'

const schema = z.object({
  autoSlide: z.boolean().optional(),
  items: z.array(
    z.object({
      media: MediaBasicSchema.optional(),
      title: z.string().optional(),
      subTitle: z.string().optional(),
      textBlend: z.enum(['normal', 'difference']).optional(),
    }),
  ).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'autoSlide', label: 'Animate slide transition?', input: 'InputToggle' }),
  new InputOption({ key: 'items', label: 'Slides', input: 'InputList', props: { itemName: 'Slide' }, options: [
    new InputOption({ key: 'media', label: 'Media', input: 'InputMedia' }),
    new InputOption({ key: 'title', label: 'Title', input: 'InputText' }),
    new InputOption({ key: 'subTitle', label: 'Sub Title', input: 'InputText' }),
    new InputOption({ key: 'textBlend', label: 'Text Blend', input: 'InputSelect', list: [
      { name: 'Normal', value: 'normal' },
      { name: 'Difference', value: 'difference' },
    ] }),
  ] }),
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
  cardTemplate({
    templateId,
    category: ['marketing', 'portfolio'],
    description: 'Overlayed profile slider, great for showcasing people or services.',
    icon: 'i-tabler-layers-intersect',
    colorTheme: 'teal',
    isPublic: true,
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
