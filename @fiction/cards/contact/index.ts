import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site/card'
import { z } from 'zod'
import { FormUserConfigSchema } from '@fiction/forms'
import { standardOption } from '../inputSets'

const templateId = 'contact'

export const UserConfigSchema = z.object({
  layout: z.enum(['left', 'right']).optional().describe('Layout of the card, image on left or right'),
  title: z.string().optional().describe('Primary headline for profile 3 to 8 words'),
  subTitle: z.string().optional().describe('Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs'),
  superTitle: z.string().optional().describe('Shorter badge above headline, 2 to 5 words'),
  items: z.array(z.object({
    title: z.string().optional().describe('Title for list of details'),
    items: z.array(z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      icon: z.string().optional(),
      href: z.string().optional(),
    })).optional().describe('List of details with contact details, location, etc.'),
  })),
  socials: z.array(z.object({
    name: z.string().optional().describe('@handle on (platform)'),
    href: z.string().optional().describe('Full link for href'),
    icon: z.string().optional().describe('icon reference associated with the social media platform (x, youtube, facebook, etc)'),
  })).optional().describe('List of social media links'),
  form: FormUserConfigSchema.optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

const options = [
  standardOption.ai(),
]

const defaultContent: UserConfig = {
  superTitle: 'Contact',
  title: 'Get In Touch',
  subTitle: `Send me a message and I'll respond within 24 hours.`,
  items: [
    {
      title: 'Chat / Email',
      items: [
        { title: 'Send me an email', content: 'test@example.com', href: 'mailto:test@example.com', icon: 'i-tabler-mail' },
        { title: 'Discord Community', content: 'Join', href: '#', icon: 'i-tabler-brand-discord' },
      ],
    },
    {
      title: 'Phone',
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

  form: {
    notifyEmails: ['arpowers@gmail.com', 'andrew@fiction.com'],
  },
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
    isPublic: false,
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
