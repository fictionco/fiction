import type { MediaItem } from '@fiction/core'
import { vue } from '@fiction/core'
import { CardTemplate, createCard } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { standardOption } from '../inputSets'

const el = vue.defineAsyncComponent(() => import('./ElMarquee.vue'))

const UserConfigSchema = z.object({
  items: z.array(z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    media: z.object({
      format: z.enum(['url', 'html']).optional(),
      url: z.string().optional(),
      html: z.string().optional(),
    }),
  })).optional() as z.Schema<MediaItem[] | undefined>,
  direction: z.enum(['left', 'right']).optional().describe('Animation direction'),
  stagger: z.boolean().optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

const templateId = 'marquee'
export const templates = [
  new CardTemplate({
    templateId,
    category: ['marketing'],
    description: 'animated image marquee',
    icon: 'i-tabler-carousel-horizontal',
    colorTheme: 'pink',
    isPublic: true,
    el,
    options: [
      standardOption.mediaItems({ key: 'items', label: 'Marquee Media Items' }),
      new InputOption({ key: 'direction', label: 'Animation Direction', input: 'InputSelect', list: ['left', 'right'], default: () => 'left' }),
      new InputOption({ key: 'stagger', label: 'Stagger Items', input: 'InputCheckbox', default: () => false }),
    ],
    userConfig: {
      items: [
        { name: 'Title', desc: 'lorem ipsum', media: { format: 'url', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=3265&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
        { name: 'Title', desc: 'lorem ipsum', media: { format: 'url', url: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2ZpbGV8ZW58MHwxfDB8fHww' } },
        { name: 'Title', desc: 'lorem ipsum', media: { format: 'url', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=3988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
        { name: 'Title', desc: 'lorem ipsum', media: { format: 'url', url: 'https://plus.unsplash.com/premium_photo-1675034393381-7e246fc40755?q=80&w=3712&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
        { name: 'Title', desc: 'lorem ipsum', media: { format: 'url', url: 'https://images.unsplash.com/photo-1577565177023-d0f29c354b69?q=80&w=2943&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
      ],
    },
    schema: UserConfigSchema,
  }),
] as const

export function demo() {
  const testItem = {
    name: 'Test',
    desc: 'lorem ipsum',
    href: '/testing',
    media: { format: 'url', url: 'https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjJ8fHByb2ZpbGV8ZW58MHwxfDB8fHww' } as const,
  }
  const duplicatedProfiles = Array.from({ length: 4 }, () => testItem)
  return createCard({
    slug: 'card-marquee',
    cards: [
      createCard({ templateId, templates, userConfig: { } }),
      createCard({ templateId, templates, userConfig: { items: duplicatedProfiles, direction: 'right' } }),
      createCard({ templateId, templates, userConfig: { items: duplicatedProfiles, stagger: true } }),
    ],
  })
}
