import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { PostHandlingSchema } from '@fiction/core'
import { getDemoPosts } from '@fiction/posts/utils/post'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

// Schema definition
export const schema = z.object({
  posts: PostHandlingSchema.optional().describe('Blog post configuration and handling'),
  index: z.object({
    featuredCount: z.number().optional().describe('Number of featured posts to display prominently'),
    showAuthors: z.boolean().optional().describe('Display author information'),
    showExcerpts: z.boolean().optional().describe('Show post excerpts in grid'),
    showReadTime: z.boolean().optional().describe('Display estimated reading time'),
    showDates: z.boolean().optional().describe('Show publication dates'),
  }).optional(),
})

export type UserConfig = z.infer<typeof schema> & SiteUserConfig

const options = [
  createOption({
    schema,
    key: 'postsGroup',
    label: 'Post Configuration',
    input: 'group',
    icon: { class: 'i-tabler-file-text' },
    options: [
      createOption({
        schema,
        key: 'posts',
        label: 'Posts',
        subLabel: 'Configure post selection and filtering',
        input: 'InputPosts',
        description: 'Choose between global posts or specify local entries',
      }),

    ],
  }),
  createOption({
    schema,
    key: 'displayGroup',
    label: 'Layout & Display',
    input: 'group',
    icon: { class: 'i-tabler-layout' },
    options: [
      createOption({
        schema,
        key: 'index.featuredCount',
        label: 'Featured Count',
        input: 'InputRadioButton',
        props: { uiSize: 'sm' },
        list: [{ value: 1, label: '1' }, { value: 2, label: '2' }, { value: 3, label: '3' }],
      }),
      createOption({
        schema,
        key: 'index.showAuthors',
        label: 'Show Author',
        subLabel: 'Display author information on post cards',
        input: 'InputToggle',
      }),
      createOption({
        schema,
        key: 'index.showDates',
        label: 'Show Date',
        subLabel: 'Display publication date on post cards',
        input: 'InputToggle',
      }),
      createOption({
        schema,
        key: 'index.showExcerpts',
        label: 'Show Excerpt',
        subLabel: 'Display post excerpt on cards',
        input: 'InputToggle',
      }),
      createOption({
        schema,
        key: 'index.showReadTime',
        label: 'Show Read Time',
        input: 'InputToggle',
      }),
    ],
  }),

]

export function getDefaultUserConfig(args: { stock: StockMedia }): UserConfig {
  const { stock } = args
  return {
    standard: {
      headers: {
        title: 'Latest Articles',
        subTitle: 'Discover our latest insights and stories',
      },
    },
    posts: {
      format: 'standard',
      limit: 12,
      entries: getDemoPosts({ stock, limit: 3 }),
    },
  }
}

// Demo user configuration
export async function getDemoUserConfig(args: { factory: CardFactory, stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args

  const demoPosts = await getDemoPosts({ stock })

  return {
    index: {
      featuredCount: 3,
      showAuthors: true,
      showExcerpts: true,
      showReadTime: true,
    },
    posts: {
      format: 'local',
      entries: demoPosts.map(p => ({
        ...p,
        media: stock.getRandomByTags(['object']),
      })),
    },
  }
}

// Demo card configurations
export function getDemoCards(args: { templateId: string, demoUserConfig: UserConfig, stock: StockMedia }): { templateId: string, userConfig: UserConfig }[] {
  const { templateId, demoUserConfig, stock } = args

  return [
    {
      templateId,
      userConfig: {
        standard: {
          headers: {
            superTitle: { text: 'Design Insights' },
            title: 'Curated Perspectives',
            subTitle: 'Exploring innovation through expert analysis and fresh ideas',
          },
        },
        ...demoUserConfig,
      },
    },
    {
      templateId,
      userConfig: {
        standard: {
          headers: {
            superTitle: { text: 'Tech & Culture' },
            title: 'Digital Frontier',
            subTitle: 'Where technology meets human experience',
          },
          themeColor: 'slate',
        },
        index: {
          ...demoUserConfig.index,
          featuredCount: 1,
        },
        posts: demoUserConfig.posts,
      },
    },
    {
      templateId,
      userConfig: {
        standard: {
          headers: {
            superTitle: { text: 'Future Impact' },
            title: 'Tomorrow\'s Stories',
            subTitle: 'Ideas and innovations shaping our world',
          },
          themeColor: 'emerald',
        },
        index: {
          ...demoUserConfig.index,
          featuredCount: 2,
        },
        posts: demoUserConfig.posts,
      },
    },
    // Single post display demo
    {
      templateId,
      userConfig: {
        ...demoUserConfig,
        posts: {
          ...demoUserConfig.posts,
          entries: getDemoPosts({ stock, limit: 1 }),
        },
      },
    },
  ] satisfies { templateId: string, userConfig: UserConfig }[]
}

// Main config function
export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()
  const demoUserConfig = await getDemoUserConfig({ factory, stock })

  return {
    options,
    schema,
    userConfig: getDefaultUserConfig({ ...args, stock }),
    demoPage: {
      cards: getDemoCards({ templateId, demoUserConfig, stock }),
    },
  }
}
