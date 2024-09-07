import { standardOption } from '@fiction/cards/inputSets'
import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site/card'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { mediaSchema } from '../schemaSets'

const templateId = 'nav'

const authStateSchema = z.enum(['loggedIn', 'loggedOut', 'default']).optional()
const navItemSchema = z.object({
  name: z.string().optional(),
  href: z.string().optional(),
  itemStyle: z.enum(['buttonPrimary', 'buttonStandard', 'user', 'default']).optional(),
  subStyle: z.enum(['mega', 'default']).optional(),
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

export type SchemaNavItem = z.infer<typeof navItemSchema> & { isActive?: boolean, isHidden?: boolean, basePath?: string, items?: SchemaNavItem[], id?: string }

const schema = z.object({
  logo: mediaSchema.optional(),
  layout: z.enum(['navCenter', 'logoCenter', 'justified']).optional(),
  navA: z.array(navItemSchema).optional(),
  navB: z.array(navItemSchema).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'logo', label: 'Logo', input: 'InputMediaDisplay' }),
  new InputOption({ key: 'layout', label: 'Layout', input: 'InputSelect', list: ['navCenter', 'logoCenter', 'justified'] }),
  standardOption.navItems({ key: 'navA', maxDepth: 2 }),
  standardOption.navItems({ key: 'navB', maxDepth: 2 }),
]

// Example default configuration for a movie actor or director's personal website
const defaultConfig: UserConfig = {
  logo: { html: `Logo` },
  navA: [
    { name: 'About', href: '/about', items: [
      { name: 'Biography', href: '/about/biography' },
      { name: 'Press', href: '/about/press', items: [{ name: 'News', href: '/about/press/news' }, { name: 'Interviews', href: '/about/press/interviews' }] },
      { name: 'FAQ', href: '/about/faq' },
    ] },
    { name: 'Filmography', desc: `Some of our work...`, href: '/filmography', subStyle: 'mega', items: [
      { name: 'Movies', href: '/filmography/movies', items: [{ name: 'Classic Movies', href: '/filmography/movies/classic' }, { name: 'Recent Movies', href: '/filmography/movies/recent' }] },
      { name: 'TV Shows', href: '/filmography/tv-shows', items: [{ name: 'Popular Shows', href: '/filmography/tv-shows/popular' }, { name: 'Latest Shows', href: '/filmography/tv-shows/latest' }] },
      { name: 'Directorial Works', href: '/filmography/directorial-works', items: [{ name: 'Feature Films', href: '/filmography/directorial-works/feature-films' }, { name: 'Short Films', href: '/filmography/directorial-works/short-films' }] },
    ] },
    { name: 'Awards', href: '/awards' },
    { name: 'Contact', href: '/contact', itemStyle: 'buttonStandard' },
  ],
  navB: [
    { name: 'Clients', href: '/clients', items: [{ name: 'Project Inquiries', href: '/clients/project-inquiries' }, { name: 'Testimonials', href: '/clients/testimonials' }, { name: 'Client Portal', href: '/clients/portal' }] },
    { name: 'Account', href: '/account', itemStyle: 'user', items: [
      { name: 'Sign In', href: '/account/login', authState: 'loggedOut' },
      { name: 'Dashboard', href: '/account/profile', authState: 'loggedIn' },
    ] },
  ],
}

const el = vue.defineAsyncComponent(async () => import('./ElCard.vue'))

export const templates = [
  new CardTemplate({
    templateId,
    category: ['navigation'],
    icon: 'i-tabler-box-align-top',
    colorTheme: 'blue',
    description: 'A header with a logo and navigation links',
    isPublic: true,
    el,
    getBaseConfig: () => ({ standard: { spacing: { verticalSpacing: 'xs' } } }),
    getUserConfig: () => ({ ...defaultConfig }),
    schema,
    options,
    title: 'Primary Nav',
    demoPage: async () => {
      return { cards: [
        { templateId, userConfig: { ...defaultConfig } },
        { templateId, userConfig: { ...defaultConfig, layout: 'logoCenter' as const } },
        { templateId, userConfig: { ...defaultConfig, layout: 'navCenter' as const } },
        {
          templateId,
          userConfig: {
            logo: { url: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100' },
            navA: [{ name: 'Lorem Ipsum Lorem Ipsum', href: '/bar' }, { name: 'Long Name', href: '/bar' }, { name: 'Foo', href: '/bar' }, { name: 'Foo', href: '/bar' }],
          },
        },
      ] }
    },
  }),
] as const
