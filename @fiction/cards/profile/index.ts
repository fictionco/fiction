import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { CardTemplate } from '@fiction/site/card'
import { z } from 'zod'
import { refineOptions } from '@fiction/site/utils/schema'
import { standardOption } from '../inputSets'
import { stockMediaHandler } from '../stock/index.js'

export const UserConfigSchema = z.object({
  heading: z.string().optional().describe('Primary headline for profile 3 to 8 words'),
  subHeading: z.string().optional().describe('Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs'),
  superHeading: z.string().optional().describe('Shorter badge above headline, 2 to 5 words'),
  layout: z.union([z.literal('left'), z.literal('right')]).optional().describe('Media on left or right'),
  detailsTitle: z.string().optional().describe('Title for list of details'),
  mediaItems: z.array(z.object({
    media: z.object({
      format: z.enum(['url', 'image', 'video']).optional(),
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

function getUserConfig(): UserConfig {
  return {
    superHeading: 'A Tagline or Category',
    heading: 'A Catchy Headline About Something',
    subHeading: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
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
      { name: '@handle on facebook', href: '#', icon: 'facebook' },
      { name: '@handle on x', href: '#', icon: 'x' },
      { name: '@handle on linkedin', href: '#', icon: 'linkedin' },
    ],
  }
}
const minimalProfile = new CardTemplate({
  templateId,
  category: ['marketing'],
  description: 'A minimal profile card with a splash image, headline, subheading, and contact details.',
  icon: 'i-tabler-user',
  colorTheme: 'blue',
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  getUserConfig: () => getUserConfig(),
  isPublic: true,
  options,
  schema: UserConfigSchema,
  demoPage: async () => {
    return { cards: [
      { templateId, userConfig: { ...getUserConfig() } },
      { templateId, userConfig: { ...getUserConfig(), layout: 'left' as const } },
    ] }
  },
})

export const templates = [minimalProfile] as const
