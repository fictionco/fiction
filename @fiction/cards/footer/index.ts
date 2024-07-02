import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { standardOption } from '@fiction/cards/inputSets'
import { CardTemplate } from '@fiction/site/card'
import { z } from 'zod'
import { mediaSchema } from '../schemaSets'

const authStateSchema = z.enum(['loggedIn', 'loggedOut', 'default']).optional()
const navItemSchema = z.object({
  name: z.string().optional(),
  href: z.string().optional(),
  itemStyle: z.enum(['buttonPrimary', 'buttonStandard', 'user', 'default']).optional(),
  authState: authStateSchema,
  itemsTitle: z.string().optional(),
  items: z.array(z.object({
    name: z.string().optional(),
    href: z.string().optional(),
    target: z.string().optional(),
    authState: authStateSchema,
    itemsTitle: z.string().optional(),
    items: z.array(z.object({
      name: z.string().optional(),
      href: z.string().optional(),
      target: z.string().optional(),
      authState: authStateSchema,
    })).optional(),
  })).optional(),
  desc: z.string().optional(),
  target: z.string().optional(),
})

export type SchemaNavItem = z.infer<typeof navItemSchema> & { isActive?: boolean, isHidden?: boolean, basePath?: string, items?: SchemaNavItem[] }

const layoutKeys = ['columns', 'centered'] as const
const schema = z.object({
  logo: mediaSchema.optional(),
  tagline: z.string().optional(),
  starline: z.string().optional(),
  layout: z.enum(layoutKeys).optional(),
  nav: z.array(navItemSchema).optional(),
  legal: z.object({
    privacyPolicy: z.string().optional(),
    termsOfService: z.string().optional(),
    copyrightText: z.string().optional(),
  }).optional(),
  socials: z.array(z.object({
    key: z.string().optional(),
    href: z.string().optional(),
    target: z.string().optional(),
    name: z.string().optional(),
    icon: z.string().optional(),
  })).optional(),
  badges: z.array(z.object({
    key: z.string().optional(),
    href: z.string().optional(),
    target: z.string().optional(),
    name: z.string().optional(),
    media: mediaSchema.optional(),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options = [
  new InputOption({ key: 'logo', label: 'Logo', input: 'InputMediaDisplay' }),
  new InputOption({ key: 'layout', label: 'Layout', input: 'InputSelect', list: layoutKeys }),
  standardOption.navItems({ key: 'navA', maxDepth: 2 }),
  standardOption.navItems({ key: 'navB', maxDepth: 2 }),
]

// Example default configuration for a movie actor or director's personal website
const defaultConfig: UserConfig = {
  logo: {
    format: 'html',
    html: `Logo`,
  },
  tagline: 'Catchy Tagline Here',
  starline: 'Catchy Starline Here',
  nav: [
    {
      itemsTitle: 'Explore',
      items: [
        { href: '/about', name: 'About' },
        { href: '/projects', name: 'Projects' },
        { href: '/media', name: 'Media' },
        { href: '/awards', name: 'Awards' },
      ],
    },
    {
      itemsTitle: 'About Me',
      items: [
        { href: '/contact', name: 'Contact' },
        { href: `/speaking`, name: 'Talks', target: '_blank' },
      ],
    },
    {
      itemsTitle: 'More',
      items: [
        { href: `#`, name: 'Hire Me', target: '_blank' },
        { href: '/app', name: 'Free Course' },
        { href: '/blog', name: 'Blog' },
      ],
    },
  ],
  legal: {
    privacyPolicy: `#`,
    termsOfService: `#`,
    copyrightText: `Fiction, Inc.`,
  },
  socials: [
    {
      key: 'linkedin',
      href: 'https://www.linkedin.com/company/fictionco',
      target: '_blank',
      name: 'LinkedIn',
      icon: `linkedin`,
    },
    {
      key: 'github',
      href: 'https://github.com/fictionco',
      target: '_blank',
      name: 'Github',
      icon: `github`,
    },
    {
      key: 'x',
      href: 'https://www.twitter.com/fictionco',
      target: '_blank',
      name: 'X',
      icon: 'x',
    },

  ],

  badges: [],
}

const el = vue.defineAsyncComponent(async () => import('./ElCard.vue'))
const templateId = 'footer'
export const templates = [
  new CardTemplate({
    templateId,
    category: ['navigation', 'basic'],
    icon: 'i-tabler-box-align-bottom',
    colorTheme: 'green',
    description: 'A professional footer for your website',
    isPublic: false,
    el,
    userConfig: { ...defaultConfig },
    schema,
    options,
    title: 'Footer Pro',
    demoPage: () => {
      return [
        { templateId, userConfig: { spacing: { spacingClass: 'py-20' }, ...defaultConfig, layout: 'columns' as const } },
        { templateId, userConfig: { spacing: { spacingClass: 'py-20' }, ...defaultConfig, layout: 'centered' as const } },

      ]
    },
  }),
] as const
