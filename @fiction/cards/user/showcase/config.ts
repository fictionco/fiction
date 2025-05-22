import type { ActionButton } from '@fiction/core'
import type { StandardUserConfig } from '@fiction/site/schema'
import { PostHandlingSchema } from '@fiction/posts'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

const aspectOptions = [
  { value: 'square', label: 'Square (1:1)' },
  { value: 'portrait', label: 'Portrait (3:4)' },
  { value: 'landscape', label: 'Landscape (4:3)' },
  { value: 'wide', label: 'Wide (16:9)' },
  { value: 'golden', label: 'Golden Ratio (1.618:1)' },
  { value: 'cinema', label: 'Cinematic (21:9)' },
] as const

const schema = z.object({
  posts: PostHandlingSchema.optional().meta({ ai: false, description: 'Post filtering and display configuration' }),
  aspect: z.enum(['square', 'portrait', 'landscape', 'wide', 'golden', 'cinema']).optional().meta({ ai: false, description: 'Control the visual impact with different image proportions' }),
  gridColsMax: z.enum(['2', '3', '4', '5']).optional().meta({ ai: false, description: 'Maximum columns on large screens for optimal viewing' }),
  gridColsMin: z.enum(['1', '2']).optional().meta({ ai: false, description: 'Minimum columns on mobile for responsive layouts' }),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

const options = [
  createOption({
    schema,
    key: 'postsGroup',
    input: 'group',
    icon: { class: 'i-tabler-photo' },
    label: 'Showcase Posts',
    options: [
      createOption({
        key: 'posts',
        input: 'InputPosts',
      }),
    ],
  }),
  createOption({
    schema,
    key: 'settingsGroup',
    input: 'group',
    icon: { class: 'i-tabler-settings' },
    label: 'Settings',
    options: [
      createOption({
        key: 'aspect',
        label: 'Image Proportions',
        description: 'Choose how your images are displayed',
        input: 'InputSelect',
        list: aspectOptions,
      }),
      createOption({
        key: 'gridColsMax',
        label: 'Desktop Grid Columns',
        description: 'Optimize the layout for larger screens',
        input: 'InputRadioButton',
        props: { uiSize: 'sm' },
        list: ['2', '3', '4', '5'].map(v => ({
          value: v,
          label: `${v} Col`,
        })),
      }),
      createOption({
        key: 'gridColsMin',
        label: 'Mobile Grid Columns',
        description: 'Ensure great mobile experience',
        input: 'InputRadioButton',
        props: { uiSize: 'sm' },
        list: [
          { value: '1', label: 'Single Column' },
          { value: '2', label: 'Two Columns' },
        ],
      }),
    ],
  }),

]

// Shared showcase items across all demos
async function getShowcaseItems(stock: any) {
  const commonActions: ActionButton[] = [
    { label: 'Learn More', design: 'outline', theme: 'primary' },
    { label: 'View Details', theme: 'primary' },
  ]

  return [
    {
      title: 'Craft Your Visual Story',
      subTitle: 'See how hierarchy guides attention',
      content: 'Start with your strongest visual element. Notice how featured images immediately draw focus while supporting content creates a natural flow through your narrative.',
      media: stock.getRandomByTags(['object']),
      actions: commonActions,
    },
    {
      title: 'Build Engaging Rhythm',
      subTitle: 'Create patterns that captivate',
      content: 'Mix different content types to maintain visual interest. Combine product showcases, lifestyle imagery, and detail shots to tell a complete story.',
      media: stock.getRandomByTags(['object']),
      actions: commonActions,
    },
    {
      title: 'Drive Action Through Design',
      subTitle: 'Transform viewers into participants',
      content: 'Each showcase item reveals deeper context on interaction. Use this expanded view to provide rich details and compelling calls to action.',
      media: stock.getRandomByTags(['object']),
      actions: commonActions,
    },
    {
      title: 'Perfect Every Detail',
      subTitle: 'Polish creates professionalism',
      content: 'Notice how smooth transitions and thoughtful spacing make your content feel premium. Every interaction has been crafted for maximum impact.',
      media: stock.getRandomByTags(['object']),
      actions: commonActions,
    },
    {
      title: 'Establish Your Brand',
      subTitle: 'Stand out with consistency',
      content: 'Maintain consistent image proportions and grid layouts. This attention to detail builds trust and reinforces your brand identity.',
      media: stock.getRandomByTags(['object']),
      actions: commonActions,
    },
    {
      title: 'Optimize for Impact',
      subTitle: 'Command attention instantly',
      content: 'Strategic image placement and sizing guides viewers through your content. Use larger features for key messages and supporting grid items for context.',
      media: stock.getRandomByTags(['object']),
      actions: commonActions,
    },
  ]
}

// Different demo configurations
const demoConfigs = {
  portfolio: {
    aspect: 'portrait',
    gridColsMax: '3',
    gridColsMin: '2',
    description: 'Perfect for creative portfolios and case studies. Portrait orientation emphasizes individual works while maintaining a clean grid.',
  },
  products: {
    aspect: 'square',
    gridColsMax: '4',
    gridColsMin: '2',
    description: 'Ideal for product galleries and catalogs. Square format ensures consistent presentation across diverse items.',
  },
  features: {
    aspect: 'wide',
    gridColsMax: '2',
    gridColsMin: '1',
    description: 'Showcase features or services with impact. Wide format provides space for compelling visuals and descriptive text.',
  },
  gallery: {
    aspect: 'landscape',
    gridColsMax: '5',
    gridColsMin: '2',
    description: 'Create an immersive photo gallery. Landscape orientation maximizes visual impact in a dense grid layout.',
  },
}

async function getDemoCards(args: { templateId: string, stock: any }) {
  const { templateId, stock } = args
  const items = await getShowcaseItems(stock)

  return Object.entries(demoConfigs).map(([key, config]) => ({
    templateId,
    userConfig: {
      ...config,
      posts: {
        format: 'local',
        entries: items,
      },
    },
  }))
}

async function getDefaultConfig(args: { stock: any }): Promise<UserConfig> {
  const { stock } = args
  const items = await getShowcaseItems(stock)

  return {
    aspect: 'portrait',
    gridColsMax: '3',
    gridColsMin: '2',
    posts: {
      format: 'local',
      entries: items.slice(0, 3), // Start with fewer items for simplicity
    },
  }
}

export async function getConfig(args: { templateId: string, factory: any }) {
  const stock = await args.factory.getStockMedia()

  return {
    schema,
    options,
    userConfig: await getDefaultConfig({ stock }),
    demoPage: {
      cards: await getDemoCards({ templateId: args.templateId, stock }),
    },
  }
}
