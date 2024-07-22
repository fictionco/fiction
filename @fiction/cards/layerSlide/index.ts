import { vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import type { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { mediaSchema } from '../schemaSets.js'

const templateId = 'layerSlide'

const schema = z.object({
  items: z.array(
    z.object({
      media: mediaSchema.optional(),
      mediaBackground: mediaSchema.optional(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      href: z.string().optional(),
    }),
  ).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
]

async function getDefaultConfig(args: { site: Site }): Promise<UserConfig> {
  return {
    items: [
      {
        title: 'I Create Unique Experiences',
        subtitle: 'I am a web developer and designer',
        media: { format: 'url', url: 'https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        mediaBackground: { format: 'url', url: 'https://images.unsplash.com/photo-1492573637402-25691cd9eac2?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
      },
      {
        title: 'I Create Unique Experiences',
        subtitle: 'I am a web developer and designer',
        media: { format: 'url', url: 'https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        mediaBackground: { format: 'url', url: 'https://images.unsplash.com/photo-1492573637402-25691cd9eac2?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },

      },
    ],
  }
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['marketing'],
    description: 'Sliding hero carousel',
    icon: 'i-tabler-image',
    colorTheme: 'teal',
    isPublic: false,
    schema,
    options,
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    getUserConfig: getDefaultConfig,
    demoPage: async (args) => {
      const userConfig = await getDefaultConfig(args)
      return {
        cards: [
          { templateId, userConfig },
        ],
      }
    },
  }),
] as const
