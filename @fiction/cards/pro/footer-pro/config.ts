import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { ActionAreaSchema, brandSchema, NavListItemSchema, NavListSchema } from '@fiction/core'
import { z } from 'zod'

const socialItemSchema = NavListItemSchema.pick({
  label: true,
  href: true,
  media: true,
})

export const schema = z.object({
  brand: brandSchema.optional(),
  menus: z.array(NavListSchema).optional(),
  badges: ActionAreaSchema.optional(),
  additional: z.object({
    links: z.array(NavListItemSchema).optional(),
    social: z.array(socialItemSchema).optional(),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

function getDefaultConfig(): UserConfig {
  return {
    brand: {
      logo: { variant: 'typography', typography: { label: 'Name' } },
      tagline: 'Add your tagline here',
      action: {
        buttons: [],
      },
    },
    menus: [
      {
        title: 'Resources',
        items: [
          { label: 'Add Site Links', href: '/status', icon: { iconId: 'activity' } },
        ],
      },
    ],
    badges: {
      buttons: [
        {
          icon: { iconId: 'star' },
          label: 'Certified',
          href: '#',
        },
      ],
    },
    additional: {
      links: [
        { label: 'Terms', href: '/terms' },
      ],
      social: [
        { label: 'X', href: 'https://x.com', media: { iconId: 'brand-x' } },
      ],
    },
  }
}

function getOptions() {
  return [
  ]
}

async function getDemoConfig(args: { templateId: string, stock: StockMedia }): Promise<{ templateId: string, userConfig: UserConfig }[]> {
  const { templateId, stock } = args
  return [
    {
      templateId,
      userConfig: {
        brand: {
          logo: {
            variant: 'media',
            media: stock.getLocalMedia({ key: 'lorem1' }),
            typography: { label: 'CloudFlow' },
          },
          tagline: 'Simplify Your Cloud Infrastructure',
          action: {
            buttons: [
              { label: 'Start Free', theme: 'primary', icon: { iconId: 'bolt' } },
              { label: 'Talk to Sales', theme: 'default', icon: { iconId: 'phone' } },
            ],
          },
        },
        menus: [
          {
            title: 'Platform',
            items: [
              { label: 'Features', href: '/features', icon: { iconId: 'sparkles' } },
              { label: 'Solutions', href: '/solutions', icon: { iconId: 'puzzle' } },
              { label: 'Enterprise', href: '/enterprise', icon: { class: 'i-tabler-building' } },
              { label: 'Pricing', href: '/pricing', icon: { iconId: 'tag' } },
            ],
          },
          {
            title: 'Resources',
            items: [
              { label: 'Documentation', href: '/docs', icon: { iconId: 'book' } },
              { label: 'API Reference', href: '/api', icon: { iconId: 'code' } },
              { label: 'Status', href: '/status', icon: { class: 'i-tabler-activity' } },
            ],
          },
          {
            title: 'Company',
            items: [
              { label: 'About', href: '/about', icon: { iconId: 'users' } },
              { label: 'Blog', href: '/blog', icon: { class: 'i-tabler-rss' } },
              { label: 'Careers', href: '/careers', icon: { iconId: 'briefcase' } },
            ],
          },
        ],
        badges: {
          buttons: [
            {
              icon: { iconId: 'star' },
              label: 'Read Reviews',
              theme: 'yellow',
            },
            {
              icon: { iconId: 'users' },
              label: 'Read Testimonials',
              theme: 'blue',
            },
            {
              icon: { iconId: 'check' },
              label: 'Satisfaction Guaranteed',
              theme: 'green',
            },
          ],
        },
        additional: {
          links: [
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Security', href: '/security' },
            { label: 'Accessibility', href: '/accessibility' },
          ],
          social: [
            { label: 'X', href: 'https://x.com', media: { iconId: 'brand-x' } },
            { label: 'GitHub', href: 'https://github.com', media: { iconId: 'brand-github' } },
            { label: 'LinkedIn', href: 'https://linkedin.com', media: { iconId: 'brand-linkedin' } },
            { label: 'YouTube', href: 'https://youtube.com', media: { iconId: 'brand-youtube' } },
          ],
        },
      },
    },
    {
      templateId,
      userConfig: getDefaultConfig(),
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
      cards: await getDemoConfig({ templateId, stock }),
    },
  }
}
