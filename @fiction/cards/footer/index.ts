import { MediaBasicSchema, MediaIconSchema, MediaTypographySchema, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site/card'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { standardOption } from '../inputSets'

const templateId = 'footer'

const navItemSchema = z.object({
  name: z.string().optional(),
  href: z.string().optional(),
  items: z.array(z.object({
    name: z.string().optional(),
    href: z.string().optional(),
    target: z.string().optional(),
    items: z.array(z.object({
      name: z.string().optional(),
      href: z.string().optional(),
      target: z.string().optional(),
    })).optional(),
  })).optional(),
  desc: z.string().optional(),
  target: z.string().optional(),
})

export type SchemaNavItem = z.infer<typeof navItemSchema> & { isActive?: boolean, isHidden?: boolean, basePath?: string, items?: SchemaNavItem[] }

const layoutKeys = ['columns', 'centered'] as const
const schema = z.object({
  logo: MediaTypographySchema.optional(),
  tagline: z.string().optional(),
  starline: z.string().optional(),
  layout: z.enum(layoutKeys).optional(),
  nav: z.array(navItemSchema).optional(),
  legal: z.object({
    privacyPolicyUrl: z.string().optional(),
    termsOfServiceUrl: z.string().optional(),
    copyrightText: z.string().optional(),
  }).optional(),
  socials: z.array(z.object({
    href: z.string().optional(),
    target: z.string().optional(),
    name: z.string().optional(),
    media: MediaIconSchema.optional(),
  })).optional(),
  badges: z.array(z.object({
    href: z.string().optional(),
    target: z.string().optional(),
    name: z.string().optional(),
    media: MediaBasicSchema.optional(),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'logo', label: 'Logo', input: 'InputLogo' }),
  new InputOption({ key: 'layout', label: 'Layout', input: 'InputSelect', list: layoutKeys }),
  new InputOption({ key: 'tagline', label: 'Tagline', input: 'InputText', description: 'A catchy phrase or description of what you do.' }),
  standardOption.navItems({ key: 'nav', maxDepth: 2, itemNames: ['Column', 'Nav Item', 'Sub Nav Item'] }),
  new InputOption({ key: 'legal', label: 'Legal', input: 'group', options: [
    new InputOption({ key: 'legal.privacyPolicyUrl', label: 'Privacy Policy URL', input: 'InputText' }),
    new InputOption({ key: 'legal.termsOfServiceUrl', label: 'Terms of Service URL', input: 'InputText' }),
    new InputOption({ key: 'legal.copyrightText', label: 'Copyright Text', input: 'InputText' }),
  ] }),
  new InputOption({ key: 'socials', label: 'Socials', input: 'InputList', props: { itemName: 'Social' }, options: [
    new InputOption({ key: 'name', label: 'Name', input: 'InputText' }),
    new InputOption({ key: 'href', label: 'URL', input: 'InputText' }),
    new InputOption({ key: 'media', label: 'Icon', input: 'InputIcon' }),
    new InputOption({ key: 'target', label: 'Target', input: 'InputSelect', list: ['_blank', '_self'] }),
  ] }),
  new InputOption({ key: 'badges', label: 'Badges', input: 'group', options: [
    new InputOption({ key: 'starline', label: 'Starline', input: 'InputText', description: 'Show 5 stars and add information about satisfaction or reviews.' }),

    new InputOption({ key: 'badges', label: 'Badges', description: 'Add certifications or other graphics to build your authority', input: 'InputList', props: { itemName: 'Badge' }, options: [
      new InputOption({ key: 'name', label: 'Name', input: 'InputText' }),
      new InputOption({ key: 'href', label: 'URL', input: 'InputText' }),
      new InputOption({ key: 'media', label: 'Media', input: 'InputMedia' }),
      new InputOption({ key: 'target', label: 'Target', input: 'InputSelect', list: ['_blank', '_self'] }),
    ] }),
  ] }),
]

// Example default configuration for a movie actor or director's personal website
const defaultConfig: UserConfig = {
  logo: {
    format: 'typography',
    typography: {
      text: 'Your Name',
      font: 'Poppins',
    },
  },
  nav: [
    {
      name: 'Explore',
      items: [
        { href: '/projects', name: 'Projects' },
        { href: '/awards', name: 'Awards' },
      ],
    },
    {
      name: 'About Me',
      items: [
        { href: '/contact', name: 'Contact' },
        { href: `/speaking`, name: 'Talks', target: '_blank' },
      ],
    },
    {
      name: 'More',
      items: [
        { href: `#`, name: 'Hire Me', target: '_blank' },
        { href: '/blog', name: 'Blog' },
      ],
    },
  ],
  legal: {
    privacyPolicyUrl: `#`,
    termsOfServiceUrl: `#`,
    copyrightText: `Your Company or Name, Inc.`,
  },
  socials: [
    {
      href: 'https://www.linkedin.com/company/fictionco',
      target: '_blank',
      name: 'LinkedIn',
      media: { iconId: `linkedin` },
    },
    {
      href: 'https://github.com/fictionco',
      target: '_blank',
      name: 'Github',
      media: { iconId: `github` },
    },
    {
      href: 'https://www.twitter.com/fictionco',
      target: '_blank',
      name: 'X',
      media: { iconId: `x` },
    },

  ],

  badges: [],
}

const el = vue.defineAsyncComponent(async () => import('./ElCard.vue'))

export const templates = [
  new CardTemplate({
    templateId,
    category: ['navigation'],
    icon: 'i-tabler-box-align-bottom',
    colorTheme: 'green',
    description: 'A professional footer for your website',
    isPublic: true,
    el,
    getUserConfig: () => defaultConfig,
    schema,
    options,
    title: 'Footer Pro',
    demoPage: async () => {
      return { cards: [
        { templateId, userConfig: { ...defaultConfig, layout: 'columns' as const } },
        { templateId, userConfig: { ...defaultConfig, layout: 'centered' as const } },
      ] }
    },
  }),
] as const
