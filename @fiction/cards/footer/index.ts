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
    html: `<svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34.5005 41H17.187C16.0637 41 15.0057 40.5523 14.211 39.7352L1.01935 26.2084C0.0221016 25.1882 -0.272797 23.6627 0.265224 22.3287C0.805496 20.9924 2.06388 20.1269 3.47534 20.1269H19.6407V3.55352C19.6407 2.11105 20.4827 0.820906 21.7838 0.266998C23.0647 -0.279986 24.591 0.0315868 25.5702 1.03554L38.7686 14.5671C39.5633 15.3864 40 16.4688 40 17.6182V35.364C39.9977 38.4728 37.5328 41 34.5005 41ZM17.9119 34.9024H34.0525V18.3544L25.5882 9.67651V26.2245H9.4476L17.9119 34.9024Z" fill="currentColor" /></svg>`,
  },
  nav: [
    {
      itemsTitle: 'Pages',
      items: [
        { href: '/tour', name: 'Tour' },
        { href: '/pricing', name: 'Pricing' },
        { href: '/developer', name: 'Developer' },
        { href: '/affiliate', name: 'Affiliate' },
      ],
    },
    {
      itemsTitle: 'Company',
      items: [
        { href: '/about', name: 'About' },
        { href: `#`, name: 'Support', target: '_blank' },
      ],
    },
    {
      itemsTitle: 'Resources',
      items: [
        { href: `#`, name: 'Docs', target: '_blank' },
        { href: '/app', name: 'Dashboard' },
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
        { templateId, userConfig: { spacing: { spacingClass: 'py-20' }, ...defaultConfig, layout: 'centered' as const } },
        { templateId, userConfig: { spacing: { spacingClass: 'py-20' }, ...defaultConfig, layout: 'columns' as const } },
      ]
    },
  }),
] as const
