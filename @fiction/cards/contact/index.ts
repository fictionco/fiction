import { vue } from '@fiction/core'
import { FormUserConfigSchema } from '@fiction/forms'
import { CardTemplate } from '@fiction/site/card'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { standardOption } from '../inputSets'

const templateId = 'contact'

export const UserConfigSchema = z.object({
  layout: z.enum(['left', 'right']).optional().describe('Layout of the card, image on left or right'),
  items: z.array(z.object({
    title: z.string().optional().describe('Title for list of details'),
    items: z.array(z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      icon: z.string().optional(),
      href: z.string().optional(),
    })).optional().describe('List of details with contact details, location, etc.'),
  })).optional().describe('List of contact details'),
  socials: z.array(z.object({
    name: z.string().optional().describe('@handle on (platform)'),
    href: z.string().optional().describe('Full link for href'),
    icon: z.string().optional().describe('icon reference associated with the social media platform (x, youtube, facebook, etc)'),
  })).optional().describe('List of social media links'),
  notifyEmails: z.array(z.object({ email: z.string().email() })).optional().describe('List of emails to notify when form is submitted'),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

const options = [
  standardOption.ai(),
  new InputOption({ key: 'layout', label: 'Layout', input: 'InputSelect', list: ['left', 'right'], description: 'Layout of the card, image on left or right' }),
  new InputOption({ key: 'items', label: 'Contact Details', input: 'InputList', options: [
    new InputOption({ key: 'title', label: 'Title', input: 'InputText' }),
    new InputOption({ key: 'items', label: 'Details', input: 'InputList', options: [
      new InputOption({ key: 'title', label: 'Title', input: 'InputText' }),
      new InputOption({ key: 'content', label: 'Content', input: 'InputText' }),
      new InputOption({ key: 'icon', label: 'Icon', input: 'InputIcon' }),
      new InputOption({ key: 'href', label: 'Link', input: 'InputText' }),
    ] }),
  ] }),
  new InputOption({ key: 'socials', label: 'Social Media', input: 'InputList', options: [
    new InputOption({ key: 'name', label: 'Name', input: 'InputText' }),
    new InputOption({ key: 'href', label: 'Link', input: 'InputText' }),
    new InputOption({ key: 'icon', label: 'Icon', input: 'InputIcon' }),
  ] }),
  new InputOption({ key: 'notifyEmails', label: 'Notify Email', input: 'InputList', options: [
    new InputOption({ key: 'email', label: 'Email', input: 'InputEmail' }),
  ] }),
] as InputOption[]

const defaultContent: UserConfig = {
  items: [
    {
      title: 'Message',
      items: [
        { title: 'Way To Get In Touch', content: 'test@example.com', href: 'mailto:test@example.com', icon: 'i-tabler-mail' },
        { title: 'Another Way', content: 'Join', href: '#', icon: 'i-tabler-brand-discord' },
      ],
    },
    {
      title: 'Call',
      items: [
        { title: '+1(888) 888-8888', content: '', href: '#', icon: 'i-tabler-phone' },
      ],
    },
  ],

  socials: [
    { name: '@handle on facebook', href: '#', icon: 'facebook' },
    { name: '@handle on x', href: '#', icon: 'x' },
    { name: '@handle on linkedin', href: '#', icon: 'linkedin' },
  ],

  notifyEmails: [{ email: 'andrew@fiction.com' }],
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['form', 'marketing'],
    description: 'A minimal profile card with a splash image, headline, subheading, and contact details.',
    icon: 'i-tabler-user',
    colorTheme: 'blue',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    getUserConfig: () => defaultContent,
    isPublic: true,
    options,
    schema: UserConfigSchema,
    demoPage: async () => {
      return { cards: [
        { templateId, userConfig: { ...defaultContent } },
        { templateId, userConfig: { ...defaultContent, layout: 'left' as const } },
      ] }
    },
  }),
] as const
