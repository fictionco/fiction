import type { Tag } from '@fiction/ui/stock/index.js'
import { MediaBasicSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { stockMediaHandler } from '@fiction/ui/stock/index.js'
import { z } from 'zod'

const el = vue.defineAsyncComponent(async () => import('./ElMarquee.vue'))

const schema = z.object({
  items: z.array(z.object({
    title: z.string().optional().describe('Title shown over the card, 1 to 5 words [ai]'),
    subTitle: z.string().optional().describe('Subtitle shown under the title, 1 to 5 words [ai]'),
    href: z.string().optional().describe('link, include http for external links'),
    media: MediaBasicSchema.optional().describe('Media background for the item'),
  })).optional(),
  direction: z.enum(['left', 'right']).optional().describe('Animation direction'),
  stagger: z.boolean().optional(),
})

export type UserConfig = z.infer<typeof schema>

const options = [
  new InputOption({ key: 'items', label: 'Items', input: 'InputList', options: [
    new InputOption({ key: 'title', label: 'Title', input: 'InputText' }),
    new InputOption({ key: 'subTitle', label: 'Content', input: 'InputText' }),
    new InputOption({ key: 'media', label: 'Media', input: 'InputMedia' }),
    new InputOption({ key: 'href', label: 'Link', input: 'InputText' }),
  ] }),

  new InputOption({ key: 'direction', label: 'Animation Direction', input: 'InputSelect', list: ['left', 'right'] }),
  new InputOption({ key: 'stagger', label: 'Stagger Items', input: 'InputCheckbox' }),
] as InputOption[]

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
      { href: '/test', title: 'Title', subTitle: 'Description', media: urls[0] },
      { href: '/test', title: 'Title', subTitle: 'Description', media: urls[1] },
      { href: '/test', title: 'Title', subTitle: 'Description', media: urls[2] },
      { href: '/test', title: 'Title', subTitle: 'Description', media: urls[3] },
      { href: '/test', title: 'Title', subTitle: 'Description', media: urls[4] },
    ],
  }
}

const templateId = 'marquee'
export const templates = [
  cardTemplate({
    templateId,
    category: ['marketing'],
    description: 'A marquee of media items that slide in and out',
    icon: 'i-tabler-carousel-horizontal',
    colorTheme: 'pink',
    isPublic: true,
    el,
    options,
    getBaseConfig: () => ({ standard: { spacing: { contentWidth: 'none' } } }),
    getUserConfig: async () => getDefaultUserConfig({ tags: ['object'] }),
    schema,
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
