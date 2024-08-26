import type { MediaItem } from '@fiction/core'
import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { standardOption } from '../inputSets'
import type { Tag } from '../stock/index.js'
import { stockMediaHandler } from '../stock/index.js'

const el = vue.defineAsyncComponent(async () => import('./ElMarquee.vue'))

const UserConfigSchema = z.object({
  items: z.array(z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    href: z.string().optional(),
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

async function getDefaultUserConfig(args: { tags: Tag[] }): Promise<UserConfig> {
  const { tags = ['person'] } = args
  const urls = [
    stockMediaHandler.getRandomByTags(['aspect:portrait', ...tags]),
    stockMediaHandler.getRandomByTags(['aspect:portrait', ...tags]),
    stockMediaHandler.getRandomByTags(['aspect:portrait', ...tags]),
    stockMediaHandler.getRandomByTags(['aspect:portrait', ...tags]),
    stockMediaHandler.getRandomByTags(['aspect:portrait', ...tags]),
  ]

  return {
    items: [
      { href: '/test', name: 'Title', desc: 'Description', media: urls[0] },
      { href: '/test', name: 'Title', desc: 'Description', media: urls[1] },
      { href: '/test', name: 'Title', desc: 'Description', media: urls[2] },
      { href: '/test', name: 'Title', desc: 'Description', media: urls[3] },
      { href: '/test', name: 'Title', desc: 'Description', media: urls[4] },
    ],
  }
}

const templateId = 'marquee'
export const templates = [
  new CardTemplate({
    templateId,
    category: ['marketing'],
    description: 'A marquee of media items that slide in and out',
    icon: 'i-tabler-carousel-horizontal',
    colorTheme: 'pink',
    isPublic: true,
    el,
    options: [
      standardOption.mediaItems({ key: 'items', label: 'Marquee Media Items' }),
      new InputOption({ key: 'direction', label: 'Animation Direction', input: 'InputSelect', list: ['left', 'right'], default: () => 'left' }),
      new InputOption({ key: 'stagger', label: 'Stagger Items', input: 'InputCheckbox', default: () => false }),
    ],
    getBaseConfig: () => ({ standard: { spacing: { contentWidth: 'none' } } }),
    getUserConfig: () => getDefaultUserConfig({ tags: ['object'] }),
    schema: UserConfigSchema,
    demoPage: async () => {
      const uc1 = await getDefaultUserConfig({ tags: ['object'] })
      const uc2 = await getDefaultUserConfig({ tags: ['object'] })
      const uc3 = await getDefaultUserConfig({ tags: ['object'] })
      return { cards: [
        { templateId, userConfig: uc1 },
        { templateId, userConfig: { ...uc2, direction: 'right' as const } },
        { templateId, userConfig: { ...uc3, stagger: true } },
      ] }
    },
  }),
] as const
