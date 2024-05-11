import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { CardTemplate } from '@fiction/site/card'
import { createCard } from '@fiction/site'
import { z } from 'zod'
import { refineOptions } from '@fiction/site/utils/schema'
import { standardOption } from '../inputSets'

export const UserConfigSchema = z.object({
  heading: z.string().optional().describe('Primary headline for profile 3 to 8 words'),
  subHeading: z.string().optional().describe('Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs'),
  superHeading: z.string().optional().describe('Shorter badge above headline, 2 to 5 words'),
  layout: z.union([z.literal('left'), z.literal('right')]).optional().describe('Media on left or right'),
  detailsTitle: z.string().optional().describe('Title for list of details'),
  mediaItems: z.array(z.object({
    media: z.object({
      format: z.enum(['url', 'html']).optional(),
      url: z.string().optional(),
      html: z.string().optional(),
    }),
  })).optional().describe('Splash picture in portrait format'),
  details: z.array(z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    icon: z.string().optional(),
    href: z.string().optional(),
  })).optional().describe('List of details with contact details, location, etc.'),
  socials: z.array(z.object({
    name: z.string().optional().describe('@handle on (platform)'),
    href: z.string().optional().describe('Full link for href'),
    icon: z.string().optional().describe('icon reference associated with the social media platform (x, youtube, facebook, etc)'),
  })).optional().describe('List of social media links'),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

function userControls() {
  const { options } = refineOptions({
    options: [
      new InputOption({
        label: 'Settings',
        input: 'group',
        key: 'minProfileSettings',
        options: [
          new InputOption({
            key: 'layout',
            input: 'InputSelect',
            list: [
              { name: 'Media on Left', value: 'left' },
              { name: 'Media on Right', value: 'right' },
            ],
          }),
          standardOption.mediaItems(),
          standardOption.headers(),
          standardOption.navItems({ label: 'Details', key: 'details' }),
          standardOption.socials(),
        ],
      }),
    ],
    schema: UserConfigSchema,
  })
  return options
}

const options = [
  standardOption.ai(),
  ...userControls(),
]

const templateId = 'profile'

const defaultContent: UserConfig = {
  superHeading: 'A Tagline or Category',
  heading: 'A Catchy Headline About Something',
  subHeading: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  mediaItems: [
    { media: { url: 'https://images.unsplash.com/photo-1577565177023-d0f29c354b69?q=80&w=2943&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
    { media: { url: 'https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?q=80&w=3648&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
  ],
  detailsTitle: 'About Me',
  details: [
    { name: 'Location', desc: 'Somewhere, USA' },
    { name: 'Email', desc: 'hello@mywebsite.com', href: 'mailto:hello@example.com' },
    { name: 'Phone', desc: '123-456-7890' },
  ],
  socials: [
    { name: '@handle on facebook', href: '#', icon: 'facebook' },
    { name: '@handle on x', href: '#', icon: 'x' },
    { name: '@handle on linkedin', href: '#', icon: 'linkedin' },
  ],
}
const minimalProfile = new CardTemplate({
  templateId,
  category: ['marketing'],
  description: 'A minimal profile card with a splash image, headline, subheading, and contact details.',
  icon: 'i-tabler-user',
  colorTheme: 'blue',
  el: vue.defineAsyncComponent(() => import('./ElCard.vue')),
  userConfig: defaultContent,
  isPublic: true,
  options,
  schema: UserConfigSchema,
})

export const templates = [minimalProfile] as const

export function demo() {
  return createCard({
    slug: 'card-profile',
    cards: [
      createCard({ templateId, templates, userConfig: { } }),
      createCard({ templateId, templates, userConfig: { layout: 'left' } }),
    ],
  })
}
