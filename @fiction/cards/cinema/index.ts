import type { ActionItem } from '@fiction/core'
import { MediaDisplaySchema, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import { standardOption } from '../inputSets'
import nightPhoto from './night-photo.mp4'
import mountainPhoto from './mountain-photo.mp4'
import desertPhoto from './desert-photo.mp4'
import wildlifePhoto from './wildlife-photo.mp4'
import cityPhoto from './city-photo.jpg'

const CinemaItemSchema = z.object({
  header: z.string().optional().describe('Header text for slide'),
  subHeader: z.string().optional().describe('Subheader text for slide'),
  superHeader: z.string().optional().describe('Superheader text for slid (2 to 5 words) above header'),
  media: MediaDisplaySchema.optional(),
  actions: z.array(z.object({
    name: z.string(),
    href: z.string(),
    btn: z.enum(['outline', 'minimal']),
    icon: z.string().optional(),
    iconAfter: z.string().optional(),
  }) as z.Schema<ActionItem>).optional(),
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
      { name: 'View Gallery', href: '#', btn: 'outline', icon: 'i-tabler-camera' },
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
      { name: 'Book Now', href: '#', btn: 'outline' },
      { name: 'Learn More', href: '#', btn: 'minimal', iconAfter: 'i-tabler-chevron-right' },
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
      { name: 'Explore Projects', href: '#', btn: 'outline' },
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
      { name: 'Read Blog', href: '#', btn: 'outline' },
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
      { name: 'View Portfolio', href: '#', btn: 'outline' },
    ],
  },
]

const UserConfigSchema = z.object({
  items: z.array(CinemaItemSchema).optional(),
  autoSlide: z.boolean().optional(),
})

const options = [
  standardOption.ai(),
  new InputOption({
    input: 'InputList',
    key: `items`,
    options: [
      new InputOption({ key: 'header', label: 'Header', input: 'InputText' }),
      new InputOption({ key: 'subHeader', label: 'Sub Header', input: 'InputText' }),
      new InputOption({ key: 'superHeader', label: 'Super Header', input: 'InputText' }),
      new InputOption({ key: 'media', label: 'Media', input: 'InputMediaDisplay', props: { formats: { url: true, video: true } } }),
      new InputOption({ key: 'actions', label: 'Actions', input: 'InputList', options: [
        new InputOption({ key: 'name', label: 'Name', input: 'InputText' }),
        new InputOption({ key: 'href', label: 'Href', input: 'InputText' }),
        new InputOption({ key: 'btn', label: 'Button', input: 'InputSelect', props: { options: ['outline', 'minimal'] } }),
        new InputOption({ key: 'icon', label: 'Icon (Left)', input: 'InputText', description: 'Use format i-tabler-[icon], check docs for info' }),
        new InputOption({ key: 'iconAfter', label: 'Icon (Right)', input: 'InputText', description: 'Use format i-tabler-[icon], check docs for info' }),
      ] }),
    ],
  }),
  new InputOption({ key: 'autoSlide', label: 'Auto Change Slide (12 Seconds)', input: 'InputToggle' }),
]

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
    isPublic: true,
    options,
    schema: UserConfigSchema,
    getBaseConfig: () => ({ standard: { spacing: { contentWidth: 'none' } } }),
    getUserConfig: () => ({ items: defaultItem }),
    demoPage: async () => {
      return { cards: [{ templateId, userConfig: { items: defaultItem, autoSlide: true } }] }
    },
  }),
] as const
