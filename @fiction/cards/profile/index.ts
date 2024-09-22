import { MediaBasicSchema, MediaIconSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'
import { InputOption } from '@fiction/ui'
import { stockMediaHandler } from '@fiction/ui/stock/index.js'
import { z } from 'zod'

const templateId = 'profile'

export const schema = z.object({
  title: z.string().optional().describe('Primary headline for profile 3 to 8 words [ai]'),
  content: z.string().optional().describe('Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs [ai]'),
  superTitle: z.string().optional().describe('Shorter badge above headline, 2 to 5 words [ai]'),
  layout: z.union([z.literal('left'), z.literal('right')]).optional().describe('Media on left or right'),
  detailsTitle: z.string().optional().describe('Title for list of details [ai]'),
  mediaItems: z.array(z.object({
    media: MediaBasicSchema.optional().describe('Media item with image or video'),
  })).optional().describe('Splash picture in portrait format  [ai seconds=40]'),
  details: z.array(z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    icon: z.string().optional(),
    href: z.string().optional(),
  })).optional().describe('List of details with contact details, location, etc.'),
  socials: z.array(z.object({
    name: z.string().optional().describe('@handle on (platform)'),
    href: z.string().optional().describe('Full link for href'),
    media: MediaIconSchema.optional().describe('icon reference associated with the social media platform (x, youtube, facebook, etc)'),
  })).optional().describe('List of social media links'),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({
    key: 'layout',
    input: 'InputSelect',
    list: [
      { name: 'Media on Left', value: 'left' },
      { name: 'Media on Right', value: 'right' },
    ],
  }),
  new InputOption({ key: 'mediaItems', input: 'InputList', props: { itemName: 'Media Item' }, options: [
    new InputOption({ key: 'media', input: 'InputMedia' }),
  ] }),
  new InputOption({ key: 'title', input: 'InputText' }),
  new InputOption({ key: 'superTitle', input: 'InputText' }),
  new InputOption({ key: 'content', input: 'InputProse' }),
  new InputOption({ key: 'detailsTitle', input: 'InputText' }),
  new InputOption({ key: 'details', input: 'InputList', props: { itemName: 'Profile Detail' }, options: [
    new InputOption({ key: 'name', input: 'InputText' }),
    new InputOption({ key: 'desc', input: 'InputText' }),
    new InputOption({ key: 'icon', input: 'InputIcon' }),
    new InputOption({ key: 'href', input: 'InputText' }),
  ] }),
  new InputOption({ key: 'socials', input: 'InputList', props: { itemName: 'Social Media' }, options: [
    new InputOption({ key: 'name', input: 'InputText' }),
    new InputOption({ key: 'href', input: 'InputText' }),
    new InputOption({ key: 'media', input: 'InputIcon' }),
  ] }),
]

function getUserConfig(): UserConfig {
  return {
    title: 'A Catchy Headline About Something',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    superTitle: 'A Tagline or Category',
    mediaItems: [
      { media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'person']) },
      { media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'person']) },
    ],
    detailsTitle: 'About Me',
    details: [
      { name: 'Location', desc: 'Somewhere, USA' },
      { name: 'Email', desc: 'hello@mywebsite.com', href: 'mailto:hello@example.com' },
      { name: 'Phone', desc: '123-456-7890' },
    ],
    socials: [
      { name: '@handle on facebook', href: '#', media: { format: 'iconId', iconId: 'facebook' } },
      { name: '@handle on x', href: '#', media: { format: 'iconId', iconId: 'x' } },
      { name: '@handle on linkedin', href: '#', media: { format: 'iconId', iconId: 'linkedin' } },
    ],
  }
}
const minimalProfile = cardTemplate({
  templateId,
  category: ['marketing'],
  description: 'A minimal profile card with a splash image, headline, subheading, and contact details.',
  icon: 'i-tabler-user',
  colorTheme: 'blue',
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  getUserConfig: () => getUserConfig(),
  isPublic: true,
  options,
  schema,
  demoPage: async () => {
    return { cards: [
      { templateId, userConfig: { ...getUserConfig() } },
      { templateId, userConfig: { ...getUserConfig(), layout: 'left' as const } },
    ] }
  },
})

export const templates = [minimalProfile] as const
