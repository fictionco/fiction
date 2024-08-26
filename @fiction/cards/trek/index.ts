import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { stockMediaHandler } from '../stock/index.js'

const templateId = 'trek'

const schema = z.object({
  items: z.array(z.object({
    header: z.string().optional(),
    subHeader: z.string().optional(),
    media: z.object({
      url: z.string().optional(),
      video: z.string().optional(),
      format: z.enum(['url', 'video', 'image']).optional(),
    }).optional(),
    actions: z.array(z.object({
      name: z.string().optional(),
      href: z.string().optional(),
      theme: z.enum(['primary', 'default']).optional(),
    })).optional(),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', options: [
    new InputOption({ key: 'header', label: 'Header', input: 'InputText' }),
    new InputOption({ key: 'subHeader', label: 'Sub Header', input: 'InputText' }),
    new InputOption({ key: 'media', label: 'Media', input: 'InputMediaDisplay' }),
  ] }),
]

async function defaultConfig(): Promise<UserConfig> {
  return {
    items: [
      {
        header: `Title Goes Here`,
        subHeader: `Subtitle or tagline goes here.`,
        media: stockMediaHandler.getRandomByTags(['background', 'video']),
        actions: [{ name: 'Button Label', href: '#' }],
      },
      {
        header: `Another Title`,
        subHeader: `Secondary subtitle or brief description.`,
        media: stockMediaHandler.getRandomByTags(['background', 'video']),
        actions: [{ name: 'Button Label', href: '#' }],
      },
      {
        header: 'Exhibit Title Here',
        subHeader: 'Brief description of the exhibit or event.',
        media: stockMediaHandler.getRandomByTags(['background', 'video']),
      },
      {
        header: `Call to Action Title`,
        subHeader: `Encouraging statement or invitation to connect.`,
        media: stockMediaHandler.getRandomByTags(['background', 'video']),
        actions: [{ name: 'Button Label', href: '#' }],
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
