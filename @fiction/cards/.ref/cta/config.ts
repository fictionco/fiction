import type { NavListItem } from '@fiction/core'
import { ActionAreaSchema, NavListItemSchema, NavListSchema, SuperTitleSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

const BenefitItemSchema = NavListItemSchema.pick({
  label: true,
  description: true,
  icon: true,
})

const BenefitSchema = NavListSchema.pick({
  title: true,
}).extend({
  items: z.array(BenefitItemSchema),
})

// Updated schema with new structure
export const schema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  superTitle: SuperTitleSchema.optional(),
  benefits: BenefitSchema.optional(),
  action: ActionAreaSchema.optional(),
})

export type UserConfig = z.infer<typeof schema>

export function getOptions() {
  return [
    createOption({
      schema,
      key: 'group.content',
      label: 'Content',
      input: 'group',
      icon: { class: 'i-tabler-highlight' },
      options: [
        createOption({ schema, key: 'title', label: 'Main Title', input: 'InputText' }),
        createOption({ schema, key: 'subTitle', label: 'Sub Title', input: 'InputTextarea' }),
        createOption({ schema, key: 'superTitle', label: 'Super Title', input: 'InputSuperTitle' }),
      ],
    }),

    createOption({
      schema,
      key: 'benefits',
      label: 'Benefits',
      input: 'group',
      icon: { class: 'i-tabler-list-check' },
      options: [
        createOption({ schema, key: 'benefits.title', label: 'Benefits Section Title', input: 'InputText' }),
        createOption({
          schema,
          key: 'benefits.items',
          label: 'Benefit Items',
          input: 'InputList',
          props: {
            itemName: 'Benefit',
            itemLabel: args => (args?.item as NavListItem)?.label ?? 'Untitled',
          },
          options: [
            createOption({ schema, key: 'benefits.items.0.label', label: 'Title', input: 'InputText', isRequired: true }),
            createOption({ schema, key: 'benefits.items.0.description', label: 'Description', input: 'InputText' }),
            createOption({ schema, key: 'benefits.items.0.icon', label: 'Icon', input: 'InputIcon' }),
          ],
        }),
      ],
    }),

    createOption({
      schema,
      key: 'action',
      label: 'Call to Action',
      input: 'InputActionArea',
      props: { proof: ['community'] },
    }),

  ]
}

export function getDefaultConfig(): UserConfig {
  return {
    superTitle: {
      text: 'Connect on Fiction',
      icon: { iconId: 'north-star' },
    },
    title: 'Let\'s Stay Connected',
    subTitle: 'Connect on Fiction and get exclusive access to events, updates, and more.',
    action: {
      variant: 'subscribe',

    },
  }
}

export function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {

    newsletter: {
      templateId,
      userConfig: {
        superTitle: {
          text: 'Limited Time Offer',
          icon: { class: 'i-tabler-star' },
          theme: 'orange',
        },
        title: 'Master the Art of Digital Marketing',
        subTitle: 'Join our premium newsletter and get battle-tested strategies that helped 100+ brands scale their online presence. Delivered fresh to your inbox every Tuesday.',
        benefits: {
          title: 'You\'ll Master:',
          items: [
            {
              label: 'Growth Psychology',
              description: 'Understand what makes audiences click, engage, and convert',
              icon: { class: 'i-tabler-brain' },
            },
            {
              label: 'Content Alchemy',
              description: 'Transform simple ideas into magnetic content that attracts leads',
              icon: { class: 'i-tabler-wand' },
            },
            {
              label: 'ROI Mastery',
              description: 'Maximize your marketing budget with data-driven decisions',
              icon: { class: 'i-tabler-chart-dots' },
            },
          ],
        },
        action: {
          variant: 'subscribe',
          subscribe: {
            input: { placeholder: 'Enter your email address' },
            button: { label: 'Claim Your Spot' },
            success: {
              title: 'Success!',
              content: 'Check your inbox for a confirmation email',
            },
          },
          proof: {
            community: {
              isEnabled: true,
              text: 'marketers growing their brands',
              count: 15430,
              thumbCount: 4,
            },
          },

        },
      },
    },
    saas: {
      templateId,
      userConfig: {
        superTitle: {
          text: 'Power Up Your Workflow',
          icon: { class: 'i-tabler-bolt' },
          theme: 'blue',
        },
        title: 'Your Team\'s Command Center',
        subTitle: 'Streamline collaboration, automate busywork, and watch your team\'s productivity soar. Built for modern teams who value efficiency.',
        benefits: {
          title: 'Platform Benefits:',
          items: [
            {
              label: 'Smart Automation',
              description: 'Save 15+ hours per week with AI-powered workflows',
              icon: { class: 'i-tabler-robot' },
            },
            {
              label: 'Real-time Sync',
              description: 'Keep your team aligned with instant updates',
              icon: { class: 'i-tabler-refresh' },
            },
            {
              label: 'Analytics Dashboard',
              description: 'Make data-driven decisions with powerful insights',
              icon: { class: 'i-tabler-chart-bar' },
            },
          ],
        },
        action: {
          variant: 'buttons',
          buttons: [
            {
              label: 'Get Started',
              theme: 'primary',
              icon: { class: 'i-tabler-rocket' },
            },
            {
              label: 'Watch Demo',
              theme: 'default',
              icon: { class: 'i-tabler-player-play' },
            },
          ],
          proof: {
            community: {
              isEnabled: true,
              text: 'teams boosting productivity',
              count: 8750,
              thumbCount: 5,
            },
          },
        },
      },

    },
    default: {
      templateId,
      userConfig: getDefaultConfig(),
    },
  }
}

export async function getConfig(args: { templateId: string }) {
  const { templateId } = args
  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: [
        ...Object.values(getDemoConfigs(templateId)),
      ],
    },
  }
}
