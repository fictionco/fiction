import type { MediaItem } from '@fiction/core'
import { vue } from '@fiction/core'
import { CardTemplate, createCard } from '@fiction/site'
import { z } from 'zod'
import { standardOption } from '../inputSets'
import { createDemoPage } from '../utils/demo'
import { PostItemSchema } from '../schemaSets'

const el = vue.defineAsyncComponent(() => import('./ElShowcase.vue'))

const UserConfigSchema = z.object({
  items: z.array(PostItemSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

export const defaultMediaItems: MediaItem[] = [
  { name: 'Title', desc: 'lorem ipsum', media: { format: 'url', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=3265&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
  { name: 'Another Title', desc: 'lorem ipsum', media: { format: 'url', url: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2ZpbGV8ZW58MHwxfDB8fHww' } },
  { name: 'Some Company', desc: 'lorem ipsum', media: { format: 'url', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=3988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
  { name: 'A really long title', desc: 'lorem ipsum', media: { format: 'url', url: 'https://plus.unsplash.com/premium_photo-1675034393381-7e246fc40755?q=80&w=3712&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
  { name: 'Something really really long this is what it looks like', desc: 'lorem ipsum', media: { format: 'url', url: 'https://images.unsplash.com/photo-1577565177023-d0f29c354b69?q=80&w=2943&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
  { name: 'Short', desc: 'lorem ipsum', media: { format: 'url', url: 'https://plus.unsplash.com/premium_photo-1675034393381-7e246fc40755?q=80&w=3712&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
  { name: 'Nice', desc: 'lorem ipsum', media: { format: 'url', url: 'https://images.unsplash.com/photo-1577565177023-d0f29c354b69?q=80&w=2943&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },

]

const templateId = 'showcase'
const template = new CardTemplate({
  templateId,
  category: ['portfolio'],
  description: 'a showcase grid of items with popup details',
  icon: 'i-tabler-carousel-horizontal',
  colorTheme: 'pink',
  isPublic: false,
  el,
  options: [
    standardOption.mediaItems({ key: 'items', label: 'Media Items' }),
  ],
  userConfig: { items: defaultMediaItems },
  schema: UserConfigSchema,
  demoPage: () => {
    return [{ templateId, userConfig: { items: defaultMediaItems } }]
  },
})

export const templates = [template] as const
