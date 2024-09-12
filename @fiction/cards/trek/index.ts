import { colorThemeUser, MediaBasicSchema, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { stockMediaHandler } from '@fiction/ui/stock/index.js'
import { z } from 'zod'

const templateId = 'trek'

const schema = z.object({
  items: z.array(z.object({
    title: z.string().optional().describe('Title of the tour item'),
    content: z.string().optional().describe('content or tagline of the tour item'),
    media: MediaBasicSchema.optional().describe('Media for the tour item'),
    actions: z.array(z.object({
      name: z.string().optional(),
      href: z.string().optional(),
      theme: z.enum(colorThemeUser).optional(),
    })).optional().describe('Action buttons for item'),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', props: { itemName: 'Tour Item' }, options: [
    new InputOption({ key: 'title', label: 'Title', input: 'InputText' }),
    new InputOption({ key: 'content', label: 'Content', input: 'InputText' }),
    new InputOption({ key: 'media', label: 'Media', input: 'InputMedia' }),
    new InputOption({ key: 'actions', label: 'Actions', input: 'InputList', options: [
      new InputOption({ key: 'name', label: 'Button Label', input: 'InputText' }),
      new InputOption({ key: 'href', label: 'Button Link', input: 'InputText' }),
      new InputOption({ key: 'theme', label: 'Button Theme', input: 'InputSelect', list: colorThemeUser }),
    ] }),
  ] }),
]

async function defaultConfig(): Promise<UserConfig> {
  return {
    items: [
      {
        title: `Title Goes Here`,
        content: `Content or tagline goes here.`,
        media: stockMediaHandler.getRandomByTags(['background', 'video']),
        actions: [{ name: 'Button Label', href: '#' }],
      },
      {
        title: `Another Title`,
        content: `Secondary content or brief description.`,
        media: stockMediaHandler.getRandomByTags(['background', 'video']),
        actions: [{ name: 'Button Label', href: '#' }],
      },
      {
        title: 'Exhibit Title Here',
        content: 'Brief description of the exhibit or event.',
        media: stockMediaHandler.getRandomByTags(['background', 'video']),
      },
      {
        title: `Call to Action Title`,
        content: `Encouraging statement or invitation to connect.`,
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
    isPublic: true,
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
