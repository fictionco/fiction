import type { PostItem } from '@fiction/core'
import { vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import { standardOption } from '../inputSets'
import { stockMediaHandler } from '../stock/index.js'

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
      format: z.enum(['url', 'html', 'video', 'image']).optional(),
      url: z.string().optional(),
      html: z.string().optional(),
    }),
  }) as z.Schema<PostItem>).optional(),
  aspect: z.enum(aspects).optional().describe('Image aspect ratio'),
  gridColsMax: z.enum(gridCols).optional().describe('Max number of columns in the grid on large screen'),
  gridColsMin: z.enum(['1', '2']).optional().describe('Min number of columns in the grid on small screen'),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

export async function getDefaultConfig(args: { site?: Site }): Promise<UserConfig> {
  return {
    aspect: 'portrait',
    gridColsMax: '4',
    items: [
      {
        title: 'Coca-Cola',
        subTitle: 'Refreshing brand refresh',
        content: 'Led the summer campaign design, increasing engagement by 25%. Created a series of vibrant, eco-friendly packaging designs that resonated with younger demographics while maintaining brand recognition.',
        media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
      },
      {
        title: 'Google',
        subTitle: 'Reimagining the search experience',
        content: 'Collaborated on redesigning Google\'s search results page, focusing on improved readability and accessibility. Implemented a new system of micro-interactions that enhanced user engagement by 15%.',
        media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
      },
      {
        title: 'Nike',
        subTitle: 'Just Do It - 2024 Edition',
        content: 'Spearheaded the visual direction for Nike\'s 2024 "Just Do It" campaign. Developed a series of dynamic, inclusive visuals that increased social media engagement by 40% and contributed to a 10% boost in online sales.',
        media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
      },
      {
        title: 'Apple',
        subTitle: 'Simplicity in innovation',
        content: 'Assisted in designing the user interface for a new product line, emphasizing Apple\'s core principle of intuitive design. The resulting UI scored 95% in user satisfaction tests.',
        media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
      },
      {
        title: 'Starbucks',
        subTitle: 'Brewing a new visual identity',
        content: 'Redesigned Starbucks\' in-store visual elements, creating a cohesive, modern aesthetic that enhanced brand perception. The new design was implemented in over 5,000 stores worldwide.',
        media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
      },
      {
        title: 'Amazon',
        subTitle: 'Redefining the online shopping experience',
        content: 'Contributed to the redesign of Amazon\'s mobile app, focusing on streamlining the checkout process. The new design reduced cart abandonment rates by 18% and improved overall user satisfaction.',
        media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
      },
      {
        title: 'Tesla',
        subTitle: 'Electrifying the future of transport',
        content: 'Developed the visual concept for Tesla\'s sustainability report, effectively communicating complex data through intuitive infographics. The report garnered significant positive press and strengthened Tesla\'s position as an industry leader in sustainability.',
        media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
      },
      {
        title: 'Disney',
        subTitle: 'Bringing magic to life',
        content: 'Created promotional materials for Disney\'s new streaming content, blending classic characters with contemporary design elements. The campaign contributed to a 30% increase in new subscriptions during its run.',
        media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
      },

      {
        title: 'Microsoft',
        subTitle: 'Windows to the future',
        content: 'Contributed to the design of key UI elements for Windows 11, focusing on creating a more intuitive and visually appealing user experience. The new design elements received positive feedback in beta testing, with a 92% approval rating.',
        media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
      },
      {
        title: 'Adidas',
        subTitle: 'Stripes of excellence',
        content: 'Led the design for Adidas\' eco-friendly product line, creating packaging and promotional materials that highlighted the company\'s commitment to sustainability. The campaign contributed to a 20% increase in sales for the new product line.',
        media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
      },
      {
        title: 'Spotify',
        subTitle: 'Visualizing the sound of a generation',
        content: 'Designed a series of dynamic, music-responsive visuals for Spotify\'s annual wrapped campaign. The designs increased social media shares of Wrapped results by 50% compared to the previous year.',
        media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
      },
      {
        title: 'Netflix',
        subTitle: 'Streaming success',
        content: 'Redesigned Netflix\'s content recommendation UI, improving personalization and discoverability. The new design increased viewer engagement time by an average of 12 minutes per session and boosted content diversity in user watchlists.',
        media: stockMediaHandler.getRandomByTags(['aspect:portrait', 'object']),
      },
    ],
  }
}

const templateId = 'showcase'
const template = new CardTemplate({
  templateId,
  category: ['portfolio'],
  description: 'Showcase grid of items with popup details',
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
  getUserConfig: args => getDefaultConfig(args),
  schema: UserConfigSchema,
  demoPage: async (args) => {
    const userConfig = await getDefaultConfig(args)
    return { cards: [{ templateId, userConfig }] }
  },
})

export const templates = [template] as const
