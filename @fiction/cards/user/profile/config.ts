import type { MediaObject } from '@fiction/core'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { CardOptionsWithStandard, StandardUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { ActionAreaSchema, NavListItemSchema, SuperTitleSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

// Schema definitions
const detailSchema = NavListItemSchema.pick({ label: true, value: true, icon: true, href: true })

const mediaSchema = NavListItemSchema.pick({ media: true,
})

export const schema = z.object({
  title: z.string().optional().meta({ ai: true, description: 'Primary headline for profile 3 to 8 words' }),
  content: z.string().optional().meta({ ai: true, description: 'Formatted markdown of profile with paragraphs, 30 to 60 words, 2 paragraphs' }),
  superTitle: SuperTitleSchema.optional().meta({ ai: true, description: 'Small text above title' }),
  layout: z.enum(['left', 'right']).optional().meta({ ai: false, description: 'Media on left or right' }),
  mediaItems: z.array(mediaSchema).optional().meta({ ai: true, description: 'Splash pictures in portrait format' }),
  details: z.array(detailSchema).optional().meta({ ai: true, description: 'List of details with contact details, location, etc.' }),
  action: ActionAreaSchema.optional().meta({ ai: true, description: 'List of social media links' }),
})

export type UserConfig = z.infer<typeof schema> & CardOptionsWithStandard
type DetailConfig = z.infer<typeof detailSchema>

// Input options configuration
const options = [
  createOption({
    schema,
    key: 'contentGroup',
    input: 'group',
    label: 'Content',
    icon: { class: 'i-tabler-align-left' },
    options: [
      createOption({ schema, key: 'title', input: 'InputText', label: 'Title' }),
      createOption({ schema, key: 'content', input: 'InputProse', label: 'Description' }),
      createOption({
        schema,
        key: 'superTitle',
        input: 'InputSuperTitle',
        label: 'Context Title',
      }),
      createOption({
        schema,
        key: 'action.buttons',
        label: 'Buttons',
        input: 'InputActions',
      }),
    ],
  }),
  createOption({
    schema,
    key: 'group.media',
    input: 'group',
    label: 'Media & Layout',
    icon: { class: 'i-tabler-photo' },
    options: [
      createOption({
        schema,
        key: 'layout',
        input: 'InputRadioButton',
        label: 'Media Layout',
        props: { uiSize: 'sm' },
        list: [
          { label: 'Media on Left', value: 'left' },
          { label: 'Media on Right', value: 'right' },
        ],
      }),
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

]

// Default content with instructional copy
async function getDefaultConfig(args: { factory: CardFactory, stock: StockMedia }): Promise<UserConfig & StandardUserConfig> {
  const { stock } = args

  return {
    superTitle: { text: '[@name]' },
    title: `[@headline]`,
    content: `[@about]`,

    mediaItems: [
      { media: stock.getRandomByTags(['aspect:portrait']) },
      { media: stock.getRandomByTags(['aspect:portrait']) },
    ],

    action: {
      buttons: [
        { label: 'Follow on X', href: '[@social_url platform=x]', icon: { iconId: 'brand-x' } },
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
    userConfig: await getDefaultConfig({ ...args, stock }),
    demoPage: {
      cards: (await getDemoUserConfig({ ...args, stock })).map(userConfig => ({ templateId, userConfig })),
    },
  }
}
