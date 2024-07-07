import type { MediaDisplayObject } from '@fiction/core'
import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import { standardOption } from '../inputSets'
import night from './night.mp4'
import columns from './columns.mp4'
import kings from './kings.mp4'
import tower from './tower.jpg'

const CinemaItemSchema = z.object({
  header: z.string().optional(),
  subHeader: z.string().optional(),
  media: z.object({
    format: z.enum(['image', 'video']),
    url: z.string(),
  }).optional() as z.Schema<MediaDisplayObject>,
  actions: z.array(z.object({
    name: z.string(),
    href: z.string(),
  })).optional(),
})

export type CinemaItem = z.infer<typeof CinemaItemSchema>
const defaultItem: CinemaItem[] = [
  {
    header: 'London Museums',
    subHeader: 'Experience the allure of the world\'s best museums',
    media: {
      format: 'video',
      url: columns,
      overlay: { color: 'blue' },
    },
  },
  {
    header: 'King\'s Road',
    subHeader: 'Stroll through the chic streets of King\'s Road',
    media: {
      format: 'video',
      url: kings,
    },
  },
  {
    header: 'Tower Bridge',
    subHeader: 'Walk across the iconic Tower Bridge',
    media: {
      format: 'url',
      url: tower,
    },
  },
  {
    header: 'Thames River Nights',
    subHeader: 'Enjoy the serene beauty of the Thames at night',
    media: {
      format: 'video',
      url: night,
    },
  },
]

const UserConfigSchema = z.object({
  items: z.array(CinemaItemSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>
const templateId = 'cinema'
export const templates = [
  new CardTemplate({
    templateId,
    category: ['marketing'],
    description: 'Full screen images or videos with text overlay.',
    icon: 'i-tabler-movie',
    colorTheme: 'rose',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    isPublic: false,
    options: [
      standardOption.ai(),
      new InputOption({
        input: 'InputList',
        key: `items`,
        options: [
          new InputOption({ key: 'text', label: 'Header', input: 'InputText' }),
        ],
      }),
    ],
    schema: UserConfigSchema,
    userConfig: { items: defaultItem },
    demoPage: () => {
      return { cards: [{ templateId, userConfig: { items: defaultItem } }] }
    },
  }),
] as const
