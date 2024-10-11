import { ActionButtonSchema, MediaBasicSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import cityPhoto from './city-photo.jpg'
import desertPhoto from './desert-photo.mp4'
import mountainPhoto from './mountain-photo.mp4'
import nightPhoto from './night-photo.mp4'
import wildlifePhoto from './wildlife-photo.mp4'

const CinemaItemSchema = z.object({
  header: z.string().optional().describe('Header text for slide'),
  subHeader: z.string().optional().describe('Subheader text for slide'),
  superHeader: z.string().optional().describe('Superheader text for slid (2 to 5 words) above header'),
  media: MediaBasicSchema.optional(),
  actions: z.array(ActionButtonSchema).optional(),
})

export type CinemaItem = z.infer<typeof CinemaItemSchema>
const defaultItem: CinemaItem[] = [
  {
    superHeader: 'Portfolio',
    header: 'Mountain Expeditions',
    subHeader: 'Capturing the Majestic Peaks',
    media: {
      format: 'video',
      url: mountainPhoto,
    },
    actions: [
      { name: 'View Gallery', href: '#', design: 'outline', icon: 'i-tabler-camera' },
    ],
  },
  {
    superHeader: 'Services',
    header: 'Desert Photography',
    subHeader: 'Professional Shoots in Stunning Deserts',
    media: {
      format: 'video',
      url: desertPhoto,
    },
    actions: [
      { name: 'Book Now', href: '#', design: 'outline', theme: 'overlay' },
      { name: 'Learn More', href: '#', design: 'textOnly', iconAfter: 'i-tabler-chevron-right' },
    ],
  },
  {
    superHeader: 'Projects',
    header: 'Wildlife Photography',
    subHeader: 'Capturing Nature\'s Wonders',
    media: {
      format: 'video',
      url: wildlifePhoto,
    },
    actions: [
      { name: 'Explore Projects', href: '#', design: 'outline', theme: 'overlay' },
    ],
  },
  {
    superHeader: 'Blog',
    header: 'Urban Exploration',
    subHeader: 'Adventures in City Life',
    media: {
      format: 'url',
      url: cityPhoto,
    },
    actions: [
      { name: 'Read Blog', href: '#', design: 'outline', theme: 'overlay' },
    ],
  },
  {
    superHeader: 'Portfolio',
    header: 'Night Photography',
    subHeader: 'Capturing the Magic of the Night',
    media: {
      format: 'video',
      url: nightPhoto,
    },
    actions: [
      { name: 'View Portfolio', href: '#', design: 'outline', theme: 'overlay' },
    ],
  },
]

const UserConfigSchema = z.object({
  items: z.array(CinemaItemSchema).optional(),
  autoSlide: z.boolean().optional(),
})

const options: InputOption[] = [
  new InputOption({
    input: 'InputList',
    key: `items`,
    options: [
      new InputOption({ key: 'header', label: 'Header', input: 'InputText' }),
      new InputOption({ key: 'subHeader', label: 'Sub Header', input: 'InputText' }),
      new InputOption({ key: 'superHeader', label: 'Super Header', input: 'InputText' }),
      new InputOption({ key: 'media', label: 'Media', input: 'InputMedia', props: { formats: { url: true, image: true, video: true } } }),
      new InputOption({ key: 'actions', input: 'InputActions', label: 'Buttons' }),
    ],
  }),
  new InputOption({ key: 'autoSlide', label: 'Auto Change Slide (12 Seconds)', input: 'InputToggle' }),
]

export type UserConfig = z.infer<typeof UserConfigSchema>
const templateId = 'cinema'
export const templates = [
  cardTemplate({
    templateId,
    category: ['marketing'],
    description: 'Full screen images or videos with text overlay.',
    icon: 'i-tabler-movie',
    colorTheme: 'rose',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    isPublic: true,
    options,
    schema: UserConfigSchema,
    getBaseConfig: () => ({ standard: { spacing: { contentWidth: 'none', verticalSpacing: 'none' } } }),
    getUserConfig: () => ({ items: defaultItem }),
    demoPage: async () => {
      return { cards: [{ templateId, userConfig: { items: defaultItem, autoSlide: true } }] }
    },
  }),
] as const
