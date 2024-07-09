import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'

const templateId = 'pricing'

const priceSchema = z.object({
  name: z.string().optional().describe('name of pricing plan'),
  price: z.number().optional().describe('monthly price of plan'),
  desc: z.string().optional().describe('description of plan, compared to other plans (all of free plan, plus...)'),
  href: z.string().optional().describe('link to purchase plan'),
  features: z.array(z.object({ name: z.string().optional().describe('feature text') })).optional().describe('list of features on plan'),
  isHighlighted: z.boolean().optional().describe('highlight this plan'),
  icon: z.string().optional().describe('icon to show on plan (format i-tabler-<icon>)'),
  badge: z.string().optional().describe('badge to show on plan (e.g. "Most Popular")'),
  buttonText: z.string().optional().describe('text for button to purchase plan'),
})

const schema = z.object({
  hasAnnual: z.boolean().optional().describe('Show Annual Discount'),
  annualDiscountPercent: z.number().optional().describe('Annual Discount Percent'),
  prices: z.array(priceSchema),
})

export type UserConfigPrice = z.infer<typeof priceSchema>
export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'hasAnnual', label: 'Show Annual Discount', input: 'InputToggle' }),
  new InputOption({ key: 'annualDiscountPercent', label: 'Annual Discount Percent', input: 'InputRange', props: { min: 0, max: 100 } }),
  new InputOption({ key: 'prices', label: 'Prices', input: 'InputList', options: [
    new InputOption({ key: 'name', label: 'Name', input: 'InputText' }),
    new InputOption({ key: 'price', label: 'Price', input: 'InputNumber' }),
    new InputOption({ key: 'desc', label: 'Description', input: 'InputText' }),
    new InputOption({ key: 'href', label: 'Link', input: 'InputText' }),
    new InputOption({ key: 'features', label: 'Features', input: 'InputList', options: [
      new InputOption({ key: 'name', label: 'Text', input: 'InputText' }),
    ] }),
    new InputOption({ key: 'icon', label: 'Icon', input: 'InputText' }),
    new InputOption({ key: 'isHighlighted', label: 'Highlighted', input: 'InputToggle' }),
    new InputOption({ key: 'badge', label: 'Badge', input: 'InputText' }),
    new InputOption({ key: 'buttonText', label: 'Button Text', input: 'InputText' }),
  ] }),
]

const defaultConfig: UserConfig = {
  annualDiscountPercent: 40,
  prices: [
    {
      name: 'Basic',
      price: 0,
      desc: `What's included...`,
      href: `#`,
      icon: 'i-tabler-free-rights',
      features: [
        { name: 'Up to 1,500 Subscribers' },
        { name: 'Web Hosting' },
        { name: 'Websites' },
        { name: 'Basic Features' },
      ],
    },
    {
      name: 'Pro',
      price: 99,
      desc: `Everything in Basic, plus...`,
      href: '#',
      badge: 'Most Popular',
      icon: 'i-tabler-star',
      features: [
        { name: 'Up to 10,000 subscribers' },
        { name: 'Remove Branding' },
        { name: 'Custom domains' },
        { name: 'Pro Features' },
      ],
      isHighlighted: true,
    },
    {
      name: 'Pro+',
      price: 199,
      desc: `Everything in Pro, plus...`,
      href: '#',
      badge: 'Advanced Features',
      icon: 'i-tabler-stars',
      features: [
        { name: 'Up to 25,000 subscribers' },
        { name: 'Private Community Access' },
        { name: 'Advanced UI cards' },
        { name: 'AI Copilot' },
        { name: 'Pro+ Only Features' },
      ],
    },
  ],
}

const altConfig: UserConfig = {
  annualDiscountPercent: 40,
  prices: [
    {
      name: 'Basic',
      price: 0,
      desc: `What's included...`,
      href: `#`,
      icon: 'i-tabler-free-rights',
      features: [
        { name: 'Up to 1,500 Subscribers' },
        { name: 'Web Hosting' },
        { name: 'Websites' },
        { name: 'Basic Features' },
      ],
    },
    {
      name: 'Pro',
      price: 99,
      desc: `Everything in Basic, plus...`,
      href: '#',
      badge: 'Most Popular',
      icon: 'i-tabler-star',
      features: [
        { name: 'Up to 10,000 subscribers' },
        { name: 'Remove Branding' },
        { name: 'Custom domains' },
        { name: 'Pro Features' },
      ],
      isHighlighted: true,
    },
  ],
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['advanced'],
    description: 'Pricing columns with features and buttons',
    icon: 'i-tabler-report-money',
    colorTheme: 'indigo',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    options,
    schema,
    userConfig: { ...defaultConfig },
    isPublic: true,
    demoPage: () => {
      return {
        cards: [
          { templateId: 'pricing', userConfig: { ...defaultConfig } },
          { templateId: 'pricing', userConfig: { ...altConfig } },
        ],
      }
    },
  }),
] as const
