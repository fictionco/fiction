import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { standardOption } from '@fiction/cards/inputSets'
import { CardTemplate } from '@fiction/site/card'
import { z } from 'zod'
import { mediaSchema } from '../schemaSets'

const navItemSchema = z.object({
  name: z.string().optional(),
  href: z.string().optional(),
  itemStyle: z.enum(['button', 'user', 'standard']).optional(),
  subStyle: z.enum(['mega', 'standard']).optional(),
  itemsTitle: z.string().optional(),
  items: z.array(z.object({
    name: z.string().optional(),
    href: z.string().optional(),
    target: z.string().optional(),
    itemsTitle: z.string().optional(),
    items: z.array(z.object({
      name: z.string().optional(),
      href: z.string().optional(),
      target: z.string().optional(),
    })).optional(),
  })).optional(),
  desc: z.string().optional(),
  target: z.string().optional(),
})

export type SchemaNavItem = z.infer<typeof navItemSchema> & { isActive?: boolean }

const schema = z.object({
  logo: mediaSchema.optional(),
  navA: z.array(navItemSchema).optional(),
  navB: z.array(navItemSchema).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options = [
  new InputOption({ key: 'logo', label: 'Logo', input: 'InputMediaDisplay' }),
  standardOption.navItems({ key: 'navA', maxDepth: 2 }),
  standardOption.navItems({ key: 'navB', maxDepth: 2 }),
]

// Example default configuration for a movie actor or director's personal website
const defaultConfig: UserConfig = {
  logo: { html: `<div class="flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
  <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
</svg> <span>Logo</span></div>
` },
  navA: [
    { name: 'About', href: '/about', items: [
      { name: 'Biography', href: '/about/biography' },
      { name: 'Press', href: '/about/press', items: [{ name: 'News', href: '/about/press/news' }, { name: 'Interviews', href: '/about/press/interviews' }] },
      { name: 'FAQ', href: '/about/faq' },

    ] },
    { name: 'Filmography', desc: `Some of our work...`, href: '/filmography', itemStyle: 'button', subStyle: 'mega', items: [
      { name: 'Movies', href: '/filmography/movies', items: [{ name: 'Classic Movies', href: '/filmography/movies/classic' }, { name: 'Recent Movies', href: '/filmography/movies/recent' }] },
      { name: 'TV Shows', href: '/filmography/tv-shows', items: [{ name: 'Popular Shows', href: '/filmography/tv-shows/popular' }, { name: 'Latest Shows', href: '/filmography/tv-shows/latest' }] },
      { name: 'Directorial Works', href: '/filmography/directorial-works', items: [{ name: 'Feature Films', href: '/filmography/directorial-works/feature-films' }, { name: 'Short Films', href: '/filmography/directorial-works/short-films' }] },
    ] },
    { name: 'Awards', href: '/awards' },
    { name: 'Gallery', href: '/gallery', itemStyle: 'button' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact', itemStyle: 'button' },
  ],
  navB: [
    { name: 'Clients', href: '/clients', itemStyle: 'user', items: [{ name: 'Project Inquiries', href: '/clients/project-inquiries' }, { name: 'Testimonials', href: '/clients/testimonials' }, { name: 'Client Portal', href: '/clients/portal' }] },
    { name: 'Account', href: '/account', itemStyle: 'user', items: [{ name: 'Login', href: '/account/login' }, { name: 'Register', href: '/account/register' }, { name: 'Profile', href: '/account/profile' }] },
  ],
}

const el = vue.defineAsyncComponent(async () => import('./ElHeader.vue'))
const templateId = 'nav'
export const templates = [
  new CardTemplate({
    templateId,
    category: ['navigation', 'basic'],
    icon: 'i-tabler-box-align-top',
    colorTheme: 'blue',
    description: 'A header with a logo and navigation links',
    isPublic: false,
    el,
    userConfig: { ...defaultConfig, spacing: { spacingClass: 'py-0 lg:py-2' } },
    schema,
    options,
    title: 'Primary Nav',
    demoPage: () => {
      return [
        { templateId, userConfig: { spacing: { spacingClass: 'py-20' }, ...defaultConfig } },
        {
          templateId,
          userConfig: {
            spacing: { spacingClass: 'py-12' },
            logo: { url: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100' },
            navA: [{ name: 'Lorem Ipsum Lorem Ipsum', href: '/bar' }, { name: 'Long Name', href: '/bar' }, { name: 'Foo', href: '/bar' }, { name: 'Foo', href: '/bar' }],
          },
        },
      ]
    },
  }),
] as const
