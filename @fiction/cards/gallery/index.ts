import type { SiteUserConfig } from '@fiction/site/schema'
import { MediaBasicSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { stockMediaHandler } from '@fiction/ui/stock/index.js'
import { z } from 'zod'

const templateId = 'gallery'

const MediaItemSchema = z.object({
  title: z.string().optional().describe('The title of the media item.'),
  content: z.string().describe('The description of the media item.'),
  href: z.string().optional().describe('Instead of opening the media item in a lightbox, the user will be taken to this URL when they click on the item.'),
  media: MediaBasicSchema.optional().describe('The media item to display.'),
  columns: z.enum(['1', '2', '3', '4']).optional().describe('The number of columns the media item should span.'),
  rows: z.enum(['1', '2', '3', '4']).optional().describe('The number of rows the media item should span.'),
})

export type MediaItem = z.infer<typeof MediaItemSchema>

const UserConfigSchema = z.object({
  items: z.array(MediaItemSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

const options: InputOption[] = [
  new InputOption({
    input: 'InputList',
    key: `items`,
    props: { itemName: 'Media Item' },
    options: [
      new InputOption({ key: 'title', label: 'Title', input: 'InputText' }),
      new InputOption({ key: 'content', label: 'Content', input: 'InputTextarea' }),
      new InputOption({ key: 'href', label: 'Link', input: 'InputText' }),
      new InputOption({ key: 'media', label: 'Media', input: 'InputMedia' }),
      new InputOption({ key: 'columns', label: 'Columns', input: 'InputSelect', list: ['1', '2', '3', '4'] }),
      new InputOption({ key: 'rows', label: 'Rows', input: 'InputSelect', list: ['1', '2', '3', '4'] }),
    ],
  }),
]

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

export const templates = [
  cardTemplate({
    templateId,
    title: 'Gallery',
    category: ['media'],
    description: 'A gallery of images or videos with captions.',
    icon: 'i-tabler-message-bolt',
    colorTheme: 'emerald',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    isPublic: true,
    options,
    schema: UserConfigSchema,
    getBaseConfig: () => ({ standard: { } }),
    getUserConfig: async () => getUserConfig(),
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
