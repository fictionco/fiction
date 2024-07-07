import type { PostItem } from '@fiction/core'
import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import { standardOption } from '../inputSets'

const el = vue.defineAsyncComponent(async () => import('./ElShowcase.vue'))
const aspects = ['square', 'tall', 'wide', 'golden', 'portrait', 'landscape', 'cinema'] as const
const gridCols = ['1', '2', '3', '4', '5'] as const
const UserConfigSchema = z.object({
  items: z.array(z.object({
    content: z.string().optional(),
    title: z.string().optional(),
    subTitle: z.string().optional(),
    superTitle: z.string().optional(),
    media: z.object({
      format: z.enum(['url', 'html']).optional(),
      url: z.string().optional(),
      html: z.string().optional(),
    }),
  }) as z.Schema<PostItem>).optional(),
  aspect: z.enum(aspects).optional().describe('Image aspect ratio'),
  gridColsMax: z.enum(gridCols).optional().describe('Max number of columns in the grid on large screen'),
  gridColsMin: z.enum(['1', '2']).optional().describe('Min number of columns in the grid on small screen'),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

export const defaultMediaItems: PostItem[] = [
  { title: 'Title', subTitle: 'lorem ipsum', content: 'hello', media: { format: 'url', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=3265&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
  { title: 'Another Title', subTitle: 'lorem ipsum', media: { format: 'url', url: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2ZpbGV8ZW58MHwxfDB8fHww' } },
  { title: 'Some Company', subTitle: 'lorem ipsum', media: { format: 'url', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=3988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
  { title: 'A really long title', subTitle: 'lorem ipsum', media: { format: 'url', url: 'https://plus.unsplash.com/premium_photo-1675034393381-7e246fc40755?q=80&w=3712&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
  { title: 'Something really really long this is what it looks like', subTitle: 'lorem ipsum', media: { format: 'url', url: 'https://images.unsplash.com/photo-1577565177023-d0f29c354b69?q=80&w=2943&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
  { title: 'Short', subTitle: 'lorem ipsum', media: { format: 'url', url: 'https://plus.unsplash.com/premium_photo-1675034393381-7e246fc40755?q=80&w=3712&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
  { title: 'Nice', subTitle: 'lorem ipsum', media: { format: 'url', url: 'https://images.unsplash.com/photo-1577565177023-d0f29c354b69?q=80&w=2943&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },

]

const templateId = 'showcase'
const template = new CardTemplate({
  templateId,
  category: ['portfolio'],
  description: 'a showcase grid of items with popup details',
  icon: 'i-tabler-carousel-horizontal',
  colorTheme: 'pink',
  isPublic: true,
  el,
  options: [
    standardOption.postItems({ key: 'items', label: 'Showcase Items' }),
    new InputOption({ key: 'aspect', label: 'Image Aspect', input: 'InputSelect', list: aspects, default: () => 'golden' }),
    new InputOption({ key: 'gridColsMax', label: 'Max Grid Columns', input: 'InputSelect', list: gridCols, default: () => '4' }),
    new InputOption({ key: 'gridColsMin', label: 'Min Grid Columns', input: 'InputSelect', list: ['1', '2'], default: () => '1' }),
  ],
  userConfig: { items: defaultMediaItems, aspect: 'golden', gridColsMax: '4' },
  schema: UserConfigSchema,
  demoPage: () => {
    return { cards: [{ templateId, userConfig: { items: defaultMediaItems } }] }
  },
})

export const templates = [template] as const
