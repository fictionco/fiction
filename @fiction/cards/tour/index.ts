import { vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { staticFileUrls } from '@fiction/site/utils/site'
import { options as heroOptions, schema as heroSchema } from '../hero/index'

const templateId = 'tour'

const schema = z.object({
  items: z.array(heroSchema).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', options: heroOptions }),
]

async function defaultConfig(args: { site: Site }): Promise<UserConfig> {
  return {
    items: [
      {
        heading: 'Brand Revitalization',
        subHeading: 'Breathing new life into established global brands.',
        splash: { url: 'https://images.unsplash.com/photo-1504548840739-580b10ae7715?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        layout: 'left' as const,
        overlays: [
          { media: { url: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }, position: 'bottomLeft' },
          { media: { url: 'https://images.unsplash.com/photo-1483959651481-dc75b89291f1?q=80&w=2470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }, position: 'topRight' },
        ],
        actions: [
          { name: 'View Projects', href: '#', theme: 'primary' },
          { name: 'Case Studies', href: '#', design: 'textOnly' },
        ],
        // content: 'Led brand refresh initiatives for Coca-Cola, Nintendo, and Burberry. These projects involved modernizing visual identities while preserving brand heritage, resulting in average engagement increases of 28% across campaigns.'
      },
      {
        heading: 'Digital Experience Design',
        subHeading: 'Crafting intuitive and engaging digital interfaces for tech giants.',
        splash: { url: 'https://images.unsplash.com/flagged/photo-1574885173944-c23db8159846?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        layout: 'right' as const,
        overlays: [{ media: { url: 'https://images.unsplash.com/photo-1536338701933-9fb6ce505c48?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }, position: 'bottomLeft' }],
        actions: [
          { name: 'Explore Work', href: '#', theme: 'primary' },
          { name: 'UX Insights', href: '#', theme: 'naked' as const },
        ],
        // content: 'Spearheaded UX/UI redesigns for Google, Spotify, and Amazon. Projects focused on enhancing user engagement, simplifying complex processes, and improving accessibility. Achieved an average 22% increase in user satisfaction scores.'
      },
      {
        heading: 'Integrated Marketing Campaigns',
        subHeading: 'Developing cohesive, multi-channel campaigns for global brands.',
        splash: { url: 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        overlays: [
          { media: { url: 'https://images.unsplash.com/photo-1529776166548-315929571406?q=80&w=2755&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' } },
          { media: { url: 'https://images.unsplash.com/photo-1536338701933-9fb6ce505c48?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }, position: 'bottomLeft' },
          { media: { url: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }, position: 'topRight', widthPercent: 15 },
        ],
        actions: [
          { name: 'View Campaigns', href: '#', theme: 'primary' },
          { name: 'Results & Metrics', href: '#', theme: 'naked' as const },
        ],
      //  content: 'Created and executed integrated marketing campaigns for Nike, Apple, and Starbucks. These campaigns spanned digital, print, and experiential mediums, driving brand awareness and sales. Notable achievements include a 45% boost in social media engagement for Nike and a 30% increase in product launch sales for Apple.'
      },
    ],
  }
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['marketing'],
    description: 'A tour section with left and right hero images and text',
    icon: 'i-tabler-compass',
    colorTheme: 'green',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    schema,
    options,
    isPublic: true,
    getUserConfig: async args => defaultConfig(args),
    demoPage: async (args) => {
      const userConfig = await defaultConfig(args)
      return {
        cards: [
          { templateId, userConfig },
        ],
      }
    },
  }),
] as const
