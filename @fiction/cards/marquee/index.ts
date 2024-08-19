import type { MediaItem } from '@fiction/core'
import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
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

async function getDefaultUserConfig(): Promise<UserConfig> {
  const urls = [
    'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/61636426-96a3-4185-b095-aebdf86fa700/public',
    'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/7c949640-3223-4fa8-4a41-dbf9dec88c00/public',
    'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/7ce233bf-c7c3-473e-1983-f38a9d4f8300/public',
    'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/ffee7f67-0133-4136-1699-830c60e4e500/public',
    'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/2bd64561-5b07-4974-e2c2-c499e93fdb00/public',
  ]

  return {
    items: [
      { href: '/test', name: 'Title', desc: 'Description', media: { format: 'url', url: urls[0] } },
      { href: '/test', name: 'Title', desc: 'Description', media: { format: 'url', url: urls[1] } },
      { href: '/test', name: 'Title', desc: 'Description', media: { format: 'url', url: urls[2] } },
      { href: '/test', name: 'Title', desc: 'Description', media: { format: 'url', url: urls[3] } },
      { href: '/test', name: 'Title', desc: 'Description', media: { format: 'url', url: urls[4] } },
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
    getUserConfig: () => getDefaultUserConfig(),
    schema: UserConfigSchema,
    demoPage: async () => {
      const userConfig = await getDefaultUserConfig()
      return { cards: [
        { templateId, userConfig },
        { templateId, userConfig: { ...userConfig, direction: 'right' as const } },
        { templateId, userConfig: { ...userConfig, stagger: true } },
      ] }
    },
  }),
] as const
