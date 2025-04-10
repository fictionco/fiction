import type { StandardUserConfig } from '@fiction/site/schema'
import { brandSchema, NavListItemSchema, NavListSchema } from '@fiction/core/schemas/schemas'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

export const schema = z.object({
  brand: brandSchema.optional(),
  menus: z.array(NavListSchema).optional(),
  additional: z.object({
    list1: z.array(NavListItemSchema).optional(),
    list2: z.array(NavListItemSchema).optional(),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

export function getOptions() {
  return [
    createOption({
      key: 'brandGroup',
      label: 'Brand',
      input: 'group',
      schema,
      icon: { class: 'i-tabler-icons' },
      options: [
        createOption({ key: 'brand', input: 'InputBrand', schema }),
      ],
    }),

    createOption({
      key: 'menuGroup',
      label: 'Menus',
      input: 'group',
      schema,
      icon: { class: 'i-tabler-list-check' },
      options: [
        createOption({ key: 'menus', input: 'InputNavMenu', schema }),
      ],
    }),

    createOption({
      key: 'additional',
      label: 'Additional Links',
      input: 'group',
      schema,
      icon: { class: 'i-tabler-link' },
      options: [
        createOption({ key: 'additional.list1', label: 'Primary Links', input: 'InputNav', props: { hasChildNav: false }, schema }),
        createOption({ key: 'additional.list2', label: 'Secondary Links', input: 'InputNav', props: { hasChildNav: false }, schema }),
      ],
    }),
  ]
}

export function getDefaultConfig(): UserConfig {
  return {
    brand: {
      logo: { variant: 'typography', typography: { label: 'Your Brand' } },
    },
    menus: [
      {
        title: 'Discover',
        items: [
          { label: 'Our Vision', href: '/about', icon: { iconId: 'eye' } },
          { label: 'Services', href: '/services', icon: { iconId: 'star' } },
          { label: 'Success Stories', href: '/case-studies', icon: { iconId: 'trophy' } },
        ],
      },
      {
        title: 'Connect',
        items: [
          {
            label: 'Schedule a Call',
            href: '/contact',
            icon: { iconId: 'calendar' },
            description: 'Book a 30-min strategy session',
          },
          {
            label: 'Join Newsletter',
            href: '/newsletter',
            icon: { iconId: 'mail' },
            description: 'Weekly insights on digital growth',
          },
        ],
      },
    ],
    additional: {
      list1: [
        { label: 'Privacy Promise', href: '/privacy' },
        { label: 'Terms of Delight', href: '/terms' },
      ],
      list2: [
        { label: '© 2024 Brand Visionaries. Crafting Digital Excellence.' },
        { label: 'Made with ♥ and Fiction' },
      ],
    },
  }
}

export function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {
    creator: {
      templateId,
      userConfig: {
        brand: {
          logo: { variant: 'typography', typography: { label: 'Alex Rivera' } },
          tagline: 'Empowering Creators to Build Their Digital Empire',
        },
        menus: [
          {
            title: 'Content Library',
            items: [
              { label: 'YouTube Channel', href: 'https://youtube.com/@alexrivera', icon: { iconId: 'brand-youtube' } },
              { label: 'Podcast Episodes', href: '/podcast', icon: { iconId: 'microphone' } },
              { label: 'Free Resources', href: '/resources', icon: { iconId: 'gift' } },
            ],
          },
          {
            title: 'Join the Movement',
            items: [
              { label: 'Creator Academy', href: '/academy', icon: { iconId: 'school' } },
              { label: 'Community Hub', href: '/community', icon: { iconId: 'users' } },
              { label: 'Support My Work', href: '/support', icon: { iconId: 'heart' } },
            ],
          },
        ],
        additional: {
          list1: [
            { label: 'Creator Terms', href: '/terms' },
            { label: 'Content Policy', href: '/content-policy' },
          ],
          list2: [
            { label: '© 2024 Alex Rivera | Creator Economy Advocate' },
            { label: 'Part of the Fiction Creator Network' },
          ],
        },
      },
    },

    saas: {
      templateId,
      userConfig: {
        brand: {
          logo: { variant: 'typography', typography: { label: 'FlowSpace' } },
          tagline: 'Where Teams Flow Together',
        },
        menus: [
          {
            title: 'Product Suite',
            items: [
              { label: 'Features', href: '/features', icon: { class: 'i-tabler-sparkles' } },
              { label: 'Solutions', href: '/solutions', icon: { iconId: 'puzzle' } },
              { label: 'Enterprise', href: '/enterprise', icon: { class: 'i-tabler-building' } },
              { label: 'Pricing', href: '/pricing', icon: { iconId: 'tag' } },
            ],
          },
          {
            title: 'Resources',
            items: [
              { label: 'Help Center', href: '/help', icon: { iconId: 'help' } },
              { label: 'API Docs', href: '/api', icon: { iconId: 'code' } },
              { label: 'System Status', href: '/status', icon: { iconId: 'chart-line' } },
            ],
          },
          {
            title: 'Company',
            items: [
              { label: 'About Us', href: '/about', icon: { iconId: 'users' } },
              { label: 'Careers', href: '/careers', icon: { iconId: 'briefcase' } },
              { label: 'Blog', href: '/blog', icon: { iconId: 'news' } },
            ],
          },
        ],
        additional: {
          list1: [
            { label: 'Privacy & Security', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'GDPR', href: '/gdpr' },
          ],
          list2: [
            { label: '© 2024 FlowSpace, Inc. All rights reserved.' },
            { label: 'SOC 2 Type II Certified' },
          ],
        },
      },
    },
    default: {
      templateId,
      userConfig: getDefaultConfig(),
    },
  }
}

export async function getFooterConfig(args: { templateId: string }) {
  const { templateId } = args
  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: Object.values(getDemoConfigs(templateId)),
    },
  }
}
