import { MediaIconSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'contact'

export const UserConfigSchema = z.object({
  layout: z.enum(['left', 'right']).optional().describe('Layout of the card, image on left or right'),
  items: z.array(z.object({
    title: z.string().optional().describe('Title for list of details'),
    items: z.array(z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      media: MediaIconSchema.optional(),
      href: z.string().optional(),
    })).optional().describe('List of details with contact details, location, etc.'),
  })).optional().describe('List of contact details'),
  socials: z.array(z.object({
    name: z.string().optional().describe('@handle on (platform)'),
    href: z.string().optional().describe('Full link for href'),
    media: MediaIconSchema.optional().describe('icon reference associated with the social media platform (x, youtube, facebook, etc)'),
  })).optional().describe('List of social media links'),
  notifyEmails: z.array(z.object({ email: z.string().email() })).optional().describe('List of emails to notify when form is submitted'),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

const options = [
  new InputOption({ key: 'layout', label: 'Layout', input: 'InputSelect', list: ['left', 'right'], description: 'Layout of the card, image on left or right' }),
  new InputOption({ key: 'items', label: 'Contact Details', props: { itemName: 'Contact Group' }, input: 'InputList', options: [
    new InputOption({ key: 'title', label: 'Group Title', input: 'InputText' }),
    new InputOption({ key: 'items', label: 'Details', input: 'InputList', props: { itemName: 'Contact Detail' }, options: [
      new InputOption({ key: 'title', label: 'Title', input: 'InputText' }),
      new InputOption({ key: 'content', label: 'Content', input: 'InputText' }),
      new InputOption({ key: 'media', label: 'Icon', input: 'InputIcon' }),
      new InputOption({ key: 'href', label: 'Link', input: 'InputText' }),
    ] }),
  ] }),
  new InputOption({ key: 'socials', label: 'Icon Links / Social', props: { itemName: 'Button' }, input: 'InputList', options: [
    new InputOption({ key: 'name', label: 'Name', input: 'InputText' }),
    new InputOption({ key: 'href', label: 'Link', input: 'InputText' }),
    new InputOption({ key: 'media', label: 'Icon', input: 'InputIcon' }),
  ] }),
  new InputOption({ key: 'notifyEmails', label: 'Notify Email', props: { itemName: 'Email' }, input: 'InputList', options: [
    new InputOption({ key: 'email', label: 'Email', input: 'InputEmail' }),
  ] }),
] as InputOption[]

function getDefaultConfig(): UserConfig {
  return {
    layout: 'right',
    items: [
      {
        title: 'Message',
        items: [
          { title: 'Way To Get In Touch', content: 'test@example.com', href: 'mailto:test@example.com', media: { iconId: 'email' } },
          { title: 'Another Way', content: 'Join', href: '#', media: { iconId: 'discord' } },
        ],
      },
      {
        title: 'Call',
        items: [
          { title: '+1(888) 888-8888', content: '', href: '#', media: { iconId: 'phone' } },
        ],
      },
    ],

    socials: [
      { name: 'Follow on Facebook', href: '#', media: { iconId: 'facebook' } },
      { name: 'Follow on X', href: '#', media: { iconId: 'x' } },
      { name: 'Follow on LinkedIn', href: '#', media: { iconId: 'linkedin' } },
    ],

    notifyEmails: [{ email: 'andrew@fiction.com' }],
  }
}

export const templates = [
  cardTemplate({
    templateId,
    category: ['form', 'marketing'],
    description: 'A minimal profile card with a splash image, headline, subheading, and contact details.',
    icon: 'i-tabler-user',
    colorTheme: 'blue',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    getUserConfig: () => getDefaultConfig(),
    isPublic: true,
    options,
    schema: UserConfigSchema,
    demoPage: async () => {
      const defaultConfig = getDefaultConfig()
      return { cards: [
        { templateId, userConfig: { ...defaultConfig } },
        { templateId, userConfig: { ...defaultConfig, layout: 'left' as const } },
      ] }
    },
  }),
] as const
