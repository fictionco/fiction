import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { brandSchema, NavListItemSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

const NavBrandSchema = brandSchema.pick({
  logo: true,
})

export const schema = z.object({
  brand: NavBrandSchema.optional(),
  layout: z.enum(['navCenter', 'logoCenter', 'justified']).optional(),
  nav: z.object({
    primary: z.array(NavListItemSchema).optional(),
    utility: z.array(NavListItemSchema).optional(),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

function getOptions() {
  return [
    createOption({
      key: 'brand',
      label: 'Logo',
      input: 'group',
      schema,
      icon: { class: 'i-tabler-icons' },
      options: [
        createOption({
          key: 'brand.logo',
          input: 'InputLogo',
          schema,
        }),
      ],
    }),
    createOption({
      key: 'layoutGroup',
      label: 'Layout',
      input: 'group',
      schema,
      icon: { class: 'i-tabler-layout' },
      options: [
        createOption({
          key: 'layout',
          input: 'InputRadioButton',
          props: { uiSize: 'sm' },
          schema,
          list: [
            { label: 'Center Nav', value: 'navCenter', description: 'Navigation centered with logo on side' },
            { label: 'Center Logo', value: 'logoCenter', description: 'Logo centered with split navigation' },
            { label: 'Justified', value: 'justified', description: 'Fully justified spacing' },
          ],
        }),
      ],
    }),
    createOption({
      key: 'navGroup',
      label: 'Navigation',
      input: 'group',
      icon: { class: 'i-tabler-compass' },
      schema,
      options: [
        createOption({
          key: 'nav.primary',
          label: 'Main Navigation',
          input: 'InputNav',
          schema,
        }),
        createOption({
          key: 'nav.utility',
          label: 'Utility Navigation',
          input: 'InputNav',
          schema,
        }),
      ],
    }),

  ]
}

function getDefaultConfig(): UserConfig {
  return {
    brand: {
      logo: { typography: { label: 'Your Logo' } },
    },
    layout: 'navCenter',
    nav: {
      primary: [],
      utility: [],
    },

  }
}

async function getDemoCards(args: { templateId: string, stock: StockMedia }): Promise<{ templateId: string, userConfig: UserConfig }[]> {
  const { templateId, stock } = args

  return [
    // Default demo showing standard navigation
    {
      templateId,
      userConfig: {
        standard: { headers: { title: 'Center Nav' }, spaceSize: 'md' },
        ...getDefaultConfig(),
      },
    },

    // Agency demo with centered logo and split navigation
    {
      templateId,
      userConfig: {
        standard: { headers: { title: 'Center Logo' }, spaceSize: 'md' },
        brand: {
          logo: { media: stock.getLocalMedia({ key: 'lorem2' }) },
        },
        layout: 'logoCenter',
        nav: {
          primary: [
            {
              label: 'Services',
              href: '/services',
              list: {
                variant: 'expanded',
                title: 'Our Services',
                description: 'End-to-end digital solutions for your brand',
                items: [
                  {
                    label: 'Brand Strategy',
                    description: 'Position your brand for success',
                    href: '/services/strategy',
                    icon: { iconId: 'target' },
                  },
                  {
                    label: 'Web Design',
                    description: 'Beautiful, functional websites',
                    href: '/services/design',
                    icon: { iconId: 'palette' },
                  },
                  {
                    label: 'Development',
                    description: 'Custom web applications',
                    href: '/services/development',
                    icon: { iconId: 'code' },
                  },
                ],
              },
            },
            {
              label: 'Work',
              href: '/work',
              list: {
                items: [
                  { label: 'Case Studies', href: '/work/cases' },
                  { label: 'Portfolio', href: '/work/portfolio' },
                ],
              },
            },
            {
              label: 'About',
              href: '/about',
            },
          ],
          utility: [
            {
              label: 'Contact',
              href: '/contact',
              variant: 'button',
              theme: 'primary',
              design: 'solid',
            },
          ],
        },

      },
    },

    // SaaS product with justified layout and feature-rich mega menu
    {
      templateId,
      userConfig: {
        standard: { headers: { title: 'Left Aligned Nav' }, spaceSize: 'md' },
        brand: {
          logo: {
            variant: 'media',
            media: stock.getRandomByTags(['aspect:wide']),
            typography: { label: 'Atlas', weight: '700' },
            scale: 1.4,
          },
        },
        layout: 'justified',
        nav: {
          primary: [
            {
              label: 'Product',
              href: '/product',
              list: {
                variant: 'expanded',
                title: 'Our Platform',
                description: 'Discover how we can help you grow',
                items: [
                  {
                    label: 'Analytics',
                    description: 'Measure what matters',
                    href: '/product/analytics',
                    icon: { iconId: 'chart-bar' },
                  },
                  {
                    label: 'Automation',
                    description: 'Save time with smart workflows',
                    href: '/product/automation',
                    icon: { iconId: 'robot' },
                  },
                  {
                    label: 'Integrations',
                    description: 'Connect your favorite tools',
                    href: '/product/integrations',
                    icon: { iconId: 'puzzle' },
                  },
                ],
              },
            },
            {
              label: 'Solutions',
              href: '/solutions',
              list: {
                variant: 'expanded',
                items: [
                  {
                    label: 'By Industry',
                    href: '#',
                    list: {
                      items: [
                        { label: 'E-commerce', href: '/solutions/ecommerce' },
                        { label: 'Healthcare', href: '/solutions/healthcare' },
                        { label: 'Finance', href: '/solutions/finance' },
                      ],
                    },
                  },
                  {
                    label: 'By Role',
                    href: '#',
                    list: {
                      items: [
                        { label: 'Marketers', href: '/solutions/marketing' },
                        { label: 'Developers', href: '/solutions/developers' },
                        { label: 'Designers', href: '/solutions/designers' },
                      ],
                    },
                  },
                ],
              },
            },
            {
              label: 'Resources',
              href: '/resources',
              list: {
                items: [
                  { label: 'Blog', href: '/blog', icon: { iconId: 'article' } },
                  { label: 'Documentation', href: '/docs', icon: { iconId: 'book' } },
                  { label: 'Community', href: '/community', icon: { iconId: 'users' } },
                ],
              },
            },
            {
              label: 'Enterprise',
              href: '/enterprise',
              emphasis: 'highlighted',
              theme: 'orange',
            },
          ],
          utility: [
            {
              label: 'Get Started',
              href: '/trial',
              variant: 'button',
              theme: 'primary',
              onAuthState: 'loggedOut',
            },
            {
              label: 'Sign In',
              href: '/signin',
              variant: 'button',
              theme: 'default',
              onAuthState: 'loggedOut',
            },
            {
              label: 'Account',
              href: '/account',
              variant: 'avatar',
              onAuthState: 'loggedIn',
            },
          ],
        },
      },
    },
    {
      templateId,
      userConfig: {
        standard: { headers: { title: 'Modern Platform Navigation' }, spaceSize: 'md' },
        brand: {
          logo: { typography: { label: 'Modern', weight: '700' }, scale: 1.4 },
        },
        layout: 'navCenter',
        nav: {
          primary: [
            {
              label: 'Platform',
              href: '/platform',
              list: {
                variant: 'expanded',
                title: 'Transform Your Workflow',
                description: 'Discover powerful tools that spark innovation and drive growth',
                items: [
                  {
                    label: 'Visual Builder',
                    description: 'Craft stunning interfaces intuitively',
                    href: '/platform/builder',
                    icon: { iconId: 'wand' },
                    emphasis: 'highlighted',
                  },
                  {
                    label: 'AI Assistant',
                    description: 'Enhance productivity with smart automation',
                    href: '/platform/ai',
                    icon: { iconId: 'robot' },
                    emphasis: 'highlighted',
                    variant: 'button',
                    theme: 'purple',
                  },
                  {
                    label: 'Analytics',
                    description: 'Gain deep insights into performance',
                    href: '/platform/analytics',
                    icon: { iconId: 'chart-dots' },
                  },
                ],
              },
            },
            {
              label: 'Solutions',
              href: '/solutions',
              list: {
                variant: 'expanded',
                title: 'Unlock Your Potential',
                description: 'Tailored solutions that drive remarkable results',
                items: [
                  {
                    label: 'Enterprise',
                    description: 'Scale with confidence',
                    href: '/solutions/enterprise',
                    icon: { iconId: 'building-skyscraper' },
                    variant: 'button',
                    theme: 'blue',
                  },
                  {
                    label: 'Startups',
                    description: 'Move fast and innovate',
                    href: '/solutions/startups',
                    icon: { iconId: 'rocket' },
                    variant: 'button',
                    theme: 'green',
                  },
                  {
                    label: 'Agencies',
                    description: 'Empower your client success',
                    href: '/solutions/agencies',
                    icon: { iconId: 'bulb' },
                    variant: 'button',
                    theme: 'yellow',
                  },
                ],
              },
            },
            {
              label: 'Resources',
              href: '/resources',
              emphasis: 'muted',
              list: {
                items: [
                  {
                    label: 'Success Stories',
                    href: '/resources/stories',
                    icon: { iconId: 'star' },
                    emphasis: 'highlighted',
                  },
                  {
                    label: 'Learning Hub',
                    href: '/resources/learn',
                    icon: { iconId: 'book' },
                  },
                  {
                    label: 'Developer Docs',
                    href: '/resources/docs',
                    icon: { iconId: 'code' },
                  },
                ],
              },
            },
            {
              label: 'Pricing',
              href: '/pricing',
              emphasis: 'muted',
            },
            {
              label: 'Start Free',
              href: '/start',
              variant: 'button',
              theme: 'green',
              emphasis: 'highlighted',
              icon: { iconId: 'sparkles' },
            },
          ],
          utility: [
            {
              label: 'Book Demo',
              href: '/demo',
              variant: 'button',
              theme: 'green',
              design: 'outline',
              onAuthState: 'loggedOut',
            },
          ],
        },

      },
    },
  ]
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()

  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: await getDemoCards({ templateId, stock }),
    },
  }
}
