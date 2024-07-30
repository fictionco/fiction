import type { MediaItem } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { staticFileUrls } from '@fiction/site/utils/site'
import { standardOption } from '../inputSets'

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

async function getDefaultUserConfig(args: { site: Site }): Promise<UserConfig> {
  const { site } = args
  const filenames = [
    'marquee-min-1.png',
    'marquee-min-2.png',
    'marquee-min-3.png',
    'marquee-min-4.png',
    'marquee-min-5.png',
  ] as const

  const urls = staticFileUrls({ site, filenames })
  return {
    items: [
      { href: '/test', name: 'Title', desc: 'Description', media: { format: 'url', url: urls.marqueeMin1 } },
      { href: '/test', name: 'Title', desc: 'Description', media: { format: 'url', url: urls.marqueeMin2 } },
      { href: '/test', name: 'Title', desc: 'Description', media: { format: 'url', url: urls.marqueeMin3 } },
      { href: '/test', name: 'Title', desc: 'Description', media: { format: 'url', url: urls.marqueeMin4 } },
      { href: '/test', name: 'Title', desc: 'Description', media: { format: 'url', url: urls.marqueeMin5 } },
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
    getUserConfig: _ => getDefaultUserConfig(_),
    schema: UserConfigSchema,
    demoPage: async (args) => {
      const userConfig = await getDefaultUserConfig(args)
      return { cards: [
        { templateId, userConfig },
        { templateId, userConfig: { ...userConfig, direction: 'right' as const } },
        { templateId, userConfig: { ...userConfig, stagger: true } },
      ] }
    },
  }),
] as const
