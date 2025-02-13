import type { MediaObject } from '@fiction/core'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { ActionAreaSchema, NavListItemSchema, SuperTitleSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

// Schema definitions
const detailSchema = NavListItemSchema.pick({
  label: true,
  value: true,
  icon: true,
  href: true,
})

const mediaSchema = NavListItemSchema.pick({
  media: true,
})

export const schema = z.object({
  title: z.string().optional().describe('Primary headline for profile 3 to 8 words [ai]'),
  content: z.string().optional().describe('Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs [ai]'),
  superTitle: SuperTitleSchema.optional(),
  layout: z.enum(['left', 'right']).optional().describe('Media on left or right'),
  mediaItems: z.array(mediaSchema).optional().describe('Splash pictures in portrait format [ai seconds=40]'),
  detailsTitle: z.string().optional().describe('Title for list of details [ai]'),
  details: z.array(detailSchema).optional().describe('List of details with contact details, location, etc.'),
  action: ActionAreaSchema.optional().describe('List of social media links'),
})

export type UserConfig = z.infer<typeof schema>
type DetailConfig = z.infer<typeof detailSchema>

// Input options configuration
const options = [
  createOption({
    schema,
    key: 'contentGroup',
    input: 'group',
    label: 'Content',
    icon: { class: 'i-tabler-highlight' },
    options: [
      createOption({ schema, key: 'title', input: 'InputText', label: 'Title' }),
      createOption({ schema, key: 'content', input: 'InputProse', label: 'Description' }),
      createOption({ schema, key: 'superTitle', input: 'InputSuperTitle' }),
      createOption({
        schema,
        key: 'detailsGroup',
        input: 'group',
        label: 'Details',
        icon: { class: 'i-tabler-list-details' },
        options: [
          createOption({ schema, key: 'detailsTitle', input: 'InputText', label: 'Details Section Title' }),
          createOption({
            schema,
            key: 'details',
            input: 'InputList',
            props: {
              itemName: 'Detail',
              itemLabel: args => (args?.item as DetailConfig)?.label ?? 'Untitled',
            },
            options: [
              createOption({ schema, key: 'details.0.label', input: 'InputText', label: 'Label' }),
              createOption({ schema, key: 'details.0.value', input: 'InputText', label: 'Value' }),
              createOption({ schema, key: 'details.0.icon', input: 'InputIcon', label: 'Icon' }),
              createOption({ schema, key: 'details.0.href', input: 'InputSiteRoute', label: 'Link URL' }),
            ],
          }),
        ],
      }),

    ],
  }),
  createOption({
    schema,
    key: 'mediaGroup',
    input: 'group',
    label: 'Media',
    icon: { class: 'i-tabler-photo' },
    options: [
      createOption({
        schema,
        key: 'mediaItems',
        label: 'Profile Media',
        input: 'InputList',
        props: {
          itemName: 'Media Item',
          itemLabel: args => (args?.item as MediaObject)?.alt ?? `Media Item ${(args?.item as MediaObject)?.format ?? (args.index ? args.index + 1 : '')}`,
        },
        options: [createOption({ schema, key: 'mediaItems.0.media', input: 'InputMedia' })],
      }),
    ],
  }),
  createOption({
    schema,
    key: 'settingsGroup',
    input: 'group',
    label: 'Settings',
    icon: { class: 'i-tabler-settings' },
    options: [
      createOption({
        schema,
        key: 'layout',
        input: 'InputRadioButton',
        label: 'Layout Style',
        props: { uiSize: 'sm' },
        list: [
          { name: 'Media on Left', value: 'left' },
          { name: 'Media on Right', value: 'right' },
        ],
      }),
    ],
  }),
  createOption({
    schema,
    key: 'mediaGroup',
    input: 'group',
    label: 'Action Area',
    icon: { class: 'i-tabler-click' },
    options: [
      createOption({
        schema,
        key: 'action',
        label: 'Profile Media',
        input: 'InputActionArea',
      }),
    ],
  }),

]

// Default content with instructional copy
async function getUserConfig(args: { factory: CardFactory, stock: StockMedia }): Promise<UserConfig & SiteUserConfig> {
  const { stock } = args

  return {
    superTitle: { text: 'Your Professional Role' },
    title: 'Crafting Your Perfect Professional Story',
    content: `<p>Notice how a well-structured bio can capture attention instantly? Start with your most compelling achievements or unique value proposition. Keep it concise yet impactful.</p>
<p>Imagine connecting with your audience through carefully chosen words that reflect your authentic voice while maintaining professional credibility. Remember to highlight your expertise and what makes you uniquely qualified.</p>`,

    mediaItems: [
      { media: stock.getRandomByTags(['aspect:portrait']) },
      { media: stock.getRandomByTags(['aspect:portrait']) },
    ],
    detailsTitle: 'Let\'s Connect',
    details: [
      { label: 'Location', value: 'Your City, Country', icon: { iconId: 'map' } },
      { label: 'Email', value: 'hello@yourdomain.com', href: 'mailto:hello@example.com', icon: { iconId: 'mail' } },
      { label: 'Availability', value: 'Open to Opportunities', icon: { iconId: 'calendar' } },
      { label: 'Phone', value: '(555) 123-4567', href: 'tel:+15551234567', icon: { iconId: 'phone' } },
    ],
    action: {
      buttons: [
        { label: 'Connect on LinkedIn', href: '#', icon: { iconId: 'brand-linkedin' } },
        { label: 'Follow on X', href: '#', icon: { iconId: 'brand-x' } },
        { label: 'View Portfolio', href: '#', icon: { iconId: 'external-link' } },
      ],
    },
  }
}

// Demo variants showcasing different use cases
async function getDemoUserConfig(args: { factory: CardFactory, stock: StockMedia }): Promise<UserConfig[]> {
  const { factory, stock } = args
  return [
    // Executive Profile
    {
      layout: 'right',
      superTitle: { text: 'Chief Executive Officer' },
      title: 'Leading Innovation Through Vision',
      content: `<p>See how a strong executive presence can be established through thoughtful imagery and precise language? Notice the professional yet approachable tone that builds trust.</p>
<p>Feel the impact of a leadership narrative that combines strategic insight with personal authenticity. Watch how selective details reinforce executive credibility.</p>`,
      mediaItems: [
        { media: stock.getRandomByTags(['person']) },
      ],
      detailsTitle: 'Executive Contact',
      details: [
        { label: 'Office', value: 'Global HQ, New York', icon: { iconId: 'building' } },
        { label: 'Assistant', value: 'executive.office@company.com', href: 'mailto:example@company.com', icon: { iconId: 'mail' } },
      ],
      action: {
        buttons: [
          { label: 'View Leadership Profile', href: '#', icon: { iconId: 'briefcase' }, theme: 'primary' },
          { label: 'LinkedIn Presence', href: '#', icon: { iconId: 'brand-linkedin' } },
        ],
      },
    },

    // Creative Professional
    {
      layout: 'left',
      superTitle: { text: 'Design Director & Artist' },
      title: 'Where Creativity Meets Strategy',
      content: `<p>Imagine capturing your creative spirit while maintaining professional credibility. Notice how the layout balances artistic expression with business acumen.</p>
<p>Experience the power of visual storytelling through carefully curated images and typography that reflect your creative expertise.</p>`,
      mediaItems: [
        { media: stock.getRandomByTags(['person']) },
        { media: stock.getRandomByTags(['object']) },
      ],
      detailsTitle: 'Studio Details',
      details: [
        { label: 'Studio', value: 'Brooklyn Design District', icon: { iconId: 'palette' } },
        { label: 'Portfolio', value: 'View Latest Work', href: '#', icon: { iconId: 'photo' } },
      ],
      action: {
        buttons: [
          { label: 'Instagram Portfolio', href: '#', icon: { iconId: 'brand-instagram' }, theme: 'violet' },
          { label: 'Behance Projects', href: '#', icon: { iconId: 'external-link' } },
        ],
      },
    },

    // Technology Expert
    {
      layout: 'right',
      superTitle: {
        text: 'Tech Innovation Lead',
        theme: 'orange',
        icon: { class: 'i-tabler-briefcase' },
      },
      title: 'Engineering Tomorrow\'s Solutions',
      content: `<p>Watch how technical expertise can be communicated in an engaging, accessible way. Notice the balance between professional accomplishments and approachable personality.</p>
<p>Discover how highlighting key technologies and achievements can build credibility while maintaining a forward-thinking perspective.</p>`,
      mediaItems: [
        { media: stock.getRandomByTags(['person']) },
      ],
      detailsTitle: 'Tech Connect',
      details: [
        { label: 'Specialties', value: 'AI & Machine Learning', icon: { iconId: 'code' } },
        { label: 'GitHub', value: '@techleader', href: '#', icon: { iconId: 'brand-github' } },
      ],
      action: {
        buttons: [
          { label: 'Tech Blog', href: '#', icon: { iconId: 'rss' }, theme: 'orange' },
          { label: 'Stack Overflow', href: '#', icon: { iconId: 'terminal' }, theme: 'orange', design: 'outline' },
        ],
      },
    },
  ]
}

export async function getConfig(args: { factory: CardFactory, templateId: string }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()
  return {
    schema,
    options,
    userConfig: await getUserConfig({ ...args, stock }),
    demoPage: {
      cards: (await getDemoUserConfig({ ...args, stock })).map(userConfig => ({ templateId, userConfig })),
    },
  }
}
