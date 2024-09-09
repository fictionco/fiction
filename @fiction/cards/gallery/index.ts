import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { stockMediaHandler } from '@fiction/ui/stock/index.js'
import { z } from 'zod'
import type { SiteUserConfig } from '@fiction/site/schema'
import { standardOption } from '../inputSets'

const templateId = 'gallery'

const MediaItemSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  href: z.string().optional(),
  media: z.object({
    format: z.enum(['url', 'video', 'image']).optional(),
    url: z.string().optional(),
  }).optional(),
  columns: z.enum(['1', '2', '3', '4']).optional(),
  rows: z.enum(['1', '2', '3', '4']).optional(),
})

export type MediaItem = z.infer<typeof MediaItemSchema>

const UserConfigSchema = z.object({
  items: z.array(MediaItemSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

async function getUserConfig(): Promise<UserConfig & SiteUserConfig> {
  return {
    items: [
      {
        title: 'Item Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies.',
        media: stockMediaHandler.getRandomByTags(['object', 'aspect:portrait']),
        columns: '1',
        rows: '2',
      },

      {
        title: 'Item Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies.',
        media: stockMediaHandler.getRandomByTags(['object', 'aspect:square']),
        columns: '2',
        rows: '3',
      },
      {
        title: 'Item Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies.',
        media: stockMediaHandler.getRandomByTags(['object', 'aspect:portrait']),
        columns: '1',
        rows: '2',
      },
      {
        title: 'Item Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies.',
        media: stockMediaHandler.getRandomByTags(['object', 'aspect:square']),
        columns: '1',
        rows: '1',
      },
      {
        title: 'Item Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies.',
        media: stockMediaHandler.getRandomByTags(['object', 'aspect:square']),
        columns: '1',
        rows: '1',
      },
      {
        title: 'Item Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies.',
        media: stockMediaHandler.getRandomByTags(['object', 'aspect:landscape']),
        columns: '3',
        rows: '2',
      },
      {
        title: 'Item Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies.',
        media: stockMediaHandler.getRandomByTags(['object', 'aspect:square']),
        columns: '2',
        rows: '2',
      },
      {
        title: 'Item Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies.',
        media: stockMediaHandler.getRandomByTags(['object', 'aspect:wide']),
        columns: '2',
      },
      {
        title: 'Item Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies.',
        media: stockMediaHandler.getRandomByTags(['object', 'aspect:wide']),
        columns: '2',
      },
      {
        title: 'Item Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies.',
        media: stockMediaHandler.getRandomByTags(['object', 'aspect:tall']),
        columns: '1',
        rows: '2',
      },
      {
        title: 'Item Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies.',
        media: stockMediaHandler.getRandomByTags(['object', 'aspect:tall']),
        columns: '1',
        rows: '2',
      },
      {
        title: 'Item Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies.',
        media: stockMediaHandler.getRandomByTags(['object', 'aspect:landscape']),
        columns: '2',
      },
      {
        title: 'Item Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies.',
        media: stockMediaHandler.getRandomByTags(['object', 'aspect:square']),
        columns: '2',
        rows: '2',
      },
      {
        title: 'Item Title',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies. Donec nec nunc tincidunt ultricies.',
        media: stockMediaHandler.getRandomByTags(['object', 'aspect:portrait']),
        columns: '1',
        rows: '3',
      },
    ],

  }
}

const options: InputOption[] = [
  standardOption.ai(),
  new InputOption({
    input: 'InputList',
    key: `items`,
    options: [
      new InputOption({ key: 'content', label: 'Quote Text', input: 'InputText' }),
    ],
  }),
]

export const templates = [
  new CardTemplate({
    templateId,
    title: 'Gallery',
    category: ['media'],
    description: 'A gallery of images or videos with captions.',
    icon: 'i-tabler-message-bolt',
    colorTheme: 'emerald',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    isPublic: false,
    options,
    schema: UserConfigSchema,
    getBaseConfig: () => ({ standard: { } }),
    getUserConfig: () => getUserConfig(),
    demoPage: async () => {
      const userConfig = await getUserConfig()
      return {
        cards: [
          { templateId, userConfig: { ...userConfig, standard: { headers: { title: 'Masonry Layout' } } } },
        ],
      }
    },
  }),
] as const
