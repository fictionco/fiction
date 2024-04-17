import { vue } from '@fiction/core'
import { CardTemplate, createCard } from '@fiction/site'
import { standardOption } from '../inputSets'

const el = vue.defineAsyncComponent(() => import('./ElMarquee.vue'))

const templateId = 'marquee'
export const templates = [
  new CardTemplate({
    templateId,
    category: ['marketing'],
    description: 'animated image marquee',
    icon: 'i-tabler-carousel-horizontal',
    iconTheme: 'pink',
    el,
    options: [
      standardOption.mediaItems({ key: 'items' }),
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
