import { PostHandlingSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { stockMediaHandler } from '@fiction/ui/stock/index.js'
import { z } from 'zod'

const el = vue.defineAsyncComponent(async () => import('./ElShowcase.vue'))
const aspects = ['square', 'tall', 'wide', 'golden', 'portrait', 'landscape', 'cinema'] as const
const gridCols = ['1', '2', '3', '4', '5'] as const
const UserConfigSchema = z.object({
  posts: PostHandlingSchema.optional(),
  aspect: z.enum(aspects).optional().describe('Image aspect ratio'),
  gridColsMax: z.enum(gridCols).optional().describe('Max number of columns in the grid on large screen'),
  gridColsMin: z.enum(['1', '2']).optional().describe('Min number of columns in the grid on small screen'),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

const options = [
  new InputOption({ key: 'posts', label: 'Showcase Items', input: 'InputPosts', list: aspects }),
  new InputOption({ key: 'aspect', label: 'Image Aspect', input: 'InputSelect', list: aspects }),
  new InputOption({ key: 'gridColsMax', label: 'Max Grid Columns', input: 'InputSelect', list: gridCols }),
  new InputOption({ key: 'gridColsMin', label: 'Min Grid Columns', input: 'InputSelect', list: ['1', '2'] }),
] as InputOption[]

export async function getDefaultConfig(): Promise<UserConfig> {
  return {
    aspect: 'portrait',
    gridColsMax: '4',
    posts: {
      format: 'local',
      entries: Array.from({ length: 13 }, (_, i) => ({
        title: `Item ${i + 1}`,
        subTitle: `Subtitle for Item ${i + 1}`,
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
        slug: `item-${i + 1}`,
      })),
    },
  }
}

const templateId = 'showcase'
const template = cardTemplate({
  templateId,
  category: ['portfolio'],
  description: 'Showcase grid of items with popup details',
  icon: 'i-tabler-carousel-horizontal',
  colorTheme: 'pink',
  isPublic: true,
  el,
  options,
  getUserConfig: async () => getDefaultConfig(),
  schema: UserConfigSchema,
  demoPage: async () => {
    const userConfig = await getDefaultConfig()
    return { cards: [{ templateId, userConfig }] }
  },
})

export const templates = [template] as const
