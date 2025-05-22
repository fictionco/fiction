import type { StandardUserConfig } from '@fiction/site/schema'
import { MediaSchema, NavListItemSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

const pricingFeatureSchema = NavListItemSchema.pick({ label: true })

const PriceSchema = z.object({
  title: z.string().optional().describe('name of pricing plan'),
  price: z.number().optional().describe('monthly price of plan'),
  description: z.string().optional().describe('compelling description highlighting plan value'),

  features: z.array(pricingFeatureSchema).optional().describe('list of included features'),
  variant: z.enum(['default', 'highlighted', 'muted']).optional().describe('visual style - highlighted draws attention, muted reduces emphasis'),
  icon: MediaSchema.optional().describe('plan icon - helps visually differentiate tiers'),
  badge: z.string().optional().describe('optional badge text like "Most Popular" or "Best Value"'),

  button: z.object({
    label: z.string().optional().describe('call-to-action text'),
    icon: MediaSchema.optional().describe('icon to display next to button text'),
    href: z.string().optional().describe('link for monthly plan purchase'),
    hrefAnnual: z.string().optional().describe('link for annual plan purchase'),
  }).optional(),

})

const schema = z.object({
  hasAnnual: z.boolean().optional().describe('enable annual pricing option'),
  annualDiscountPercent: z.number().optional().describe('discount percentage for annual plans'),
  layout: z.enum(['cards', 'minimal', 'standard']).optional().describe('visual presentation style'),
  prices: z.array(PriceSchema).optional(),
})

export type PricingPlan = z.infer<typeof PriceSchema>
type PricingPlanFeature = NonNullable<PricingPlan['features']>[number]
export type UserConfig = z.infer<typeof schema> & StandardUserConfig

const options = [

  createOption({
    schema,
    key: 'pricesGroup',
    label: 'Pricing Plans',
    input: 'group',
    icon: { class: 'i-tabler-report-money' },
    options: [
      createOption({
        schema,
        key: 'prices',
        label: 'Pricing Plans',
        input: 'InputList',
        icon: { class: 'i-tabler-money' },
        props: {
          itemName: 'Plan',
          itemLabel: args => (args?.item as PricingPlan)?.title ?? 'Untitled',
        },
        options: [
          createOption({
            schema,
            key: 'prices.0.title',
            label: 'Plan Name',
            input: 'InputText',
            isRequired: true,
          }),
          createOption({
            schema,
            key: 'prices.0.price',
            label: 'Monthly Price',
            input: 'InputNumber',
          }),
          createOption({
            schema,
            key: 'prices.0.description',
            label: 'Description',
            input: 'InputTextarea',
            description: 'Highlight the key value proposition',
          }),
          createOption({
            schema,
            key: 'prices.0.variant',
            label: 'Visual Style',
            input: 'InputSelect',
            props: {
              list: [
                { label: 'Default', value: 'default' },
                { label: 'Highlighted', value: 'highlighted' },
                { label: 'Muted', value: 'muted' },
              ],
            },
          }),
          createOption({
            schema,
            key: 'prices.0.icon',
            label: 'Plan Icon',
            input: 'InputIcon',
          }),
          createOption({
            schema,
            key: 'prices.0.badge',
            label: 'Badge Text',
            input: 'InputText',
          }),
          createOption({
            schema,
            key: 'prices.0.features',
            label: 'Features',
            input: 'InputList',
            props: {
              itemName: 'Feature',
              itemLabel: args => (args?.item as PricingPlanFeature)?.label ?? 'Untitled',
            },
            options: [
              createOption({
                schema,
                key: 'prices.0.features.0.label',
                label: 'Feature',
                input: 'InputText',
                isRequired: true,
              }),
            ],
          }),
          createOption({
            schema,
            key: 'prices.0.button',
            label: 'Call to Action',
            input: 'group',
            options: [
              createOption({
                schema,
                key: 'prices.0.button.label',
                label: 'Button Text',
                input: 'InputText',
              }),
              createOption({
                schema,
                key: 'prices.0.button.icon',
                label: 'Button Icon',
                input: 'InputIcon',
              }),
              createOption({
                schema,
                key: 'prices.0.button.href',
                label: 'Monthly Plan Link',
                input: 'InputSiteRoute',
              }),
              createOption({
                schema,
                key: 'prices.0.button.hrefAnnual',
                label: 'Annual Plan Link',
                input: 'InputSiteRoute',
              }),
            ],
          }),

        ],
      }),
    ],
  }),

  createOption({
    schema,
    key: 'settingsGroup',
    label: 'Settings',
    input: 'group',
    icon: { class: 'i-tabler-settings' },
    options: [
      createOption({
        schema,
        key: 'layout',
        label: 'Visual Style',
        input: 'InputRadioButton',
        props: { uiSize: 'sm' },
        list: [
          { label: 'Standard', value: 'standard' },
          { label: 'Minimal', value: 'minimal' },
          { label: 'Cards', value: 'cards' },
        ],
      }),
      createOption({
        schema,
        key: 'hasAnnual',
        label: 'Annual Pricing',
        input: 'InputToggle',
        description: 'Enable annual pricing with discount',
      }),
      createOption({
        schema,
        key: 'annualDiscountPercent',
        label: 'Annual Discount',
        description: 'Percentage discount for annual plans',
        input: 'InputRange',
        props: { min: 0, max: 100, step: 5 },
      }),
    ],
  }),
]

function getDefaultConfig(): UserConfig {
  return {
    hasAnnual: true,
    annualDiscountPercent: 20,
    layout: 'standard',
    prices: [
      {
        title: 'Starter',
        price: 0,
        description: 'Perfect for trying out our core features',
        icon: { class: 'i-tabler-rocket' },
        features: [
          { label: 'Up to 1,000 monthly visitors' },
          { label: 'Basic analytics dashboard' },
          { label: 'Standard support response time' },
          { label: 'Community access' },
        ],
        button: {
          label: 'Get Started',
          icon: { class: 'i-tabler-rocket' },
          href: '#starter-monthly',
          hrefAnnual: '#starter-annual',
        },
      },
      {
        title: 'Professional',
        price: 49,
        description: 'Everything you need to grow your business',
        variant: 'highlighted',
        badge: 'Most Popular',
        icon: { class: 'i-tabler-stars' },
        features: [
          { label: 'Unlimited visitors' },
          { label: 'Advanced analytics & reporting' },
          { label: 'Priority support (24h response)' },
          { label: 'Custom domain support' },
          { label: 'Remove branding' },
          { label: 'API access' },
        ],
        button: {
          label: 'Start Pro Trial',
          icon: { class: 'i-tabler-stars' },
          href: '#pro-monthly',
          hrefAnnual: '#pro-annual',
        },

      },
      {
        title: 'Enterprise',
        price: 199,
        description: 'Advanced features for larger organizations',
        icon: { class: 'i-tabler-building-skyscraper' },
        features: [
          { label: 'Everything in Professional' },
          { label: 'Dedicated account manager' },
          { label: 'Custom integration support' },
          { label: 'Advanced security features' },
          { label: 'SLA guarantee' },
          { label: 'Custom contract terms' },
        ],
        button: {
          label: 'Contact Sales',
          icon: { class: 'i-tabler-building-skyscraper' },
          href: '#enterprise-monthly',
          hrefAnnual: '#enterprise-annual',
        },
      },
    ],
  }
}

function getStartupConfig(): UserConfig {
  return {
    hasAnnual: true,
    annualDiscountPercent: 25,
    layout: 'minimal',
    prices: [
      {
        title: 'Bootstrap',
        price: 0,
        description: 'Perfect for early-stage startups',
        icon: { class: 'i-tabler-plant-2' },
        features: [
          { label: 'Essential features to get started' },
          { label: 'Up to 3 team members' },
          { label: 'Basic analytics' },
          { label: 'Community support' },
        ],
        button: {
          label: 'Get Started',
          icon: { class: 'i-tabler-plant-2' },
          href: '#bootstrap-monthly',
          hrefAnnual: '#bootstrap-annual',
        },
      },
      {
        title: 'Scale Up',
        price: 79,
        variant: 'highlighted',
        badge: 'Recommended',
        description: 'Power features for growing teams',
        icon: { class: 'i-tabler-chart-arrows-vertical' },
        features: [
          { label: 'Everything in Bootstrap, plus:' },
          { label: 'Unlimited team members' },
          { label: 'Advanced integrations' },
          { label: 'Priority support' },
          { label: 'Enhanced security' },
        ],
        button: {
          label: 'Start Pro Trial',
          icon: { class: 'i-tabler-chart-arrows-vertical' },
          href: '#scale-up-monthly',
          hrefAnnual: '#scale-up-annual',
        },
      },
    ],
  }
}

export async function getConfig(args: { templateId: string }) {
  return {
    schema,
    options,
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: [
        { templateId: args.templateId, userConfig: getDefaultConfig() },
        { templateId: args.templateId, userConfig: getStartupConfig() },
      ],
    },
  }
}
