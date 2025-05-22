import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { MediaSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

const MarqueeItemSchema = z.object({
  title: z.string().optional().meta({ description: 'Primary text shown on hover' }),
  subTitle: z.string().optional().meta({ description: 'Secondary text shown on hover' }),
  href: z.string().optional().meta({ description: 'Navigation link - use full URL for external links' }),
  media: MediaSchema.optional().meta({ description: 'Background media for the item' }),
})

const schema = z.object({
  items: z.array(MarqueeItemSchema).meta({ description: 'Media items to display in the marquee' }),
  direction: z.enum(['left', 'right']).optional().meta({ description: 'Scroll direction' }),
  stagger: z.boolean().optional().meta({ description: 'Enable staggered item positioning' }),
  speed: z.number().min(1).max(20).optional().meta({ description: 'Animation speed in seconds' }),
  showAllText: z.boolean().optional().meta({ description: 'Show text overlay on items' }),
})

export type MarqueeItem = z.infer<typeof MarqueeItemSchema>
export type UserConfig = z.infer<typeof schema> & StandardUserConfig

const options = [
  createOption({
    input: 'group',
    key: 'itemsGroup',
    label: 'Marquee Items',
    icon: { class: 'i-tabler-map-photo' },
    options: [
      createOption({
        schema,
        key: 'items',
        input: 'InputList',
        props: {
          itemName: 'Marquee Item',
          itemLabel: args => (args?.item as MarqueeItem)?.title ?? 'Untitled',
        },
        options: [
          createOption({
            schema,
            key: 'items.0.title',
            label: 'Title',
            input: 'InputText',
            description: 'Main text displayed on hover',
          }),
          createOption({
            schema,
            key: 'items.0.subTitle',
            label: 'Subtitle',
            input: 'InputText',
            description: 'Supporting text shown below title',
          }),
          createOption({
            schema,
            key: 'items.0.media',
            label: 'Media',
            input: 'InputMedia',
            description: 'Background image or video',
          }),
          createOption({
            schema,
            key: 'items.0.href',
            label: 'Link URL',
            input: 'InputSiteRoute',
            description: 'Where the item links to when clicked',
          }),
        ],
      }),
    ],
  }),

  createOption({
    input: 'group',
    key: 'itemsGroup',
    label: 'Settings',
    icon: { class: 'i-tabler-settings' },
    options: [
      createOption({
        schema,
        key: 'direction',
        label: 'Scroll Direction',
        input: 'InputSelect',
        props: { list: ['left', 'right'] },
        description: 'Direction of marquee animation',
      }),
      createOption({
        schema,
        key: 'stagger',
        label: 'Stagger Items',
        input: 'InputToggle',
        description: 'Create visual depth with subtle height variations',
      }),
      createOption({
        schema,
        key: 'speed',
        label: 'Animation Speed',
        input: 'InputNumber',
        props: { min: 1, max: 20 },
        description: 'Duration of the scroll animation in seconds',
      }),
      createOption({
        schema,
        key: 'showAllText',
        label: 'Show Text Overlay',
        input: 'InputToggle',
        description: 'Display title and subtitle over images',
      }),
    ],
  }),

]

async function getUserConfig(args: { stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args

  const items = await Promise.all([
    stock.getRandomByTags(['aspect:portrait']),
    stock.getRandomByTags(['aspect:portrait']),
    stock.getRandomByTags(['aspect:portrait']),
    stock.getRandomByTags(['aspect:portrait']),
    stock.getRandomByTags(['aspect:portrait']),
  ])

  return {
    items: [
      {
        title: 'Visual Storytelling',
        subTitle: 'Shape your narrative',
        media: items[0],
        href: '#',
      },
      {
        title: 'Dynamic Design',
        subTitle: 'Craft with purpose',
        media: items[1],
        href: '#',
      },
      {
        title: 'Creative Flow',
        subTitle: 'Inspire movement',
        media: items[2],
        href: '#',
      },
      {
        title: 'Bold Vision',
        subTitle: 'Lead with clarity',
        media: items[3],
        href: '#',
      },
      {
        title: 'Artistic Direction',
        subTitle: 'Guide with style',
        media: items[4],
        href: '#',
      },
    ],
    direction: 'left',
    speed: 7,
    stagger: false,
    showAllText: false,
  }
}

async function getDemoUserConfig(args: { stock: StockMedia }): Promise<UserConfig[]> {
  const { stock } = args
  const base = await getUserConfig({ stock })

  return [
    {
      standard: { headers: {
        title: 'Fluid Motion',
        subTitle: 'Experience the natural flow of content with smooth transitions',
      } },
      ...base,
      items: base.items.map(item => ({
        ...item,
        media: { ...item.media, overlay: { opacity: 0.2 } },
      })),
      direction: 'left',
      stagger: false,
      showAllText: true,
      speed: 7,
    },
    {
      standard: { headers: {
        title: 'Visual Rhythm',
        subTitle: 'Feel the dynamic energy of staggered elements in motion',
      } },
      ...base,
      items: base.items.map(item => ({
        ...item,
        media: { ...item.media, overlay: { opacity: 0 } },
      })),
      direction: 'right',
      stagger: true,
      speed: 10,
      showAllText: false,
    },
    {
      standard: { headers: {
        title: 'Artistic Balance',
        subTitle: 'Discover the perfect harmony of imagery and typography',
      } },
      ...base,
      items: base.items.map(item => ({
        ...item,
        media: { ...item.media, overlay: { opacity: 0.4 } },
      })),
      direction: 'left',
      stagger: true,
      speed: 5,
      showAllText: true,
    },
  ]
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const stock = await args.factory.getStockMedia()

  return {
    schema,
    options,
    userConfig: await getUserConfig({ stock }),
    demoPage: {
      cards: (await getDemoUserConfig({ stock })).map(userConfig => ({
        templateId: args.templateId,
        userConfig,
      })),
    },
  }
}
